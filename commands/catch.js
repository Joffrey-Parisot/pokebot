const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

module.exports = {
	name: 'cap',
	label: 'Capture',
	description: 'Permet de capturer un Pokémon',
	args: 1,
	usage: '[ball type (50 / 55 / 60)] [bonus (5 / 10 / 15)]',
	execute(message, args) {
		// ATTENTION BONUS peut être null (d'où le 1 args)

		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const catchImg = new MessageAttachment('./assets/img/catch-logo.jpg', 'catch-logo.jpg')
		const catchGif = new MessageAttachment('./assets/img/catch.gif', 'catch.gif')
		const failedCatchGif = new MessageAttachment('./assets/img/failed-catch-01.gif', 'failed-catch-01.gif')

		// TODO faire les tests des values
		const ballType = parseInt(args[0])
		const bonus = parseInt(args[1])

		const hasCatch = hasChance((ballType + bonus) / 100)

		const embed = {
			files: [
				trainerImg, catchImg, catchGif, failedCatchGif
			],
			color: '#8a25bf',
			title: hasCatch ? 'Félicitations, le Pokémon sauvage a été capturé !' : 'Raté ! Vous y étiez presque !',
			author: {
				name: message.author.username,
				icon_url: 'trainerImg://trainer-logo.jpg'
			},
			description: hasCatch ? '*(Pensez à vous procurer un certificat pour authentifier votre nouveau Pokémon)*' : '',
			thumbnail: {
				url: 'catchImg://catch-logo.jpg'
			},
			image: {
				url: `${hasCatch ? 'catchGif://catch.gif' : 'failedCatchGif://failed-catch-01.gif'}`
			}
		}

		return message.channel.send({ embed })
	}
}