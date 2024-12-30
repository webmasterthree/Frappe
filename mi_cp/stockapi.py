# # import frappe

# # @frappe.whitelist()
# # def cp_stock(channel_partner=None):
# #     try:
# #         # SQL Query to fetch data
# #         query = """
# #         SELECT 
# #             parent.channel_partner AS ChannelPartner,
# #             child.item_name AS ItemName,
# #             SUM(child.quantity) AS TotalQuantity
# #         FROM 
# #             `tabMy Stock` AS parent
# #         INNER JOIN 
# #             `tabStock Item` AS child
# #         ON 
# #             parent.name = child.parent
# #         WHERE 
# #             parent.channel_partner = %(channel_partner)s
# #         GROUP BY 
# #             parent.channel_partner, child.item_name
# #         ORDER BY 
# #             parent.channel_partner, child.item_name;
# #         """
        
# #         # Execute query with the channel_partner parameter if provided
# #         data = frappe.db.sql(query, {'channel_partner': channel_partner}, as_dict=True)

# #         # Return the data in the expected format
# #         if data:
# #             return {
# #                 "message": data
# #             }
# #         else:
# #             return {
# #                 "message": "No data found"
# #             }
    
# #     except Exception as e:
# #         frappe.log_error(f"Error in cp_stock: {str(e)}")
# #         return {
# #             "message": f"Error occurred: {str(e)}"
# #         }


# # import frappe
# # @frappe.whitelist()
# # def cp_stock(channel_partner=None):
# #     try:
# #         # Log the input channel_partner for debugging
# #         frappe.log_error(title="cp_stock Debug", message=f"Received channel_partner: {channel_partner}")
        
# #         query = """
# #         SELECT 
# #             parent.channel_partner AS ChannelPartner,
# #             child.item_name AS ItemName,
# #             SUM(child.quantity) AS TotalQuantity
# #         FROM 
# #             `tabMy Stock` AS parent
# #         INNER JOIN 
# #             `tabStock Item` AS child
# #         ON 
# #             parent.name = child.parent
# #         WHERE 
# #             parent.channel_partner = %(channel_partner)s
# #         GROUP BY 
# #             parent.channel_partner, child.item_name
# #         ORDER BY 
# #             parent.channel_partner, child.item_name;
# #         """
# #         # Execute query
# #         data = frappe.db.sql(query, {'channel_partner': channel_partner}, as_dict=True)

# #         # Log the query result safely in the message field
# #         frappe.log_error(title="cp_stock Query Result Debug", message=f"Query Result: {data}")

# #         # Return the query result in the expected format
# #         return {"message": data or []}

# #     except Exception as e:
# #         # Log the error message in the message field to avoid truncation
# #         frappe.log_error(title="Error in cp_stock", message=f"Error: {str(e)}")
# #         return {"message": []}



# # import frappe
# # @frappe.whitelist()
# # def cp_stock(channel_partner):
# #     """
# #     Fetch stock details for a specific Channel Partner.
# #     """
# #     if not channel_partner:
# #         frappe.throw(_("Channel Partner is required"))

# #     query = f"""
# #         SELECT 
# #             stock.channel_partner AS channel_partner,
# #             stock.item_name AS item_name,
# #             IFNULL(stock.total_quantity, 0) AS total_stock_quantity,
# #             IFNULL(sales.total_quantity, 0) AS total_sales_quantity,
# #             (IFNULL(stock.total_quantity, 0) - IFNULL(sales.total_quantity, 0)) AS remaining_stock
# #         FROM
# #             (SELECT 
# #                 parent.channel_partner AS channel_partner,
# #                 child.item_name AS item_name,
# #                 SUM(child.quantity) AS total_quantity
# #              FROM 
# #                 `tabMy Stock` AS parent
# #              INNER JOIN 
# #                 `tabStock Item` AS child
# #              ON 
# #                 parent.name = child.parent
# #              GROUP BY 
# #                 parent.channel_partner, child.item_name
# #             ) AS stock
# #         LEFT JOIN
# #             (SELECT 
# #                 csr.channel_partner AS channel_partner,
# #                 csri.item_name AS item_name,
# #                 SUM(csri.quantity) AS total_quantity
# #              FROM 
# #                 `tabCustomer Sales Receipt` AS csr
# #              INNER JOIN 
# #                 `tabCustomer Sales Receipt Item` AS csri
# #              ON 
# #                 csr.name = csri.parent
# #              GROUP BY 
# #                 csr.channel_partner, csri.item_name
# #             ) AS sales
# #         ON 
# #             stock.channel_partner = sales.channel_partner AND stock.item_name = sales.item_name
# #         WHERE 
# #             stock.channel_partner = %(channel_partner)s
# #         ORDER BY 
# #             stock.channel_partner, stock.item_name
# #     """

# #     stock_details = frappe.db.sql(query, {"channel_partner": channel_partner}, as_dict=True)
# #     return stock_details


# import frappe
# @frappe.whitelist()
# def cp_stock(channel_partner):
#     """
#     Fetch stock details for a specific Channel Partner.
#     Ensures that Remaining Stock values are not negative.
#     """
#     if not channel_partner:
#         frappe.throw(_("Channel Partner is required"))

#     query = f"""
#         SELECT 
#             stock.channel_partner AS channel_partner,
#             stock.item_name AS item_name,
#             IFNULL(stock.total_quantity, 0) AS total_stock_quantity,
#             IFNULL(sales.total_quantity, 0) AS total_sales_quantity,
#             GREATEST(IFNULL(stock.total_quantity, 0) - IFNULL(sales.total_quantity, 0), 0) AS remaining_stock
#         FROM
#             (SELECT 
#                 parent.channel_partner AS channel_partner,
#                 child.item_name AS item_name,
#                 SUM(child.quantity) AS total_quantity
#              FROM 
#                 `tabMy Stock` AS parent
#              INNER JOIN 
#                 `tabStock Item` AS child
#              ON 
#                 parent.name = child.parent
#              GROUP BY 
#                 parent.channel_partner, child.item_name
#             ) AS stock
#         LEFT JOIN
#             (SELECT 
#                 csr.channel_partner AS channel_partner,
#                 csri.item_name AS item_name,
#                 SUM(csri.quantity) AS total_quantity
#              FROM 
#                 `tabCustomer Sales Receipt` AS csr
#              INNER JOIN 
#                 `tabCustomer Sales Receipt Item` AS csri
#              ON 
#                 csr.name = csri.parent
#              GROUP BY 
#                 csr.channel_partner, csri.item_name
#             ) AS sales
#         ON 
#             stock.channel_partner = sales.channel_partner AND stock.item_name = sales.item_name
#         WHERE 
#             stock.channel_partner = %(channel_partner)s
#         ORDER BY 
#             stock.channel_partner, stock.item_name
#     """

#     stock_details = frappe.db.sql(query, {"channel_partner": channel_partner}, as_dict=True)
#     return stock_details
