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
	// TODO revoir le nommage name vs label ? + le nom des fichiers
	// TODO mettre des gifs aléatoires

	console.log(message.content)

	if (!message.content.startsWith(prefix) || message.author.bot) return

	const args = message.content.slice(prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()

	if (!client.commands.has(commandName)) return

	const command = client.commands.get(commandName)

	if (command.args && args.length !== command.args) {
		let reply = `${message.author}, `

		if (!args.length) {
			reply += 'you didn\'t provide any arguments !'
		}
		else if (args.length < command.args) {
			reply += 'you didn\'t give enough arguments !'
		}
		else if (args.length > command.args) {
			reply += 'you gave too many arguments !'
		}

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
		}

		return message.channel.send(reply)
	}

	try {
		command.execute(message, args)
	}
	catch (error) {
		console.error(error)
		message.reply('There was an error trying to execute that command enculé !')
	}
})

client.login(process.env.BOT_TOKEN)
