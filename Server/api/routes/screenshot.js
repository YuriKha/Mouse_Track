// בקובץ זה נגדיר ראוטר ונייצא אותו החוצה
const router=require('express').Router();  // יצירת אובייקט של ראוטר המכיל את ההגדרות של הניתובים

// הפונקציה שלנו שנמצאת בקונטרולר יש לשים לב לשם הפונקציה
const {
    TakeScreenshot, // פונקציה שמצלמת תמונת מסך של אתר
}=require('../controller/screenshot'); // נתיב בו נמצאת הפונקציה 

//--------------- ניתוב לצילום מסך ----------------
//-- יש ליזכור שאם אתה מגיע לפה אתה כבר מקבל '/screenshot' ---

//-------- ניתוב לקבלת תמונת מסך של אתר --------- POST
// במידה ובניתוב יש /takescreenshot
// אני מפעיל את הפונקציה TakeScreenshot                                                         פעולת POST
router.post('/takescreenshot',TakeScreenshot); // על מנת להפעיל פונקציה זו יש לשלוח בכתובת --->  http://localhost:3001/screenshot/takescreenshot

//----------------------ייצא-----------------------------
module.exports=router; // לייצא החוצה