# import frappe
# @frappe.whitelist()
# def get_sales_by_channel_partner(channel_partner):
#     if not channel_partner:
#         frappe.throw("Channel Partner is required.")

#     result = frappe.db.sql("""
#         SELECT
#             csr.channel_partner,
#             csri.item_name,
#             SUM(csri.quantity) AS total_quantity
#         FROM
#             `tabCustomer Sales Receipt` csr
#         JOIN
#             `tabCustomer Sales Receipt Item` csri
#         ON
#             csr.name = csri.parent
#         WHERE
#             csr.channel_partner = %(channel_partner)s
#         GROUP BY
#             csri.item_name
#     """, {"channel_partner": channel_partner}, as_dict=True)

#     return result


# import frappe
# @frappe.whitelist()
# def get_sales_by_channel_partner(channel_partner):
#     if not channel_partner:
#         frappe.throw("Channel Partner is required.")

#     result = frappe.db.sql("""
#         SELECT
#             parent.channel_partner,
#             child.item_name,
#             SUM(child.quantity) AS total_stock_quantity
#         FROM
#             `tabMy Stock` parent
#         JOIN
#             `tabStock Item` child
#         ON
#             parent.name = child.parent
#         WHERE
#             parent.channel_partner = %(channel_partner)s
#         GROUP BY
#             child.item_name
#     """, {"channel_partner": channel_partner}, as_dict=True)

#     return result
