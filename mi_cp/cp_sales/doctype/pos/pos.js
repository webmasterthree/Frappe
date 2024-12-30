// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("POS", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("POS", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator'){
        frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});

frappe.ui.form.on("POS Item", {
    price: function (frm, cdt, cdn) {
        calculate_row_amount_and_total(frm, cdt, cdn);
    },
    quantity: function (frm, cdt, cdn) {
        calculate_row_amount_and_total(frm, cdt, cdn);
    },
});

function calculate_row_amount_and_total(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    
    // Calculate row amount
    row.amount = (row.price || 0) * (row.quantity || 0);
    frm.refresh_field("items"); // Refresh child table to update the amount field

    // Calculate total amount
    let total = 0;
    frm.doc.items.forEach((row) => {
        total += row.amount || 0;
    });

    // Update total_amount field in the parent form
    frm.set_value("total_amount", total);
    
    // Convert total amount to words and update the field
    const totalInWords = convertNumberToWords(total);
    frm.set_value("amount_chargeable_in_words", totalInWords);
}

// Function to convert number to words (Indian Currency)
function convertNumberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
        'Seventeen', 'Eighteen', 'Nineteen'];

    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return "Zero Rupees";

    let words = '';
    let decimalPart = 0;

    // Handle decimal part (Paise)
    if (num % 1 !== 0) {
        decimalPart = Math.round((num % 1) * 100); // Convert paise (up to two decimal places)
    }

    // Convert the integer part
    let n = Math.floor(num);
    let i = 0; // To keep track of thousands, lakhs, crores

    // Split the number into groups of thousands
    while (n > 0) {
        if (n % 1000 !== 0) {
            words = convertThreeDigitsToWords(n % 1000) + ' ' + thousands[i] + ' ' + words;
        }
        n = Math.floor(n / 1000);
        i++;
    }

    words = words.trim() + " Rupees";

    // Add the decimal (Paise) part if available
    if (decimalPart > 0) {
        words += " and " + convertThreeDigitsToWords(decimalPart) + " Paise";
    }

    return words.trim();
}

// Helper function to convert a three-digit number to words
function convertThreeDigitsToWords(n) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 
        'Seventeen', 'Eighteen', 'Nineteen'];

    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    let words = '';

    if (n > 99) {
        words += ones[Math.floor(n / 100)] + ' Hundred ';
        n = n % 100;
    }

    if (n > 0 && n < 20) {
        words += ones[n];
    } else if (n >= 20) {
        words += tens[Math.floor(n / 10)];
        if (n % 10 > 0) {
            words += " " + ones[n % 10];
        }
    }

    return words.trim();
}


////////////////// 

// frappe.ui.form.on('POS', {
//     refresh: function (frm) {
//         // Add "Create Customer Sales Order" button if the document is submitted
//         if (frm.doc.docstatus === 1) {
//             frm.add_custom_button(__('Customer Sales Order'), function () {
//                 // Create a new Customer Sales Order
//                 frappe.new_doc("Customer Sales Order", {}, (new_order) => {
//                     // Set the Customer link in Customer Sales Order
//                     if (frm.doc.customer) {
//                         new_order.customer = frm.doc.customer; // Link to Customer
//                     } else {
//                         frappe.msgprint(__('Please select a valid customer.'));
//                         return;
//                     }

//                     // Set additional fields
//                     new_order.channel_partner = frm.doc.channel_partner;
//                     new_order.sales_executive = frm.doc.sales_executive;
//                     new_order.date = frm.doc.date;
//                     new_order.delivery_date = frm.doc.delivery_date;
//                     new_order.total_amount = frm.doc.total_amount;
//                     new_order.amount_chargeable_in_words = frm.doc.amount_chargeable_in_words;
//                     new_order.address = frm.doc.address;

//                     // Map items table from POS to Customer Sales Order
//                     frm.doc.items.forEach((order_item) => {
//                         let new_item = frappe.model.add_child(new_order, 'items');
//                         new_item.item_code = order_item.item_code;
//                         new_item.item_name = order_item.item_name;
//                         new_item.quantity = order_item.quantity;
//                         new_item.price = order_item.price;
//                         new_item.amount = order_item.amount;
//                     });

//                     // Navigate to the newly created Customer Sales Order
//                     frappe.set_route("Form", "Customer Sales Order", new_order.name);
//                 });
//             }, __('Create')).addClass('btn btn-danger w-100'); // Adding styling to the button
//         }
//     }
// });





// frappe.ui.form.on("POS", {
//     channel_partner: function (frm) {
//         // Update the sales_executive field with a custom string when channel_partner changes
//         if (frm.doc.channel_partner) {
//             frm.set_value(
//                 'sales_executive', 
//                 `Initiated by Channel Partner: ${frm.doc.channel_partner}`
//             );
//         } else {
//             // Clear the sales_executive field if channel_partner is empty
//             frm.set_value('sales_executive', '');
//         }
//     }
// });
