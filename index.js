const fs = require('fs')
const Discord = require('discord.js')
const prefix = process.env.PREFIX

const client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()

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

	// Errors part
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

	// Cooldown part
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 1) * 1000

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(`merci d'attendre encore **${timeLeft.toFixed(1)} secondes** avant de pouvoir réutiliser la commande \`${command.name}\`.`)
		}
	}

	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

	// Exec part
	try {
		command.execute(message, userArgs)
	}
	catch (error) {
		console.error(error)
		message.reply('Il y a eu une erreur lors de l\'exécution de votre commande, veuillez réessayer.')
	}
})

client.login(process.env.BOT_TOKEN)
