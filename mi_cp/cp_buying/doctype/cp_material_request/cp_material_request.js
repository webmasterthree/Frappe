// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("CP Material Request", {
// 	refresh(frm) {

// 	},
// });



frappe.ui.form.on("CP Material Request", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator')
        {
            frm.set_value('channel_parnter',frappe.session.user_fullname);
        }
	},
});


// frappe.session.user !== 'Administrator'

// frappe.ui.form.on('CP Material Request Item', {
//     item_code: function(frm, cdt, cdn) {
//         var row = locals[cdt][cdn];
        
//         // Fetching Item details including Item Name, Pack Type, and Pack Size
//         if (row.item_code) {
//             frappe.call({
//                 method: 'frappe.client.get',
//                 args: {
//                     doctype: 'Sales Price',
//                     name: row.item_code
//                 },
//                 callback: function(data) {
//                     if (data.message) {
//                         frappe.model.set_value(cdt, cdn, 'price', data.message.selling_price);
//                     }
//                 }
//             });
//         }
//     }
// });
// create supplier quoation supplier Quotation
frappe.ui.form.on('CP Material Request', {
    refresh: function(frm) {
        if (frm.doc.status === 'Supplier Quotation Generated' && frappe.session.user == 'Administrator') {
            // Add the "Create Supplier Quotation" button
            frm.add_custom_button(__('Create Supplier Quotation'), function() {
                // Create a new Supplier Quotation document
                frappe.model.with_doctype('CP Supplier Quotation', function() {
                    let new_supplier_quotation = frappe.model.get_new_doc('CP Supplier Quotation');
                    
                    // Map fields from CP Material Request to Supplier Quotation
                    new_supplier_quotation.channel_partner = frm.doc.channel_parnter;

                    // Map items from CP Material Request to Supplier Quotation items table
                    frm.doc.items.forEach((order_item) => {
                        let sq_item = frappe.model.add_child(new_supplier_quotation, 'items');
                        sq_item.item_code = order_item.item_code;
                        sq_item.item_name = order_item.item_name;
                        sq_item.pack_type = order_item.pack_type;
                        sq_item.pack_size = order_item.pack_size;
                        sq_item.uom= order_item.uom;
                        sq_item.quantity = order_item.quantity;

                        sq_item.rate = order_item.price; // Map price to rate
                    });

                    // Redirect to the new Supplier Quotation document
                    frappe.set_route('Form', 'CP Supplier Quotation', new_supplier_quotation.name);
                });
            }).addClass('btn-primary'); // Style the button as primary
        }
    }
});



//status handling
frappe.ui.form.on('CP Material Request', {
    status: function(frm) {
        if (frm.doc.status == 'Supplier Quotation Generated' && frappe.session.user != 'Administrator') {
            frappe.msgprint(__('You are not authorized to select "Supplier Quotation Generated".'));
            // Optionally reset the field or handle the case if unauthorized
            frm.set_value('status', 'Pending');  // or 'Order' depending on the desired fallback
        }
    }
});



 

// create purchase order


frappe.ui.form.on('CP Material Request', {
    refresh: function(frm) {
        if (frm.doc.status === 'Order' && frappe.session.user == 'Administrator') {
            // Add the "Create Supplier Quotation" button
            frm.add_custom_button(__('Create Purchase Order'), function() {
                // Create a new Supplier Quotation document
                frappe.model.with_doctype('CP Purchase Order', function() {
                    let new_supplier_quotation = frappe.model.get_new_doc('CP Purchase Order');
                    
                    // Map fields from CP Material Request to Supplier Quotation
                    new_supplier_quotation.channel_partner = frm.doc.channel_parnter;
                    new_supplier_quotation.required_by = frm.doc.required_by;

                    // Map items from CP Material Request to Supplier Quotation items table
                    frm.doc.items.forEach((order_item) => {
                        let sq_item = frappe.model.add_child(new_supplier_quotation, 'items');
                        sq_item.item_code = order_item.item_code;
                        sq_item.item_name = order_item.item_name;
                        sq_item.quantity = order_item.quantity;
                        // sq_item.rate = order_item.price; // Map price to rate
                    });

                    // Redirect to the new Supplier Quotation document
                    frappe.set_route('Form', 'CP Purchase Order', new_supplier_quotation.name);
                });
            }).addClass('btn-primary'); // Style the button as primary
        }
    }
});






















// frappe.ui.form.on('CP Material Request Item', {
//     item_code: function (frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (row.item_code) {
//             // Fetch the brand details from the Item Name doctype
//             frappe.db.get_doc('Item Name', row.item_code).then(doc => {
//                 if (doc.brand && doc.brand.length > 0) {
//                     // Set the brand field with the first brand's name (or customize as needed)
//                     frappe.model.set_value(cdt, cdn, 'brand', doc.brand.map(brand => brand.brand).join(', '));
//                 } else {
//                     // Clear the brand field if no brands are found
//                     frappe.model.set_value(cdt, cdn, 'brand', '');
//                     frappe.msgprint(__('No brands found for this item.'));
//                 }
//             });
//         } else {
//             // Clear the brand field if item_code is empty
//             frappe.model.set_value(cdt, cdn, 'brand', '');
//         }
//     }
// });




// frappe.ui.form.on('CP Material Request Item', {
//     item_code: function(frm, cdt, cdn) {
//         const row = locals[cdt][cdn];

//         if (row.item_code) {
//             // Fetch the `brand` field value from the `Item Name` doctype
//             frappe.db.get_value('Item Name', row.item_code, 'brand', (r) => {
//                 if (r && r.message && r.message.brand) {
//                     const selected_brands = r.message.brand.split(',').map(brand => brand.brand.trim());
//                     console.log("Fetched brands for item:", selected_brands);

//                     // Apply filter to `brand` field based on the `Brand Name` doctype
//                     frm.fields_dict['items'].grid.get_field('brand_name').get_query = function() {
//                         return {
//                             filters: {
//                                 'brand_name': ['in', selected_brands]  // Match the `brand_name` field in `Brand Name` doctype
//                             }
//                         };
//                     };
//                 } else {
//                     console.log("No brands found for item_code:", row.item_code);
//                     // If no brands are found, clear the filter
//                     frm.fields_dict['items'].grid.get_field('brand').get_query = function() {
//                         return {
//                             filters: {
//                                 'brand_name': ['in', []]  // Empty filter if no brands
//                             }
//                         };
//                     };
//                 }

//                 // Refresh the field to apply the new filter
//                 frm.refresh_field('items');
//             });
//         }
//     },

//     refresh: function(frm) {
//         // Default filter when the form is refreshed
//         frm.fields_dict['items'].grid.get_field('brand').get_query = function() {
//             return {
//                 filters: {
//                     'brand_name': ['!=', '']  // Ensure it matches only valid `brand_name` values
//                 }
//             };
//         };
//     }
// });


// frappe.ui.form.on('CP Material Request', {
//     refresh: function(frm) {
//         // Add "Create Sales Receipt" inside the "Create" dropdown if the document is submitted
//         if (frm.doc.docstatus == 1) {
//             frm.add_custom_button(__('Create Sales Receipt'), function() {
//                 // Create a new Sales Receipt based on the Customer Sales Order
//                 frappe.new_doc("Customer Sales Receipt", {}, (new_receipt) => {
//                     // Set fields in the new Sales Receipt based on Customer Sales Order
//                     new_receipt.customer_name = frm.doc.customer_name;
//                     new_receipt.channel_partner = frm.doc.channel_partner;
//                     new_receipt.date = frm.doc.date;
//                     new_receipt.delivery_date = frm.doc.delivery_date;
//                     new_receipt.total_amount = frm.doc.total_amount;
//                     new_receipt.amount_chargeable_in_words = frm.doc.amount_chargeable_in_words;
//                     new_receipt.address = frm.doc.address;
//                     // new_receipt.total_amount18_gst_included = frm.doc.total_amount18_gst_included;

//                     // Map items from Customer Sales Order to Sales Receipt items table
//                     frm.doc.items.forEach((order_item) => {
//                         let receipt_item = frappe.model.add_child(new_receipt, 'items');
//                         receipt_item.item_code = order_item.item_code;
//                         receipt_item.item_name = order_item.item_name;
//                         receipt_item.quantity = order_item.quantity;
//                         receipt_item.price = order_item.price;
//                         receipt_item.amount = order_item.amount;
//                     });

//                     // Route to the new Sales Receipt document
//                     frappe.set_route("Form", "Customer Sales Receipt", new_receipt.name);
//                 });
//             }, __('Create'))
//             .addClass('btn btn-danger w-100'); // Adding Bootstrap classes for button styling
//         }
//     }
// });