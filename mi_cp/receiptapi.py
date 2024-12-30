 
import frappe

@frappe.whitelist()
def receiptapi(channel_partner=None, items=[]):
    try:
        if not isinstance(items, list):
            items = frappe.parse_json(items)

        frappe.log_error(title="receiptapi Debug", message=f"Received channel_partner: {channel_partner}, items: {items}")

        unavailable_items = []

        for item in items:
            item_name = item.get("item_name")
            requested_quantity = item.get("quantity", 0)

            # Query to fetch available stock
            query = """
            SELECT 
                SUM(child.quantity) AS TotalQuantity
            FROM 
                `tabMy Stock` AS parent
            INNER JOIN 
                `tabStock Item` AS child
            ON 
                parent.name = child.parent
            WHERE 
                parent.channel_partner = %(channel_partner)s
                AND child.item_name = %(item_name)s
            GROUP BY 
                child.item_name;
            """
            result = frappe.db.sql(query, {'channel_partner': channel_partner, 'item_name': item_name}, as_dict=True)
            available_quantity = result[0].get("TotalQuantity", 0) if result else 0

            if requested_quantity > available_quantity:
                unavailable_items.append({
                    "item_name": item_name,
                    "requested_quantity": requested_quantity,
                    "available_quantity": available_quantity
                })

        if unavailable_items:
            return {
                "status": "error",
                "message": "Some items are not available in sufficient quantity.",
                "unavailable_items": unavailable_items
            }

        return {
            "status": "success",
            "message": "All items are available in sufficient quantity."
        }

    except Exception as e:
        frappe.log_error(title="Error in receiptapi", message=f"Error: {str(e)}")
        return {
            "status": "error",
            "message": "An error occurred while processing the request.",
            "error": str(e)
        }
