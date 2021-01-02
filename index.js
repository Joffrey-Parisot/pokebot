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

	const userArgs = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = userArgs.shift().toLowerCase()

	if (!client.commands.has(commandName)) return

	const command = client.commands.get(commandName)

	if (command.args) {
		let hasError = true
		let reply = ''

		if (!userArgs.length) {
			reply += 'vous n\'avez pas renseigné les paramètres !'
		}
		else if (userArgs.length < command.args) {
			reply += 'vous n\'avez pas renseigné assez de paramètres !'
		}
		else if (!command.optionalArgs && userArgs.length > command.args || command.optionalArgs && userArgs.length > command.optionalArgs) {
			reply += 'vous avez renseigné trop de paramètres !'
		}
		else {
			hasError = false
		}

		if (hasError) {
			if (command.usage) {
				reply += `\nLa bonne utilisation est la suivante : \`${prefix}${command.name} ${command.usage}\``
			}

			return message.channel.send(`${message.author}, ` + reply)
		}
	}

	try {
		command.execute(message, userArgs)
	}
	catch (error) {
		console.error(error)
		message.reply('Il y a eu une erreur lors de l\'exécution de votre commande, veuillez réessayer.')
	}
})

client.login(process.env.BOT_TOKEN)
