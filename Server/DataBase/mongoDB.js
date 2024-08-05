//---------- חיבור לספריית מונגוס --------------------------
const mongoose=require('mongoose');
//-----------------------------------------------------------
//----- חיבור לבסיס נתונים של מונגו -----------------------
mongoose.set('strictQuery', true); 

const uri = process.env.ConnectionString; // נסתיר את מחרוזת ההתחברות בתוך קובץ ENV
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology: true}).then(()=>{
    console.log('you connected to MongoDb'); // נכתוב הודעה לקונסול שבסיס הנתונים מחובר
});
//-----------------------------------------------------------