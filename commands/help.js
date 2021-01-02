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
			data.push('Voici la liste des commandes disponibles :')
			data.push(commands.map(command => command.name).join(', '))
			data.push(`\nVous pouvez envoyer \`${prefix}${this.name} [command name]\` afin d'afficher plus d'informations à propos d'une commande en particulier !`)

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return
					message.reply('Je viens de vous envoyer un MP listant les commandes disponibles !')
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
					message.reply('Il semble que je ne peux pas vous envoyer de MP ! Sont-ils désactivés ?')
				})
		}

		const name = args[0].toLowerCase()
		const command = commands.get(name)

		if (!command) {
			return message.reply('Ce n\'est pas une commande valide !')
		}

		data.push(`**Nom : ** ${command.label}`)

		if (command.description) data.push(`**Description : ** ${command.description}`)
		if (command.usage) data.push(`**Utilisation : ** ${prefix}${command.name} ${command.usage}`)

		message.channel.send(data, { split: true })
	}
}