const { 
    ApplicationCommandOptionType, 
    ChannelType, 
    PermissionFlagsBits 
} = require("discord.js");

const Channel = require("../../database/schemas/Channel");

module.exports = {
    name: "config",
    description: "Configuration",
    // devOnly: boolean,
    // testOnly: boolean,
    deleted: true,
    options: [
        {
            name: "channel",
            description: "Channel that get notifications",
            type: ApplicationCommandOptionType.Channel,
            ChannelType: ChannelType.GuildText,
            required: true
        },
        {
            name: "role_mention",
            description: "Role to mention in the channel",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "description",
            description: "Isi pesan (ex. lagi live nih! yuk nonton!)",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    permissionRequired: PermissionFlagsBits.ManageChannels,
    botPermissions: PermissionFlagsBits.Administrator,
    
    execute: async (client, interaction) => {
        try {
            const Ch = interaction.options.getChannel("channel");
        const role = interaction.options.getRole("role_mention");
        const desc = interaction.options.getString("description");

        let channel = await Channel.findOne({ channelId: Ch.id });

        if (channel) {
            const lastChannel = channel.channelId;
            const newChannel = Ch.id

            if (lastChannel === newChannel) {
                await interaction.reply("Channel already set!");
                return;
            }
        } else {
            channel = new Channel({ channelId: Ch.id });
        }
        
            channel.roleId = role.id
            channel.description = desc

        await channel.save();

        interaction.reply({ content: `> Channel: ${Ch}\n> Mention: ${role}\n> Description: ${desc}`, ephemeral: true });
        } catch (error) {
            console.log(`Ada masalah di command config:`, error);
        }
    }
}