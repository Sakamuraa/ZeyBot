const {
    ActivityType,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    WebhookClient,
    ApplicationCommandType,
    EmbedBuilder
  } = require("discord.js");
const fetch = require("node-fetch");
const express = require('express');
const e = require("express");
const app = express();
const port = process.env.PORT || 3000;
const herokuApp = process.env.HEROKU_APP || null;
const youtubeFetchTimeout = 1200000;
const mongoose = require("mongoose");
require('dotenv').config();

//EVENTHANDLER
const eventHandler = require('./src/handlers/eventHandler.js');
//


const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video';
const discordApiKey = process.env.DISCORD_API_KEY;
const discordApiUrl = `https://discordapp.com/api/webhooks/${discordApiKey}`;
const discordChannelId = process.env.DISCORD_CHANNEL_ID || null;

const youtubeChannels = [
/*  {
        channelId: 'UCjWk_VRIThkP0fc0A32W2pA',
        channelUrl: 'https://www.youtube.com/channel/UCjWk_VRIThkP0fc0A32W2pA'
    },
    {
        channelId: 'UCqSqR9Jvs3vg7ca40AXQVlA',
        channelUrl: 'https://www.youtube.com/channel/UCqSqR9Jvs3vg7ca40AXQVlA'
    }, 
    {
        Name: 'Aqua',
        channelId: 'UC1opHUrw8rvnsadT-iGp7Cg', // Bijou
        channelUrl: 'https://www.youtube.com/channel/UC1opHUrw8rvnsadT-iGp7Cg'
    }, */
    {
        Name: 'Zeyayaya',
        channelId: 'UCdggLAiNWb1p0IUv1qe5CTA', // zeya
        channelUrl: 'https://www.youtube.com/channel/UCdggLAiNWb1p0IUv1qe5CTA'
    }
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.User, Partials.Message, Partials.Reaction],
      allowedMentions: {
        parse: ['users', 'roles'],
      },
      restRequestTimeout: 10000,
});

client.login(process.env.BOT_TOKEN)

client.on('ready', () => {
    handleUploads();
})

eventHandler(client);
//TRIGGER EVENTHANDLER
/* (async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_CONNECTION);
        console.log('Terhubung ke MongoDB.');

        eventHandler(client);
    } catch (error) {
        console.log(`Terjadi kesalahan: ${error}`);
    }
})(); */
//

let activeLiveStreams = new Set();

async function fetchLiveStreamStatus() {
    try {
        // for(const youtubeChannel of youtubeChannels) {
            const youtubeChannel = youtubeChannels[0];
            console.log('Memproses channel ', JSON.stringify(youtubeChannel));
            // https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&channelId=UC54JqsuIbMw_d1Ieb4hjKoQ&key=AIzaSyAAP2793O2XL_L-_WELeGVZyGZS5o7484s
            const url = `${youtubeApiUrl}&channelId=${youtubeChannel.channelId}&key=${youtubeApiKey}`;
            const response = await fetch(url);
            const myJson = await response.json();
            
            // console.log('YouTube Response', JSON.stringify(myJson));
            if(myJson && myJson.pageInfo && myJson.pageInfo.totalResults > 0) {
                console.log('Menemukan aktif stream pada channel: ', youtubeChannel.Name);
                myJson.items.forEach(element => {
                    if(!activeLiveStreams.has(element.id.videoId)) {
                        // console.log(element);
                        activeLiveStreams.add(element.id.videoId);

                        if (element.snippet.description === "") {
                            element.snippet.description = "Tidak ada deskripsi";
                        }

                        let channelDC = client.channels.cache.get(discordChannelId);

                        const embud = new EmbedBuilder()
                            .setAuthor({ 
                                name: `${element.snippet.channelTitle} lagi live!`,
                                iconURL: 'https://yt3.googleusercontent.com/m_RK-tlTnywYzMBmYzoBKObBfKZA0PRD8-tNJn77sHJUalY_0vn0OIyleotjcgVXnqktb9QJ=s160-c-k-c0x00ffffff-no-rj',
                                url: `${youtubeChannel.channelUrl}`
                            })
                            .setImage(`https://i.ytimg.com/vi/${element.id.videoId}/maxresdefault_live.jpg`)
                            .setURL(`https://www.youtube.com/watch?v=${element.id.videoId}`)
                            .setThumbnail('https://yt3.googleusercontent.com/m_RK-tlTnywYzMBmYzoBKObBfKZA0PRD8-tNJn77sHJUalY_0vn0OIyleotjcgVXnqktb9QJ=s160-c-k-c0x00ffffff-no-rj')
                            .setTitle(element.snippet.title)
                            .addFields({ name: 'Deskripsi', value: element.snippet.description, inline: true })
                            .setFooter({ 
                                text: `Youtube Live`,
                                iconURL: 'https://pngfre.com/wp-content/uploads/You-Tube-14.png'
                            })
                            .setColor('#f21818')
                            .setTimestamp(new Date());
                            
                        /* const discordObj = {
                            username: 'Dumpster LIVE',
                            avatar_url: 'https://yt3.ggpht.com/a/AGF-l7__zvPRgglwpeA85-NPjkxRlhi46IG3wKdwKg=s288-c-k-c0xffffffff-no-rj-mo',
                            content: `Richlife is LIVE. **${element.snippet.title}**. Channel: ${youtubeChannel.channelUrl}`
                        }
                        postToDiscord(discordObj); */
                        
                        channelDC.send({ content: `<@&1240273115590819921> lagi live nih!!! Yuk nonton disini!\nhttps://www.youtube.com/watch?v=${element.id.videoId}`, embeds: [embud] });
                    } else {
                        console.log(`Sudah mengirim ${element.snippet.channelTitle} ke Discord. Mengabaikan.`);
                    }
                });
            }
        // }
    } catch (error) {
        console.error(`Terjadi kesalahan: ${error}`);
    }
}

/* async function postToDiscord(json) {
    const resp = fetch(discordApiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(json)
    }).catch(error => console.log('Discord POST failed.', JSON.stringify(json), error));

    const content = await resp.json();
    console.log('Discord response', content); 
}

async function herokuKeepAlive() {
    try {
        const response = await fetch(herokuApp);
        console.log('Heroku Keep-Alive Success')
    } catch(error) {
        console.error(error);
    }
}

app.get('/', (req, res) => res.send('Shhh! Im busy monitoring Youtube Channels.'));
app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
    setInterval(fetchLiveStreamStatus, youtubeFetchTimeout);
    if(herokuApp) {
        setInterval(herokuKeepAlive, 600000); // Heroku will sleep the app if it's not accessed, so access itself to keep-alive
    }
}) */

/* const { initializeMongoose } = require("./src/database/mongoose");
const Guild = require("./src/database/schemas/Guild");
initializeMongoose(); */

 async function handleUploads() {
    await fetchLiveStreamStatus();
    setInterval(fetchLiveStreamStatus, youtubeFetchTimeout);
} 

// EVENT