#!/usr/bin/env node
const config = require('./config');
const chalk = require("chalk");
const boxen = require("boxen");
const axios = require("axios");
const nodemailer = require('nodemailer');
const yargs = require('yargs');

const options = yargs
 .usage("Usage: -m <model> -f <from> -pw <password> -to<email> -r <refresh>")
 .option("m", { alias: "model", describe: "RTX 3000 series model number - default 3080", type: "string", demandOption: false })
 .option('f', { alias: "from", describe: "Gmail address to send email from", type: "string", demandOption: true })
 .option('p', { alias: "password", describe: "Gmail account password", type: "string", demandOption: true })
 .option('e', { alias: "email", describe: "Email address to send email to", type: "string", demandOption: true })
 .option('r', { alias: "refresh", describe: "How often in seconds do you want to check stock - default 120", type: "number", demandOption: false })
 .argv;

const model = options.model || config.model;
const refresh = options.refresh || config.refreshRate;

const greeting = chalk.white.bold("Nvidia RTX 3000 series FE stock checker UK");

const boxenOptions = {
 padding: 1,
 margin: 1,
 borderStyle: "round",
 borderColor: "green",
 backgroundColor: "#222222"
};
const msgBox = boxen( greeting, boxenOptions );

let emailedLastCheck = false;

console.log(msgBox);

console.log("Let's check some stock:");

const interval = 1000 * refresh;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: options.from,
      pass: options.password
    }
});

const check = () => {
    const ts = Date.now();
    const time = new Date(ts);
    const url = `https://api.nvidia.partners/edge/product/search?page=1&limit=9&locale=en-gb&category=GPU&gpu=RTX%20${model}&ts=${time.getTime()}`;
        
    axios.get(url, { headers: { 
            Accept: "application/json",
            'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 0 
    }})
    .then(res => {
        if(res.data) {
            const name = res.data.searchedProducts.featuredProduct.displayName;
            let buyLink;
            if(res.data.searchedProducts.featuredProduct.retailers && res.data.searchedProducts.featuredProduct.retailers.length > 0){
                buyLink = res.data.searchedProducts.featuredProduct.retailers[0].purchaseLink || '';
            }
            
            if(res.data.searchedProducts.featuredProduct.prdStatus !== 'out_of_stock' && buyLink) {
                console.log(`${time} - ${chalk.green(`${name} IN STOCK!!!!!!`)}`);
                //Send Email
                if(!emailedLastCheck) {
                    const mailOptions = {
                        headers: {
                            priority: 'high'
                        },
                        from: options.from,
                        to: options.email,
                        subject: `${name} is in stock!`,
                        text: `${name} is available ${buyLink}` 
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                    });

                    emailedLastCheck = true;
                }

            } else {
                console.log(`${time} - ${chalk.red(`${name} is not in stock`)}`);
                emailedLastCheck = false;
            }
        }
    })
    .catch(err => {
        console.log(chalk.red(err));
    });
}

check();

setInterval(() => {
    check();
}, interval);