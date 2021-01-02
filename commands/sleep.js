const { MessageAttachment } = require('discord.js')

module.exports = {
	name: 'dodo',
	label: 'Dodo',
	description: 'Permet de savoir si votre Pokémon s\'endors.',
	usage: ' ',
	execute(message) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const statusImg = new MessageAttachment('./assets/img/status-logo.jpg', 'status-logo.jpg')
		const sleepImg = new MessageAttachment('./assets/img/sleep-logo.png', 'sleep-logo.png')

		const sleepingTurns = Math.floor(Math.random() * 3) + 1

		const embed = {
			files: [
				trainerImg, statusImg, sleepImg
			],
			color: '#03d8dd',
			title: 'Votre Pokémon s\'endors !',
			author: {
				name: message.member.displayName,
				icon_url: 'attachment://trainer-logo.jpg'
			},
			description: `Sa phase de sommeil durera **${sleepingTurns} tour${sleepingTurns > 1 ? 's' : ''}**.`,
			thumbnail: {
				url: 'attachment://status-logo.jpg'
			},
			image: {
				url: 'attachment://sleep-logo.png'
			}
		}

		return message.channel.send({ embed })
	}
}