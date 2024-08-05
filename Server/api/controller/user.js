
// ---- כאן נממש את הפונקיות שיש לכל אחד שנכנס לאתר ----

// חיבור לתקיית dot.env 
require('dotenv').config();

// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const user=require('../models/user'); // המשתנה 'משתמש באנגלית' שיצרתי פה ילווה אותנו בקובץ זה

// חיבור לקובץ שסופר את כמות המשתמשים 
// בעזרתו אני נותן למשתמש חדש איידי ייחודי
const userCounter=require('../models/userCounter');
 
// קישור לספריה שיודעת לטפל בבסיס הנתונים שלי
const mongoose=require('mongoose');  

// קישור לספרייה שיודעת להצפין
const bcrypt=require('bcryptjs'); 

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken'); 



//-------------------------------------------------------------------------------------------------

// נייצא את הפונקציות הללו ונשתמש בהם בקובץ ראוטר
module.exports={
    //------- רישום חדש של משתמש  ------- http://localhost:3001/user/signup
    Register:(req,res)=>{
        // אני מקבל מהפרונט את הפרטים כ  data
        const Fname = req.body.data.firstName;
        const Lname = req.body.data.lastName;
        const Email = req.body.data.email.toLowerCase();
        const Password = req.body.data.Password;
        const Phone = req.body.data.Phonenumber;
        // אפשר להוסיף שיחפש גם אימייל זהה במאגר אם האופרטור או
        user.find({Email:Email}).then((userfound)=>{ // נבדוק האם כבר קיים לי איידי כזה בבסיס נתונים שלי
            if(userfound.length>0) //   במידה ואכן נמצאה לי משתמש כזה הוא ידפיס שגיאה 
            {
                // קיים משתמש עם האימייל הזה
                console.log("this email --> " + Email + " <-- is in use, choose another email"); // נדפיס בצד שרת
                return res.status(409).json({Msg:"this email --> " + Email + " <-- is in use, choose another email"}); // נשלח הודעה לצד לקוח
            }
            else // אחרת יצפין לי את הסיסמא וישמור את כל הנתונים
            {
                // לפני ההצפנה אני אמור לתת למשתמש איידי ייחודי
                // פה אני אמור להתחיל לבדוק מה הוא האיידי
                // בטבלה שעוקבת אחר האיידי 
                // על מנת לתת למשתמש איידי מקורי וייחודי
                userCounter.findOneAndUpdate({id:"user_counter"},{"$inc":{"seq":1}},{new:true},(err,cb)=>{
                    let seqId;
                    if(cb === 0)
                    {
                        // במידה ויוצרים בפעם הראשונה - רשומה מספר אחת
                        const newvalue = new userCounter({id:"user_counter",seq:1});
                        newvalue.save();
                        seqId = 1;
                    }
                    else
                    {
                        seqId=cb.seq
                        // --- הצפנה ----
                        // מקבל את תוכן השדה סיסמא ובנוסף צורת הצפנה  משהוא אישי או משהוא מובנה 
                        bcrypt.hash(Password,10).then((myHashPass)=>{ // המפתח להצפנה נמצאה בקובץ ENV
                            const users=new user({  // משתמש חדש מהמשתנה שייצרתי
                                _id:new mongoose.Types.ObjectId(),
                                ID:seqId, 
                                Fname:Fname, 
                                Lname:Lname,
                                Email:Email,
                                Password:myHashPass,
                                Phone:Phone,
                                joined:new Date().toLocaleDateString('en-GB') // נוצר באופן אוטומטי מהתאריך הנוכחי 
                            });
                            // שומרים את המשתמש החדש שייצרנו  
                            users.save().then((user)=>{  
                                // -------------------  SEND MAIL -------------------------------------
                               // נייבא את הפונקציה שיודעת לשלוח מייל ונשלח לו את המייל של המשתמש
                                require('../view/mails/RegisterUserEmail').SendEmail(Email,seqId,req.body.data); // נשלח מייל משתמש על זה שהוא נרשם בהצלחה
                                require('../view/mails/RegisteeAdminEmail').SendEmail(process.env.PROJECT_EMAIL,seqId,req.body.data); // נשלח מייל לאדמין להודיע לו שיש משתמש חדש
                                //---------------------------------------------------------------------
                                // מדפיסים הודעה עם פרטי המשתמש
                                console.log("You just registerd new user " + user); // נדפיס בצד שרת
                                return res.status(201).json({Msg:"You just registerd new user " ,user}); // נשלח הודעה לצד לקוח
                            }).catch((error)=>{
                                // במידה ונוצרה שגיאה בזמן השמירה
                                console.log("could NOT save the new user " + error); // נדפיס בצד שרת
                                return res.status(500).json({Msg:"could NOT save the new user " ,error}); // נשלח הודעה לצד לקוח
                            }); 
                        }).catch((error)=>{
                            // במידה ונוצרה שגיאה בזמן ההצפנה
                            console.log("some thing wrong with the encryption : " + error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"some thing wrong with the encryption : " + error}); // נשלח הודעה לצד לקוח
                        });
                    }
                })
            }
        });
    },
    //------- התחברות של משתמש קיים  ------- http://localhost:3001/user/login
    Login:(req,res)=>{ 
        const Email = req.body.userName.toLowerCase();
        const Password = req.body.Password;
        // אפשר להוסיף שיחפש גם אימייל זהה במאגר עם האופרטור או
        user.find({Email:Email}).then((userfound)=>{ // נחפש אם יש שם משתמש זה בבסיס נתונים שלי
            if(userfound.length === 0) //   במידה ולא נמצאה אחד זהה נדפיס שגיאה 
            {
                // במידה ואימייל לא נמצאה בדאטא נשלח הודעה שלא נמצאה
                console.log("This email --> " + Email + " <-- was NOT found in database"); // נדפיס בצד שרת
                return res.status(404).json({Msg:"This email --> " + Email + " <-- was NOT found in database"}); // נשלח הודעה לצד לקוח
            }
            else // אחרת תשווה את ההצפנה של הסיסמא אם מה שיש לי בבסיס נתונים 
            {
                if(userfound.length>1)
                {
                    // הודעה בשבילנו שיש לנו כפילות באימייל בדאטה שלנו
                    console.log("you have more then 1 of this Email in the Database " +Email); // נדפיס בצד שרת
                }
                // --- ההשוואה של ההצפנות מה שיש לי בבסיס נתונים מול מה מה שיש לי עכשיו----
                bcrypt.compare(Password,userfound[0].Password).then((status)=>{ // פה נשווה את הסיסמאות
                    if(!status) // אם הסיסמא לא תואמת נחזיר שגיאה
                    {
                        // אם הגעתי לפה שם משתמש נכון אבל סיסמא לא נכונה
                        console.log("the password is wrong try again "); // נדפיס בצד שרת
                        return res.status(401).json({Msg:"the password is wrong try again "}); // נשלח הודעה לצד לקוח
                    }
                    else //  אחרת כל הנתונים תואמים לבסיס נתונים וצריך להכניס את המשתמש
                    {
                        // בודק האם מי שמתחבר הוא אחד האדמינים
                        if (Email === process.env.Admin1 || Email === process.env.Admin2 )
                        {
                            user.find({Email:Email}).then((userfound)=>{
                                const payload = {               
                                    ID: userfound[0].ID,    
                                    Fname: userfound[0].Fname,
                                    Lname: userfound[0].Lname,
                                    Email: Email,
                                    Phone: userfound[0].Phone,
                                    Joined: userfound[0].joined                         
                                };  
                                // sign(מחרוזת ליצירת תוקן, קוד מפתח שאותו הסתרתי, וזמן תפוגה לתוקן)                               
                                const admintoken=jwt.sign(payload,process.env.KEY_FOR_ADMIN_TOKEN);
                                console.log("welcome back admin " + userfound[0].Fname); // נדפיס בצד שרת
                                return res.status(200).json({Msg:"welcome back admin " + userfound[0].Fname,admintoken}); // נחזיר תוקן והודעה             
                            }).catch((error)=>{
                                console.log("could not creat the payload for the token : " + error); // נדפיס בצד שרת
                                return res.status(500).json({Msg:"could not creat the payload for the token : "  + error}); // נשלח הודעה לצד לקוח
                            });
                        }
                        else // אחרת הוא מקבל תוקן רגיל
                        {
                            user.find({Email:Email}).then((userfound)=>{
                                const payload = {               
                                    ID: userfound[0].ID,    
                                    Fname: userfound[0].Fname,
                                    Lname: userfound[0].Lname,
                                    Email: Email,
                                    Phone: userfound[0].Phone,
                                    Joined: userfound[0].joined 
                                }; 
                                console.log("this is from user.js line 160 , just printing the payload that in the token" , payload); 
                                // sign(מחרוזת ליצירת תוקן, קוד מפתח שאותו הסתרתי, וזמן תפוגה לתוקן)
                                const usertoken=jwt.sign(payload,process.env.KEY_FOR_USER_TOKEN);
                                console.log("welcome back user " + userfound[0].Fname); // נדפיס בצד שרת
                                return res.status(200).json({Msg:"welcome back user " + userfound[0].Fname,usertoken}); // נחזיר תוקן והודעה
                            }).catch((error)=>{
                                console.log("could not creat the payload for the token : " + error); // נדפיס בצד שרת
                                return res.status(500).json({Msg:"could not creat the payload for the token : "  + error}); // נשלח הודעה לצד לקוח
                            });
                        } 
                        //--------------------Client-Side-----------------------
                        // import jwt from 'jsonwebtoken';

                        // יש להכניס את מפתח ההצפנה 
                        // const secret = 'KEY_FOR_USER_TOKEN || KEY_FOR_ADMIN_TOKEN'; // בשרת שלנו יש 2 מפתחות אחד למנהל והשני למשתמש
                        
                        // נכניס את התוקן שקיבלנו מצד שרת
                        // const token = this.state.token;
                        
                        // נוציא את תוכן התוקן לתוך משתנה
                        // const decoded = jwt.verify(token, secret); // jwt.verify(מקבל מפתח הצפנה , ותוקן שקיבלנו מצג שרת)
                        
                        // ככמה נראה תוכן התוקן שקיבלנו מצד שרת
                        // ID: "",    // console.log(decoded.ID); 
                        // Fname: "", // console.log(decoded.Fname); 
                        // Lname: "", // console.log(decoded.Lname); 
                        // Email: "", // console.log(decoded.Email); 
                        // Phone: "", // console.log(decoded.Phone); 
                        //--------------------Client-Side-----------------------
                    }
                }).catch((err)=>{                   
                    console.log("some thing wrong with the encryption : " + err); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"some thing wrong with the encryption : "  + err}); // נשלח הודעה לצד לקוח
                });               
            }
        }).catch((error)=>{
            // במידה והתרחשה טעות
            console.log("could not search in database: "  + error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח            
        });
    }


    // ------  פונקציה ליצירת מידע מזוייף על מנת למלא את רשימת המתשמשים שלנו ----
    // Register:async(req,res)=>{
    //     // אני מקבל מהפרונט את הפרטים כ  data
    //     const data = req.body;
    //     for (let i = 0; i < data.length; i++){
    //         var Fname = data[i].firstName;
    //         var Lname = data[i].lastName;
    //         var Email = data[i].email.toLowerCase();
    //         var Password = '123';
    //         var Phone = data[i].Phonenumber;

    //         var userfound = await user.find({Email:Email});
    //         if(userfound.length>0) 
    //         {
    //             console.log("this email --> " + Email + " <-- is in use, choose another email");
    //             return res.status(406).json({Msg:"this email --> " + Email + " <-- is in use, choose another email"});
    //         }
    //         else
    //         {
    //             const cb = await userCounter.findOneAndUpdate({id:"user_counter"},{"$inc":{"seq":1}},{new:true});
    //             let seqId;
    //             if(cb === 0)
    //             {
    //                 const newvalue = new userCounter({id:"user_counter",seq:1});
    //                 await newvalue.save();
    //                 seqId = 1;
    //             }
    //             else
    //             {
    //                 seqId=cb.seq
    //                 const myHashPass = await bcrypt.hash(Password,10);
    //                 const users=new user({ 
    //                     _id:new mongoose.Types.ObjectId(),
    //                     ID:seqId, 
    //                     Fname:Fname, 
    //                     Lname:Lname,
    //                     Email:Email,
    //                     Password:myHashPass,
    //                     Phone:Phone,
    //                     joined:new Date().toLocaleDateString('en-GB')
    //                 });
    //                 await users.save();
    //                 console.log("user created successfully");
    //             }
    //         }
    //     }
    //     return res.status(200).json({Msg:"all have save"});
    // },
}

