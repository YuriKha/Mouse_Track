const puppeteer = require('puppeteer');

module.exports={   
    // פונקציה לצילום מסך של אתר  ------ http://localhost:3001/screenshot/takescreenshot
    // {
    //     "website":""
    // }
    TakeScreenshot:async (req, res) => {
        const website = req.body.website;
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
    
            // Set a larger viewport width and height
            await page.setViewport({ width: 1920, height: 1080 });
    
            // Navigate to the URL you want to capture
            await page.goto(website);
            //https://www.ynet.co.il/
            //https://share-vacation.web.app/
            //https://ksp.co.il/
            // Capture a screenshot of the entire page
            const screenshotBuffer = await page.screenshot({ fullPage: true });
    
            await browser.close();
    
            // Send the full-page screenshot as a response
            res.setHeader('Content-Type', 'image/png');
            res.send(screenshotBuffer);
        } catch (error) {
            console.error('Error capturing screenshot:', error);
            res.status(500).send('Error capturing screenshot');
        }
    }
}