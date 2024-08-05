// --- כאן נממש את הפונקיות שיש למנהל  ----

// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const user=require('../models/user'); // המשתנה 'משתמש באנגלית' שיצרתי פה ילווה אותנו בקובץ זה

// חיבור לתקיית dot.env 
require('dotenv').config();

// קישור לספרייה שיודעת להצפין
const bcrypt=require('bcryptjs'); 

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken');

//-------------------------------------------------------------------------------------------------

// נייצא את הפונקציות הללו ונשתמש בהם בקובץ ראוטר
module.exports={
    //------- מביא את כל המשתמשים הרשומים --- http://localhost:3001/adminmanagement/getalluser
    GetAllUser:(req,res)=>{
        user.find().then((alluser)=>{ // כל האוסף של המשתמשים
            // אני מחזיר את כל המשתמשים
            console.log("this is all the users: "  ,alluser); // נדפיס בצד שרת
            return res.status(200).json({Msg:"this is all the users: " ,alluser}); // נשלח הודעה לצד לקוח
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש המשתמש
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח  
        });  
    }, 
    //--- מביא את המשתמש עם האיידי המבוקש --- http://localhost:3001/adminmanagement/{id}
    GetUserById:async(req,res)=>{
        try {
            const userfound = await user.findOne({ID:req.params.pid});
            const decoded = { 
                ID:userfound.ID,
                Fname:userfound.Fname,
                Lname:userfound.Lname,
                Email:userfound.Email,
                Phone:userfound.Phone,
                Joined:userfound.joined
            }
            // מחזיר את המשתמש שאתה מחפש
            console.log("the user with the ID: " + req.params.pid + " you looking for is: "  ,decoded); // נדפיס בצד שרת
            return res.status(200).json({Msg:"the user that you looking for " ,decoded}); // נשלח הודעה לצד לקוח
        } catch (error) {
            // במידה והתרחשה טעות בזמן חיפוש המשתמש
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח  
        }

        // .then((userfound)=>{ // מחפש בבסיס נתונים שלי לפי האיידי שהתקבל
        //     if(userfound.length>0)
        //     {
        //          // מחזיר את המשתמש שאתה מחפש
        //          console.log("the user with the ID: " + req.params.pid + " you looking for is: "  ,userfound); // נדפיס בצד שרת
        //          return res.status(200).json({Msg:"the user that you looking for " ,userfound}); // נשלח הודעה לצד לקוח
        //     } 
        //     else
        //     {
        //          // במידה ולא מוצא משתמש עם האיידי שביקשתה 
        //          console.log("no user with the ID " + req.params.pid); // נדפיס בצד שרת
        //          return res.status(404).json({Msg:"no user with the ID " + req.params.pid}); // נשלח הודעה לצד לקוח
        //     }          
        //  }).catch((error)=>{
        //     // במידה והתרחשה טעות בזמן חיפוש המשתמש
        //     console.log("could not search in database: "  + error); // נדפיס בצד שרת
        //     return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח           
        //  });  
    },
    //------ מחיקת משתמש מבסיס הנתונים----- http://localhost:3001/adminmanagement/{id}
    DeleteUser:(req,res)=>{
        user.find({ID:req.params.pid}).then((userfound)=>{ // בודק אם בכלל קיים כזה משתמש 
            if(userfound.length>0) // במידה וקיים
            {
                // מוחק את המתמש
                user.deleteOne({ID:req.params.pid}).then(()=>{
                    // מוחק ושולח הודעה שהמשתמש עם האיידי הזה נמחק
                    console.log("user with the ID " + req.params.pid + " was deleted"); // נדפיס בצד שרת
                    return res.status(200).json({Msg:"user with the ID " + req.params.pid + " was deleted"}); // נשלח הודעה לצד לקוח                
                });
            }
            else
            {
                // מודיע שלא קיים משתמש אם האיידי הזה
                console.log("no user found with the ID " + req.params.pid); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no user found with the ID " + req.params.pid}); // נשלח הודעה לצד לקוח
            }            
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש המשתמש
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        });
    },
    //--- עידכון פרטי משתמש בבסיס נתונים --- http://localhost:3001/adminmanagement/{id}
    UpdateUser:(req,res)=>{
        //נפרק את תוכן הגוף לחתיכות
        const Fname = req.body.firstName;
        const Lname = req.body.lastName;
        const Email = req.body.email;
        const Password = req.body.Password;
        const Phone = req.body.Phonenumber;
        const CustomerWebsite = req.body.CustomerWebsite;
        // קודם נחפש אם קיים משתמש עם האיידי המבוקש  
        user.find({ID:req.params.pid}).then((userfound)=>{ 
            if(userfound.length>0) // אם נמצאה אחד
            {     
                // נעדכן רק את החלקים הרלוונטים שצריך לעדכן 
                if(Fname!=="") // במידה וצריך לעדכן שדה Fname
                {
                    // פה נתחיל לבצע את עידכון השדה
                    user.updateOne({ID:req.params.pid},{$set:{Fname:Fname}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update first name : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update first name : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }       
                if(Lname!=="") // במידה וצריך לעדכן שדה Lname
                {
                    // פה נתחיל לבצע את עידכון השדה
                    user.updateOne({ID:req.params.pid},{$set:{Lname:Lname}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update last name : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update last name : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }       
                if(Email!=="") // במידה וצריך לעדכן שדה Email
                {
                    // פה נתחיל לבצע את עידכון השדה
                    user.updateOne({ID:req.params.pid},{$set:{Email:Email}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update email : " + error) // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update email : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }       
                if(CustomerWebsite!=="") // במידה וצריך לעדכן שדה CustomerWebsite
                {
                    // פה נתחיל לבצע את עידכון השדה
                    user.updateOne({ID:req.params.pid},{$set:{CustomerWebsite:CustomerWebsite}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update WebID : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update WebID : " ,error}); // נשלח הודעה לצד לקוח
                        }); 
                }        
                if(Password!=="") // במידה וצריך לעדכן שדה Password
                {
                    // נצפין את הסיסמא החדשה לפי המפתח שנמצאה בקובץ ENV
                    bcrypt.hash(Password,10).then((myHashPass)=>{
                        // פה נתחיל לבצע את עידכון השדה
                        user.updateOne({ID:req.params.pid},{$set:{Password:myHashPass}}).catch((error)=>{
                                // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                                console.log("could NOT update password : " + error); // נדפיס בצד שרת
                                return res.status(500).json({Msg:"could NOT update password : " ,error}); // נשלח הודעה לצד לקוח                
                        });
                    }).catch((error)=>{
                        // במידה ונוצרה שגיאה בזמן ההצפנה החדשה
                        console.log("some thing wrong with the encryption : " + error); // נדפיס בצד שרת
                        return res.status(500).json({Msg:"some thing wrong with the encryption : " ,error}); // נשלח הודעה לצד לקוח 
                    });  
                } 
                if(Phone!=="") // במידה וצריך לעדכן שדה Phone
                {
                    // פה נתחיל לבצע את עידכון השדה
                    user.updateOne({ID:req.params.pid},{$set:{Phone:req.body.Phonenumber}}).catch((error)=>{
                            // במידה ולא הצלחנו לעדכן את השדה נדפיס הודעה עם השגיאה
                            console.log("could NOT update phone number : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT update phone number : " ,error}); // נשלח הודעה לצד לקוח 
                        }); 
                }
                // במידה והגענו לפה אומר שלא יצאנו מקודם ולא התרחשה שום טעות הנתונים נשמרו בהצלחה
                console.log("you update user with the ID " + req.params.pid); // נדפיס בצד שרת
                return res.status(200).json({Msg:"you update user with the ID " + req.params.pid}); // נשלח הודעה לצד לקוח

            }
            else 
            {
                // לא נמצאה משתמש כזה
                console.log("no user with the ID " + req.params.pid + " in the database"); // נדפיס בצד שרת
                return res.status(404).json({Msg:"no user with the ID " + req.params.pid + " in the database"}); // נשלח הודעה לצד לקוח
            }
        }).catch((error)=>{
            // במידה והתרחשה טעות בזמן חיפוש בקשת יצירת הקשר
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח
        });
    },
    //--- פונקציה שמחזירה את פרטי המשתמש שהתחבר ועבר את שכבת ההזדהות --- http://localhost:3001/adminmanagement/VerifyUser
    VerifyUser:(req, res) =>{
        const Token = req.body.storedToken; // נקבל את התוקן שהמשתמש קיבל מאיתנו
        if(Token){
            var decoded = jwt.verify(Token, process.env.KEY_FOR_ADMIN_TOKEN); // נאמת אותו במידה והכל תקין נחזיר את התוכן שלו פרטים עם כל השדות
            return res.status(200).json({Msg:"admin Found!" ,decoded});
        }else{
            return res.status(406).json({Msg:"There is a problem with the Token"});
        }
    }
}