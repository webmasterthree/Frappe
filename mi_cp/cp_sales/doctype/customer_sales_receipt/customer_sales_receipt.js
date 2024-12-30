// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Customer Sales Receipt", {
// 	refresh(frm) {
//         if(frm.doc.items && frm.doc.items.length){
//             frm.doc.items.forEach(element => {
                
//             });
//         }
// 	},
// });






// frappe.session.user_fullname




frappe.ui.form.on("Customer Sales Receipt", {
	refresh(frm) {
        frm.set_value('channel_partner',frappe.session.user_fullname);
	},
});







frappe.ui.form.on("Customer Sales Receipt", {
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







// stock Error for sales Receipt order

// frappe.ui.form.on("Customer Sales Receipt Item", {
//     quantity: function (frm, cdt, cdn) {
//         // Get the current row in the child table
//         let row = locals[cdt][cdn];
        
//         // Ensure item_code is selected
//         if (!row.item_code) {
//             frappe.msgprint(__('Please select an item first.'));
//             return;
//         }
        
//         // Fetch the total quantity available in stock for the specified item
//         frappe.call({
//             method: "mi_cp.api.get_stock_quantity", // Replace with your actual method
//             args: {
//                 item_code: row.item_code
//             },
//             callback: function (r) {
//                 if (r.message) {
//                     let totalQuantityAvailable = r.message; // Total stock available
                    
//                     if (row.quantity > totalQuantityAvailable) {
//                         frappe.msgprint(__('Warning: Item "{0}" has insufficient stock. Only {1} units available.',
//                             [row.item_code, totalQuantityAvailable]));
                        
//                         // Optionally reset the quantity to the available stock
//                         frappe.model.set_value(cdt, cdn, "quantity", totalQuantityAvailable);
//                     }
//                 } else {
//                     frappe.msgprint(__('Item "{0}" is not available in stock.', [row.item_code]));
//                     frappe.model.set_value(cdt, cdn, "quantity", 0); // Reset quantity to 0 if no stock
//                 }
//             }
//         });
//     }
// });










// frappe.ui.form.on('Customer Sales Receipt Item', {
//     validate: function(frm) {
//         // Get the list of items and quantities entered by the user
//         let items = [];
//         frm.doc.items.forEach(item => {
//             items.push({
//                 "item_name": item.item_name,
//                 "quantity": item.qty
//             });
//         });

//         // Call the backend API to validate stock before saving
//         frappe.call({
//             method: 'mi_cp.stockapi.receiptapi',
//             args: {
//                 channel_partner: frm.doc.channel_partner,  // Pass the channel partner
//                 items: JSON.stringify(items)  // Pass the items as a JSON string
//             },
//             callback: function(response) {
//                 if (response.message.status === "error") {
//                     // Handle the error by displaying a message to the user
//                     let errorMessage = 'The following items are not available in sufficient quantity:<br>';
//                     response.message.unavailable_items.forEach(item => {
//                         errorMessage += `<br>Item: ${item.item_name} - Requested: ${item.requested_quantity} - Available: ${item.available_quantity}`;
//                     });
//                     frappe.msgprint({
//                         title: __('Insufficient Stock'),
//                         message: errorMessage,
//                         indicator: 'red'
//                     });
//                     // Prevent form save if there are errors
//                     frappe.validated = false;
//                 } else {
//                     // Continue with form saving if stock is sufficient
//                     frappe.msgprint({
//                         title: __('Stock Validation'),
//                         message: response.message.message,
//                         indicator: 'green'
//                     });
//                 }
//             },
//             error: function(error) {
//                 console.error('API Error:', error);
//                 frappe.msgprint({
//                     title: __('Error'),
//                     message: 'An error occurred while validating stock availability.',
//                     indicator: 'red'
//                 });
//                 frappe.validated = false;
//             }
//         });
//     }
// });


frappe.ui.form.on("Customer Sales Receipt Item", {
    quantity: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (!frm.doc.channel_partner || !row.item_name || !row.quantity) {
            frappe.msgprint(__('Please fill in all required fields.'));
            return;
        }

        frappe.call({
            method: "mi_cp.receiptapi.receiptapi",
            args: {
                channel_partner: frm.doc.channel_partner,
                items: [
                    {
                        item_name: row.item_name,
                        quantity: row.quantity
                    }
                ]
            },
            callback: function (response) {
                if (response.message.status === "error") {
                    let unavailable_item = response.message.unavailable_items.find(item => item.item_name === row.item_name);

                    if (unavailable_item) {
                        frappe.msgprint({
                            title: "Stock Error",
                            message: __(
                                'Insufficient stock for {0}. Requested: {1}, Available: {2}',
                                [unavailable_item.item_name, unavailable_item.requested_quantity, unavailable_item.available_quantity]
                            ),
                            indicator: "red"
                        });

                        frappe.model.set_value(cdt, cdn, "quantity", unavailable_item.available_quantity);
                    }
                }
            }
        });
    }
});



 