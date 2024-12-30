frappe.query_reports["Stock Report"] = {
    "filters": [
    ],
    onload: function(report) {
        report.page.add_inner_button(__("Add New Stock"), function() {
            window.location.href = "/app/my-stock/new-my-stock";
        }).addClass("btn btn-danger");
    }
};