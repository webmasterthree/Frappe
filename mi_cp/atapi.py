import frappe

@frappe.whitelist()
def at_report():
    try:
        query = """
        SELECT 
            e.name AS EMPLOYEE_ID,
            e.employee_name AS EMPLOYEE_NAME,
            e.department AS DEPARTMENT,
            IFNULL(DATE(ec.time), CURDATE()) AS DATE,
            ec.device_id AS LOCATION,
            ec.shift AS SHIFT,
            TIME(ec.shift_start) AS SHIFT_START,
            TIME(ec.shift_end) AS SHIFT_END,
            MAX(CASE WHEN ec.log_type = 'IN' THEN TIME(ec.time) END) AS IN_TIME,  
            MAX(CASE WHEN ec.log_type = 'OUT' THEN TIME(ec.time) END) AS OUT_TIME,
            CASE
                WHEN MAX(CASE WHEN ec.log_type = 'IN' THEN TIME(ec.time) END) > TIME(ec.shift_start) THEN
                    TIMEDIFF(MAX(CASE WHEN ec.log_type = 'IN' THEN TIME(ec.time) END), TIME(ec.shift_start))
                ELSE '00:00:00'
            END AS LATE_BY,
            CASE
                WHEN MAX(CASE WHEN ec.log_type = 'OUT' THEN TIME(ec.time) END) < TIME(ec.shift_end) THEN
                    TIMEDIFF(TIME(ec.shift_end), MAX(CASE WHEN ec.log_type = 'OUT' THEN TIME(ec.time) END))
                ELSE '00:00:00'
            END AS EARLY_BY,
            CASE
                WHEN MAX(CASE WHEN ec.log_type = 'IN' THEN TIME(ec.time) END) IS NOT NULL
                     AND MAX(CASE WHEN ec.log_type = 'OUT' THEN TIME(ec.time) END) IS NOT NULL THEN
                    TIMEDIFF(
                        MAX(CASE WHEN ec.log_type = 'OUT' THEN TIME(ec.time) END),
                        MAX(CASE WHEN ec.log_type = 'IN' THEN TIME(ec.time) END)
                    )
                ELSE '00:00:00'
            END AS WORK_DURATION,
            CASE
                WHEN ec.time IS NULL THEN 'Absent'  
                ELSE 'Present'  
            END AS STATUS
        FROM 
            tabEmployee e
        LEFT JOIN 
            tabEmployee Checkin ec
            ON e.name = ec.employee
        GROUP BY 
            e.name, e.employee_name, e.department, DATE(ec.time), ec.shift, ec.shift_start, ec.shift_end
        ORDER BY 
            DATE ASC, EMPLOYEE_ID ASC;
        """
        
        # Execute the query using Frappe's db.sql method
        result = frappe.db.sql(query, as_dict=True)
        
        # If no data found, return a message
        if not result:
            return {"message": "No data found."}
        
        # Return the query result
        return {"data": result}
    except Exception as e:
        frappe.log_error(f"Error in get_employee_attendance_report: {str(e)}")
        return {"message": f"Error occurred: {str(e)}"}
