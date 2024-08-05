
// --- כאן נממש את הפונקציות שיש ליצירת קשר  ----

// חיבור לקובץ יצירת קשר אשר נמצאה בתקיית מודל
const contactrequest=require('../models/contactrequest'); 
 
// חיבור לתקיית dot.env 
require('dotenv').config();

//-------------------------------------------------------------------------------------------------
// נייצא את הפונקציות הללו ונשתמש בהם בקובץ ראוטר
module.exports={
    // --- מחזיר את כל הבקשות  ליצירת קשר שיש במסד הנתונים --- http://localhost:3001/contactadmin/getall
    GetAll:async(req,res)=>{
        try {
            const allContactUs = await contactrequest.find();
            //console.log("this is all the contactus request in database: "  + allContactUs); // נדפיס בצד שרת
            return res.status(200).json({Msg:"this is all the contactus request in database: " ,allContactUs}); // נשלח הודעה לצד לקוח
        } catch (error) {
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }
    },
    // --- מחזיר את כל הבקשות הפתוחות ליצירת קשר שיש במסד הנתונים --- http://localhost:3001/contactadmin/getallopen
    GetAllOpen:(req,res)=>{
        contactrequest.find({Status:true}).then((allcontact)=>{ // מחפש את כל הבקשות הפתוחות
            if(allcontact.length>0) // אם הוא מצאה לפחות בקשה אחת 
            {
                // מחזיר את כל מה שהוא מצא
                console.log("this is all the OPEN contact request: "  + allcontact); // נדפיס בצד שרת
                return res.status(200).json({Msg:"this is all the OPEN contact request: " ,allcontact}); // נשלח הודעה לצד לקוח
            }
            else
            {
                // אחרת אין בקשות ליצירת קשר במסד נתונים
                console.log("you don't have OPEN contact request stored in the database"); // נדפיס בצד שרת
                return res.status(200).json({Msg:"you don't have OPEN contact request stored in the database"}); // נשלח הודעה לצד לקוח
            }
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }); 
    },
    // --- מחזיר את כל הבקשות הסגורות ליצירת קשר שיש במסד הנתונים --- http://localhost:3001/contactadmin/getallclose
    GetAllClose:(req,res)=>{
        contactrequest.find({Status:false}).then((allcontact)=>{ // מחפש את כל הבקשות הסגורות
            if(allcontact.length>0) // אם הוא מצאה לפחות בקשה אחת 
            {
                // מחזיר את כל מה שהוא מצא
                console.log("this is all the CLOSE contact request: "  + allcontact); // נדפיס בצד שרת
                return res.status(200).json({Msg:"this is all the CLOSE contact request: " ,allcontact}); // נשלח הודעה לצד לקוח
            }
            else
            {
                // אחרת אין בקשות ליצירת קשר במסד נתונים
                console.log("you don't have CLOSE contact request stored in the database"); // נדפיס בצד שרת
                return res.status(200).json({Msg:"you don't have CLOSE contact request stored in the database"}); // נשלח הודעה לצד לקוח
            }
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש בקשות סגורות ליצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }); 
    },
    // --- מחזיר בקשה ליצירת קשר ספציפית --- http://localhost:3001/contactadmin/{id}
    GetContactUsById:(req,res)=>{
        contactrequest.find({ID:req.params.pid}).then((contactfound)=>{ // מחפש את ההבקשה ליצירת קשר לפי האיידי שהתקבל
            if(contactfound.length>0)  // אם הוא מצאה לפחות בקשה אחת
            {
                // מחזיר את הבקשה ליצירת קשר שאתה מחפש
                console.log("the contact request with the ID: " + req.params.pid + " is: "  + contactfound); // נדפיס בצד שרת
                return res.status(200).json({Msg:"the contact request that you looking for " ,contactfound}); // נשלח הודעה לצד לקוח
            } 
            else
            {
                // במידה ולא מצאה בקשה ליצירת קשר במסד נתונים
                console.log("no contact request with the ID " + req.params.pid); // נדפיס בצד שרת
                return res.status(200).json({Msg:"no contact request with the ID " + req.params.pid}); // נשלח הודעה לצד לקוח
            }           
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }); 
    },
    // --- סוגר בקשת יצירת קשר --- http://localhost:3001/contactadmin/{id}
    CloseContactUs:(req,res)=>{
        contactrequest.find({ID:req.params.pid}).then((contactfound)=>{ // בודק אם קיימת לי בקשה ליצירת קשר עם האיידי שצריך לסגור
            if(contactfound.length>0) // במידה וקיים
            {
                // הופך את הבקשה ליצירת קשר שהוא מצא לסגורה 
                contactrequest.updateOne({ID:req.params.pid},{$set:{Status:false}}).then(()=>{
                    // שולח הודעה שהבקשה נסגרה
                    console.log("contact request with the ID " + req.params.pid + " was close"); // נדפיס בצד שרת
                    return res.status(200).json({Msg:"contact request with the ID " + req.params.pid + " was close"}); // נשלח הודעה לצד לקוח                
                }).catch((error)=>{
                    // במידה והתרחשה טעות בזמן ניסיון הסגירה של בקשת יצירת הקשר
                    console.log("could not close the request in the database: "  + error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"could not close in the database: " ,error}); // נשלח הודעה לצד לקוח
                });
            }
            else
            {
                // מודיע שלא קיים משתמש אם האיידי הזה
                console.log("no contact request found with the ID " + req.params.pid); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no contact request found with the ID " + req.params.pid}); // נשלח הודעה לצד לקוח
            }            
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש בקשת יצירת הקשר על מנת לסגור אותה
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        });
    },
    // --- הופך בקשות מחשוב ללא חשוב וההפך --- http://localhost:3001/contactadmin/toggleimportant/:id
    ToggleImportant:async(req,res)=>{
        // בכתובת ישלח האיידי הייחודי של הבקשה ליצירת קשר ובגוף הבקשה התוקן של המנהל
        // {
        //     "storedToken": ""
        // }
        try {
            // נבדוק האם קיים אצלנו בקשה עם האיידי המבוקש
            const contactFound = await contactrequest.find({ID:req.params.id});
            if(contactFound.length > 0){
                try {
                    // הפונקציה תהפוך כל ערך אמת לשקר וההפך
                    await contactrequest.updateOne({ID:req.params.id},{$set:{Important:!contactFound[0].Important}}); // פה נבצע את העידכון
                    console.log("you just update the important from: "  + contactFound[0].Important + " to :" + !contactFound[0].Important +" to user ID: " +req.params.id); // נדפיס בצד שרת
                    return res.status(200).json({Msg:"you just update the important from: "  + contactFound[0].Important + " to:" + !contactFound[0].Important +" to user ID: " +req.params.id}); // נשלח הודעה לצד לקוח  
                } catch (error) {
                    // במידה ולא הצלחנו לעדכן את השדה
                    console.log("Could NOT update the Important field some thing wrong with database", error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"Could NOT update the Important field some thing wrong with database", error}); // נשלח הודעה לצד לקוח
                }
            }
            else{
                // במידה ולא נמצאה משתמש עם האיידי 
                console.log("no Contac with the ID: "  + req.params.id + " in the database"); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no Contac with the ID: "  + req.params.id + " in the database"}); // נשלח הודעה לצד לקוח
            }
        } catch (error) {
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }
    },
    // --- עידכון התקשרות עם לקוח --- http://localhost:3001/contactadmin/updatecustomerflow/:id
    UpdateCustomerFlow:async(req,res)=>{
        // בכתובת ישלח האיידי הייחודי של הבקשה ליצירת קשר ובגוף הבקשה התוקן של המנהל וההסבר במילים כסטרינג
        // {
        //     "storedToken": "",
        //     "string":""
        // }
        try {
            // נבדוק האם קיים אצלנו בקשה עם האיידי המבוקש
            const contactFound = await contactrequest.find({ID:req.params.id});
            if(contactFound.length > 0){
                try {
                    let date = new Date(); // ניצור תאריך של רגע זה
                    const newCustemerFlow = { // ניצור אובייקט עם כל השינויים 
                        Date: date.toLocaleDateString('en-GB'), // התאריך בו בוצע העידכון
                        Time: date.getHours() + ':' + date.getMinutes(), // השעה בו בוצע העידכון
                        Message: req.body.string,  // תוכן ההודעה
                      };
                    // פה נתחיל לבצע את עידכון השדה
                    await contactrequest.updateOne({ID:req.params.id},{ $push: { CustemerFlow: newCustemerFlow }});
                    // פה נבצע את העידכון של פרטי ההתקשרות
                    console.log("you just update the Custemer Flow to contact us ID: "+req.params.id, newCustemerFlow); // נדפיס בצד שרת
                    return res.status(200).json({Msg:"you just update the Custemer Flow to contact us ID: "+req.params.id, newCustemerFlow}); // נשלח הודעה לצד לקוח  
                } catch (error) {
                    // במידה ולא הצלחנו לעדכן את השדה
                    console.log("Could NOT update the Customer Flow some thing wrong with database", error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"Could NOT update the Customer Flow some thing wrong with database", error}); // נשלח הודעה לצד לקוח
                }
            }
            else{
                // במידה ולא נמצאה משתמש עם האיידי 
                console.log("no Contac with the ID: "  + req.params.id + " in the database"); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no Contac with the ID: "  + req.params.id + " in the database"}); // נשלח הודעה לצד לקוח
            }
        } catch (error) {
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        }
    },
    // --- מחזיר את ההתקשרות של לקוח ספציפי לפי בקשת קשר איידי --- http://localhost:3001/contactadmin/customerflowbyid/:id
    CustomerFlowById:async(req,res)=>{
        // בכתובת ישלח האיידי הייחודי של הבקשה ליצירת קשר ובגוף הבקשה התוקן של המנהל
        // {
        //     "storedToken": ""
        // }
        try {
            // נבדוק האם קיים אצלנו בקשה עם האיידי המבוקש
            const contactFound = await contactrequest.findOne({ID:req.params.id});
            const CustemerFlow = contactFound.CustemerFlow;
            console.log("the Custemer Flow of contact us ID: "+req.params.id, CustemerFlow); // נדפיס בצד שרת
            return res.status(200).json({Msg:"the Custemer Flow of contact us ID: "+req.params.id, CustemerFlow}); // נשלח הודעה לצד לקוח 
        } catch (error) {
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח            
        }
    },
    // ---  מחזיר את ההתקשרות של לקוח ספציפי לפי לקוח איידי  --- http://localhost:3001/contactadmin/customerflowbycid/:cid
    CustomerFlowByCid:async(req,res)=>{
        // בכתובת ישלח האיידי הייחודי של הבקשה ליצירת קשר ובגוף הבקשה התוקן של המנהל
        // {
        //     "storedToken": ""
        // }
        try {
            // נבדוק האם קיים אצלנו בקשה עם האיידי המבוקש
            const contactFound = await contactrequest.findOne({ClientID:req.params.cid});
            console.log(contactFound);
            const CustemerFlow = contactFound.CustemerFlow;
            console.log("the Custemer Flow of contact us ID: "+req.params.cid, CustemerFlow); // נדפיס בצד שרת
            return res.status(200).json({Msg:"the Custemer Flow of contact us ID: "+req.params.cid, CustemerFlow}); // נשלח הודעה לצד לקוח 
        } catch (error) {
            // במידה והתרחשה טעות בזמן חיפוש כל בקשות יצירות הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח            
        }
    },
    // --- מעדכן בקשה ליצירת קשר --- http://localhost:3001/contactadmin/{id}
    UpdateContactUs:(req,res)=>{
        //נפרק את תוכן הגוף לחתיכות
        const Fname = req.body.firstName;
        const Lname = req.body.lastName;
        const Email = req.body.email;
        //const Progress = req.body.progress;
        // const Details = req.body.details;
        // קודם נחפש האם קיימת לי בקשה ליצירת קשר עם האיידי הזה
        contactrequest.find({ID:req.params.pid}).then((contactfound)=>{ 
            if(contactfound.length>0) // אם נמצאה אחד
            {     
                // נעדכן רק את החלקים הרלוונטים שצריך לעדכן 
                if(Fname!=="") // במידה וצריך לעדכן שדה Fname
                {
                    // פה נתחיל לבצע את עידכון השדה
                    contactrequest.updateOne({ID:req.params.pid},{$set:{Fname:Fname}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update first name : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update first name : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }       
                if(Lname!=="") // במידה וצריך לעדכן שדה Lname
                {
                    // פה נתחיל לבצע את עידכון השדה
                    contactrequest.updateOne({ID:req.params.pid},{$set:{Lname:Lname}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update last name : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update last name : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }       
                if(Email!=="") // במידה וצריך לעדכן שדה Email
                {
                    // פה נתחיל לבצע את עידכון השדה
                    contactrequest.updateOne({ID:req.params.pid},{$set:{Email:Email}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update email : " + error) // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update email : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }             
                // if(Progress!=="") // במידה וצריך לעדכן שדה Progress
                // {
                //     var date = new Date();
                //     // פה נתחיל לבצע את עידכון השדה
                //     contactrequest.updateOne({ID:req.params.pid},{$push:{Progress:date.toLocaleDateString('en-GB') + " " + date.getHours() +":"+ date.getMinutes()+ " " + Progress}}).catch((error)=>{
                //             // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                //             console.log("could NOT update Progress : " + error); // נדפיס בצד שרת
                //             return res.status(500).json({Msg:"could NOT update Progress : " ,error}); // נשלח הודעה לצד לקוח 
                //         }); 
                // }
                // במידה והגענו לפה אומר שלא יצאנו מקודם ולא התרחשה שום טעות הנתונים נשמרו בהצלחה
                console.log("you update contact request with the ID: " + req.params.pid); // נדפיס בצד שרת
                return res.status(200).json({Msg:"you update contact request with the ID: " + req.params.pid}); // נשלח הודעה לצד לקוח
            }
            else 
            {
                // לא נמצאה משתמש כזה
                console.log("no contact request with the ID " + req.params.pid + " in the database"); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no contact request with the ID " + req.params.pid + " in the database"}); // נשלח הודעה לצד לקוח
            }
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש בקשת יצירת הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        });
    }
}

