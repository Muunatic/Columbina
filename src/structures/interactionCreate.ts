console.info('Loading interactionCreate.ts');
import { client, Interaction } from '../client';
import { DefaultError } from '../structures/error';

client.on('interactionCreate', async (interaction: Interaction) => {

    if (!interaction.isCommand()) return;
    if (!interaction.guild) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: DefaultError, ephemeral: true });
    }

});
