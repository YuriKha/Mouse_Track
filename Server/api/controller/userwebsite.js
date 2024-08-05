
// קישור לספריה שיודעת לטפל בבסיס הנתונים שלי
const mongoose=require('mongoose');  

// קישור למודל של אתרים לניתור
const userwebsite=require('../models/userWebSite'); 

// קישור לספרייה שיודע לעבוד עם תוקן
const jwt=require('jsonwebtoken');

// חיבור לתקיית dot.env 
require('dotenv').config();

module.exports={ 

    AddWebSite:async(req,res)=>{ // POST ---> http://localhost:3001/userwebsite/addwebsite
        // {
        //     "storedToken":"",
        //     "website":""
        // }
        try {
            // נברר מי הוא המתשמש שמעוניין להוסיף אתר לניתור
            const decodedToken=jwt.verify(req.body.storedToken,process.env.KEY_FOR_USER_TOKEN);
            try {
                // נחפש האם יש לאותו משתמש טבלה של אתרים אותם הוא כבר מנתר
                const website = await userwebsite.find({ClientID:decodedToken.ID});
                if(website.length>0){// מצאנו שלמשתמש זה יש אתרים שהוא כבר מנתר
                    // במידה ויש טבלה נחפש האם הוא כבר מנתר אתר זה
                    const newSite = await userwebsite.findOne({
                        ClientID:decodedToken.ID,
                        CustomerWebsite:{ $elemMatch: { $eq: req.body.website }}
                    });
                    if(newSite){ // במידה ואכן אני כבר מנתר אתר זה
                        console.log("you allready monitor this website: ",req.body.website); // נדפיס בצד שרת
                        return res.status(400).json({Msg:"you allready monitor this website: " + req.body.website}); // נשלח הודעה לצד לקוח
                    }else{// במידה והוא לא מנתר נוסיף לאותה טבלה אתר חדש לנתר                      
                        await userwebsite.updateOne({ClientID:decodedToken.ID},{ $push: { CustomerWebsite: req.body.website }});
                        console.log("you just save a new website to monitor ",req.body.website); // נדפיס בצד שרת
                        return res.status(201).json({Msg:"you just save a new website to monitor " + req.body.website}); // נשלח הודעה לצד לקוח
                    }
                }
                else{// למשתמש זה אין כרגע אתרים שהוא מנתר יש ליצור טבלה חדשה
                    try {
                        const newwebsite = new userwebsite({ // נייצר אובייקט חדש שמוסג אתר למעקב
                            _id:new mongoose.Types.ObjectId(),
                            ClientID:decodedToken.ID,
                            CustomerWebsite:req.body.website
                        });
                        await newwebsite.save(); // נשמור אותו 
                        console.log("you just save a new website to monitor ",newwebsite); // נדפיס בצד שרת
                        return res.status(201).json({Msg:"you just save a new website to monitor " ,newwebsite}); // נשלח הודעה לצד לקוח
                    } catch (error) {
                        console.log("could NOT save the new website to monitor ",error); // נדפיס בצד שרת
                        return res.status(500).json({Msg:"could NOT save the new website to monitor " ,error}); // נשלח הודעה לצד לקוח
                    }
                }
            } catch (error) {
                console.log("could not search in database ",error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could not search in database " ,error}); // נשלח הודעה לצד לקוח
            }
        } catch (error) {
            console.log("could not verify user BAD token",error); // נדפיס בצד שרת
            return res.status(401).json({Msg:"could not verify user BAD token" ,error}); // נשלח הודעה לצד לקוח
        }
    },
    DeleteWebSite:async(req,res)=>{ // DELETE ---> http://localhost:3001/userwebsite/deletewebsite         
        // {
        //     "storedToken":"",
        //     "website":""
        // }
        try {
            // נברר מי הוא המתשמש שמעוניים למחוק אתר תחת ניתור
            const decodedToken=jwt.verify(req.body.storedToken,process.env.KEY_FOR_USER_TOKEN);
            try {
                // נחפש האם יש בכלל אתר כזה בבסיס הנתונים שאפשר למחוק
                const siteToDelete = await userwebsite.findOne({
                    ClientID:decodedToken.ID,
                    CustomerWebsite:{ $elemMatch: { $eq: req.body.website }}
                });
                if(siteToDelete){ // במידה ואכן אני כבר מנתר אתר זה
                    try {
                        await userwebsite.updateOne(
                            { ClientID: decodedToken.ID },
                            { $pull: { CustomerWebsite: req.body.website } }
                        );
                        console.log("you deleted a website: ",req.body.website); // נדפיס בצד שרת
                        return res.status(200).json({Msg:"you deleted a website: " + req.body.website}); // נשלח הודעה לצד לקוח
                    } catch (error) {
                        console.log("could NOT delete at the moment server database problem: ",error); // נדפיס בצד שרת
                        return res.status(500).json({Msg:"could NOT delete at the moment server database problem:  " ,error}); // נשלח הודעה לצד לקוח
                    }
                }else{// לא קיים אתר כזה בבסיס הנתונים שאפשר למחוק           
                    console.log("you dont have this website: "+ req.body.website + " to delete from database: "); // נדפיס בצד שרת
                    return res.status(400).json({Msg:"you dont have this website: "+ req.body.website + " to delete from database"}); // נשלח הודעה לצד לקוח
                }
            } catch (error) {
                console.log("could NOT search in database at the moment to delete the website ",error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could NOT search in database at the moment to delete the website " , error}); // נשלח הודעה לצד לקוח
            }
        } catch (error) {
            console.log("could not verify user BAD token",error); // נדפיס בצד שרת
            return res.status(401).json({Msg:"could not verify user BAD token" ,error}); // נשלח הודעה לצד לקוח
        }
    },
    GetAllWebSite:async(req,res)=>{ // POST ---> http://localhost:3001/userwebsite/getallwebsite  
        // {
        //     "storedToken":""
        // }
        try {
            // נברר מי הוא המתשמש
            const decodedToken=jwt.verify(req.body.storedToken,process.env.KEY_FOR_USER_TOKEN);
            try {
                const website = await userwebsite.find({ClientID:decodedToken.ID});
                if(website.length>0){
                    const CustomerWebsit = website[0].CustomerWebsite;
                    console.log("this is all the website that you are monitor: ",CustomerWebsit); // נדפיס בצד שרת
                    return res.status(200).json({Msg:"this is all the website that you are monitor: " ,CustomerWebsit}); // נשלח הודעה לצד לקוח
                }else{
                    console.log("this user does not have any website to monitor: ",decodedToken); // נדפיס בצד שרת
                    return res.status(404).json({Msg:"this user does not have any website to monitor: " ,decodedToken}); // נשלח הודעה לצד לקוח
                }
            } catch (error) {
                console.log("could not search in database ",error); // נדפיס בצד שרת
                return res.status(500).json({Msg:"could not search in database " ,error}); // נשלח הודעה לצד לקוח
            }
        } catch (error) {
            console.log("could not verify user BAD token",error); // נדפיס בצד שרת
            return res.status(401).json({Msg:"could not verify user BAD token" ,error}); // נשלח הודעה לצד לקוח
        }
    }
}