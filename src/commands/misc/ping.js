const { 
    ApplicationCommandOptionType,
    ChannelType,
    PermissionFlagsBits, 
    EmbedBuilder 
} = require("discord.js");

module.exports = {
    name: "ping",
    description: "Check bot ping!",
    // devOnly: boolean,
    // testOnly: boolean,
    // options: Object[],
    // deleted: boolean,
    botPermissions: PermissionFlagsBits.SendMessages,
    
    execute: async (client, interaction) => {
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const mbud = new EmbedBuilder()
            .setTitle("Pong!")
            .setDescription(`Ping: ${ping}ms\nAPI: ${client.ws.ping}ms`)
            .setColor("#77b4e9");
        interaction.editReply({ embeds: [mbud] });
    }
}