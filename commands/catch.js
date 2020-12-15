const hasChance = require('../helpers/probability')

module.exports = {
	name: 'cap',
	label: 'Catch',
	description: 'Command to launch a Ball',
	args: 1,
	usage: '[ball type (50 / 55 / 60)] [bonus (5 / 10 / 15)]',
	execute(message, args) {
		// BONUS peut être null

		// TODO faire les tests des values
		const ballType = parseInt(args[0])
		const bonus = parseInt(args[1])


		const hasCatch = hasChance((ballType + bonus) / 100)

		// TODO : changer le domaine des images + remplacer les images par les bonnes
		const embed = {
			color: '#8a25bf',
			title: hasCatch ? 'Félicitations, le Pokémon sauvage a été capturé !' : 'Raté ! Vous y étiez presque !',
			author: {
				name: message.author.username,
				icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
			},
			description: hasCatch ? '*(Pensez à vous procurer un certificat pour authentifier votre nouveau Pokémon)*' : '',
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