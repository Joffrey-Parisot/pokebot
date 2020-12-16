const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

module.exports = {
	name: 'cap',
	label: 'Capture',
	description: 'Permet de capturer un Pokémon',
	args: 1,
	usage: '[pokéball (50%) / superball (55%) / hyperball (60%)] [bonus de capture (0% / 5% / 10% / 15%)]',
	execute(message, args) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const catchImg = new MessageAttachment('./assets/img/catch-logo.jpg', 'catch-logo.jpg')
		const catchGif = new MessageAttachment('./assets/img/catch.gif', 'catch.gif')
		const failedCatchGif = new MessageAttachment('./assets/img/failed-catch-01.gif', 'failed-catch-01.gif')

		// Utils
		const ballTypes = { 'pokéball': 50, 'pokeball': 50, 'superball': 55, 'hyperball': 60 }
		const bonusCoeff = [0, 5, 10, 15]

		// Args
		const ball = args[0]
		const bonus = args[1] === undefined ? 0 : parseInt(args[1])

		// Errors part
		let reply = `${message.author.username}, `

		if (!Object.keys(ballTypes).includes(ball)) {
			reply += 'le type de ball est inconnu. Veuillez réessayer avec pokéball / superball / hyperball et relancer la commande.'
			return message.channel.send(reply)
		}

		if (isNaN(bonus) || !bonusCoeff.includes(bonus)) {
			reply += 'le bonus de capture doit être de 0 / 5 / 10 / 15 %, veuillez le corriger et relancer la commande.'
			return message.channel.send(reply)
		}

		const ballCoeff = ballTypes[ball]
		const hasCatch = hasChance((ballCoeff + bonus) / 100)
		const files = hasCatch ? [
			trainerImg, catchImg, catchGif
		] : [
			trainerImg, catchImg, failedCatchGif
		]

		const embed = {
			files,
			color: '#8a25bf',
			title: hasCatch ? 'Félicitations, le Pokémon sauvage a été capturé !' : 'Raté ! Vous y étiez presque !',
			author: {
				name: message.author.username,
				icon_url: 'attachment://trainer-logo.jpg'
			},
			description: hasCatch ? '*(Pensez à vous procurer un certificat pour authentifier votre nouveau Pokémon)*' : '',
			thumbnail: {
				url: 'attachment://catch-logo.jpg'
			},
			image: {
				url: `${hasCatch ? 'attachment://catch.gif' : 'attachment://failed-catch-01.gif'}`
			}
		}

		return message.channel.send({ embed })
	}
}