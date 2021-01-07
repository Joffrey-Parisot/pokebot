const { MessageAttachment } = require('discord.js')

module.exports = {
	name: 'train',
	label: 'Entraînement',
	description: 'Permet d\'entraîner votre Pokémon.',
	cooldown: 3600,
	execute(message) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const trainingImg = new MessageAttachment('./assets/img/training-logo.jpg', 'training-logo.jpg')
		const randomTrainGifPath = Math.floor(Math.random() * 2) + 1 === 1 ? 'train-01.gif' : 'train-02.gif'
		const trainGif = new MessageAttachment(`./assets/img/${randomTrainGifPath}`, randomTrainGifPath)

		const embed = {
			files: [
				trainerImg, trainingImg, trainGif
			],
			color: '#03d8dd',
			title: 'Vos Pokémon s\'entraînent !',
			author: {
				name: message.member.displayName,
				icon_url: 'attachment://training-logo.jpg'
			},
			description: 'Leur entraînement durera **1h00**.',
			thumbnail: {
				url: 'attachment://status-logo.jpg'
			},
			image: {
				url: `attachment://${randomTrainGifPath}`
			}
		}

		return message.channel.send({ embed })
	}
}