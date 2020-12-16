const prefix = process.env.PREFIX

module.exports = {
	name: 'aide',
	label: 'Aide',
	description: 'Liste toutes les commandes, ou affiche les infos d\'une commande spécifique.',
	usage: '[command name]',
	execute(message, args) {
		const data = []
		const { commands } = message.client

		if (!args.length) {
			data.push('Here\'s a list of all my commands:')
			data.push(commands.map(command => command.name).join(', '))
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return
					message.reply('I\'ve sent you a DM with all my commands!')
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
					message.reply('it seems like I can\'t DM you! Do you have DMs disabled?')
				})
		}

		const name = args[0].toLowerCase()
		const command = commands.get(name)

		if (!command) {
			return message.reply('that\'s not a valid command!')
		}

		data.push(`**Name:** ${command.label}`)

		if (command.description) data.push(`**Description:** ${command.description}`)
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)

		message.channel.send(data, { split: true })
	}
}