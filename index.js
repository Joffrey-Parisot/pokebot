const fs = require('fs')
const Discord = require('discord.js')
const prefix = process.env.PREFIX

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command)
}

client.once('ready', () => {
	console.log('Ready!')
})

client.on('message', message => {
	// TODO : i18n
	// TODO : revoir le nommage name vs label ? + le nom des fichiers

	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	if (!client.commands.has(commandName)) return

	const command = client.commands.get(commandName)

	if (command.args && args.length !== command.args) {
		let reply = `${message.author}, `

		if (!args.length) {
			reply += 'vous n\'avez pas renseigné les paramètres !'
		}
		else if (args.length < command.args) {
			reply += 'vous n\'avez pas renseigné assez de paramètres !'
		}
		else if (args.length > command.args) {
			reply += 'vous avez renseigné trop de paramètres !'
		}

		if (command.usage) {
			reply += `\nLa bonne utilisation est la suivante : \`${prefix}${command.name} ${command.usage}\``
		}

		return message.channel.send(reply)
	}

	try {
		command.execute(message, args)
	}
	catch (error) {
		console.error(error)
		message.reply('Il y a eu une erreur lors de l\'exécution de votre commande, veuillez réessayer.')
	}
})

client.login(process.env.BOT_TOKEN)
