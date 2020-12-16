const { MessageAttachment } = require('discord.js')

module.exports = {
	name: 'dodo',
	label: 'Dodo',
	description: 'Permet de savoir si votre Pokémon s\'endors.',
	usage: ' ',
	execute(message) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('../assets/img/trainer-logo.jpg', 'trainer-logo')
		const statusImg = new MessageAttachment('../assets/img/status-logo.jpg', 'status-logo')
		const sleepImg = new MessageAttachment('../assets/img/sleep-logo.png', 'sleep-logo')

		const sleepingTurns = Math.floor(Math.random() * 3) + 1

		const embed = {
			files: [
				trainerImg, statusImg, sleepImg
			],
			color: '#03d8dd',
			title: 'Votre Pokémon s\'endors !',
			author: {
				name: message.author.username,
				icon_url: 'trainerImg://trainer-logo.jpg'
			},
			description: `Sa phase de sommeil durera **${sleepingTurns} tour${sleepingTurns > 1 ? 's' : ''}**.`,
			thumbnail: {
				url: 'statusImg://status-logo.jpg'
			},
			image: {
				url: 'sleepImg://sleep-logo.png'
			}
		}

		return message.channel.send({ embed })
	}
}