// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("CP Supplier Quotation", {
// 	refresh(frm) {

// 	},
// });




 


// frappe.ui.form.on("CP Supplier Quotation", {
//     refresh: function (frm) {
//         // Add a custom button to fetch items from CP Material Request
//         frm.add_custom_button(__('Get Items from Material Request'), function () {
//             // Prompt the user to select a CP Material Request
//             frappe.prompt({
//                 label: 'Material Request',
//                 fieldname: 'material_request',
//                 fieldtype: 'Link',
//                 options: 'CP Material Request',
//                 reqd: 1
//             },
//             function (data) {
//                 // Fetch items from the selected Material Request
//                 frappe.call({
//                     method: "frappe.client.get",
//                     args: {
//                         doctype: "CP Material Request",
//                         name: data.material_request
//                     },
//                     callback: function (r) {
//                         if (r.message) {
//                             let materialRequest = r.message;

//                             // Clear existing items in the child table
//                             frm.clear_table('items');

//                             // Loop through items in the Material Request and add them to the Supplier Quotation
//                             (materialRequest.items || []).forEach(item => {
//                                 let newRow = frm.add_child('items');
//                                 frappe.model.set_value(newRow.doctype, newRow.name, {
//                                     item_code: item.item_code,
//                                     item_name: item.item_name,
//                                     pack_type: item.pack_type,
//                                     pack_size: item.pack_size,
//                                     uom:item.uom,
//                                     quantity: item.quantity,
                                     
//                                 });
//                             });

//                             // Refresh the child table to show the newly added items
//                             frm.refresh_field('items');
//                         }
//                     }
//                 });
//             });
//         }, __("Actions")); // Group the button under the "Actions" menu
//     }
// });


 
// frappe.ui.form.on("CP Supplier Quotation", {
//     refresh: function (frm) {
//         // Add a custom button to fetch items from CP Material Request
//         frm.add_custom_button(__('Get Items from Material Request'), function () {
//             // Prompt the user to select a CP Material Request
//             frappe.prompt({
//                 label: 'Material Request',
//                 fieldname: 'material_request',
//                 fieldtype: 'Link',
//                 options: 'CP Material Request',
//                 reqd: 1
//             },
//             function (data) {
//                 // Fetch items from the selected Material Request
//                 frappe.call({
//                     method: "frappe.client.get",
//                     args: {
//                         doctype: "CP Material Request",
//                         name: data.material_request
//                     },
//                     callback: function (r) {
//                         if (r.message) {
//                             let materialRequest = r.message;
//                             if(materialRequest.channel_parnter){
//                                 frm.set_value('channel_partner',materialRequest.channel_parnter)
//                             }
//                             // Clear existing items in the child table


//                             // Loop through items in the Material Request and add them to the Supplier Quotation
//                             (materialRequest.items || []).forEach(item => {
//                                 let newRow = frm.add_child('items');
//                                 frappe.model.set_value(newRow.doctype, newRow.name, {
//                                     item_code: item.item_code,
//                                     item_name: item.item_name,
//                                     pack_type: item.pack_type,
//                                     pack_size: item.pack_size,
//                                     uom: item.uom,
//                                     quantity: item.quantity
//                                 });

//                                 // Fetch the price for the item from the Sales Price Doctype
//                                 frappe.db.get_value('Sales Price', { item_code: item.item_code }, 'selling_price', function (value) {
//                                     if (value && value.selling_price) {
//                                         // Set the fetched price in the new row
//                                         frappe.model.set_value(newRow.doctype, newRow.name, 'price', value.selling_price);
//                                     } else {
//                                         // If no price is found, set it to 0 or leave it blank
//                                         frappe.model.set_value(newRow.doctype, newRow.name, 'selling_price', 0);
//                                     }
//                                 });
//                             });

//                             // Refresh the child table to show the newly added items
//                             frm.refresh_field('items');
//                         }
//                     }
//                 });
//             });
//         }, __("Actions")); // Group the button under the "Actions" menu
//     }
// });


//role 
frappe.ui.form.on("CP Supplier Quotation", {
    refresh: function (frm) {
        // Check if the user has the "System Manager" or "Administrator" role
        if (frappe.user_roles.includes('System Manager') || frappe.user_roles.includes('Administrator')) {
            // Add a custom button to fetch items from CP Material Request
            frm.add_custom_button(__('Get Items from Material Request'), function () {
                // Prompt the user to select a CP Material Request
                frappe.prompt({
                    label: 'Material Request',
                    fieldname: 'material_request',
                    fieldtype: 'Link',
                    options: 'CP Material Request',
                    reqd: 1
                },
                function (data) {
                    // Fetch items from the selected Material Request
                    frappe.call({
                        method: "frappe.client.get",
                        args: {
                            doctype: "CP Material Request",
                            name: data.material_request
                        },
                        callback: function (r) {
                            if (r.message) {
                                let materialRequest = r.message;
                                if (materialRequest.channel_parnter) {
                                    frm.set_value('channel_partner', materialRequest.channel_parnter);
                                }

                                // Clear existing items in the child table
                                frm.clear_table('items');

                                // Loop through items in the Material Request and add them to the Supplier Quotation
                                (materialRequest.items || []).forEach(item => {
                                    let newRow = frm.add_child('items');
                                    frappe.model.set_value(newRow.doctype, newRow.name, {
                                        item_code: item.item_code,
                                        item_name: item.item_name,
                                        pack_type: item.pack_type,
                                        pack_size: item.pack_size,
                                        uom: item.uom,
                                        quantity: item.quantity
                                    });

                                    // Fetch the price for the item from the Sales Price Doctype
                                    frappe.db.get_value('Sales Price', { item_code: item.item_code }, 'selling_price', function (value) {
                                        if (value && value.selling_price) {
                                            // Set the fetched price in the new row
                                            frappe.model.set_value(newRow.doctype, newRow.name, 'price', value.selling_price);
                                        } else {
                                            // If no price is found, set it to 0 or leave it blank
                                            frappe.model.set_value(newRow.doctype, newRow.name, 'selling_price', 0);
                                        }
                                    });
                                });

                                // Refresh the child table to show the newly added items
                                frm.refresh_field('items');
                            }
                        }
                    });
                });
            }, __("Actions")); // Group the button under the "Actions" menu
        }
    }
});






// frappe.ui.form.on("CP Supplier Quotation Item", {
//     price: function (frm, cdt, cdn) {
//         calculate_row_amount_and_total(frm, cdt, cdn);
//     },
//     quantity: function (frm, cdt, cdn) {
//         calculate_row_amount_and_total(frm, cdt, cdn);
//     },
// });

// function calculate_row_amount_and_total(frm, cdt, cdn) {
//     const row = locals[cdt][cdn];
    
//     // Calculate row amount
//     row.amount = (row.price || 0) * (row.quantity || 0);
//     frm.refresh_field("items"); // Refresh child table to update the amount field

//     // Calculate total amount
//     let total = 0;
//     frm.doc.items.forEach((row) => {
//         total += row.amount || 0;
//     });

//     // Update total_amount field in the parent form
//     frm.set_value("total_amount", total);
// }











//  
frappe.ui.form.on("CP Supplier Quotation Item", {
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
    frm.set_value("amount_in_words", totalInWords);
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


// total Quantity

frappe.ui.form.on("CP Supplier Quotation Item", {
    quantity: function(frm, cdt, cdn) {
        const row = locals[cdt][cdn];

        let totalQuantity = 0;
        frm.doc.items.forEach(item => {
            totalQuantity += item.quantity || 0;
        });
        frm.set_value('total_quantity', totalQuantity);
    }
});



// Status
// frappe.ui.form.on("CP Supplier Quotation", {
//     on_submit: function(frm) {
//         frm.set_value("status", "Submitted");
//     }
// });





// create purchase order

frappe.ui.form.on('CP Supplier Quotation', {
    refresh: function(frm) {
        // Add "Create Purchase Order" inside the "Create" dropdown if the document is submitted
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Create Purchase Order'), function() {
                // Create a new CP Purchase Order document
                frappe.new_doc("CP Purchase Order", {}, (new_order) => {
                    // Set fields in the new Purchase Order based on the Supplier Quotation
                    new_order.channel_partner = frm.doc.channel_partner;
                    new_order.supplier = frm.doc.supplier;
                    new_order.date = frappe.datetime.now_date();
                    new_order.supplier_name = frm.doc.supplier_name;
                    new_order.required_by = frm.doc.required_by;
                    new_order.total_amount = frm.doc.total_amount;
                    new_order.total_amount_in_words = frm.doc.amount_in_words;
                    new_order.total_quantity = frm.doc.total_quantity;

                    // Map items from Supplier Quotation to Purchase Order items table
                    (frm.doc.items || []).forEach((item) => {
                        let new_item = frappe.model.add_child(new_order, 'items');
                        new_item.item_code = item.item_code;
                        new_item.item_name = item.item_name;
                        new_item.pack_type = item.pack_type,
                        new_item.pack_size = item.pack_size,
                        new_item.quantity = item.quantity;
                        new_item.price = item.price;
                        new_item.amount = item.amount;
                    });

                    // Route to the new CP Purchase Order document
                    frappe.set_route("Form", "CP Purchase Order", new_order.name);
                });
            }, __('Create'))
            .addClass('btn-success'); // Adding a success button style
        }
    }
});


// Selling Price
frappe.ui.form.on('CP Supplier Quotation Item', {
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
