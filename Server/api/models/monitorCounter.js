// יש לשים לב שהמודל שלנו יהיה באותם השמות כמו בבסיס הנתונים שלנו כולל טיפוס הנתונים של השדות
 
const mongoose=require('mongoose'); // נייבא את הסיפרייה 
 
mongoose.pluralize(null); // מבטל את ההתערבות של ספריית מונגוס בשמות הקבצים שלי
 
// ככה בדיוק נראים השדות בטבלה של מונגו דיבי
const MonitortCounterSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    id:String,  // שם הטבלה אחריו יש מעקב
    seq:Number  // מספר זה יהיה המספר הייחודי של הטבלה אחריו יש מעקב
});
 
//----------------------ייצא----------------------------
// שם של האוסף ,הטבלה, בבסיס הנתונים והסכימה של המסמכים הכלולים בו 
module.exports=mongoose.model("monitorCounter",MonitortCounterSchema); // יש לשים לב שהאוסף באותו שם
 