// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt



frappe.ui.form.on("Customer Sales Order", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator'){
        frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});














frappe.ui.form.on("Customer Sales Order", {
    validate(frm) {
        let total = 0;
        if (frm.doc.items && frm.doc.items.length) {
            frm.doc.items.forEach(row => {
                let quantity = row.quantity || 0;
                let price = row.price || 0;
                row.amount = quantity * price; // Calculate row amount
                total += row.amount; // Accumulate the total amount
            });
        }

        // Round the total to the nearest integer
        total = Math.round(total);

        frm.set_value('total_amount', total); // Set total amount before saving

        // Convert total amount to words and set it in 'amount_chargeable_in_words'
        let totalInWords = convertNumberToWords(total);
        frm.set_value('amount_chargeable_in_words', totalInWords); // Set amount in words
    }
});

// Helper function to convert numbers to words
function convertNumberToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const thousands = [
        '', 'Thousand', 'Million', 'Billion', 'Trillion'
    ];

    // Handle case where the number is zero
    if (number === 0) return 'Zero';

    let words = '';

    let i = 0;
    // Separate integer part and decimal part
    let integerPart = Math.floor(number);
    let decimalPart = Math.round((number - integerPart) * 100); // Get two decimal places

    // Convert integer part to words
    while (integerPart > 0) {
        if (integerPart % 1000 !== 0) {
            words = convertThreeDigitNumberToWords(integerPart % 1000) + thousands[i] + ' ' + words;
        }
        integerPart = Math.floor(integerPart / 1000);
        i++;
    }

    // Convert decimal part to words
    if (decimalPart > 0) {
        words += 'and ' + convertDecimalToWords(decimalPart);
    }

    return words.trim();
}

// Helper function to convert three-digit numbers to words
function convertThreeDigitNumberToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    let words = '';

    if (number > 99) {
        words += ones[Math.floor(number / 100)] + ' Hundred ';
        number %= 100;
    }

    if (number > 19) {
        words += tens[Math.floor(number / 10)] + ' ';
        number %= 10;
    }

    if (number > 0) {
        words += ones[number] + ' ';
    }

    return words;
}

// Helper function to convert decimal part to words
function convertDecimalToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'
    ];

    let words = '';
    let tensPlace = Math.floor(number / 10);
    let onesPlace = number % 10;

    if (tensPlace > 0) {
        words += ones[tensPlace] + ' ';
    }

    if (onesPlace > 0) {
        words += ones[onesPlace] + ' ';
    }

    return words.trim();
}


frappe.ui.form.on('Customer Sales Order', {
    refresh: function(frm) {
        // Add "Create Sales Receipt" inside the "Create" dropdown if the document is submitted
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Create Sales Receipt'), function() {
                // Create a new Sales Receipt based on the Customer Sales Order
                frappe.new_doc("Customer Sales Receipt", {}, (new_receipt) => {
                    // Set fields in the new Sales Receipt based on Customer Sales Order
                    new_receipt.customer_name = frm.doc.customer_name;
                    new_receipt.channel_partner = frm.doc.channel_partner;
                    new_receipt.sales_executive = frm.doc.sales_executive;
                    new_receipt.date = frm.doc.date;
                    new_receipt.delivery_date = frm.doc.delivery_date;
                    new_receipt.total_amount = frm.doc.total_amount;
                    new_receipt.amount_chargeable_in_words = frm.doc.amount_chargeable_in_words;
                    new_receipt.address = frm.doc.address;
                    // new_receipt.total_amount18_gst_included = frm.doc.total_amount18_gst_included;

                    // Map items from Customer Sales Order to Sales Receipt items table
                    frm.doc.items.forEach((order_item) => {
                        let receipt_item = frappe.model.add_child(new_receipt, 'items');
                        receipt_item.item_code = order_item.item_code;
                        receipt_item.item_name = order_item.item_name;
                        receipt_item.quantity = order_item.quantity;
                        receipt_item.price = order_item.price;
                        receipt_item.amount = order_item.amount;
                    });

                    // Route to the new Sales Receipt document
                    frappe.set_route("Form", "Customer Sales Receipt", new_receipt.name);
                });
            }, __('Create'))
            .addClass('btn btn-danger w-100'); // Adding Bootstrap classes for button styling
        }
    }
});



frappe.ui.form.on('Customer Sales Order Item', {
    item_code: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        
        // Fetching Item details including Item Name, Pack Type, and Pack Size
        if (row.item_code) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Sales Price',
                    name: row.item_code
                },
                callback: function(data) {
                    if (data.message) {
                        frappe.model.set_value(cdt, cdn, 'price', data.message.selling_price);
                    }
                }
            });
        }
    }
});



frappe.ui.form.on("Customer Sales Order Item", {
    quantity: function (frm, cdt, cdn) {
        // Get the current row in the child table
        let row = locals[cdt][cdn];
        
        // Ensure item_code is selected
        if (!row.item_code) {
            frappe.msgprint(__('Please select an item first.'));
            return;
        }
        
        // Fetch the total quantity available in stock for the specified item
        frappe.call({
            method: "mi_cp.api.get_stock_quantity", // Replace with your actual method
            args: {
                item_code: row.item_code
            },
            callback: function (r) {
                if (r.message) {
                    let totalQuantityAvailable = r.message; // Total stock available
                    
                    if (row.quantity > totalQuantityAvailable) {
                        frappe.msgprint(__('Warning: Item "{0}" has insufficient stock. Only {1} units available.',
                            [row.item_code, totalQuantityAvailable]));
                        
                        // Optionally reset the quantity to the available stock
                        frappe.model.set_value(cdt, cdn, "quantity", totalQuantityAvailable);
                    }
                } else {
                    frappe.msgprint(__('Item "{0}" is not available in stock.', [row.item_code]));
                    frappe.model.set_value(cdt, cdn, "quantity", 0); // Reset quantity to 0 if no stock
                }
            }
        });
    }
});