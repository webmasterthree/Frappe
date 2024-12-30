import frappe
@frappe.whitelist()
def cp_stock(item_name=None):
    try:
        query = """
        SELECT 
            stock.item_name AS ITEM_NAME,
            stock.TOTAL_QUANTITY AS AVAILABLE_STOCK,
            COALESCE(sales.SOLD_OUT_QUANTITY, 0) AS SOLD_OUT_QUANTITY,
            (stock.TOTAL_QUANTITY - COALESCE(sales.SOLD_OUT_QUANTITY, 0)) AS REMAINING_STOCK,
            stock.PURCHASE_PRICE AS PURCHASE_PRICE,
            stock.PACT_TYPE AS PACK_TYPE,
            stock.UNIT_OF_MEASUREMENT AS UNIT_OF_MEASUREMENT
        FROM 
            (SELECT 
                item_name,
                SUM(quantity) AS TOTAL_QUANTITY,
                purchase_price,
                pack_size AS PACT_TYPE,
                uom AS UNIT_OF_MEASUREMENT,
                pack_type
             FROM 
                `tabStock Item`
             GROUP BY 
                item_name, purchase_price, pack_size, uom, pack_type) AS stock
        LEFT JOIN 
            (SELECT 
                item_name,
                SUM(quantity) AS SOLD_OUT_QUANTITY,
                price AS PRICE
             FROM   
                `tabCustomer Sales Receipt Item`
             GROUP BY 
                item_name, price) AS sales
        ON 
            stock.item_name = sales.item_name
        {where_clause}
        """
        where_clause = ""
        if item_name:
            where_clause = "WHERE stock.item_name = %(item_name)s"
        query = query.format(where_clause=where_clause)

        # Execute the SQL query
        result = frappe.db.sql(query, {"item_name": item_name}, as_dict=True)

        # If no data, return a message
        if not result:
            return {"message": "No data found."}
        
        return {"message": result}
    except Exception as e:
        frappe.log_error(f"Error in cp_stock: {str(e)}")
        return {"message": f"Error occurred: {str(e)}"}



# import frappe
# @frappe.whitelist()
# def cp_stock():
#     try:
#         query = """
#         SELECT 
#             stock.item_name AS ITEM_NAME,
#             stock.TOTAL_QUANTITY AS AVAILABLE_STOCK,
#             COALESCE(sales.SOLD_OUT_QUANTITY, 0) AS SOLD_OUT_QUANTITY,
#             (stock.TOTAL_QUANTITY - COALESCE(sales.SOLD_OUT_QUANTITY, 0)) AS REMAINING_STOCK,
#             stock.PURCHASE_PRICE AS PURCHASE_PRICE,
#             stock.PACT_TYPE AS PACK_TYPE,
#             stock.UNIT_OF_MEASUREMENT AS UNIT_OF_MEASUREMENT
#         FROM 
#             (SELECT 
#                 item_name,
#                 SUM(quantity) AS TOTAL_QUANTITY,
#                 purchase_price,
#                 pack_size AS PACT_TYPE,
#                 uom AS UNIT_OF_MEASUREMENT,
#                 pack_type
#              FROM 
#                 `tabStock Item`
#              GROUP BY 
#                 item_name, purchase_price, pack_size, uom, pack_type) AS stock
#         LEFT JOIN 
#             (SELECT 
#                 item_name,
#                 SUM(quantity) AS SOLD_OUT_QUANTITY,
#                 price AS PRICE
#              FROM   
#                 `tabCustomer Sales Receipt Item`
#              GROUP BY 
#                 item_name, price) AS sales
#         ON 
#             stock.item_name = sales.item_name;
#         """
#         # Execute the SQL query and fetch the results
#         result = frappe.db.sql(query, as_dict=True)
#         frappe.logger().info(f"Query Result: {result}")  # Add logging here

#         # If no data, return a message
#         if not result:
#             return {"message": "No data found."}
        
#         return {"message": result}
    
#     except Exception as e:
#         # Log any error and return an error message
#         frappe.log_error(f"Error in cp_stock: {str(e)}")
#         return {"message": f"Error occurred: {str(e)}"}
