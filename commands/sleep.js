module.exports = {
	name: 'dodo',
	label: 'Sleep',
	description: 'Command to launch a sleeping roll',
	usage: ' ',
	execute(message) {
		const sleepingTurns = Math.floor(Math.random() * 3) + 1

		// TODO : changer le domaine des images + remplacer les images par les bonnes
		const embed = {
			color: '#03d8dd',
			title: 'Votre Pokémon s\'endors !',
			author: {
				name: message.author.username,
				icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
			},
			description: `Sa phase de sommeil durera **${sleepingTurns} tour${sleepingTurns > 1 ? 's' : ''}**.`,
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