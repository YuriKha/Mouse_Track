// --- כאן נממש את הפונקיות שיש בקליטת נתונים מהאתרים שאני מנטר ----

// קישור לספריה שיודעת לטפל בבסיס הנתונים שלי
const mongoose=require('mongoose');  

// חיבור לקובץ משתמשים אשר נמצאה בתקיית מודל
const mouse=require('../models/mouse'); 

// חיבור לקובץ שסופר את כמות רשומות   
// בעזרתו אני נותן לכל רשומה איידי יחודי
const mouseCounter=require('../models/mouseCounter');

// חיבור למודל רשומות תנועות העכבר
const monitor=require('../models/monitor'); 
// חיבור למודל רשומות האיידי הייחודי של תנועות העכבר
const monitorCounter=require('../models/monitorCounter');
// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken');

// חיבור לתקיית dot.env 
require('dotenv').config();

module.exports={    
    // --- נותן לינק ייחודי שהמשתמש צריך לשים בתגית הסקריפט ---> http://localhost:3001/mousetracker/giveuniquescriptsrc                                                                                        
    GiveUniqueScriptSrc:async(req,res)=>{ 
        // ככה צד שרת מקבל את המידע
        //{
        //   "storedToken": ""
        //}
        const token = req.body.storedToken;
        try {
            // נאמת את המשתמש שהוא אכן משתמש שלנו ונחלץ את המידע - את הפרטים האישיים שלו
            // נוציא את תוכן התוקן לתוך משתנה
            const decoded = await jwt.verify(token, process.env.KEY_FOR_USER_TOKEN);
            // נייצר תגית ייחודית בעזרת האיידי הייחודי של הלקוח
            const hotzoneCode = `
                &lt;!-- HotZone Tracking Code for my site --&gt;
                &lt;script&gt;
                    (function(h,o,t,z,n,e){
                        h.hz=h.hz||function(){(h.hz.q=h.hz.q||[]).push(arguments)};
                        h._hzSettings={hzid:${decoded.ID};
                        n=o.getElementsByTagName('head')[0];
                        e=o.createElement('script');e.async=1;
                        e.src=t+h._hzSettings.hzid+z;
                        n.appendChild(e);
                    })(window,document,'http://localhost:3001/mousetracker/','/trackMouse.js');
                &lt;/script&gt;
            `;
            // פונקציה לספירת השורות בסקריפט שייצרתי למעלה
            function countRows(hotzoneCode) {
                // Split the input string by newline characters
                const lines = hotzoneCode.split("\n");
                // Filter out empty lines and lines containing only spaces
                const nonEmptyLines = lines.filter((line) => line.trim() !== "");
                // Return the number of non-empty lines
                return nonEmptyLines.length;
            }
            // נייתר אובייקט
            const data = {
                string:hotzoneCode, // הסקריפט בצורת מחרוזת
                row:countRows(hotzoneCode) // מספר השורות שיש במחרוזת
            }

            console.log("youe uniquew src: " ,data); // נדפיס בצד שרת
            return res.status(200).json({Msg:"youe uniquew src: " ,data}); // נשלח הודעה לצד לקוח
        } catch (error) { // במידה ולא הצלחנו להוציא מידע מהתוקן מסיבה כזו או אחרת
            console.log("could not verify " ,error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not verify " ,error}); // נשלח הודעה לצד לקוח
        }
    },
    // --- מקבל נתונים מאתר מסויים עם איידי של לקוח פה אני שומר את הנתונים --- http://localhost:3001/mousetracker/savetrackbyid/:id
    SaveTrackById:async(req,res)=>{
        // {
        //     website:"",
        //     coordinates:[{
        //         moves:[],
        //         clicks:[],
        //         recorded:""
        //     }]
        // } 
        if(req.body.coordinates[0].moves.length===0){
            console.log("the arrays of moves is empty " , req.body);
            return res.status(400).json({Msg:"the array of moves is empty " + req.body});
        }
        try {
            // נחפש רשומות קיימות תחת המשתמש הזה
            const clientfound = await monitor.find({ClientID:req.params.id});
            if(clientfound.length === 0){ // במידה ולא מצאנו רשומה של משתמש זה
                // ניצור רשומה חדשה למשתמש
                try {
                    // נבדוק בטבלה שעוקבת אחר האיידי האחרון על מנת לתת איידי ייחודי
                    const cb = await monitorCounter.findOneAndUpdate({id:"monitor_counter"},{"$inc":{"seq":1}},{new:true});
                    try {
                        // ניצור אובייקט חדש ובתוכו הנתונים שקיבלנו
                        const newmonitor = await new monitor({ 
                            _id:new mongoose.Types.ObjectId(),
                            MonitorID:cb.seq,
                            ClientID:req.params.id,
                            Monitor:[{
                                website:req.body.website,
                                coordinates:[{
                                    moves:req.body.coordinates[0].moves,
                                    clicks:req.body.coordinates[0].clicks,
                                    recorded:new Date()
                                }]
                            }] 
                        });
                        try {
                            await newmonitor.save(); // נשמור
                            console.log("You just save new monitor "  ,newmonitor); // נדפיס בצד שרת
                            return res.status(200).json({Msg:"You just save new monitor " ,newmonitor}); // נשלח הודעה לצד לקוח
                        } catch (error) { // לא הצלחנו לשמור 
                            console.log("could NOT save new monitor "  ,error); // נדפיס בצד שרת
                            return res.status(500).json({Msg:"could NOT save new monitor " ,error}); // נשלח הודעה לצד לקוח
                        }
                    } catch (error) { // במידה ולא הצלחנו ליצור אובייקט חדש 
                        console.log("could not creat new obj newmonitor" ,error); // נדפיס בצד שרת
                        return res.status(500).json({Msg:"could not creat new obj newmonitor" ,error}); // נשלח הודעה לצד לקוח
                    }
                }catch (error) { // במידה ולא הצלחנו ליצור איידי ייחודי לרשומה החדשה
                    console.log("could not creat unique ID for the monitor track " ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"could not creat unique ID for the monitor track  " ,error}); // נשלח הודעה לצד לקוח
                }
            }else{ // במידה ומצאנו רשומה קיימת תחת המשתמש הזה
                try {
                    // נבדוק האם הייתה הקלטה לאתר המסויים שממנו התקבלה הבקשה
                    const mymonitor = clientfound[0].Monitor;
                    for(let i=0; i < mymonitor.length;i++){
                        if(mymonitor[i].website === req.body.website){
                            // במידה וקיים כבר ניתור מהאתר הזה נקלוט את נקודות הציון
                            try {
                                let dataTosave = req.body; // נעביר את תוכן הבקשה למחסן זמני
                                dataTosave.coordinates[0].recorded = new Date(); // נעדכן את התאריך הנוכחי כבר במחסן
                                
                                const query = {  // נייצר אובייקט בתוכו יש את מאפייני החיפוש בבסיס הנתונים
                                    ClientID: req.params.id, 
                                    'Monitor.website': req.body.website 
                                };

                                const update = { // נייצר אובייקט בתוכו המאפיינים של מה שאנו מעוניינים לעדכן
                                    $push: {
                                        'Monitor.$.coordinates': dataTosave.coordinates, // תנועות העכבר
                                    }
                                };
                                // פה נבצעה את השמירה 
                                await monitor.findOneAndUpdate(query, update); // נכניס לפה את האובייקטים שייצרנו למעלה כפרמטרים לחיפוש ועידכון
                                console.log("you just save a new  coordinates for website: "+ req.body.website);
                                return res.status(200).json({Msg:"you just save a new  coordinates for website: ",  dataTosave});
                            } catch (error) {
                                console.log("could not save new  coordinates",  error);
                                return res.status(500).json({Msg:"could not save new  coordinates",  error});
                            }
                        }
                    }
                    // אם הגענו לפה זאת אומרת זאת הפעם הראשונה שאנחנו מנתרים את האתר המסויים הזה
                    try {
                        let dataTosave = req.body; // נעביר את תוכן הבקשה למחסן זמני
                        dataTosave.coordinates[0].recorded = new Date(); // נעדכן את התאריך הנוכחי כבר במחסן
                        
                        const query = {  // נייצר אובייקט בתוכו יש את מאפייני החיפוש בבסיס הנתונים
                            ClientID: req.params.id, 
                        };

                        const update = { // נייצר אובייקט בתוכו המאפיינים של מה שאנו מעוניינים לעדכן
                            $push: {
                                'Monitor': dataTosave, 
                            }
                        };
                        // פה נבצעה את השמירה 
                        await monitor.findOneAndUpdate(query, update); // נכניס לפה את האובייקטים שייצרנו למעלה כפרמטרים לחיפוש ועידכון
                        console.log("you just save a new  Monitor: "+ dataTosave);
                        return res.status(200).json({Msg:"you just save a new  Monitor: ",  dataTosave});
                    } catch (error) {
                        console.log("could not save new  Monitor:",  error);
                        return res.status(500).json({Msg:"could not save new  Monitor:",  error});
                    }
                } catch (error) {
                    console.log("could not cheak for website in Monitor array" ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"could not cheak for website in Monitor array"  ,error}); // נשלח הודעה לצד לקוח
                }
            }    
        } catch (error) { // במידה ולא הצלחנו לחפש בבסיס הנתונים שלנו אחר רשומות
            console.log("could not search in the monitor database for the Client ID ",  error);
            return res.status(500).json({Msg:"could not search in the database for the Client ID ",  error});
        }
    },
    // --- צד לקוח מגיעה לפה בעזרת תגית הסקריפט פה הוא מקבל את הפונקציה שעוקבת אחר העכבר --- http://localhost:3001/mousetracker/:id/trackMouse.js
    Track:async(req,res)=>{
        const sendTo = 'http://localhost:3001/mousetracker/savetrackbyid/'+ req.params.id;
        const TrackFunction = `
        let Monitor = {
            website:"",
            coordinates:[{
                moves:[],
                clicks:[],
                recorded:""
            }]
        } 

        Monitor.website = window.location.href;
        let scaleX = 1920 / window.screen.width; 
        let scaleY = 1080 / window.screen.height;

        document.addEventListener("mousemove", function(event) {
        setTimeout(function(){
            let x1 = event.clientX * scaleX;
            let y1 = event.clientY * scaleY;
            Monitor.coordinates[0].moves.push({ x: x1, y: y1});
        },1000/5);
        });
    
        document.addEventListener("click", function(event) {
        setTimeout(function(){
            let x1 = event.clientX * scaleX;
            let y1 = event.clientY * scaleY;
            Monitor.coordinates[0].clicks.push({ x: x1, y: y1});
        }, 1000/5);
        });
          
        window.addEventListener("visibilitychange", function() {
        fetch('${sendTo}', {
            method: "POST",
            body: JSON.stringify(Monitor),
            headers: {
            "Content-Type": "application/json"
            }
        });
        });
        `;
        res.setHeader('Content-Type', 'application/javascript');
        res.send(TrackFunction);
    },
    // --- מחזיר את הניתור האחרון לפי איידי של המשתמש  --- http://localhost:3001/mousetracker/getlastmonitor/:id
    GetLastMonitor:async(req,res)=>{
        // {
        //     "website": "http://127.0.0.1:5501/index.html"
        // }
        try {
            const monitorsFound = await monitor.find(
              { ClientID: req.params.id, 'Monitor.website': req.body.website },
              { 'Monitor.$': 1 }
            );
            if (monitorsFound.length > 0 && monitorsFound[0].Monitor.length > 0) {
              const lastElement = monitorsFound[0].Monitor[0].coordinates.slice(-1);
              console.log("last known coordinates", lastElement);
              return res.status(200).json({ Msg: "last known coordinates", lastElement });
            } 
            else {
              console.log("no records in database for client ID: " + req.params.id);
              return res.status(404).json({ Msg: "no records in database for client ID: " + req.params.id });
            }
        } catch (error) {
        console.log("could NOT search in the database", error);
        return res.status(500).json({ Msg: "could NOT search in the database", error });
        }
    },
    // --- מקבל מהאתר שאני מנטר נתונים של העכבר ---     "http://localhost:3001/mousetracker/savetrack" 
    SaveTrack:async(req,res)=>{  
        const ArrX = req.body.ArrX;
        const ArrY = req.body.ArrY;
        const CurrentWebsite = req.body.CurrentWebsite;


        try {
            // נבדוק בטבלה שעוקבת אחר האיידי האחרון על מנת לתת איידי ייחודי
            const cb = await mouseCounter.findOneAndUpdate({id:"mouse_counter"},{"$inc":{"seq":1}},{new:true});

            try {
                const newtrack = await new mouse({ 
                    _id:new mongoose.Types.ObjectId(),
                    ID:cb.seq,
                    ArrX:ArrX,
                    ArrY:ArrY,
                    CurrentWebsite:CurrentWebsite,
                    Recorded:new Date().toLocaleDateString('en-GB')
                });
                // נשמור
                await newtrack.save()

                console.log("You just got a new 'track' "  ,newtrack); // נדפיס בצד שרת
                return res.status(200).json({Msg:"You just got a new 'track' " ,newtrack}); // נשלח הודעה לצד לקוח

            } catch (error) { // במידה ולא הצלחנו לשמור 
                console.log("could not save the track" ,error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could not save the track" ,error}); // נשלח הודעה לצד לקוח
            }

        } catch (error) { // במידה ולא הצלחנו לייצר אידי יחודי
            console.log("could not creat unique ID for the mouse track " ,error); // נדפיס בצד שרת
            return res.status(500).json({Msg:"could not creat unique ID for the mouse track  " ,error}); // נשלח הודעה לצד לקוח
        }

    },
    // ---  מחזיר את הרשומה האחרונה שנשמרה  ---     http://localhost:3001/mousetracker/getlasttrack 
    GetLastTrack:async(req,res)=>{
        try {

            const lastTrack = await mouse.find({}).sort({ _id: -1 }).limit(1);

            console.log("the track: "  ,lastTrack); // נדפיס בצד שרת
            return res.status(200).json({Msg:"the track:  " ,lastTrack}); // נשלח הודעה לצד לקוח

        } catch (error) { // במידה ולא הצלחנו למצוא רשומה
            console.log("could not finde " ,error); // נדפיס בצד שרת
            return res.status(404).json({Msg:"could not finde " ,error}); // נשלח הודעה לצד לקוח
        }
    },
    // --- מחזיר את כל האתרים שיש עליהם ניתור ---  http://localhost:3001/mousetracker/getallwebmonitor
    GetAllWebMonitor:async(req,res)=>{
        // ככה צד שרת מקבל את המידע
        //{
        //   "storedToken": ""
        //}
        const token = req.body.storedToken; // נחלץ את התוקן לתוך משתנה
        if(token){ // נוודא שיש לנו תוקן 
            try {
                // נהפוך את התוקן למדי שמאוחסן בתוכו
                const decoded = await jwt.verify(token, process.env.KEY_FOR_USER_TOKEN);
                try {
                    // שאילתה לבסיס הנתונים שלני
                    const websitefound = await monitor.aggregate([
                        {
                         $match: { ClientID: decoded.ID }
                        },
                        {
                          $unwind: "$Monitor"
                        },
                        {
                       $group: {
                            _id: null,
                            websites: { $addToSet: "$Monitor.website" }
                       }
                        },
                        {
                       $project: {
                            _id: 0,
                            websites: 1
                       }
                        }
                    ]);
                    
                    const websitesArray = websitefound[0].websites;
                    const fullName = decoded.Fname +" " + decoded.Lname;
                     console.log("this is all the website " ,websitesArray); // נדפיס בצד שרת
                      return res.status(200).json({Msg:"this is all the website " ,websitesArray,fullName}); // נשלח הודעה לצד לקוח
                } catch (error) {
                    console.log("no website found " ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"no website found " ,error}); // נשלח הודעה לצד לקוח
                }
            } catch (error) { // אם הגעתי לפה התוקן שקיבלתי לא תקין ואי אפשר לחלץ ממנו מידע
                console.log("could not decoded the token " ,error); // נדפיס בצד שרת
                return res.status(401).json({Msg:"could not decoded the token " ,error}); // נשלח הודעה לצד לקוח
            }
        }else{ // אם הגעתי לפה הבקשה התקבלה ללא התוקן
            console.log("you dont have token " ,token); // נדפיס בצד שרת
            return res.status(401).json({Msg:"you dont have token " ,token}); // נשלח הודעה לצד לקוח
        }
    },
    // --- מחזיר את כל האתרים שיש עליהם ניתור גישה למנהל --- http://localhost:3001/mousetracker/getallwebmonitorforadmin
    GetAllWebMonitorForAdmin:async(req,res)=>{
        // ככה צד שרת מקבל את המידע
        //{
        //   "storedToken": "",
        //   "ID":""
        //}
        console.log(req.body)
        const token = req.body.storedToken; // נחלץ את התוקן לתוך משתנה
        if(token){ // נוודא שיש לנו תוקן 
            try {
                // נהפוך את התוקן למדי שמאוחסן בתוכו
                const decoded = await jwt.verify(token, process.env.KEY_FOR_ADMIN_TOKEN);
                try {
                    // שאילתה לבסיס הנתונים שלני
                    const websitefound = await monitor.aggregate([
                        {
                         $match: { ClientID: req.body.ID }
                        },
                        {
                          $unwind: "$Monitor"
                        },
                        {
                       $group: {
                            _id: null,
                            websites: { $addToSet: "$Monitor.website" }
                       }
                        },
                        {
                       $project: {
                            _id: 0,
                            websites: 1
                       }
                        }
                    ]);
                    
                    const websitesArray = websitefound[0].websites;
                    const fullName = decoded.Fname +" " + decoded.Lname;
                     console.log("this is all the website " ,websitesArray); // נדפיס בצד שרת
                      return res.status(200).json({Msg:"this is all the website " ,websitesArray,fullName}); // נשלח הודעה לצד לקוח
                } catch (error) {
                    console.log("no website found " ,error); // נדפיס בצד שרת
                    return res.status(500).json({Msg:"no website found " ,error}); // נשלח הודעה לצד לקוח
                }
            } catch (error) { // אם הגעתי לפה התוקן שקיבלתי לא תקין ואי אפשר לחלץ ממנו מידע
                console.log("could not decoded the token " ,error); // נדפיס בצד שרת
                return res.status(401).json({Msg:"could not decoded the token " ,error}); // נשלח הודעה לצד לקוח
            }
        }else{ // אם הגעתי לפה הבקשה התקבלה ללא התוקן
            console.log("you dont have token " ,token); // נדפיס בצד שרת
            return res.status(401).json({Msg:"you dont have token " ,token}); // נשלח הודעה לצד לקוח
        }
    },
    //  מחזיר את כל הניתורים בין תאריכים מסויים ---  http://localhost:3001/mousetracker/gettrackbydata
    GetTrackByData: async (req, res) => {
        // נבדוק שיש לנו את המידע הנדרש על מנת לבצע את החיפוש
        if (req.body.ClientID && req.body.website && req.body.startDate && req.body.endDate) {
            const ID = req.body.ClientID;
            const website = req.body.website;
            const [day, month, year] = req.body.startDate.split('/');
            const startDate = new Date(Date.UTC(year, month - 1, day));
            startDate.setDate(startDate.getDate() - 1);
            const [da, mont, yea] = req.body.endDate.split('/');
            const endDate = new Date(Date.UTC(yea, mont - 1, da));
            endDate.setDate(endDate.getDate() + 1);
            console.log(startDate);
            console.log(endDate);
            try {
                const result = await monitor.aggregate([
                    // נחפש רשומה לפי האיידי שקיבלנו
                    { $match: { ClientID: ID } },
                    // נשחרר את המוניתור שנמצאה
                    { $unwind: "$Monitor" },
                    // נחפש לפי האתר שקיבלנו
                    { $match: { "Monitor.website": website } },
                    // נשחרר את הקורדינטות שנמצאה
                    { $unwind: "$Monitor.coordinates" },
                    // נחפש התאמה בתאריך
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $gte: ["$Monitor.coordinates.recorded", startDate] },
                                    { $lte: ["$Monitor.coordinates.recorded", endDate] },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            newMoves: "$Monitor.coordinates.moves",
                        },
                    },
                ]);
                if (result.length === 0) { // במידה ולא נמצאו התאמות
                    console.log("No matching document found.");
                    return res.status(404).json({ Msg: "No matching document found." });
                }
                // כרגע יש לי מערך עם 2 אובייקטים
                const newMoves = result.map((item) => item.newMoves).flat();
    
                return res.status(200).json({newMoves});// נשלח לצד לקוח

            } catch (error) { // במידה ויש בעיה בבסיס הנתונים שלנו
                console.error("could NOT search in the database ", error);// נדפיס בצד שרת
                return res.status(500).json({ Msg: "could NOT search in the database " });// נשלח לצד לקוח
            }
        } else { // נגיע לפה במידה ואין לנו את כל המידע הנדרש
            console.log("You don't have one or all of the following: storedToken, website, startDate, endDate");// נדפיס בצד שרת
            return res.status(400).json({ Msg: "You don't have one or all of the following: storedToken, website, startDate, endDate" });// נשלח לצד לקוח
        }
    }
    
}