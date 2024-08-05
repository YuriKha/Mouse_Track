
// בקובץ זה נגדיר ראוטר ונייצא אותו החוצה
const router=require('express').Router();  // יצירת אובייקט של ראוטר המכיל את ההגדרות של הניתובים

// הפונקציות שלנו שנמצאות בקונטרולר יש לשים לב לשמות הפונקציות 
const {
    AddWebSite, // פונקציה שמוסיפה על ידי המשתמש שיש לנתר
    DeleteWebSite, // פונקציה שמוחקת אתר שהמשתמש כבר לא רוצה לנתר
    GetAllWebSite, // פונקציה שמחזירה את כל האתרים שהמשתמש ביקש לנתר
}=require('../controller/userwebsite'); // נתיב בו נמצאות הפונקציות שלי

//---------------  ניתובים למשתמשים-----------------------
//-- יש ליזכור שאם אתה מגיע לפה אתה כבר מקבל '/userwebsite' ---

//--- נתיב שמוסיף אתר שיש לנתר --- POST
// במידה ובניתוב יש /addwebsite
// אני מפעיל את הפונקציה AddWebSite   
router.post('/addwebsite',AddWebSite); // http://localhost:3001/userwebsite/addwebsite
//----------------------------------

//--- ניתוב למחיקת אתר שיש להפסיק לנתר --- DELETE
// במידה ובניתוב יש /deletewebsite
// אני מפעיל את הפונקציה DeleteWebSite   
router.delete('/deletewebsite',DeleteWebSite); // http://localhost:3001/userwebsite/deletewebsite
//----------------------------------

//--- ניתוב שמחזיר את כל האתרים שהמשתמש ביקש לנתר --- POST
// במידה ובניתוב יש /getallwebsite
// אני מפעיל את הפונקציה GetAllWebSite   
router.post('/getallwebsite',GetAllWebSite); // http://localhost:3001/userwebsite/getallwebsite
//----------------------------------

//----------------------ייצא-----------------------------
module.exports=router; // לייצא החוצה