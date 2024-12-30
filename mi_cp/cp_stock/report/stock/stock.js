// frappe.query_reports["Stock"] = {
//     "filters": [
//     ],
//     onload: function(report) {
//         report.page.add_inner_button(__("CP Purchase Order"), function() {
//             let report_url = "/app/query-report/Stock?channel_partner=" + encodeURIComponent(doc.channel_partner);
//             window.location.href = report_url
//         }).addClass("btn btn-success");
//     }
// }


// frappe.query_reports["Stock"] = {
//     "filters": [],
//     onload: function(report) {
//         report.page.add_inner_button(__("CP Purchase Order"), function() {
//             // Retrieve channel_partner dynamically
//             frappe.prompt([
//                 {
//                     fieldname: 'channel_partner',
//                     label: 'Channel Partner',
//                     fieldtype: 'Data',
//                     reqd: 1
//                 }
//             ], function(values) {
//                 // Construct the dynamic URL
//                 let report_url = `/app/query-report/CP%20Purchase%20Order?channel_partner=${encodeURIComponent(values.channel_partner)}`;
//                 window.location.href = report_url;
//             }, __("Enter Channel Partner"), __("Submit"));
//         }).addClass("btn btn-success");
//     }
// };

// frappe.listview_settings["Channel Partner"] = {
//     hide_name_column: true,
//     add_fields: ["channel_partner"],

//     button: {
//         show: function(doc) {
//             return doc.channel_partner;  // Show button if channel_partner exists
//         },
//         get_label: function() {
//             return __("Stock List", null, "Access");
//         },
//         get_description: function(doc) {
//             return __("Click to view report for {0}", [doc.name]);
//         },
//         action: function(doc) {
//             // Redirect to the query report with the channel_partner filter
//             let report_url = "/app/query-report/Stock?channel_partner=" + encodeURIComponent(doc.channel_partner);
//             window.location.href = report_url;  // Redirects to the specified URL
//         },
//     }
// };

