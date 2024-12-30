// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Channel Partner", {
// 	refresh(frm) {

// 	},
// });







// Stock Tabel Data
frappe.ui.form.on('Channel Partner', {
    onload: function(frm) {
        // Call the server function to fetch the data
        if (frm.doc.channel_partner) {
            fetch_stock_data(frm, frm.doc.channel_partner);
        }
    },

    // Triggered when the channel_partner field changes
    channel_partner: function(frm) {
        if (frm.doc.channel_partner) {
            fetch_stock_data(frm, frm.doc.channel_partner);
        }
    }
});

// Function to fetch stock data and render it in the table
function fetch_stock_data(frm, channel_partner) {
    frappe.call({
        method: 'mi_cp.stockDataTable.cp_stock', // Server method path
        args: {
            channel_partner: channel_partner
        },
        callback: function(response) {
            if (response.message && response.message.length > 0) {
                render_data_table(frm, response.message, channel_partner);
            } else {
                frappe.msgprint(__('No stock data found.'));
            }
        }
    });
}

// Function to render the data in a table
function render_data_table(frm, data, channel_partner) {
    // Create a container for the table with the desired columns
    let table_html = `<h4>Stock : ${channel_partner}</h4>`;
    table_html += '<table class="table table-bordered"><thead><tr><th>Item Name</th><th>Total Sales Quantity</th><th>Remaining Stock</th></tr></thead><tbody>';

    // Loop through the fetched data and build the table rows
    data.forEach(row => {
        table_html += `<tr>
            <td>${row.item_name}</td>
            <td>${row.total_sales_quantity}</td>
            <td>${row.remaining_stock}</td>
        </tr>`;
    });

    table_html += '</tbody></table>';

    // Append the table to the Stock tab HTML field
    frm.fields_dict['stock_data_html'].$wrapper.html(table_html);
    frm.refresh_field('stock_data_html');
}

// Stock Table Data




//Sales Table Data

// frappe.ui.form.on('Channel Partner', {
//     onload: function(frm) {
//         // Call the server function to fetch the data
//         if (frm.doc.channel_partner) {
//             fetch_stock_data(frm, frm.doc.channel_partner);
//         }
//     },

//     // Triggered when the channel_partner field changes
//     channel_partner: function(frm) {
//         if (frm.doc.channel_partner) {
//             fetch_stock_data(frm, frm.doc.channel_partner);
//         }
//     }
// });

// // Function to fetch stock data and render it in the "Sales" tab
// function fetch_stock_data(frm, channel_partner) {
//     frappe.call({
//         method: 'mi_cp.salesapi.get_sales_by_channel_partner', // Server method path
//         args: {
//             channel_partner: channel_partner
//         },
//         callback: function(response) {
//             if (response.message && response.message.length > 0) {
//                 render_data_table(frm, response.message, channel_partner);
//             } else {
//                 frappe.msgprint(__('No stock data found.'));
//             }
//         }
//     });
// }

// // Function to render the data in the "Sales" field of the "Sales Data" tab
// function render_data_table(frm, data, channel_partner) {
//     // Create a container for the table with the desired columns
//     let table_html = `<h4>Sales Data for Channel Partner: ${channel_partner}</h4>`;
//     table_html += '<table class="table table-bordered"><thead><tr><th>Item Name</th><th>Total Stock Quantity</th></tr></thead><tbody>';

//     // Loop through the fetched data and build the table rows
//     data.forEach(row => {
//         table_html += `<tr>
//             <td>${row.item_name}</td>
//             <td>${row.total_stock_quantity}</td>
//         </tr>`;
//     });

//     table_html += '</tbody></table>';

//     // Append the table to the "Sales" field in the "Sales Data" tab
//     frm.fields_dict['sales'].$wrapper.html(table_html);
//     frm.refresh_field('sales');
// }

//Sales Table Data





 





frappe.ui.form.on('Channel Partner', {
    onload: function(frm) {
        frm.set_query('username', function() {
            return {
                filters: {
                    role_profile_name: 'Channel Partner'
                }
            };
        });
    }
});

// frappe.ui.form.on('Channel Partner', {
//     refresh: function (frm) {
//         frm.add_custom_button('CP Stock', function () {
//             const url = '/app/my-stock/view/list';
//             window.open(url, '_blank');
//         }).addClass('btn-primary');
//         frm.add_custom_button('CP Purchase Order', function () {
//             const url = '/app/cp-purchase-order/view/list';
//             // const url = `/app/cp-purchase-order/view/list?channel_partner=${encodeURIComponent(channel_partner)}`;


//             window.open(url, '_blank');
//         }).addClass('btn-primary');

//         frm.add_custom_button('CP Material Request', function () {
//             const url = '/app/cp-material-request/view/list';
//             window.open(url, '_blank');
//         }).addClass('btn-primary');

//         frm.add_custom_button('CP Supplier Quotation', function () {
//             const url = '/app/cp-supplier-quotation/view/list';
//             window.open(url, '_blank');
//         }).addClass('btn-primary');

//         frm.add_custom_button('Sales Quotation', function () {
//             const url = '/app/sales-quotation/view/list';
//             window.open(url, '_blank');
//         }).addClass('btn-primary');

//     }
// });

frappe.listview_settings["Channel Partner"] = {
    hide_name_column: true,
    add_fields: ["channel_partner"],

    button: {
        show: function(doc) {
            return doc.channel_partner;  // Show button if channel_partner exists
        },
        get_label: function() {
            return __("Stock List", null, "Access");
        },
        get_description: function(doc) {
            return __("Click to view report for {0}", [doc.name]);
        },
        action: function(doc) {
            // Redirect to the query report with the channel_partner filter
            let report_url = "/app/query-report/Stock?channel_partner=" + encodeURIComponent(doc.channel_partner);
            window.location.href = report_url;  // Redirects to the specified URL
        },
    },

    dropdown_button: {
        get_label: __("Actions"),  // Label for the dropdown
        show: function(doc) {
            return doc.channel_partner;  // Show dropdown if channel_partner exists
        },
        buttons: [
            {
                get_label: __("Button 1"),
                show: function(doc) {
                    return true;  // Always show Button 1
                },
                get_description: function(doc) {
                    return __("Action for {0}", [doc.name]);
                },
                action: function(doc) {
                    // Add your custom action for Button 1 here
                    frappe.msgprint("Button 1 clicked for " + doc.channel_partner);
                }
            },
            {
                get_label: __("Button 2"),
                show: function(doc) {
                    return doc.channel_partner !== "";  // Show Button 2 if channel_partner exists
                },
                get_description: function(doc) {
                    return __("Another action for {0}", [doc.name]);
                },
                action: function(doc) {
                    // Add your custom action for Button 2 here
                    frappe.msgprint("Button 2 clicked for " + doc.channel_partner);
                }
            },
            {
                get_label: __("Button 3"),
                show: function(doc) {
                    return doc.channel_partner;  // Show Button 3 if channel_partner exists
                },
                get_description: function(doc) {
                    return __("Final action for {0}", [doc.name]);
                },
                action: function(doc) {
                    // Add your custom action for Button 3 here
                    frappe.msgprint("Button 3 clicked for " + doc.channel_partner);
                }
            }
        ]
    }
};



frappe.ui.form.on('Channel Partner', {
    refresh: function(frm) {
        // Ensure that the 'Create User' button is rendered on the form
        frm.fields_dict['create_user'].input.onclick = function() {
            // Redirect to the correct route for the User doctype
            window.location.href = '/app/user';
        };
    }
});



// frappe.ui.form.on('Channel Partner', {
//     refresh: function(frm) {
//         // Ensure that the 'Create User' button is rendered on the form
//         frm.fields_dict['create_permission'].input.onclick = function() {
//             // Generate dynamic route with a unique identifier (e.g., random string, docname, or any value)
//             // const dynamic_id = frappe.utils.get_random_string(12); // Replace this with actual dynamic logic if needed
//             const dynamic_url = '/app/user-permission/new-user-permission';

//             // Redirect to the dynamically generated URL
//             window.location.href = dynamic_url;
//         };
//     }
// });



frappe.ui.form.on('Channel Partner', {
    // Trigger when the form is saved
    before_save(frm) {
        // Check if the User Permission Item table has data
        if (frm.doc.user_permission && frm.doc.user_permission.length > 0) {
            // Iterate over the rows of the User Permission Item child table
            frm.doc.user_permission.forEach(row => {
                // Create a new User Permission record based on the values in the User Permission Item child table

                frappe.call({
                    method: "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "User Permission",
                            user: row.user,
                            allow: row.allow,
                            for_value: row.for_value,
                            parent: frm.doc.name, // Link the permission to the current Channel Partner
                            parenttype: "Channel Partner",
                            parentfield: "user_permission"
                        }
                    },
                    // callback: function(response) {
                    //     console.log('User Permission saved:', response.message);
                    // }
                });
            });
        }
    }
});


 
/// set value for user_id in user

// This will set the 'user' field of the first row of the user_permission child table to 'Hello'

frappe.ui.form.on('Channel Partner', {
    refresh: function(frm) {
        // Check if the user_permission child table has at least 3 rows
        if (!frm.doc.user_permission || frm.doc.user_permission.length === 0) {
            // Add three rows to the user_permission table if there are no rows
            frm.add_child('user_permission', {
                user: frm.doc.user_id,
                allow: 'User',
                for_value: frm.doc.user_id
            });

            frm.add_child('user_permission', {
                user: frm.doc.user_id,
                allow: 'Channel Partner',
                for_value: frm.doc.channel_partner
            });

            frm.add_child('user_permission', {
                user: frm.doc.user_id,
                allow: 'Report',
                for_value: 'Stock'
            });

            // Refresh the child table to reflect the new rows
            frm.refresh_field('user_permission');
        } else {
            // Set values for row 0 if already present
            frm.doc.user_permission[0].user = frm.doc.user_id;
            frm.doc.user_permission[0].allow = 'User';
            frm.doc.user_permission[0].for_value = frm.doc.user_id;

            // Set values for row 1 if already present
            if (frm.doc.user_permission.length > 1) {
                frm.doc.user_permission[1].user = frm.doc.user_id;
                frm.doc.user_permission[1].allow = 'Channel Partner';
                frm.doc.user_permission[1].for_value = frm.doc.channel_partner;
            }

            // Set values for row 2 if already present
            if (frm.doc.user_permission.length > 2) {
                frm.doc.user_permission[2].user = frm.doc.user_id;
                frm.doc.user_permission[2].allow = 'Report';
                frm.doc.user_permission[2].for_value = 'Stock';
            }

            // Refresh the child table to reflect the changes
            frm.refresh_field('user_permission');
        }
    }
});






























// frappe.ui.form.on('User Permission Item', {
//     user: function(frm, cdt, cdn) {
//         const row = frappe.get_doc(cdt, cdn); // Get the current row in the child table
        
//         // Check if the user_id is set in the parent document (Channel Partner)
//         if (frm.doc.user_id) {
//             row.user = frm.doc.user_id; // Set the user field in the child row to the user_id from the parent
//             frm.refresh_field('user_permission'); // Refresh the child table to reflect the change
//         } else {
//             frappe.msgprint(__('Please set the User ID in the Channel Partner.'));
//         }
//     }
// });


// frappe.ui.form.on('User Permission Item', {
//     user: function(frm, cdt, cdn) {
//         const row = frappe.get_doc(cdt, cdn); // Get the current row in the child table
        
//         // Check if the user_id is set in the parent document (Channel Partner)
//         if (cur_frm.doc.user_id) {
//             row.user = cur_frm.doc.user_id; // Set the user field in the child row to the user_id from the parent
//             frm.refresh_field('user_permission'); // Refresh the child table to reflect the change
//         } else {
//             frappe.msgprint(__('Please set the User ID in the Channel Partner.'));
//         }
//     }
// });






// frappe.ui.form.on('Channel Partner', {
//     onload: function(frm) {
//         // Ensure full-width mode is enabled when the form loads
//         frappe.ui.toolbar.toggle_full_width(); 
        
//         // Toggle the sidebar when the form loads
//         // frappe.ui.toolbar.toggle_sidebar();
//     }
// });


// frappe.ui.form.on('Channel Partner', {
//     onload: function(frm) {

//         // Hide Assigned To field
//         frm.fields_dict['assigned_to'].$wrapper.hide();

//         // Hide Attachments section
//         frm.fields_dict['attachments'].$wrapper.hide();

//         // Hide Tags field
//         frm.fields_dict['tags'].$wrapper.hide();

//         // Hide Share section
//         frm.fields_dict['share'].$wrapper.hide();
//     }
// });
















//json Formate

// frappe.ui.form.on('Channel Partner', {
//     refresh: function (frm) {
//         frm.add_custom_button(__('Fetch My Stock Data'), function () {
//             fetch_cp_stock(frm);
//         });
//     }
// });

// function fetch_cp_stock(frm) {
//     frappe.call({
//         method: 'mi_cp.stockapi.cp_stock',
//         args: {
//             channel_partner: frm.doc.channel_partner // Pass the required field value
//         },
//         callback: function (response) {
//             if (response.message) {
//                 // Handle the fetched data
//                 frappe.msgprint({
//                     title: __('My Stock Data'),
//                     message: JSON.stringify(response.message, null, 2),
//                     indicator: 'blue'
//                 });
//             } else {
//                 frappe.msgprint(__('No data found for the selected Channel Partner'));
//             }
//         }
//     });
// }

 

// frappe.ui.form.on('Channel Partner', {
//     refresh: function (frm) {
//         frm.add_custom_button(__('See Stock Details'), function () {
//             fetch_cp_stock(frm);
//         }).addClass('btn-primary'); // Add color to the button
//     }
// });

// function fetch_cp_stock(frm) {
//     frappe.call({
//         method: 'mi_cp.stockapi.cp_stock',
//         args: {
//             channel_partner: frm.doc.channel_partner // Pass the required field value
//         },
//         callback: function (response) {
//             console.log('API Response:', response); // Log the response for debugging

//             if (response && response.message) {
//                 const channel_partner = frm.doc.channel_partner;
//                 const stock_data = response.message.message || [];

//                 if (stock_data.length === 0) {
//                     // If stock data is empty, show a message
//                     frappe.msgprint({
//                         title: `Stock : ${channel_partner}`,
//                         message: '<p style="color: red;">Stock is empty</p>',
//                         indicator: 'red'
//                     });
//                 } else {
//                     // Generate HTML table for the fetched data
//                     let table = `
//                         <table class="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th>Item Name</th>
//                                     <th>Total Quantity</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                     `;
//                     stock_data.forEach(row => {
//                         table += `
//                             <tr>
//                                 <td>${row.ItemName}</td>
//                                 <td>${row.TotalQuantity}</td>
//                             </tr>
//                         `;
//                     });

//                     table += `
//                             </tbody>
//                         </table>
//                     `;

//                     // Show the table in a message dialog with Channel Partner in the heading
//                     frappe.msgprint({
//                         title: `Stock : ${channel_partner}`,
//                         message: table,
//                         indicator: 'blue'
//                     });
//                 }
//             } else {
//                 // If response.message is not present
//                 frappe.msgprint({
//                     title: __('Error'),
//                     message: '<p style="color: red;">No data found for the selected Channel Partner.</p>',
//                     indicator: 'red'
//                 });
//             }
//         },
//         error: function (error) {
//             console.error('API Error:', error); // Log the error for debugging
//             frappe.msgprint({
//                 title: __('Error'),
//                 message: '<p style="color: red;">An error occurred while fetching stock details.</p>',
//                 indicator: 'red'
//             });
//         }
//     });
// }



// fetch Button - Stock


// frappe.ui.form.on('Channel Partner', {
//     refresh: function (frm) {
//         frm.add_custom_button(__('See Stock Details'), function () {
//             fetch_cp_stock(frm);
//         }).addClass('btn-primary'); // Add a primary button style
//     }
// });

// function fetch_cp_stock(frm) {
//     frappe.call({
//         method: 'mi_cp.stockapi.cp_stock',
//         args: {
//             channel_partner: frm.doc.channel_partner // Pass the channel_partner field value
//         },
//         callback: function (response) {
//             console.log('API Response:', response); // Debugging log

//             if (response && response.message) {
//                 const channel_partner = frm.doc.channel_partner;
//                 const stock_data = response.message || []; // Ensure response.message is an array

//                 if (stock_data.length === 0) {
//                     // Show message if stock data is empty
//                     frappe.msgprint({
//                         title: `Stock : ${channel_partner}`,
//                         message: '<p style="color: red;">Stock is empty</p>',
//                         indicator: 'red'
//                     });
//                 } else {
//                     // Create an HTML table for the fetched stock data
//                     let table = `
//                         <table class="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th>Item Name</th>
//                                     <th>Remaining Stock</th>
//                                     <th>Total Sales Quantity</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                     `;
//                     stock_data.forEach(row => {
//                         table += `
//                             <tr>
//                                 <td>${row.item_name}</td>
//                                 <td>${row.remaining_stock}</td>
//                                 <td>${row.total_sales_quantity}</td>
//                             </tr>
//                         `;
//                     });

//                     table += `
//                             </tbody>
//                         </table>
//                     `;

//                     // Display the table in a dialog
//                     frappe.msgprint({
//                         title: `Stock Details: ${channel_partner}`,
//                         message: table,
//                         indicator: 'blue'
//                     });
//                 }
//             } else {
//                 // Handle case where response.message is not present
//                 frappe.msgprint({
//                     title: __('Error'),
//                     message: '<p style="color: red;">No data found for the selected Channel Partner.</p>',
//                     indicator: 'red'
//                 });
//             }
//         },
//         error: function (error) {
//             console.error('API Error:', error); // Debugging log
//             frappe.msgprint({
//                 title: __('Error'),
//                 message: '<p style="color: red;">An error occurred while fetching stock details.</p>',
//                 indicator: 'red'
//             });
//         }
//     });
// }






// frappe.listview_settings['Channel Partner'] = {
// 	refresh: function(listview) {
//         $('span.sidebar-toggle-btn').hide();
//         $('.col-lg-2.layout-side-section').hide();
// 	}
// };


frappe.ui.form.on('Channel Partner', {
    refresh: function(frm) {
        // Hide the sidebar toggle button
        $('span.sidebar-toggle-btn').hide();

        // Hide the sidebar itself
        $('.col-lg-2.layout-side-section').hide();
    }
});

 


frappe.ui.form.on('Channel Partner', {
    refresh: function(frm) {
        frm.page.wrapper.find(".comment-box").css({'display':'none'});
    }
});



// frappe.ui.form.on("Channel Partner", {
//     refresh: function (frm) {
//         setTimeout(() => {
//           $('.timeline-items').hide();
//         }, 10);
//     }
//   });
  

frappe.ui.form.on("Channel Partner", {
    refresh: function (frm) {
        setTimeout(() => {
            // Hide the timeline (activity feed)
            $('.timeline-items').hide();

            // Hide the Activity heading (h4 text)
            $('h4:contains("Activity")').hide();
        }, 10);
    }
});



//Sales Receipt

// frappe.ui.form.on('Channel Partner', {
//     refresh: function (frm) {
//         frm.add_custom_button(__('Get Sales Data'), function () {
//             fetch_sales_data(frm);
//         }).addClass('btn-primary'); // Add color to the button
//     }
// });

// function fetch_sales_data(frm) {
//     // Ensure the channel_partner field is not empty
//     if (!frm.doc.channel_partner) {
//         frappe.msgprint(__('Please select a Channel Partner.'));
//         return;
//     }

//     frappe.call({
//         method: 'mi_cp.salesapi.get_sales_by_channel_partner', // API path
//         args: {
//             channel_partner: frm.doc.channel_partner
//         },
//         callback: function (response) {
//             console.log('API Response:', response); // Log for debugging

//             if (response && Array.isArray(response.message)) {
//                 const sales_data = response.message;

//                 if (sales_data.length === 0) {
//                     frappe.msgprint({
//                         title: `Sales : ${frm.doc.channel_partner}`,
//                         message: '<p style="color: red;">No sales data found</p>',
//                         indicator: 'red'
//                     });
//                 } else {
//                     // Generate HTML table for the sales data
//                     let table = `
//                         <table class="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th>Item Name</th>
//                                     <th>Total Quantity</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                     `;

//                     sales_data.forEach(row => {
//                         table += `
//                             <tr>
//                                 <td>${row.item_name}</td>
//                                 <td>${row.total_quantity}</td>
//                             </tr>
//                         `;
//                     });

//                     table += `
//                             </tbody>
//                         </table>
//                     `;

//                     // Display the table in a dialog box
//                     frappe.msgprint({
//                         title: `Sales : ${frm.doc.channel_partner}`,
//                         message: table,
//                         indicator: 'blue'
//                     });
//                 }
//             } else {
//                 frappe.msgprint({
//                     title: `Sales : ${frm.doc.channel_partner}`,
//                     message: '<p style="color: red;">No valid data found.</p>',
//                     indicator: 'red'
//                 });
//             }
//         },
//         error: function (error) {
//             console.error('API Error:', error);
//             frappe.msgprint({
//                 title: `Sales : ${frm.doc.channel_partner}`,
//                 message: '<p style="color: red;">An error occurred while fetching sales data.</p>',
//                 indicator: 'red'
//             });
//         }
//     });
// }



 