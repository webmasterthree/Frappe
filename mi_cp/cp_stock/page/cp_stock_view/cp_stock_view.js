// // frappe.pages['cp_stock_view'].on_page_load = function(wrapper) {
// // 	var page = frappe.ui.make_app_page({
// // 		parent: wrapper,
// // 		title: 'Stock Data',
// // 		single_column: true
// // 	});
// // }



frappe.pages['cp_stock_view'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Stock Data',
        single_column: true
    });

    // Filter Container
    const $filter_container = $(`
        <div class="container mt-3">
            <div class="row">
                <div class="col-md-4">
                    <input 
                        type="text" 
                        id="item_name_filter" 
                        class="form-control w-100" 
                        placeholder="Enter Item Name">
                </div>
                <div class="col-md-2">
                    <button 
                        class="btn btn-success w-100" 
                        id="apply_filter">
                        Search
                    </button>
                </div>
            </div>
        </div>
    `);

    // Table Container
    const $table_container = $(`
        <div class="container mt-3">
            <div class="row">
                <div class="col-12">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Sold Out Quantity</th>
                                <th>Remaining Stock</th>
                                <th>Purchase Price</th>
                                <th>Pack Type</th>
                                <th>Unit of Measurement</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    `);

    // Append Filter and Table to Page
    $(page.body).append($filter_container).append($table_container);

    // Function to Fetch and Render Data
    const fetchAndRenderData = (item_name = null) => {
        frappe.call({
            method: 'mi_cp.stock.cp_stock',
            args: { item_name },
            callback: function(response) {
                const $tbody = $table_container.find('tbody');
                $tbody.empty(); // Clear the table body

                if (response.message && response.message.message) {
                    const data = response.message.message;
                    data.forEach(row => {
                        $tbody.append(`
                            <tr>
                                <td>${row.ITEM_NAME}</td>
                                <td>${row.SOLD_OUT_QUANTITY}</td>
                                <td>${row.REMAINING_STOCK}</td>
                                <td>${row.PURCHASE_PRICE}</td>
                                <td>${row.PACK_TYPE}</td>
                                <td>${row.UNIT_OF_MEASUREMENT}</td>
                            </tr>
                        `);
                    });
                } else {
                    frappe.msgprint('No data found.');
                }
            },
            error: function(err) {
                console.error("Error:", err);
                frappe.msgprint('Failed to fetch data.');
            }
        });
    };

    // Fetch all data initially
    fetchAndRenderData();

    // Apply filter on button click
    $filter_container.find('#apply_filter').on('click', function() {
        const item_name = $filter_container.find('#item_name_filter').val().trim();
        fetchAndRenderData(item_name || null);
    });
};





















// // frappe.pages['cp_stock_view'].on_page_load = function(wrapper) {
// //     var page = frappe.ui.make_app_page({
// //         parent: wrapper,
// //         title: 'Stock Data',
// //         single_column: true
// //     });

// //     const $table_container = $(`
// //         <div>
// //             <table class="table table-bordered">
// //                 <thead>
// //                     <tr>
// //                         <th>Item Name</th>
// //                          <th>Sold Out Quantity</th>
// //                         <th>Remaining Stock</th>
// //                         <th>Purchase Price</th>
// //                         <th>Pack Type</th>
// //                         <th>Unit of Measurement</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody></tbody>
// //             </table>
// //         </div>
// //     `);

// //     $(page.body).append($table_container);

// //     frappe.call({
// //         method: 'mi_cp.stock.cp_stock',
// //         callback: function(response) {
// //             console.log("Response:", response); // Log the response for debugging

// //             // Access the correct level of the response
// //             if (response.message && response.message.message) {
// //                 const data = response.message.message;
// //                 const $tbody = $table_container.find('tbody');
// //                 $tbody.empty(); // Clear the table body before populating

// //                 data.forEach(row => {
// //                     $tbody.append(`
// //                         <tr>
// //                             <td>${row.ITEM_NAME}</td>
// //                             <td>${row.SOLD_OUT_QUANTITY}</td>
// //                             <td>${row.REMAINING_STOCK}</td>
// //                             <td>${row.PURCHASE_PRICE}</td>
// //                             <td>${row.PACK_TYPE}</td>
// //                             <td>${row.UNIT_OF_MEASUREMENT}</td>
// //                         </tr>
// //                     `);
// //                 });
// //             } else {
// //                 frappe.msgprint('No data found.');
// //             }
// //         },
// //         error: function(err) {
// //             console.error("Error:", err); // Log the error for debugging
// //             frappe.msgprint('Failed to fetch data.');
// //         }
// //     });
// // };


// // frappe.pages['cp_stock_view'].on_page_load = function(wrapper) {
// //     var page = frappe.ui.make_app_page({
// //         parent: wrapper,
// //         title: 'Stock Data',
// //         single_column: true
// //     });

// //     const $filter_container = $(`
// //     <div class="container mt-3">
// //         <div class="row">
// //             <div class="col-md-4">
// //                 <input 
// //                     type="text" 
// //                     id="item_name_filter" 
// //                     class="form-control" 
// //                     placeholder="Enter Item Name" 
// //                     aria-label="Item Name">
// //             </div>
// //             <div class="col-md-2">
// //                 <button 
// //                     class="btn btn-primary w-100" 
// //                     id="apply_filter">
// //                     Search
// //                 </button>
// //             </div>
// //         </div>
// //     </div>
// // `);

// //     const $table_container = $(`
// //         <div>
// //             <table class="table table-bordered">
// //                 <thead>
// //                     <tr>
// //                         <th>Item Name</th>
// //                          <th>Sold Out Quantity</th>
// //                         <th>Remaining Stock</th>
// //                         <th>Purchase Price</th>
// //                         <th>Pack Type</th>
// //                         <th>Unit of Measurement</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody></tbody>
// //             </table>
// //         </div>
// //     `);

// //     $(page.body).append($filter_container).append($table_container);

// //     const fetchAndRenderData = (item_name = null) => {
// //         frappe.call({
// //             method: 'mi_cp.stock.cp_stock',
// //             args: { item_name },
// //             callback: function(response) {
// //                 const $tbody = $table_container.find('tbody');
// //                 $tbody.empty(); // Clear the table body

// //                 if (response.message && response.message.message) {
// //                     const data = response.message.message;
// //                     data.forEach(row => {
// //                         $tbody.append(`
// //                             <tr>
// //                                 <td>${row.ITEM_NAME}</td>
// //                                 <td>${row.SOLD_OUT_QUANTITY}</td>
// //                                 <td>${row.REMAINING_STOCK}</td>
// //                                 <td>${row.PURCHASE_PRICE}</td>
// //                                 <td>${row.PACK_TYPE}</td>
// //                                 <td>${row.UNIT_OF_MEASUREMENT}</td>
// //                             </tr>
// //                         `);
// //                     });
// //                 } else {
// //                     frappe.msgprint('No data found.');
// //                 }
// //             },
// //             error: function(err) {
// //                 console.error("Error:", err);
// //                 frappe.msgprint('Failed to fetch data.');
// //             }
// //         });
// //     };

// //     // Fetch all data initially
// //     fetchAndRenderData();

// //     // Apply filter on button click
// //     $filter_container.find('#apply_filter').on('click', function() {
// //         const item_name = $filter_container.find('#item_name_filter').val().trim();
// //         fetchAndRenderData(item_name || null);
// //     });
// // };
