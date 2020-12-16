const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

module.exports = {
	name: 'para',
	label: 'Paralysie',
	description: 'Permet de savoir si votre Pokémon est paralysé.',
	args: 1,
	usage: '[paralyze value (0 to 100)]',
	execute(message, args) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('../assets/img/trainer-logo.jpg', 'trainer-logo')
		const statusImg = new MessageAttachment('../assets/img/status-logo.jpg', 'status-logo')
		const paraImg = new MessageAttachment('../assets/img/paralyze-logo.png', 'paralyze-logo')
		const failureImg = new MessageAttachment('../assets/img/failure-logo.png', 'failure-logo')

		// TODO tester la value de paraChance
		const paraChance = parseInt(args[0])
		const isPara = hasChance(paraChance / 100)

		const embed = {
			files: [
				trainerImg, statusImg, paraImg, failureImg
			],
			color: '#ffde00',
			title: isPara ? 'Votre Pokémon est paralysé !' : 'Votre Pokémon résiste à la paralysie !',
			author: {
				name: message.author.username,
				icon_url: 'trainerImg://trainer-logo.jpg'
			},
			thumbnail: {
				url: 'statusImg://status-logo.jpg'
			},
			image: {
				url: `${isPara ? 'paraImg://paralyze-logo.png' : 'failureImg://failure-logo.png'}`
			}
		}

		return message.channel.send({ embed })
	}
}