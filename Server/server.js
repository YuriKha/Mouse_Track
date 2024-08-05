//כאן מוקם שרת האינטרנט

const http = require('http'); // חיבור לספרייה
const app=require('./app'); //   ייבוא של קובץ אפ ,יש לייצא קובץ אפ בתוך אפ על מנת שנוכל לייבא

const server=http.createServer(app);

const port= process.env.PORT || "3002"; // המשתנה פורט יכיל מספר הפורט ובמידה והוא תפוס יהיה חליפי

server.listen(port,()=>{ // אומר לשרת להתחיל להאזין לפורט
    console.log('you started the server') // ולהדפיס שהשרת התחיל
});