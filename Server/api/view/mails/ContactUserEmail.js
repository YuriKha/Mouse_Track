// ספריה שיודעת לשלוח מייל
const nodemailer = require('nodemailer');

// חיבור לתקיית dot.env 
require('dotenv').config();

module.exports={
    SendEmail:(to,subject,body)=>{
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.PROJECT_EMAIL,  
                pass: process.env.PROJECT_PASS.toString()  
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        let mailDetails = {
            from: process.env.PROJECT_EMAIL,                                      // ממי ישלח המייל , מאוחסן בקובץ נסתר
            to: to,                                                               // למי ישלח המייל , מקבל נתון זה בחתימת הפונקציה כשזומן     
            subject:'Contact ID: '+subject +' Message Title: ' +body.title + '',  // כותרת המייל 
            // נצרף תוכן למייל בפורמט HTML
            html: `
            <p>Dear valued customer,</p>
            <p>We have received your message with the following details:</p>
            <p>Contact ID: ${subject}<br>
            Message Title: ${body.title}</p>
            <p>Message:</P>
            <p>${body.messageBody}</p>
            <p>We will review your message and respond as soon as possible. If you require immediate assistance, please contact our customer service line at 555-555-5555.</p>
            <p>Thank you for choosing our company.</p>
            <p>Best regards,</p>
            <p>HotZone</p>
            <img src="cid:unique" alt="HotZone_Logo" style="width:auto;">
            `,
            // נצרף תמונת לוגו ביחד עם ה HTML
            attachments: [{
                filename: 'Hotzonelogo.jpg', // שם התמונה
                path: 'api/view/logo/Hotzonelogo.jpg', // מיקום התמונה
                cid: "unique" // שם ייחודי לתמונה אותו אני מעביר בקוד HTML SRC
            }],
        };
               
        mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                console.log('Error Occurs  could NOT send the Email' + err);
            } else {
                console.log('Email sent to user successfully');
            }
        });
    }
}

