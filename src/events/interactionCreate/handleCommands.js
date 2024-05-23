const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../Utils/getLocalCommands");


module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const command = localCommands.find((cmd) => cmd.name === interaction.commandName);

        if (!command) return;

        if (command.devOnly) {
            if (!devs.includes(interaction.user.id)) {
                interaction.reply({ 
                    content: "Hanya developer yang bisa menggunakan command ini", 
                    ephemeral: true 
                });
                return;
            }
        }

        if (command.testOnly) {
            if (!devs.includes(interaction.guild.id === testServer)) {
                interaction.reply({ 
                    content: "Command ini hanya bisa digunakan di test server", 
                    ephemeral: true 
                });
                return;
            }
        }

        if (command.permissionsRequired?.length) {
            for (const permission of command.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({ 
                        content: "Anda tidak mempunyai izin untuk menggunakan command ini", 
                        ephemeral: true 
                    });
                    return;
                }
            }
        }

        if (command.botPermissions?.length) {
            for (const permission of command.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    interaction.reply({ 
                        content: "Bot tidak mempunyai izin untuk menggunakan command ini", 
                        ephemeral: true 
                    });
                    return;
                }
            }
        }

        await command.execute(client, interaction);
    } catch (error) {
        console.log(`Ada masalah saat mengeksekusi command ${interaction.commandName}`, error);
    }
};