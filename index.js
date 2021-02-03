require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');


// setup Wolfram|Alpha API
const appid = process.env.APPID;
const WolframAlphaAPI = require('./lib/WolframAlphaAPI.js');
let wraAPI = WolframAlphaAPI(appid);
const invokeKey = 'wra';

let sessionLocal = JSON.parse(process.env.WW_SESSION);
console.log(sessionLocal);

const puppeteerOptions = {
    headless: true,
    args: ["--no-sandbox"],
};

const client = new Client({
    puppeteer: puppeteerOptions,
    session: sessionLocal
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', session => {
    // Save this session object in WW_SESSION manually to reuse it next time
    console.log(JSON.stringify(session));
});
client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    console.log(message);
    // only reply if message contains invoke keyword as first word
    // example: !wra <message here>
    if (message.body.startsWith('!' + invokeKey + ' ')) {
    	// send the rest of the message to Wolfram|Alpha API
    	const actualMessage = message.body.substring(1 + invokeKey.length);
    	wraAPI.getShort(actualMessage)
    		.then(res => message.reply(res));
    }
});

client.initialize();

