import frappe

@frappe.whitelist()
def get_item():
    items = frappe.db.sql("""
        SELECT item_name, pack_type, pack_size, uom 
        FROM `tabItem Name`
    """, as_dict=True)

    if items:
        html_table = """
        <table style="width:100%; border-collapse: collapse;" border="1">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Pack Type</th>
                    <th>Pack Size</th>
                    <th>UOM</th>
                </tr>
            </thead>
            <tbody>
        """
        for row in items:
            html_table += f"""
            <tr>
                <td>{row['item_name']}</td>
                <td>{row['pack_type']}</td>
                <td>{row['pack_size']}</td>
                <td>{row['uom']}</td>
            </tr>
            """
        html_table += "</tbody></table>"
        return html_table
    else:
        return "<p>No items found in Item Name doctype.</p>"
