# Copyright (c) 2024, Daiyan Alam and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document


class POS(Document):
	pass

def before_insert(doc, method):
    if doc.from_pos:
        doc.delivery_date = None
