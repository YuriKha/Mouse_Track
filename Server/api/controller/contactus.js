
// --- כאן נממש את הפונקיות שיש ליצירת קשר  ----

// חיבור לקובץ יצירת קשר אשר נמצאה בתקיית מודל
const contactrequest=require('../models/contactrequest'); 

// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const user=require('../models/user'); // המשתנה 'משתמש באנגלית' שיצרתי פה ילווה אותנו בקובץ זה

// חיבור לקובץ שסופר את כמות רשומות יצירת קשר שיש
// בעזרתו אני נותן לכל רשומה איידי יחודי
const contactCounter=require('../models/contactCounter');
 
// קישור לספריה שיודעת לטפל בבסיס הנתונים שלי
const mongoose=require('mongoose');  

// חיבור לתקיית dot.env 
require('dotenv').config();

//-------------------------------------------------------------------------------------------------
// נייצא את הפונקציות הללו ונשתמש בהם בקובץ ראוטר
module.exports={
    // --- שולח בקשה חדשה ליצירת קשר --- http://localhost:3001/contactus/send
    SendContactUs:(req,res)=>{        
        const Fname = req.body.MessageData.firstName;
        const Lname = req.body.MessageData.lastName;
        const Email = req.body.MessageData.Email.toLowerCase();
        const Title = req.body.MessageData.title;
        const Details = req.body.MessageData.messageBody;
        var ClientID = 0;
        user.findOne({Email:Email}).then((emailfound)=>{
           ClientID = emailfound.ID;
        }).catch((error)=>{
            // במידה ונוצרה שגיאה בזמן החיפוש בבסיס הנתונים
            console.log("Unable to search in the database " + error); // נדפיס בצד שרת
        });
        //  אני אמור לתת לבקשת צור קשר איידי ייחודי
        // פה אני אמור להתחיל לבדוק מה הוא האיידי
        // בטבלה שעוקבת אחר האיידי 
        // על מנת לתת לבקשה צור קשר איידי מקורי וייחודי
        contactCounter.findOneAndUpdate({id:"contact_counter"},{"$inc":{"seq":1}},{new:true},(err,cb)=>{
            let seqId;
            if(cb === 0)
            {
                // במידה ויוצרים בפעם הראשונה - רשומה מספר אחת
                const newvalue = new contactCounter({id:"contact_counter",seq:1});
                newvalue.save();
                seqId = 1;
            }
            else
            {
                seqId=cb.seq  
                // מקבל את תוכן השדה סיסמא ובנוסף צורת הצפנה  משהוא אישי או משהוא מובנה 
                const contact=new contactrequest({  // משתמש חדש מהמשתנה שייצרתי
                    _id:new mongoose.Types.ObjectId(),
                    ID:seqId, 
                    ClientID:ClientID,
                    Fname:Fname, 
                    Lname:Lname,
                    Email:Email,
                    Details:Details,
                    Title:Title,
                    Status:true,
                    Important:false,
                    Received:new Date().toLocaleDateString('en-GB') // נוצר באופן אוטומטי מהתאריך הנוכחי 
                });
                // שומרים את בקשת צור קשר החדש שייצרנו  
                contact.save().then((contactUs)=>{  
                    //----------- כאן יהיה שליחת המייל לאדמין שיש בקשה חדשה ואישר למשתמש שיש לו פניה פתוחה -----
                    // נייבא את הפונקציה שיודעת לשלוח מייל ונשלח לו את המייל של המשתמש
                    require('../view/mails/ContactUserEmail').SendEmail(req.body.MessageData.Email,seqId,req.body.MessageData);    // שולח מייל למשתמש שקיבלנו את התלונה שלו  
                    require('../view/mails/ContactAdminEmail').SendEmail(process.env.PROJECT_EMAIL,seqId,req.body.MessageData);    // שולח מייל לעצמנו שקיבלנו תלונה חדשה
                    //-----------------------------------------------------------------------------------------------
                    // מדפיסים הודעה עם פרטי המשתמש
                    console.log("You just got a new 'contact us' request "  ,contactUs); // נדפיס בצד שרת
                    return res.status(201).json({Msg:"You just send 'contact us' " ,contactUs}); // נשלח הודעה לצד לקוח
                }).catch((error)=>{
                    // במידה ונוצרה שגיאה בזמן השמירה
                    console.log("could NOT save the new 'contact us' request "  ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"could NOT save the new 'contact us' request " ,error}); // נשלח הודעה לצד לקוח
                });      
            }
        });
    }

    // SendContactUs:async(req,res)=>{
    //     const data = req.body;
    //     for (let i = 0; i < data.length; i++)
    //     {
    //         // "firstName": "",
    //         // "lastName": "",
    //         // "email": "",
    //         // "Password": 123,
    //         // "Phonenumber": "3863134568",
    //         // "title": "",
    //         // "messageBody": ""
    //         var Fname = data[i].firstName;
    //         var Lname = data[i].lastName;
    //         var Email = data[i].email.toLowerCase();
    //         var Password = 123;
    //         var Phonenumber = data[i].Phonenumber;
    //         var title = data[i].title;
    //         var messageBody = data[i].messageBody;
    //     }
    // }

    // --- פונקציה ליצירת מידע מזוייף על מנת למלא את טבלת היצירות קשר ---
    // SendContactUs:async(req,res)=>{    
    //     const data = req.body;    
    //     for (let i = 0; i < data.length; i++){
    //         var Fname = data[i].firstName;
    //         var Lname = data[i].lastName;
    //         var Email = data[i].email.toLowerCase();
    //         var Title = data[i].title;
    //         var Details = data[i].messageBody;
    //         var ClientID = 0;

    //         var emailfound = await user.findOne({Email:Email});
    //         if(emailfound != null){
    //             ClientID = emailfound.ID;
    //         }
            
    //         //  אני אמור לתת לבקשת צור קשר איידי ייחודי
    //         // פה אני אמור להתחיל לבדוק מה הוא האיידי
    //         // בטבלה שעוקבת אחר האיידי 
    //         // על מנת לתת לבקשה צור קשר איידי מקורי וייחודי
    //         const cb = await contactCounter.findOneAndUpdate({id:"contact_counter"},{"$inc":{"seq":1}},{new:true});
    //         let seqId;
    //         if(cb === 0)
    //         {
    //             // במידה ויוצרים בפעם הראשונה - רשומה מספר אחת
    //             const newvalue = new contactCounter({id:"contact_counter",seq:1});
    //             await newvalue.save();
    //             seqId = 1;
    //         }
    //         else
    //         {
    //             seqId=cb.seq  
    //             // מקבל את תוכן השדה סיסמא ובנוסף צורת הצפנה  משהוא אישי או משהוא מובנה 
    //             const contact = new contactrequest({  // משתמש חדש מהמשתנה שייצרתי
    //                 _id:new mongoose.Types.ObjectId(),
    //                 ID:seqId, 
    //                 ClientID:ClientID,
    //                 Fname:Fname, 
    //                 Lname:Lname,
    //                 Email:Email,
    //                 Details:Details,
    //                 Title:Title,
    //                 Status:true,
    //                 Important:false,
    //                 Received:new Date().toLocaleDateString('en-GB') // נוצר באופן אוטומטי מהתאריך הנוכחי 
    //             });
    //             // שומרים את בקשת צור קשר החדש שייצרנו  
    //             await contact.save();   
    //             console.log("created successfully");  
    //         }
    //     } 
    //     return res.status(200).json({Msg:"all have save"});        
    // }
}

