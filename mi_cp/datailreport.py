import frappe
from calendar import monthrange

@frappe.whitelist()
def get_detail_work_duration_report(month, year, employee):
    """
    API to fetch the Detail Work Duration Report for a specific employee, month, and year.
    """
    # Validate inputs
    if not month or not year or not employee:
        frappe.throw("Please select Month, Year, and Employee to generate the report")

    # Calculate start_date and end_date based on month and year
    start_date = f"{year}-{month}-01"
    days_in_month = monthrange(int(year), int(month))[1]
    end_date = f"{year}-{month}-{days_in_month}"

    # Define columns
    columns = [
        {"fieldname": "date", "label": "Date", "fieldtype": "Date", "width": 100},
        {"fieldname": "status", "label": "Status", "fieldtype": "Data", "width": 100},
        {"fieldname": "check_in", "label": "Check-in Time", "fieldtype": "Time", "width": 100},
        {"fieldname": "check_out", "label": "Check-out Time", "fieldtype": "Time", "width": 100},
        {"fieldname": "shift", "label": "Shift", "fieldtype": "Data", "width": 120},
        {"fieldname": "shift_start", "label": "Shift Start", "fieldtype": "Time", "width": 120},
        {"fieldname": "shift_end", "label": "Shift End", "fieldtype": "Time", "width": 120},
        {"fieldname": "employee", "label": "Emp Id", "fieldtype": "Link", "options": "Employee", "width": 100},
        {"fieldname": "employee_name", "label": "Name", "fieldtype": "Data", "width": 150},
        {"fieldname": "department", "label": "Department", "fieldtype": "Link", "options": "Department", "width": 150},
    ]

    # Fetch employee details
    employee_data = frappe.db.sql("""
        SELECT name, employee_name, department
        FROM `tabEmployee`
        WHERE name = %s
    """, (employee,), as_dict=True)

    if not employee_data:
        frappe.throw("Employee not found!")

    employee_info = employee_data[0]

    # Fetch shift details for the employee
    shift_data = frappe.db.sql("""
        SELECT DISTINCT 
            shift, 
            TIME(shift_start) AS shift_start, 
            TIME(shift_end) AS shift_end
        FROM `tabEmployee Checkin`
        WHERE employee = %s
        LIMIT 1
    """, (employee,), as_dict=True)

    shift_info = shift_data[0] if shift_data else {"shift": None, "shift_start": None, "shift_end": None}

    # Initialize data rows
    data = []

    # Generate rows for each day in the selected month
    num_days = frappe.utils.date_diff(end_date, start_date) + 1
    for i in range(num_days):
        date = frappe.utils.add_days(start_date, i)

        # Fetch daily attendance data
        daily_data = frappe.db.sql("""
            SELECT 
                MAX(CASE WHEN log_type = 'IN' THEN TIME(time) END) AS check_in,
                MAX(CASE WHEN log_type = 'OUT' THEN TIME(time) END) AS check_out,
                CASE
                    WHEN MAX(CASE WHEN log_type = 'IN' THEN TIME(time) END) IS NOT NULL THEN 'P'
                    ELSE 'A'
                END AS status
            FROM `tabEmployee Checkin`
            WHERE employee = %s AND DATE(time) = %s
        """, (employee, date), as_dict=True)

        # Populate row data
        if daily_data:
            data.append({
                "date": date,
                "status": daily_data[0]["status"],
                "check_in": daily_data[0]["check_in"],  # Leave blank if None
                "check_out": daily_data[0]["check_out"],  # Leave blank if None
                "shift": shift_info["shift"],
                "shift_start": shift_info["shift_start"],
                "shift_end": shift_info["shift_end"],
                "employee": employee_info["name"],
                "employee_name": employee_info["employee_name"],
                "department": employee_info["department"],
            })
        else:
            data.append({
                "date": date,
                "status": "A",
                "check_in": None,  # Blank space for check-in
                "check_out": None,  # Blank space for check-out
                "shift": shift_info["shift"],
                "shift_start": shift_info["shift_start"],
                "shift_end": shift_info["shift_end"],
                "employee": employee_info["name"],
                "employee_name": employee_info["employee_name"],
                "department": employee_info["department"],
            })

    # Return columns and data as JSON response
    return {
        "columns": columns,
        "data": data
    }
