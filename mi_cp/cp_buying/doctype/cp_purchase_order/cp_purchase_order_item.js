frappe.ui.form.on('CP Purchase Order Item', {
    item_code: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        
        // Fetching Item details including Item Name, Pack Type, and Pack Size
        if (row.item_code) {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: 'Sales Price',
                    name: row.item_code
                },
                callback: function(data) {
                    if (data.message) {
                        frappe.model.set_value(cdt, cdn, 'price', data.message.selling_price);
                    }
                }
            });
        }
    }
});