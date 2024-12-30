// frappe.listview_settings["Channel Partner"] = {
//     hide_name_column: true,
//     add_fields: ["channel_partner"],

//     button: {
//         show: function(doc) {
//             return doc.channel_partner;  // Show button if channel_partner exists
//         },
//         get_label: function() {
//             return __("Actions");  // Dropdown label
//         },
//         get_description: function(doc) {
//             return __("Click to choose an action for {0}", [doc.name]);
//         },
//         action: function(doc) {
//             // Default action when no specific action is chosen
//             frappe.msgprint("No action selected for " + doc.channel_partner);
//         }
//     },

//     dropdown_button: {
//         get_label: __("Actions"),  // Label for the dropdown button
//         show: function(doc) {
//             return doc.channel_partner;  // Show dropdown if channel_partner exists
//         },
//         buttons: [
//             {
//                 get_label: __("Button 1"),
//                 show: function(doc) {
//                     return true;  // Always show Button 1
//                 },
//                 get_description: function(doc) {
//                     return __("Action for {0}", [doc.name]);
//                 },
//                 action: function(doc) {
//                     // Custom action for Button 1
//                     frappe.msgprint("Button 1 clicked for " + doc.channel_partner);
//                 }
//             },
//             {
//                 get_label: __("Button 2"),
//                 show: function(doc) {
//                     return doc.channel_partner !== "";  // Show Button 2 if channel_partner exists
//                 },
//                 get_description: function(doc) {
//                     return __("Another action for {0}", [doc.name]);
//                 },
//                 action: function(doc) {
//                     // Custom action for Button 2
//                     frappe.msgprint("Button 2 clicked for " + doc.channel_partner);
//                 }
//             },
//             {
//                 get_label: __("Button 3"),
//                 show: function(doc) {
//                     return doc.channel_partner;  // Show Button 3 if channel_partner exists
//                 },
//                 get_description: function(doc) {
//                     return __("Final action for {0}", [doc.name]);
//                 },
//                 action: function(doc) {
//                     // Custom action for Button 3
//                     frappe.msgprint("Button 3 clicked for " + doc.channel_partner);
//                 }
//             }
//         ]
//     }
// };
