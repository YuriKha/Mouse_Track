
// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const user=require('../models/user'); 

// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const receipt=require('../models/receipt'); 

// חיבור לקובץ שסופר את כמות רשומות יצירת קשר שיש
// בעזרתו אני נותן לכל רשומה איידי יחודי
const receiptCounter=require('../models/receiptCounter');

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken');

// קישור לספריה שיודעת לטפל בבסיס הנתונים שלי
const mongoose=require('mongoose');  

// חיבור לתקיית dot.env 
require('dotenv').config();

module.exports={
    //  שולח תשלום ומחזיר קבלה למייל ----  http://localhost:3001/receipt/pay
    // ככה צד שרת מקבל את המידע
    //   {
    //      "storedToken": "",
    //      "paid": number,
    //      "creditcardtype": "string",
    //      "creditcardnumber": "string",
    //      "experationdate": "string",
    //      "cvv": "string",
    //      "customerwebsite": "string"
    //   }
    Pay:async(req,res)=>{  
        const token = req.body.storedToken;                 // נחלץ את התוקן על מנת לחלץ מתוכו את המידע לגבי המשתמש הכוונה לפרטים האישיים שלו
        const paid = req.body.paid;                         // הסכום שהלקוח שילם
        const creditcardtype = req.body.creditcardtype;     // סוג כרטיס האשראי
        const creditcardnumber = req.body.creditcardnumber; // מספר כרטיס האשראי
        const experationdate = req.body.experationdate;     // תאריך תפוגה לאשראי
        const cvv = req.body.cvv;                           // הקוד מאחורי הכרטיס
        const customerwebsite = req.body.customerwebsite;   //  האתר אותו הלקוח מעוניין לנטר, נתון זה יעודכן בטבלת משתמשים

        try { 
            // נאמת את המשתמש שהוא אכן משתמש שלנו ונחלץ את המידע - את הפרטים האישיים שלו
            // נוציא את תוכן התוקן לתוך משתנה
            const decoded = await jwt.verify(token, process.env.KEY_FOR_USER_TOKEN);

            try {
                // נבדוק בטבלה שעוקבת אחר האיידי האחרון על מנת לתת איידי ייחודי לקבלה
                const cb = await receiptCounter.findOneAndUpdate({id:"receipt_counter"},{"$inc":{"seq":1}},{new:true});

                try {
                    // ----- תקופת המנוי, במהלך תקופה זאת האתר יהיה תחת ניטור ----
                    // ניצור תאריך תחילת מתן שירות
                    var start = new Date().toLocaleDateString('en-GB');
                    // ניצור תאריך סיום מתן שירות
                    var temp = new Date();
                    var end = new Date(temp.setDate(temp.getDate() + 30)).toLocaleDateString('en-GB');

                    const newreceipt = await new receipt({ 
                        _id:new mongoose.Types.ObjectId(),
                        ID:cb.seq,
                        ClientID:decoded.ID,
                        Paid:paid,
                        CreditCardType:creditcardtype,
                        CreditCardNumber:creditcardnumber,
                        ExperationDate:experationdate,
                        Cvv:cvv,
                        StartServis:start,
                        EndServis:end,
                        CustomerWebsite:customerwebsite
                    });
                    // נשמור את הקבלה החדשה שייצרנו
                    await newreceipt.save()

                    // ננסה לשלוח את הקבלה במייל
                    try {  
                        // נייבא את הפונקציה שיודעת לשלוח מייל
                        // require('../view/mails/PayUserEmail').SendEmail(decoded.Email,decoded,newreceipt); // נשלח קבלה במייל למשתמש על זה שהוא שילם בהצלחה
                        // require('../view/mails/PayAdminEmail').SendEmail(process.env.PROJECT_EMAIL,decoded,newreceipt); // נשלח מייל לאדמין להודיע לו שיש קבלה חדש
                    } catch (error) { // במידה והתרחשה שגיאה במהלך ניסיון שליחת המייל
                        // במידה ולא הצלחנו לשלוח מייל נדפיס רק לקונסול, לא נעצור את קבלת התשלום
                        console.log("could not send the receipt" ,error); // נדפיס רק בצד שרת
                    }

                    // נעדכן בטבלת המשתמשים שלנו את האתר שיש אחריו מעקב
                    try {
                        // נחפש את הלקוח בטבלת המשתמשים שלנו ונעדכן את האתר שיש לנטר
                        await user.updateOne({ID:decoded.ID},{$set:{CustomerWebsite:customerwebsite}});
                    } catch (error) {
                        // במידה ולא הצלחנו לעדכן בטבלת המשתמשים שלנו את האתר שיש לנטר לא נעצור את התשלום
                        // רק נדפיס שלא הצלחנו לשמור שדה זה, יש לבדוק למה זה קרה בהמשך
                        console.log("could not update the CustomerWebsite in the user table " ,error); // נדפיס בצד שרת
                    }
                    
                    // אם הגעתי לפה אז הכל עבר בהצלחה אני מחזיר קבלה לצד לקוח 
                    console.log("you got new receipt" ,newreceipt); // נדפיס בצד שרת
                    return res.status(201).json({Msg:"We got you payment " ,newreceipt}); // נשלח הודעה לצד לקוח
                } catch (error) { // במידה ולא הצלחנו לשמור את הקבלה 
                    console.log("could not save the receipt" ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"could not save the receipt" ,error}); // נשלח הודעה לצד לקוח
                }
            } catch (error) { // במידה ולא הצלחנו לייצר אידי יחודי לקבלה
                console.log("could not creat unique ID for the receipt " ,error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could creat unique ID for the receipt " ,error}); // נשלח הודעה לצד לקוח
            }
        } catch (error) { // במידה ולא הצלחנו להוציא מידע מהתוקן מסיבה כזו או אחרת
            console.log("could not verify " ,error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not verify " ,error}); // נשלח הודעה לצד לקוח
        }
    },

    //  מוסיף אתר נוסף שיש לבצע ניתור  ----  http://localhost:3001/receipt/addsitetotrack
    // ככה צד שרת מקבל את המידע
    //   {
    //      "storedToken": "",
    //      "customerwebsite": "string"
    //   }
    AddSiteToTrack:async(req,res)=>{
        // req.body.storedToken;       // נחלץ את התוקן על מנת לחלץ מתוכו את המידע לגבי המשתמש הכוונה לפרטים האישיים שלו
        // req.body.customerwebsite;   //  האתר אותו הלקוח מעוניין לנטר, נתון זה יעודכן בטבלת משתמשים
        try {
            // נבצע אימות לגבי זהות המשתמש בעזרת התוקן שקיבלנו
            const decoded = await jwt.verify(req.body.storedToken, process.env.KEY_FOR_USER_TOKEN);
            try {
                // נבדוק האם יש קבלה קיימת שנוכל לעדכן את האתר שיש לנתר
                const found = await receipt.find({ClientID:decoded.ID});
                if(found.length > 0){
                    // צריך לחפש האם כבר קיים אתר כזה לעקוב 
                    try {
                        // נעדכן בטבלת הקבלות שלנו את האתר הנוסף שיש לבצע ניתור
                        await receipt.updateOne({ClientID:decoded.ID},{$push:{CustomerWebsite:req.body.customerwebsite}});
                        // נעדכן בטבלת המשתמשים שלנו את האתר הנוסף שיש לבצע ניתור
                        await user.updateOne({ID:decoded.ID},{$push:{CustomerWebsite:req.body.customerwebsite}});
                        console.log("you add this website: " + req.body.customerwebsite + " to moniter for client ID: " +decoded.ID); // נדפיס בצד שרת
                        return res.status(200).json({Msg:"you add this website: " + req.body.customerwebsite + " to moniter for client ID: " +decoded.ID}); // נשלח הודעה לצד לקוח
                    } catch (error) { // במידה ולא הצלחנו לעדכן בטבלת הקבלות שלנו את האתר הנוסף שיש לבצע ניתור
                        console.log("could NOT update the website: " + req.body.customerwebsite + " to monitor for the clinet ID: " + decoded.ID ,error); // נדפיס בצד שרת
                        return res.status(500).json({Msg:"could NOT update the website: " + req.body.customerwebsite + " to monitor for the clinet ID: " + decoded.ID ,error}); // נשלח הודעה לצד לקוח
                    }
                }else{
                    // לא קיימת קבלה תחת המשתמש שמנסה להוסיף אתר נוסף לניתור
                    console.log(decoded.Fname + " " + decoded.Lname + " is not a paying customer"); // נדפיס בצד שרת
                    return res.status(409).json({Msg:decoded.Fname + " " + decoded.Lname + " is not a paying customer" }); // נשלח הודעה לצד לקוח
                }
            } catch (error) { // לא הצליח לחפש בבסיס נתונים אחר קבלה מסיבה מסויימת
                console.log("could not search in the receipt table" ,error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could not search in the receipt table" ,error}); // נשלח הודעה לצד לקוח
            }
        } catch (error) { // במידה ולא הצלחנו להוציא מידע מהתוקן מסיבה כזו או אחרת
            console.log("could not verify user " ,error); // נדפיס בצד שרת
            return res.status(401).json({Msg:"could not verify user " ,error}); // נשלח הודעה לצד לקוח
        }
    }   
}