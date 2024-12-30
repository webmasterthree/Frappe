// frappe.pages['cp-stock-data'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Channel Partner Stock',
// 		single_column: true
// 	});
// }


frappe.pages['cp-stock-data'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Channel Partner Stock',
        single_column: true
    });

    // Filter Container with Select Dropdown for Channel Partner
    const $filter_container = $(`
        <div class="container mt-3">
            <div class="row">
                <div class="col-md-4">
                    <select 
                        id="channel_partner_filter" 
                        class="form-control" 
                        aria-label="Channel Partner">
                        <option value="">Select Channel Partner</option>
                    </select>
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
        <div class="container mt-5">
            <div class="row">
                <div class="col-12">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Channel Partner</th>
                                <th>Item Name</th>
                                <th>Total Quantity</th>
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
    const fetchAndRenderData = (channel_partner = null) => {
        frappe.call({
            method: 'mi_cp.stockapi.cp_stock',  // Custom server-side method
            args: { channel_partner },  // Pass the channel_partner as argument
            callback: function(response) {
                const $tbody = $table_container.find('tbody');
                $tbody.empty(); // Clear the table body

                if (response.message && response.message.message) {
                    const data = response.message.message;
                    data.forEach(row => {
                        $tbody.append(`
                            <tr>
                                <td>${row.ChannelPartner}</td>
                                <td>${row.ItemName}</td>
                                <td>${row.TotalQuantity}</td>
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

    // Fetch all channel partners to populate the select dropdown
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Channel Partner',  // Adjust this if your doctype is different
            fields: ['name'],
            limit_page_length: 100
        },
        callback: function(response) {
            const $channel_partner_select = $filter_container.find('#channel_partner_filter');
            if (response.message) {
                // Add Channel Partners as options to the dropdown
                response.message.forEach(partner => {
                    $channel_partner_select.append(`<option value="${partner.name}">${partner.name}</option>`);
                });
            }
        },
        error: function(err) {
            console.error("Error fetching channel partners:", err);
            frappe.msgprint('Failed to load channel partners.');
        }
    });

    // Fetch all data initially
    fetchAndRenderData();

    // Apply filter on button click
    $filter_container.find('#apply_filter').on('click', function() {
        const channel_partner = $filter_container.find('#channel_partner_filter').val().trim();
        fetchAndRenderData(channel_partner || null);
    });
};
