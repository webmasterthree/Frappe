// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Sales Executive", {
// 	refresh(frm) {

// 	},
// });



// frappe.ui.form.on('Sales Executive', {
//     onload: function (frm) {
//         // Fetch users with the role "Sales Executive"
//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "Has Role",
//                 filters: {
//                     role: "Sales Executive"
//                 },
//                 fields: ["parent"] // 'parent' contains the user ID
//             },
//             callback: function (response) {
//                 if (response.message) {
//                     // Extract user IDs
//                     let sales_executive_users = response.message.map(role => role.parent);

//                     // Apply filter to the 'user' field
//                     frm.set_query("user", function () {
//                         return {
//                             filters: [
//                                 ["User", "name", "in", sales_executive_users]
//                             ]
//                         };
//                     });
//                 }
//             }
//         });
//     }
// });

frappe.ui.form.on('Sales Executive', {
    onload: function(frm) {
        frm.set_query('username', function() {
            return {
                filters: {
                    role_profile_name: 'Sales Executive'
                }
            };
        });
    }
});


 