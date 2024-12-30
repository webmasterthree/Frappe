// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("My Stock", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("My Stock", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator')
        {
            frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});



// frappe.ui.form.on("My Stock", {
//     refresh(frm) {
//        frm.set_df_property('name', 'visibility', 'hidden');

//     },
// });
















// frappe.ui.form.on('My Stock', {
//     refresh: function (frm) {
//         frappe.call({
//             method: 'mi_cp.cp_stock.get_grouped_stock', // Ensure this matches your Python module and function
//             callback: function (response) {
//                 const data = response.message;

//                 // Clear existing data
//                 const container = frm.fields_dict['custom_html'].wrapper;
//                 container.innerHTML = '';

//                 // Create a table
//                 let html = '<table class="table table-bordered">';
//                 html += '<thead><tr><th>Channel Partner</th><th>Item Name</th><th>Quantity</th></tr></thead>';
//                 html += '<tbody>';
                
//                 Object.keys(data).forEach(channel_partner => {
//                     const items = data[channel_partner];
//                     items.forEach(item => {
//                         html += `<tr>
//                             <td>${channel_partner}</td>
//                             <td>${item.item_name}</td>
//                             <td>${item.quantity}</td>
//                         </tr>`;
//                     });
//                 });

//                 html += '</tbody></table>';
//                 container.innerHTML = html;
//             }
//         });
//     }
// });
























// frappe.ui.form.on('My Stock', {
//     validate: function(frm) {
//         if (frm.doc.items && frm.doc.items.length > 0) {
//             let updated_items = {};
//             let updated_summary = [];

//             frm.doc.items.forEach(function(item) {
//                 // Check if the item_code already exists in the updated_items dictionary
//                 if (updated_items[item.item_code]) {
//                     // If it exists, update the quantity by adding the current quantity
//                     updated_items[item.item_code].quantity += item.quantity;
//                 } else {
//                     // If it doesn't exist, add the item details to updated_items
//                     updated_items[item.item_code] = { ...item };
//                 }
//             });

//             // Prepare a summary of updated values
//             Object.values(updated_items).forEach(function(item) {
//                 updated_summary.push(`${item.item_code}: ${item.quantity}`);
//             });

//             // Clear the items table and reassign the consolidated data
//             frm.doc.items = Object.values(updated_items);

//             // Show updated values in a message
//             frappe.msgprint({
//                 title: __('Updated Items'),
//                 message: `<b>Items:</b><br>${updated_summary.join('<br>')}`,
//                 indicator: 'green'
//             });
//         }
//     }
// });


frappe.ui.form.on('My Stock', {
    validate: function(frm) {
        let item_codes_in_table = new Set();

        frm.doc.items.forEach(function(item) {
            // Check if the item_code already exists in the table
            if (item_codes_in_table.has(item.item_code)) {
                // If the item_code already exists, raise an error
                frappe.throw(__('{0} has already been added.', [item.item_code]));
            } else {
                // Add the item_code to the set of existing codes
                item_codes_in_table.add(item.item_code);
            }
        });
    }
});




frappe.listview_settings["My Stock"] = {
    hide_name_column: true,
    add_fields: ["channel_partner"],

    button: {
        show: function(doc) {
            return doc.channel_partner;  // You can modify the condition based on your requirement
        },
        get_label: function() {
            return __("Open", null, "Access");
        },
        get_description: function(doc) {
            return __("Open {0}", [doc.name]);  // Show document name or any other relevant field
        },
        action: function(doc) {
            frappe.set_route("Form", "My Stock", doc.name);  // Navigate to the form view of the 'My Stock' doctype
        },
    }
};


// frappe.ui.form.on('My Stock', {
//     before_save: function(frm) {
//         frappe.call({
//             method: "mi_cp.stockapi.consolidate_stock",
//             args: {
//                 doc: frm.doc
//             },
//             callback: function(response) {
//                 if (response.message) {
//                     // Replace the current doc with the consolidated doc
//                     frm.doc = response.message;
//                     frm.refresh();
//                     frappe.msgprint({
//                         title: __('Stock Updated'),
//                         message: __('Stock quantities have been consolidated across records.'),
//                         indicator: 'green'
//                     });
//                 }
//             }
//         });
//     }
// });
