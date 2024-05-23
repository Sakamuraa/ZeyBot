const { testServer } = require("../../../config.json");
const getApplicationCommands = require("../../Utils/getApplicationCommands");
const getLocalCommands = require("../../Utils/getLocalCommands");
const areCommandsDifferent = require("../../Utils/areCommandsDifferent");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

module.exports = async (client) => {
    const localCommands = getLocalCommands();

    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client);

        for (const localCommand of localCommands) {
            const {name, description, options } = localCommand;

            const commandExist = await applicationCommands.cache.find((cmd) => cmd.name === name);

            if (commandExist) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(commandExist.id);
                    console.log(`Command ${name} sudah di hapus`);
                    continue;
                }

                if (areCommandsDifferent(commandExist, localCommand)) {
                    await applicationCommands.edit(commandExist.id, {
                        description,
                        options,
                    });

                    console.log(`Command ${name} sudah diperbarui`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`Command ${name} dilewatkan karena sudah dihapus`);
                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                })

                rest.put(Routes.applicationCommands(client), { body: applicationCommands });
                console.log(`Command ${name} sudah ditambahkan`);
            }
        }
    } catch (error) {
        console.log('Ada masalah saat register command', error);
    }
};