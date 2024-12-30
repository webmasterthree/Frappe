import frappe
from frappe import _

@frappe.whitelist()
def get_stock_quantity(item_code):
    if not frappe.has_permission("Stock Item", "read"):
        frappe.throw(__("You do not have permission to access Stock Item data."))
    
    stock_items = frappe.get_all(
        "Stock Item",
        filters={"item_code": item_code},
        fields=["quantity"]
    )
    
    total_quantity = sum(item["quantity"] for item in stock_items)
    return total_quantity





# import frappe
# from frappe import _

# @frappe.whitelist()
# def get_stock_quantity(item_code):
#     """
#     Retrieve the total stock quantity for a given item code.
#     Restrict access for Channel Partners to their specific stock data.

#     Args:
#         item_code (str): The item code to fetch the stock quantity for.

#     Returns:
#         int: Total quantity of the item for the user's accessible records.

#     Raises:
#         frappe.PermissionError: If the user does not have read permission on the Stock Item Doctype.
#     """
#     # Check if the user has read permission on "Stock Item"
#     if not frappe.has_permission("Stock Item", "read"):
#         frappe.throw(_("You do not have permission to access Stock Item data."))

#     user = frappe.session.user  # Get the current logged-in user
#     filters = {"item_code": item_code}  # Base filter for the item code

#     # Additional filter for "Channel Partner" role
#     if "Channel Partner" in frappe.get_roles(user):
#         # Get the linked Channel Partner for the current user
#         channel_partner = frappe.db.get_value("Channel Partner", {"user": user}, "name")
        
#         # Ensure the user has a valid Channel Partner record
#         if not channel_partner:
#             frappe.throw(_("No linked Channel Partner found for this user."))
        
#         # Add Channel Partner filter to restrict data
#         filters["channel_partner"] = channel_partner

#     # Fetch stock items with the applied filters
#     stock_items = frappe.get_all(
#         "Stock Item",
#         filters=filters,
#         fields=["quantity"]
#     )

#     # Calculate the total quantity of the item
#     total_quantity = sum(item["quantity"] for item in stock_items)

#     return total_quantity















# @frappe.whitelist()
# def get_item_details(item_code):
#     # Check if the user has read permission for the parent doctype containing the "Stock Item" child table
#     if not frappe.has_permission("Stock Item", "read"):
#         frappe.throw(__("You do not have permission to access Stock Item data."))
    
#     item_details = []
    
#     # Query the child table to fetch item_name and purchase_price for the given item_code
#     stock_items = frappe.get_all(
#         "Stock Item",
#         filters={"item_code": item_code},
#         fields=["item_name", "purchase_price"]
#     )
    
#     # Prepare the response with item details
#     for item in stock_items:
#         item_details.append({
#             "item_name": item["item_name"],
#             "purchase_price": item["purchase_price"]
#         })
    
#     return item_details


 