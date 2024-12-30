// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("CP Purchase Order", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("CP Purchase Order", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator'){
        frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});















frappe.ui.form.on("CP Purchase Order Item", {
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
    frm.set_value("total_amount_in_words", totalInWords);
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

// access selling price


 


// total Quantity

frappe.ui.form.on("CP Purchase Order Item", {
    quantity: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];

        let totalQuantity = 0;
        frm.doc.items.forEach(item => {
            totalQuantity += item.quantity || 0;
        });
        frm.set_value('total_quantity', totalQuantity);
    }
});



// Client Script for 'Purchase Order'
frappe.ui.form.on('CP Purchase Order', {
    refresh: function(frm) {
        // Add "Update In Stock" button if the document is submitted
        if (frm.doc.status == 'Dispatch' && frappe.session.user !== 'Administrator') {
            frm.add_custom_button(__('Update In Stock'), function() {
                // Redirect to My Stock and pass values
                frappe.model.with_doctype('My Stock', function() {
                    let new_stock_entry = frappe.model.get_new_doc('My Stock');
                    
                    // Map fields from CP Purchase Order to My Stock
                    // new_stock_entry.purchase_order = frm.doc.name; // Link field for reference
                    // new_stock_entry.customer_name = frm.doc.customer_name;
                    // new_stock_entry.date = frm.doc.date;
                    // new_stock_entry.channel_partner = frm.doc.channel_partner;
                    // new_stock_entry.address = frm.doc.address;
                    new_stock_entry.channel_partner = frm.doc.channel_partner;
                    // Map items from CP Purchase Order to My Stock items table
                    frm.doc.items.forEach((order_item) => {
                        let stock_item = frappe.model.add_child(new_stock_entry, 'items');
                        stock_item.item_code = order_item.item_code;
                        stock_item.item_name = order_item.item_name;
                        stock_item.pack_type = order_item.pack_type;
                        stock_item.pack_size = order_item.pack_size;
                        stock_item.uom = order_item.uom;
                        stock_item.quantity= order_item.quantity;
                        stock_item.purchase_price = order_item.price;
                        
                     });

                    // Redirect to the new My Stock document
                    frappe.set_route('Form', 'My Stock', new_stock_entry.name);
                });
            }, __('Actions')) // Group the button under the 'Actions' dropdown
            .addClass('btn-primary text-center text-success'); // Style the button as primary
        }
    }
});


 
frappe.ui.form.on('CP Purchase Order', {
    refresh: function(frm) {
        // Check if the logged-in user is not Administrator
        if (frappe.session.user !== 'Administrator') {
            // Make the status field read-only
            frm.set_df_property('status', 'read_only', 1);
        }
    }
});

 





frappe.ui.form.on('CP Purchase Order', {
    refresh: function(frm) {
        // Ensure the wrapper for 'status' field is targeted
        const statusField = frm.fields_dict.status.$wrapper;

        // Remove existing Bootstrap color classes to prevent conflicts
        statusField.removeClass('text-success text-danger');

        // Apply color based on the status value
        if (frm.doc.status === "Dispatch") {
            statusField.addClass('text-success'); // Green text for Dispatch
        } else if (frm.doc.status === "Cancel") {
            statusField.addClass('text-danger'); // Red text for Cancel
        } else {
            statusField.removeClass('text-success text-danger'); // Default styling for other statuses
        }
    }
});


// create sales receipt

frappe.ui.form.on('CP Purchase Order', {
    refresh: function(frm) {
        // Add "Create Sales Receipt" inside the "Create" dropdown if the document is submitted
        if (frm.doc.status == 'Dispatch' && frappe.session.user == 'Administrator') {
            frm.add_custom_button(__('Create Sales Receipt'), function() {
                // Create a new Sales Receipt based on the Customer Sales Order
                frappe.new_doc("CP Sales Receipt", {}, (new_receipt) => {
                    // Set fields in the new Sales Receipt based on Customer Sales Order
                    new_receipt.customer_name = frm.doc.customer_name;
                    new_receipt.channel_partner = frm.doc.channel_partner;
                    new_receipt.date = frm.doc.date;
                    new_receipt.supplier = frm.doc.supplier_name;
                    new_receipt.delivery_date = frm.doc.required_by;
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
                    frappe.set_route("Form", "CP Sales Receipt", new_receipt.name);
                });
            }, __('Create'))
            .addClass('btn btn-danger w-100'); // Adding Bootstrap classes for button styling
        }
    }
});















// frappe.ui.form.on("CP Purchase Order", {
//     before_submit: function (frm) {
//         // Check if the logged-in user is not Administrator
//         if (frappe.session.user.toLowerCase() !== "administrator") {
//             // Set the status to Pending if the user is not an Administrator
//             frm.set_value("status", "Pending");

//             // Optionally display a message to the user
//             frappe.msgprint({
//                 title: __('Status Updated'),
//                 message: __('Since you are not an Administrator, the status has been set to <b>Pending</b> instead of Submitted.'),
//                 indicator: 'orange'
//             });
//         } else {
//             // For Administrator, set the status to Submitted
//             frm.set_value("status", "Submitted");
//         }
//     }
// });



// frappe.ui.form.on("CP Purchase Order", {
//     // Before submitting, set the status based on the user role
//     before_submit: function (frm) {
//         if (frappe.session.user.toLowerCase() !== "administrator") {
//             frm.set_value("status", "Pending");  // Set to Pending for non-Admins
//         } else {
//             frm.set_value("status", "Submitted"); // Set to Submitted for Admin
//         }
//     },

//     // On form load/refresh, ensure the correct status
//     refresh: function (frm) {
//         if (frappe.session.user.toLowerCase() !== "administrator") {
//             // If the status is not Pending for non-Admins, set it to Pending
//             if (frm.doc.status !== "Pending") {
//                 frm.set_value("status", "Pending");
//             }
//             frm.set_df_property("status", "read_only", 1); // Make status read-only for non-Admins
//         } else {
//             // For Admins, allow editing and show "Submitted"
//             if (frm.doc.status !== "Submitted") {
//                 frm.set_value("status", "Submitted"); // Ensure status is "Submitted" for Admin
//             }
//             frm.set_df_property("status", "read_only", 0); // Allow Admins to edit status
//         }
//     },

//     // Trigger to make sure status updates on save as well
//     on_save: function (frm) {
//         if (frappe.session.user.toLowerCase() !== "administrator") {
//             // Set to Pending if the user is not an Admin on save
//             if (frm.doc.status !== "Pending") {
//                 frm.set_value("status", "Pending");
//             }
//         }
//     }
// });
frappe.ui.form.on('CP Purchase Order Item', {
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