
// יש לשים לב שהמודל שלנו יהיה באותם השמות כמו בבסיס הנתונים שלנו כולל טיפוס הנתונים של השדות
const mongoose=require('mongoose'); // נייבא את הסיפרייה 

mongoose.pluralize(null); // מבטל את ההתערבות של ספריית מונגוס בשמות הקבצים שלי

// ככה בדיוק נראים השדות בטבלה שמונגו דיבי
const ReceiptSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ID:Number,                // מספר יחודי לקבלה, מתקבל אוטומטית מטבלה אחרת שעוקבת אחר טבלה זו
    ClientID:Number,          // מספר יחודי של הלקוח, נלקח מטבלת לקוחות
    Paid:Number,              // כמה שולם
    CreditCardType:String,    // סוג הכרטיס
    CreditCardNumber:String,  // מספר הכרטיס
    ExperationDate:String,    // תאריך תפוגה
    Cvv:String,               // קוד מאחורי הכרטיס
    StartServis:String,       // תחילת מתן שירות הניטור, מתקבל באופן אוטומטית
    EndServis:String,         // סיום מתן שירות הניטור, מתקבל באופן אוטומטית
    CustomerWebsite:[String]    // האתר אותו אני אמור לנטר
});

//----------------------ייצא----------------------------
// שם של האוסף ,הטבלה, בבסיס הנתונים והסכימה של המסמכים הכלולים בו 
module.exports=mongoose.model("receipt",ReceiptSchema); // יש לשים לב שהאוסף באותו שם
