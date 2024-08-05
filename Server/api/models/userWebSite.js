
// יש לשים לב שהמודל שלנו יהיה באותם השמות כמו בבסיס הנתונים שלנו כולל טיפוס הנתונים של השדות

const mongoose=require('mongoose'); // נייבא את הסיפרייה 

mongoose.pluralize(null); // מבטל את ההתערבות של ספריית מונגוס בשמות הקבצים שלי

// ככה בדיוק נראים השדות בטבלה שמונגו דיבי
const userWebSiteSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ClientID:Number,             
    CustomerWebsite:[String], 
});

//----------------------ייצא----------------------------
// שם של האוסף ,הטבלה, בבסיס הנתונים והסכימה של המסמכים הכלולים בו 
module.exports=mongoose.model("userwebsite",userWebSiteSchema); // יש לשים לב שהאוסף באותו שם