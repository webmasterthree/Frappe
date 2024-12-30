// frappe.pages['earned-loyality'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Earned Loyality Points',
// 		single_column: true
// 	});
// }


frappe.pages['earned-loyality'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Earned Loyalty Points',
        single_column: true
    });

    // Filter container with a search icon
    const $filter_container = $(`
        <div class="container mt-3">
            <div class="row">
                <div class="col-md-4">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input 
                            type="text" 
                            id="sales_executive_filter" 
                            class="form-control" 
                            placeholder="Enter Sales Executive" 
                            aria-label="Sales Executive">
                    </div>
                </div>
                <div class="col-md-2">
                    <button 
                        class="btn btn-primary w-100" 
                        id="apply_filter">
                        Search
                    </button>
                </div>
            </div>
        </div>
    `);

    // Table container for displaying results
    const $table_container = $(`
        <div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Sales Executive</th>
                        <th>Item Name</th>
                        <th>Total Quantity</th>
                        <th>Total Amount</th>
                        <th>Total Reward Points</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `);

    $(page.body).append($filter_container).append($table_container);

    // Function to fetch and render data based on sales executive filter
    const fetchAndRenderData = (sales_executive = null) => {
        frappe.call({
            method: 'mi_cp.loyalitypoint.earned_points',
            args: { sales_executive },
            callback: function(response) {
                const $tbody = $table_container.find('tbody');
                $tbody.empty(); // Clear the table body

                if (response.message && response.message.length > 0) {
                    const data = response.message;
                    data.forEach(row => {
                        $tbody.append(`
                            <tr>
                                <td>${row.Sales_Executive}</td>
                                <td>${row.ItemName}</td>
                                <td>${row.TotalQuantity}</td>
                                <td>${row.total_amount}</td>
                                <td>${row.Total_Reward_Points}</td>
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
        const sales_executive = $filter_container.find('#sales_executive_filter').val().trim();
        fetchAndRenderData(sales_executive || null);
    });
};
