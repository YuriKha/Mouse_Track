
// יש לשים לב שהמודל שלנו יהיה באותם השמות כמו בבסיס הנתונים שלנו כולל טיפוס הנתונים של השדות

const mongoose=require('mongoose'); // נייבא את הסיפרייה 

mongoose.pluralize(null); // מבטל את ההתערבות של ספריית מונגוס בשמות הקבצים שלי

// ככה בדיוק נראים השדות בטבלה שמונגו דיבי
const UserSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ID:Number,              // מספר ייחודי ללקוח מתקבל מהטבלה שעוקבת אחר טבלה זו
    Fname:String,           // שם פרטי
    Lname:String,           // שם משפחה
    Email:String,           // דואר אלקטרוני 
    CustomerWebsite:[String], // אתר שאני אמור לנטר, שדה זה מקבל ערך רק לאחר שהלקוח משלם ומציין איזה אתר לנטר
    Password:String,        // סיסמא 
    Phone:String,           // טלפון
    joined:String           // תאריך הצטרפות של הלקוח, מתקבל באופן אוטומטי בזמן הרשמה
});

//----------------------ייצא----------------------------
// שם של האוסף ,הטבלה, בבסיס הנתונים והסכימה של המסמכים הכלולים בו 
module.exports=mongoose.model("user",UserSchema); // יש לשים לב שהאוסף באותו שם