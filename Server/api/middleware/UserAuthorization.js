// הרשאות למשתמש רגיל

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken'); 

// חיבור לתקיית dot.env 
require('dotenv').config(); // לקבל גישה ל KEY_FOR_USER_TOKEN

module.exports=(req,res,next)=>{
    try{
        // מחלץ את התוקן בלבד מתוך הגוף
        const token = req.body.storedToken; 
        jwt.verify(token,process.env.KEY_FOR_USER_TOKEN); // משווה עם ההצפנה שמתאימה למשתמש
        next(); // מקדם הלאה במידה והכל תקין
    }
    catch{
        // במידה והגעתי לפה ישנה בעיה עם ההרשאה
        console.log("Not authorized request"); // נדפיס בצד שרת
        return res.status(401).json({Msg:"Not authorized request"}); // נשלח הודעה לצד לקוח
    }
}