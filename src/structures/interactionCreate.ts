console.info('Loading interactionCreate.ts');
import { Interaction, client } from '../client';
import { defaultError } from '../structures/error';

client.on('interactionCreate', async (interaction: Interaction) => {

    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: defaultError, ephemeral: true });
    }

});
