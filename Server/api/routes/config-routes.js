// -----------  ניתובים  -----------------------------------
//-- ניתוב לתוך תקיוית הראוטר אשר מכילה ניתובים למשתמש רגיל
const UserRouter=require('./user'); //   login & signup
//-- ניתוב לתוך הראוטר אשר מכילה ניתובים למנהל
const AdminRouter=require('./admin'); //  /adminmanagement
//-- ניתוב לתוך הראוטר אשר מכיל ניתובים למשתמש מחובר
const UserlogedRouter=require('./userloged'); // /usermanagement 
//-- ניתוב לתוך הראוטר אשר מכיל ניתובים ליצירת קשר 
const ContactUsRouter=require('./contactus'); // /contactadmin
//-- ניתוב לתוך הראוטר אשר מכיל ניתוב לתשלום
const ReceiptRouter=require('./receipt'); // //receipt
//-- ניתוב לתוך הראוטר אשר מכיל ניתובים לניהול יצירות קשר
const ContactAdminRouter=require('./contactadmin'); // /contactus
//-- ניתוב לתוך הראוטר אשר מכיל ניתובים לקבלת נתונים מהאתר שאנחנו עוקבים
const MouseRouter=require('./mouse'); // /mousetracker
// -- ניתוב לקבלת תמונת מסך
const Screenshot=require('./screenshot'); // /screenshot
// -- ניתוב לרישום אתרים שיש לנתר גישה למשתמש
const UserWebSiteRouter=require('./userwebsite'); //
// -- ניתוב לניהול רישום אתרים שיש לנתר גישה למנהל
//const UserWebSiteAdminRouter=require('./userwebsiteadmin'); //

//-----------  הרשאות  --------------------------------------
// -- בודק את התוקן של משתמש רגיל--------
const UserAuthorization=require('../middleware/UserAuthorization'); // USER
//-- בודק את התוקן של מנהל --------
const AdminAuthorization=require('../middleware/AdminAuthorization'); // ADMIN
//-----------------------------------------------------------

//--------------- נייצא את כל נקודות הקצה הקיימות באפליקציה ---------
exports.routesInit = (app) =>{
    
    //--- כולם רשאים לפנות לנתיב זה נתיב התחברות והרשמה ----  /user
    app.use('/user',UserRouter); // מקבל ניתוב ובנוסף ראוטר המטפל בניתוב משתמשים

    //--- כולם רשאים לפנות לנתיב זה נתיב לבקשת צור קשר----  /contactus
    app.use('/contactus',ContactUsRouter); // מקבל ניתוב ובנוסף ראוטר המטפל בניתוב משתמשים

    //--- כולם רשאים לפנות לנתיב זה נתיב לבקשת צור קשר----  /contactadmin
    app.use('/contactadmin',AdminAuthorization,ContactAdminRouter); // מקבל ניתוב ובנוסף ראוטר המטפל בניתוב משתמשים

    //-- משתמשים רשומים יכולים לפנות לנתיב זה על מנת לבצע תשלום --- /receipt
    app.use('/receipt',UserAuthorization,ReceiptRouter); // מקבל ניתוב מתאים , שכבת אימות למשתמש מחובר, וראוטר המטפל בניתוב של תשלום

    //--  לפה ישלחו כל הנתונים מהאתרים שאנחנו עוקבים ---- /mousetracker
    app.use('/mousetracker',MouseRouter); //  מקבל ניתוב מתאים

    // --  צילום מסך לאתר ---- /screensho
    app.use('/screenshot',Screenshot);

    // -- ניתוב לרישום אתרים שיש לנתר גישה למשתמש ---
    app.use('/userwebsite',UserAuthorization,UserWebSiteRouter); // /userwebsite

    // -- ניתוב לניהול רישום אתרים שיש לנתר גישה למנהל ---
    //app.use('/userwebsiteadmin',AdminAuthorization,UserWebSiteAdminRouter); // /userwebsiteadmin

    //--  רק המנהלים רשאים לפנות לנתיב זה ניהול המשתמשים ---- /adminmanagement
    app.use('/adminmanagement',AdminAuthorization,AdminRouter); //  מקבל ניתוב מתאים , שכבת אימות למנהל, וראוטר המטפל בניתוב של המנהל

    //--  רק משתמש מחובר יכול לפנות לנתיב זה ---- /usermanagement
    app.use('/usermanagement',UserAuthorization,UserlogedRouter); //  מקבל ניתוב מתאים , שכבת אימות למשתמש מחובר, וראוטר המטפל בניתוב של משתמש מחובר


    // נתיב שלא נתפס למעלה יתפס פה
    // יש לוודא שנתיב זה יהיה האחרון והוא יתפוס מה שלא נתפס בניתובים הקודמים
    app.all('*',(req,res)=>{ 
    console.log("cheack the URL i do not know the route");
    res.status(404).json({Msg:"cheack the URL i do not know the route"});
    });

}
