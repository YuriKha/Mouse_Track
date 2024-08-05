// בקובץ זה נגדיר ראוטר ונייצא אותו החוצה
const router=require('express').Router();  // יצירת אובייקט של ראוטר המכיל את ההגדרות של הניתובים

//-----------  הרשאות  -------------------------
// -- בודק את התוקן של משתמש רגיל--------
const UserAuthorization=require('../middleware/UserAuthorization'); // USER
const AdminAuthorization=require('../middleware/AdminAuthorization'); // ADMIN
//-----------------------------------------------------------

// הפונקציות שלנו שנמצאות בקונטרולר יש לשים לב לשמות הפונקציות 
const {
    GiveUniqueScriptSrc, // כאן הלקוח מקבל את הסקריפט המיוחד שלו 
    Track,  // צד לקוח מגיע לפה דרך תגית הסקריפט פה הוא מקבל את הפונקציה שמנתרת
    SaveTrackById,  // פה אני שומר את הנתונים אני מקבל מידע מהלקוח
    GetLastMonitor, 
    SaveTrack,  // פונקציה לשמירת נתונים שמתקבלים, נתוני העכבר
    GetLastTrack, // פונקציה שמחזירה את הרשומה האחרונה
    GetAllWebMonitor, // פונקציה שמחזירה את האתרים שיש ניתור
    GetTrackByData,  // מחזיר את כל הניתורים בין תאריכים מסויימים
    GetAllWebMonitorForAdmin // מחזיר את כל האתרים שיש עליהם ניתור לפי איידיי גישה למנהל
} = require('../controller/mouse'); // נתיב בו נמצאות הפונקציות שלי
 
//---------------  ניתוב לשמירת מידע של העכבר  ------------------
//-- יש ליזכור שאם אתה מגיע לפה אתה כבר מקבל '/mousetracker' ---

//-------- ניתוב לתגית סקריפט --------- GET
// במידה ובניתוב יש /giveuniquescriptsrc
// אני מפעיל את הפונקציה GiveUniqueScriptSrc                       פעולת GET
router.post('/giveuniquescriptsrc',UserAuthorization,GiveUniqueScriptSrc);  // ---> //  http://localhost:3001/mousetracker/giveuniquescriptsrc 

//-------- ניתוב לפונקציה שיודעת לנתר--------- GET
// במידה ובניתוב יש /:id/trackMouse.js
// אני מפעיל את הפונקציה Track                     פעולת GET
router.get('/:id/trackMouse.js',Track);  // ---> //  http://localhost:3001/mousetracker/:id/trackMouse.js  

// ניתוב המקבל את כל המידע מהלקוח ושומר אותו לפי איידי--- POST
// במידה ובניתוב יש /savetrackbyid/:id
// אני מפעיל את הפונקציה SaveTrackById                                                              פעולת POST
router.post('/savetrackbyid/:id',SaveTrackById); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/savetrackbyid/:id

// ניתוב המחזיר את הרשומה האחרונה-- POST
// במידה ובניתוב יש /getlastmonitor/:id
// אני מפעיל את הפונקציה GetLastMonitor                                                              פעולת POST
router.post('/getlastmonitor/:id',GetLastMonitor);// על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/getlastmonitor/:id

// ניתוב המקבל את כל המידע ושומר אותו--- POST
// במידה ובניתוב יש /savetrack
// אני מפעיל את הפונקציה SaveTrack                                                      פעולת POST
router.post('/savetrack',SaveTrack); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/savetrack

// ניתוב המחזיר את הרשומה האחרונה-- GET
// במידה ובניתוב יש /getlasttrack
// אני מפעיל את הפונקציה GetLastTrack                                                      פעולת GET
router.get('/getlasttrack',GetLastTrack);// על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/getlasttrack
//----------------------------------

// ניתוב המחזיר את כל האתרים שיש ניתור --- POST
// במידה ובניתוב יש /getallwebmonitor
// אני מפעיל את הפונקציה GetAllWebMonitor                                                      פעולת POST
router.post('/getallwebmonitor',GetAllWebMonitor);// על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/getallwebmonitor
//----------------------------------

// ניתוב המחזיר את כל האתרים שיש ניתור --- POST
// במידה ובניתוב יש /getallwebmonitorforadmin
// אני מפעיל את הפונקציה GetAllWebMonitorForAdmin                                                      פעולת POST
router.post('/getallwebmonitorforadmin',AdminAuthorization,GetAllWebMonitorForAdmin);// על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/getallwebmonitorforadmin
//----------------------------------

// ניתוב המחזיר את כל הניתורים בין תאריכים מסויימים  --- POST
// במידה ובניתוב יש /gettrackbydata
// אני מפעיל את הפונקציה GetTrackByData                                                      פעולת POST
router.post('/gettrackbydata',GetTrackByData);// על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/mousetracker/gettrackbydata
//----------------------------------

//----------------------ייצא-----------------------------
module.exports=router; // לייצא החוצה