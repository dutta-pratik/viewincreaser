const puppetteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports.homePage = async function(req, res){
    try{
        return res.render("homepage");
    }catch(err){
        console.log("Error in Homepage : ", err);
    }
}

module.exports.start = async function(req, res){
    try{
        console.log("start");
        let URL = req.body.url;

        let numOfVisits=13;
        
        let isBrowserOpen = false;
        let browser;
        const OpenPage = async () => {
            try{
                console.log(numOfVisits, URL);
                if(!isBrowserOpen){
                    browser = await puppetteer.launch({
                        args: [
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                        ],
                        headless: false
                    });
                    isBrowserOpen = true;
                    console.log("---------------browser Connected------------");
                }
            
                const page = (await browser).newPage();
                
                (await page).goto(URL, {
                    waitUntil: 'networkidle2',
                    timeout: 3000000
                });
        
                numOfVisits--;
                // (await page).close();
                if(numOfVisits <= 0){
                    clearInterval(x);
                    
                    await closeBrowser();
                    console.log("Process Completed");
                    return res.render("complete");
                }
            }catch(err){
                console.log("Error in OpenPage : ", err);
                return res.render("homepage");
            }
        }
        var x = setInterval(OpenPage, 5000);
        const closeBrowser = () => {
            browser.close();
            console.log("-----------browser disconnected------------");
        }

    }catch(err){
        console.log("Error in Start : ", err);
        return res.render("homepage");
    }
}