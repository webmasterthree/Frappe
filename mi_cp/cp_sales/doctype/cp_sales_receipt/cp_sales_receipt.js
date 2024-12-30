// Copyright (c) 2024, Daiyan Alam and contributors
// For license information, please see license.txt

// frappe.ui.form.on("CP Sales Receipt", {
// 	refresh(frm) {

// 	},
// });



frappe.ui.form.on("CP Sales Receipt", {
	refresh(frm) {
        if(frappe.session.user != 'Administrator'){
        frm.set_value('channel_partner',frappe.session.user_fullname);
        }
	},
});










frappe.ui.form.on("CP Sales Receipt", {
    validate(frm) {
        let total = 0;
        if (frm.doc.items && frm.doc.items.length) {
            frm.doc.items.forEach(row => {
                let quantity = row.quantity || 0;
                let price = row.price || 0;
                row.amount = quantity * price; // Calculate row amount
                total += row.amount; // Accumulate the total amount
            });
        }

        // Round the total to the nearest integer
        total = Math.round(total);

        frm.set_value('total_amount', total); // Set total amount before saving

        // Convert total amount to words and set it in 'amount_chargeable_in_words'
        let totalInWords = convertNumberToWords(total);
        frm.set_value('amount_chargeable_in_words', totalInWords); // Set amount in words
    }
});

// Helper function to convert numbers to words
function convertNumberToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const thousands = [
        '', 'Thousand', 'Million', 'Billion', 'Trillion'
    ];

    // Handle case where the number is zero
    if (number === 0) return 'Zero';

    let words = '';

    let i = 0;
    // Separate integer part and decimal part
    let integerPart = Math.floor(number);
    let decimalPart = Math.round((number - integerPart) * 100); // Get two decimal places

    // Convert integer part to words
    while (integerPart > 0) {
        if (integerPart % 1000 !== 0) {
            words = convertThreeDigitNumberToWords(integerPart % 1000) + thousands[i] + ' ' + words;
        }
        integerPart = Math.floor(integerPart / 1000);
        i++;
    }

    // Convert decimal part to words
    if (decimalPart > 0) {
        words += 'and ' + convertDecimalToWords(decimalPart);
    }

    return words.trim();
}

// Helper function to convert three-digit numbers to words
function convertThreeDigitNumberToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
        '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    let words = '';

    if (number > 99) {
        words += ones[Math.floor(number / 100)] + ' Hundred ';
        number %= 100;
    }

    if (number > 19) {
        words += tens[Math.floor(number / 10)] + ' ';
        number %= 10;
    }

    if (number > 0) {
        words += ones[number] + ' ';
    }

    return words;
}

// Helper function to convert decimal part to words
function convertDecimalToWords(number) {
    const ones = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'
    ];

    let words = '';
    let tensPlace = Math.floor(number / 10);
    let onesPlace = number % 10;

    if (tensPlace > 0) {
        words += ones[tensPlace] + ' ';
    }

    if (onesPlace > 0) {
        words += ones[onesPlace] + ' ';
    }

    return words.trim();
}
