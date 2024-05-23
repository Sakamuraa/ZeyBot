const { ActivityType } = require("discord.js");
const mongoose = require('mongoose');

module.exports = async (client) => {
    console.log(`Terhubung ke Discord dan bot ${client.user.tag}!`);
    client.user.setPresence({ 
        activities: [{ name: "Zeya | /ping", type: ActivityType.Watching }],
        status: "idle"
    });
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_CONNECTION);
        console.log('Terhubung ke MongoDB.');

    } catch (error) {
        console.log(`Terjadi kesalahan: ${error}`);
    }
};