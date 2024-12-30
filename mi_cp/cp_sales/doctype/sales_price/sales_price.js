// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt


frappe.ui.form.on("Sales Price", {
    rate(frm) {
        if (frm.doc.rate) {
            const add_profit = frm.doc.rate * 1.5; // Calculate selling price with 50% profit
            frm.set_value('selling_price', add_profit);
        } else {
            frm.set_value('selling_price', 0); // Reset if rate is empty
        }
    },
});



// frappe.ui.form.on('Sales Price', {
//     item_code: function(frm) {
//         // Ensure item_code is selected
//         if (frm.doc.item_code) {
//             // Call the server method to fetch item details
//             frappe.call({
//                 method: 'mi_cp.api.get_item_details',  // Replace with your actual module path
//                 args: {
//                     item_code: frm.doc.item_code  // Pass the item_code as an argument
//                 },
//                 callback: function(response) {
//                     if (response.message) {
//                         // Check if item details are returned
//                         const item_details = response.message;

//                         // Assuming you want to display item_name and purchase_price
//                         if (item_details.length > 0) {
//                             // Set the item_name and purchase_price in the Sales Price form
//                             frm.set_value('item_name', item_details[0].item_name);  // Set item_name
//                             frm.set_value('rate', item_details[0].purchase_price);  // Set purchase_price
//                         } else {
//                             frappe.msgprint(__('No details found for the selected item.'));
//                         }
//                     } else {
//                         frappe.msgprint(__('Error retrieving item details.'));
//                     }
//                 }
//             });
//         }
//     }
// });




// frappe.ui.form.on('Sales Price', {
//     item_code: function(frm) {
//         if (frm.doc.item_code) {
//             frappe.call({
//                 method: 'mi_cp.api.get_item_details', // Update the path as needed
//                 args: {
//                     item_code: frm.doc.item_code
//                 },
//                 callback: function(response) {
//                     if (response.message) {
//                         const item_details = response.message;
//                         if (Array.isArray(item_details) && item_details.length > 0) {
//                             frm.set_value('item_name', item_details[0].item_name || '');
//                             frm.set_value('rate', item_details[0].purchase_price || 0);
//                         } else {
//                             frappe.msgprint(__('No details found for the selected item.'));
//                         }
//                     } else {
//                         frappe.msgprint(__('Error retrieving item details.'));
//                     }
//                 },
//                 error: function(err) {
//                     frappe.msgprint(__('An error occurred: ' + err.message));
//                 }
//             });
//         } else {
//             frappe.msgprint(__('Please select an Item Code.'));
//         }
//     }
// });
