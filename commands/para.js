const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

module.exports = {
	name: 'para',
	label: 'Paralysie',
	description: 'Permet de savoir si votre Pokémon est paralysé.',
	args: 1,
	usage: '[précision (0 à 100)]',
	execute(message, args) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const statusImg = new MessageAttachment('./assets/img/status-logo.jpg', 'status-logo.jpg')
		const paraImg = new MessageAttachment('./assets/img/paralyze-logo.png', 'paralyze-logo.png')
		const failureImg = new MessageAttachment('./assets/img/failure-logo.png', 'failure-logo.png')

		// Arg
		const paraChance = parseInt(args[0])

		// Error part
		let reply = `${message.author}, `

		if (isNaN(paraChance) || paraChance < 0 || paraChance > 100) {
			reply += 'la précision de la capacité susceptible d\'appliquer la paralysie doit être comprise entre 1 et 100, veuillez la corriger et relancer la commande.'
			return message.channel.send(reply)
		}

		const isPara = hasChance(paraChance / 100)
		const files = isPara ? [
			trainerImg, statusImg, paraImg
		] : [
			trainerImg, statusImg, failureImg
		]

		const embed = {
			files,
			color: '#ffde00',
			title: isPara ? 'Votre Pokémon est paralysé !' : 'Votre Pokémon résiste à la paralysie !',
			author: {
				name: message.member.displayName,
				icon_url: 'attachment://trainer-logo.jpg'
			},
			thumbnail: {
				url: 'attachment://status-logo.jpg'
			},
			image: {
				url: `${isPara ? 'attachment://paralyze-logo.png' : 'attachment://failure-logo.png'}`
			}
		}

		return message.channel.send({ embed })
	}
}