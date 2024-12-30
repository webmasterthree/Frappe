import frappe
from frappe import _

@frappe.whitelist()
def cp_stock(channel_partner):
    """
    Fetch stock details for a specific Channel Partner.
    """
    if not channel_partner:
        frappe.throw(_("Channel Partner is required"))

    query = f"""
        SELECT 
            stock.channel_partner AS channel_partner,
            stock.item_name AS item_name,
            IFNULL(stock.total_quantity, 0) AS total_stock_quantity,
            IFNULL(sales.total_quantity, 0) AS total_sales_quantity,
            GREATEST(IFNULL(stock.total_quantity, 0) - IFNULL(sales.total_quantity, 0), 0) AS remaining_stock
        FROM
            (SELECT 
                parent.channel_partner AS channel_partner,
                child.item_name AS item_name,
                SUM(child.quantity) AS total_quantity
             FROM 
                `tabMy Stock` AS parent
             INNER JOIN 
                `tabStock Item` AS child
             ON 
                parent.name = child.parent
             GROUP BY 
                parent.channel_partner, child.item_name
            ) AS stock
        LEFT JOIN
            (SELECT 
                csr.channel_partner AS channel_partner,
                csri.item_name AS item_name,
                SUM(csri.quantity) AS total_quantity
             FROM 
                `tabCustomer Sales Receipt` AS csr
             INNER JOIN 
                `tabCustomer Sales Receipt Item` AS csri
             ON 
                csr.name = csri.parent
             GROUP BY 
                csr.channel_partner, csri.item_name
            ) AS sales
        ON 
            stock.channel_partner = sales.channel_partner AND stock.item_name = sales.item_name
        WHERE 
            stock.channel_partner = %(channel_partner)s
        ORDER BY 
            stock.channel_partner, stock.item_name
    """

    stock_details = frappe.db.sql(query, {"channel_partner": channel_partner}, as_dict=True)
    return stock_details
