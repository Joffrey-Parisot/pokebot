const { MessageAttachment } = require('discord.js')

module.exports = {
	name: 'train',
	label: 'Entraînement',
	description: 'Permet d\'entraîner votre Pokémon.',
	cooldown: 3600,
	execute(message) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const statusImg = new MessageAttachment('./assets/img/status-logo.jpg', 'status-logo.jpg')
		const randomTrainPath = Math.floor(Math.random() * 2) + 1 === 1 ? 'train-01.gif' : 'train-02.gif'
		const trainImg = new MessageAttachment(`./assets/img/${randomTrainPath}`, randomTrainPath)

		const embed = {
			files: [
				trainerImg, statusImg, trainImg
			],
			color: '#03d8dd',
			title: 'Votre Pokémon s\'entraîne !',
			author: {
				name: message.member.displayName,
				icon_url: 'attachment://trainer-logo.jpg'
			},
			description: 'Son entraînement durera **1h**.',
			thumbnail: {
				url: 'attachment://status-logo.jpg'
			},
			image: {
				url: `attachment://${randomTrainPath}`
			}
		}

		return message.channel.send({ embed })
	}
}