const hasChance = require('../helpers/probability')

module.exports = {
	name: 'para',
	label: 'Paralyze',
	description: 'Command to launch a paralyze roll',
	args: 1,
	usage: '[paralyze value (0 to 100)]',
	execute(message, args) {
		// TODO tester la value de paraChance
		const paraChance = parseInt(args[0])
		const isPara = hasChance(paraChance / 100)

		// TODO : changer le domaine des images + remplacer les images par les bonnes
		const embed = {
			color: '#ffde00',
			title: isPara ? 'Votre Pokémon est paralysé !' : 'Votre Pokémon résiste à la paralysie !',
			author: {
				name: message.author.username,
				icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
			},
			thumbnail: {
				url: 'https://media.discordapp.net/attachments/784858926478131240/785233935939665940/PKM_UNLIMITED_Bot_Logo-01.jpg'
			},
			image: {
				url: 'https://media.discordapp.net/attachments/785239103712919562/785257789400154172/PKM_UNLIMITED_Bot_Logo-03.png'
			}
		}

		return message.channel.send({ embed })
	}
}