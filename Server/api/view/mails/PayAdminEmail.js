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
            from: process.env.PROJECT_EMAIL,                         // ממי ישלח המייל , מאוחסן בקובץ נסתר
            to: to,                                                  // למי ישלח המייל , מקבל נתון זה בחתימת הפונקציה כשזומן
            subject: 'New payment received, receipt ID: ' + body.ID, // הנושא של המייל , כותרת
            // נצרף תוכן למייל בפורמט HTML
            html: `
            <p>From ${subject.Fname} ${subject.Lname} we received payment</p>
            <h5>Personal details:</h5>
            <p>First name: ${subject.Fname}<br>
               Last name: ${subject.Lname}<br>
               Email: ${subject.Email}<br>
               Phone number: ${subject.Phone}</p>

            <h5>Payment details:</h5>
            <p>Receipt ID: ${body.ID}<br>
               Card type: ${body.CreditCardType}<br>
               Card number: ${body.CreditCardNumber}<br>
               Experation date: ${body.ExperationDate}</p>

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
                console.log('Email sent to Admin successfully');
            }
        });
    }
}

