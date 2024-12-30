import frappe
@frappe.whitelist()
def earned_points(sales_executive=None):
    # Prepare the condition based on the sales_executive filter
    conditions = ""
    if sales_executive:
        conditions = f"WHERE sr.sales_executive = '{sales_executive}'"
    
    # SQL query to fetch data
    query = f"""
        SELECT 
            sr.sales_executive AS Sales_Executive, 
            sri.item_name AS ItemName,
            SUM(sri.quantity) AS TotalQuantity,
            ROUND(SUM(sri.amount), 2) AS total_amount, 
            ROUND(SUM(sri.amount * lp.reward_points_per_qty)/100, 2) AS Total_Reward_Points
        FROM 
            `tabCustomer Sales Receipt` AS sr
        INNER JOIN 
            `tabCustomer Sales Receipt Item` AS sri ON sr.name = sri.parent
        LEFT JOIN 
            `tabLoyality Point` AS lp ON sri.item_name = lp.item_name
        {conditions}
        GROUP BY 
            sr.sales_executive, sri.item_name
        ORDER BY 
            sr.sales_executive, sri.item_name
    """
    
    # Execute the query and return the result
    result = frappe.db.sql(query, as_dict=True)
    return {"message": result if result else []}
