// הרשאות של מנהל

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken'); 

// חיבור לתקיית dot.env 
require('dotenv').config(); // לקבל גישה ל KEY_FOR_ADMIN_TOKEN

module.exports=(req,res,next)=>{
    try{
        // מחלץ את התוקן בלבד מתוך הגוף
        var token = req.body.storedToken;
        if(token === undefined){
            token = req.query.params1;
        }
        jwt.verify(token,process.env.KEY_FOR_ADMIN_TOKEN); // משווה עם ההצפנה שמתאימה למנהל המערכת
        next(); // מקדם הלאה במידה והכל תקין
    }
    catch{
        // במידה והגעתי לפה ישנה בעיה עם ההרשאה
        console.log("Not authorized request"); // נדפיס בצד שרת
        return res.status(401).json({Msg:"Not authorized request"}); // נשלח הודעה לצד לקוח
    }
}