// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Item Name", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Item Name', {
    onload: function (frm) {
        // Check if the form is new and the item_code is empty
        if (frm.is_new() && !frm.doc.item_code) {
            // Generate a random number and ensure it's in the range 00001 to 99999
            let random_number = Math.floor(Math.random() * 99999 + 1);
            
            // Pad the number to ensure it is 5 digits
            let padded_number = String(random_number).padStart(5, '0');
            
            // Set the item_code in the format ITEM-00001
            frm.set_value('item_code', `ITEM-${padded_number}`);
        }
    }
});



frappe.ui.form.on('Item Name', {
    refresh: function (frm) {
        frappe.call({
            method: 'mi_cp.item.get_item', // Update this path if needed
            callback: function (response) {
                if (response.message) {
                    frm.fields_dict.items_table.$wrapper.html(response.message);
                } else {
                    frappe.msgprint(__('Failed to fetch data.'));
                }
            }
        });
    }
});
