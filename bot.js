const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config.json');

const US_url = "https://www.worldometers.info/coronavirus/";

async function USCovidCases() {
    const html = await axios.get(US_url + "country/us/");
    const $ = await cheerio.load(html.data);
    let data = [];

    $(".maincounter-number").each(function(i, elem) {
        data[i] = $(this).text();
    });

    return "U.S. COVID Cases: " + data[0].replace(/\n/g, '') + "\nU.S. COVID Deaths: " + data[1].replace(/\n/g, '');
}

async function caseByState(state) {
    const html = await axios.get(US_url + "usa/" + state + "/");
    const $ = await cheerio.load(html.data);
    let data = [];

    $(".maincounter-number").each(function(i, elem) {
        data[i] = $(this).text();
    });

    return state + "'s COVID Cases: " + data[0].replace(/\n/g, '') + "\n" + state + "'s COVID Deaths: " + data[1].replace(/\n/g, '');
}

async function topLink() {
    const html = await axios.get("https://www.reddit.com/t/coronavirus/");
    const $ = await cheerio.load(html.data);

    links = [];

    $('.SQnoC3ObvgnGjWt90zD9Z').each(function(i, elem) {
        var link = $(elem).attr('href');
        links.push("https://www.reddit.com" + link);
    });

    return links[0];
}

async function randLink() {
    const html = await axios.get("https://www.reddit.com/t/coronavirus/");
    const $ = await cheerio.load(html.data);

    links = [];

    $('.SQnoC3ObvgnGjWt90zD9Z').each(function(i, elem) {
        var link = $(elem).attr('href');
        links.push("https://www.reddit.com" + link);
    });

    var random_link = Math.floor(Math.random() * links.length);
    console.log(links.length);
    return links[random_link];
}

function getTime() {
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    return hours + minutes;
}

// commands

client.on('ready', () => {
    console.log(`bot is online`);
});

client.on("message", async message => {
    if (!message.content.startsWith(config.prefix)) return;
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "state_cases") {
        caseByState(args[0])
            .then(function(output) {
                message.channel.send(output);
            });
    } else if (command === "us_cases") {
        USCovidCases()
            .then(function(output) {
                message.channel.send(output);
            });
    } else if (command === "top_link") {
        topLink()
            .then(function(output) {
                message.channel.send(output);
            });
    } else if (command === "rand_link") {
        randLink()
            .then(function(output) {
                message.channel.send(output);
            });
    }
});

client.login(config.token);