// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Sales Quotation", {
// 	refresh(frm) {

// 	},
// });


frappe.ui.form.on("Sales Quotation", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator'){
        frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});




frappe.ui.form.on('Sales Quotation', {
    refresh: function(frm) {
        // Add "Create Sales Receipt" inside the "Create" dropdown if the document is submitted
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Create Customer Sales Order'), function() {
                // Create a new Sales Receipt based on the Customer Sales Order
                frappe.new_doc("Customer Sales Order", {}, (new_receipt) => {
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
                    frappe.set_route("Form", "Customer Sales Order", new_receipt.name);
                });
            }, __('Create'))
            .addClass('btn btn-primary w-100'); // Adding Bootstrap classes for button styling
        }
    }
});