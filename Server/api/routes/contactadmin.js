
// בקובץ זה נגדיר ראוטר ונייצא אותו החוצה
const router=require('express').Router();  // יצירת אובייקט של ראוטר המכיל את ההגדרות של הניתובים

// הפונקציות שלנו שנמצאות בקונטרולר יש לשים לב לשמות הפונקציות 
const {
    GetAll,            // פונקציה שמחזירה את על הבקשות ליצירת קשר
    GetAllOpen,        // פונקציה שמחזירה את כל הבקשות הפתוחות ליצירת קשר
    GetAllClose,       // פונקציה שמחזירה את כל הבקשות הסגורות ליצירת קשר
    GetContactUsById,  // פונקציה שמחזירה בקשה אחת 
    CloseContactUs,    // פונקציה שסוגרת בקשה ליצירת קשר
    ToggleImportant,   // פונקציה שהופכת בקשות מחשוב ללא חשוב וההפך 
    UpdateCustomerFlow,// פונקציה לעידכון התקשרות עם לקוח
    CustomerFlowById,  //  מחזיר את ההתקשרות של לקוח ספציפי לפי בקשת קשר איידי 
    CustomerFlowByCid, // מחזיר את ההתקשרות של לקוח ספציפי לפי לקוח איידי 
    UpdateContactUs    // פונקציה לעידכון של בקשה ליצירת קשר
}=require('../controller/contactadmin'); // נתיב בו נמצאות הפונקציות שלי

//---------------  ניתובים  לניהול יצירות קשר  ------------------
//-- יש ליזכור שאם אתה מגיע לפה אתה כבר מקבל '/contactadmin' ---

//---- ניתוב המחזיר את כל הבקשות הפתוחות ליצירת קשר --- POST
// במידה ובניתוב יש /getall
// אני מפעיל את הפונקציה GetAll                                                     פעולת POST
router.post('/getall',GetAll); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/getall

//---- ניתוב המחזיר את כל הבקשות הפתוחות ליצירת קשר --- POST
// במידה ובניתוב יש /getallopen
// אני מפעיל את הפונקציה GetAllOpen                                                     פעולת POST
router.post('/getallopen',GetAllOpen); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/getallopen
//----------------------------------

//---- ניתוב המחזיר את כל הבקשות הסגורות ליצירת קשר --- POST
// במידה ובניתוב יש /getallclose
// אני מפעיל את הפונקציה GetAllClose                                                      פעולת POST
router.post('/getallclose',GetAllClose); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/getallclose
//----------------------------------

//--- ניתוב המחזיר בקשה ליצירת קשר לפי האיידי--- GET
// במידה ובניתוב יש /:pid
// אני מפעיל את הפונקציה GetContactUsById                                              פעולת GET
router.get('/:pid',GetContactUsById); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/{id}
//----------------------------------

//---- ניתוב לסגירה של בקשה ליצירת קשר --- DEL
// במידה ובניתוב יש /:pid
// אני מפעיל את הפונקציה CloseContactUs                                                 פעולת DELETE
router.delete('/:pid',CloseContactUs); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/{id}
//----------------------------------

//--- הופך בקשות מחשוב ללא חשוב וההפך  --- GET
// במידה ובניתוב יש /toggleimportant/:id
// אני מפעיל את הפונקציה ToggleImportant                                                             פעולת GET
router.get('/toggleimportant/:id',ToggleImportant); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/toggleimportant/:id
//----------------------------------

//---  עידכון התקשרות עם לקוח --- POST
// במידה ובניתוב יש /updatecustomerflow/:id
// אני מפעיל את הפונקציה UpdateCustomerFlow                                                                פעולת POST
router.post('/updatecustomerflow/:id',UpdateCustomerFlow); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/updatecustomerflow/:id
//----------------------------------

//--- מחזיר את ההתקשרות של לקוח ספציפי לפי בקשת קשר איידי --- GET
// במידה ובניתוב יש /customerflowbyid/:id
// אני מפעיל את הפונקציה CustomerFlowById                                                             פעולת GET
router.get('/customerflowbyid/:id',CustomerFlowById); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/customerflowbyid/:id
//----------------------------------

//--- מחזיר את ההתקשרות של לקוח ספציפי לפי לקוח איידי --- GET
// במידה ובניתוב יש /customerflowbycid/:cid
// אני מפעיל את הפונקציה CustomerFlowByCid                                                                פעולת GET
router.get('/customerflowbycid/:cid',CustomerFlowByCid); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/customerflowbycid/:cid
//----------------------------------

//--- ניתוב לעידכון של בקשה ליצירת קשר לפי האיידי--- PATCH
// במידה ובניתוב יש /:pid
// אני מפעיל את הפונקציה UpdateContactUs                                                פעולת PATCH
router.patch('/:pid',UpdateContactUs); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --> http://localhost:3001/contactadmin/{id}
//----------------------------------

//----------------------ייצא-----------------------------
module.exports=router; // לייצא החוצה