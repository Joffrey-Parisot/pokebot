const hasChance = require('../helpers/probability')

module.exports = {
	name: 'dd',
	label: 'Damage dealer',
	description: 'Command to launch a damage dealer',
	args: 7,
	usage: '[attacker lvl] [defender lvl] [attack power] [attack precision] [stab ? Y/N] [resistance (0 / 0.5 / 1 / 2 / 4 / 8)] [para ? Y/N]',
	execute(message, args) {
		// TODO mettre des couleurs pour chaque args dans les messages (+ usage si possible)
		// TODO : changer le domaine des images
		// TODO : faire une conf json pour chaque stats ? Comme ça, il suffit de faire une boucle pour les erreurs
		console.log(args)

		const isOk = ['Y', 'O', 'y', 'o']
		const isNok = ['N', 'n']
		const normalAttackCoef = 1
		const stabbedAttackCoef = 1.5
		const resistanceSlots = [0, 0.5, 1, 2, 4, 8]
		const criticalChance = 1 / 16
		const criticalMultiplier = 1.5
		const paraChance = 25 / 100

		const attackerLvl = parseInt(args[0])
		const defenderLvl = parseInt(args[1])
		const attackPower = parseInt(args[2])
		const attackPrecision = parseInt(args[3])
		const stab = args[4]
		const resistance = parseInt(args[5])
		const para = args[6]

		// Errors part
		let reply = `${message.author.username}, `

		if (isNaN(attackerLvl) || attackerLvl < 1 || attackerLvl > 100) {
			reply += 'the attacker level must be between 1 and 100, please correct your value.'
			return message.channel.send(reply)
		}

		if (isNaN(defenderLvl) || defenderLvl < 1 || attackerLvl > 100) {
			reply += 'the defender level must be between 1 and 100, please correct your value.'
			return message.channel.send(reply)
		}

		if (isNaN(attackPower) || attackPower < 0 || attackPower > 250) {
			reply += 'the attack power must be between 0 and 250, please correct your value.'
			return message.channel.send(reply)
		}

		if (isNaN(attackPrecision) || attackPrecision < 33 || attackPrecision > 100) {
			reply += 'the attack precision must be between 33 and 100, please correct your value.'
			return message.channel.send(reply)
		}

		if (!isOk.includes(stab) && !isNok.includes(stab)) {
			reply += 'the stab must be Y/N (or y/n, or O/N, or o/n), please correct your value.'
			return message.channel.send(reply)
		}

		if (isNaN(resistance) || !resistanceSlots.includes(resistance)) {
			reply += `the resistance must be between ${resistanceSlots[0]} and ${resistanceSlots.slice(-1).pop()}, please correct your value.`
			return message.channel.send(reply)
		}

		if (!isOk.includes(para) && !isNok.includes(para)) {
			reply += 'the para must be Y/N (or y/n, or O/N, or o/n), please correct your value.'
			return message.channel.send(reply)
		}

		// Paralyze part
		const isPara = isOk.includes(para)

		if (isPara) {
			const canAttack = hasChance(paraChance)

			// TODO remplacer les images par les bonnes
			if (!canAttack) {
				const embed = {
					color: '#ffde00',
					title: 'Votre Pokémon est paralysé, il ne peut pas attaquer !',
					author: {
						name: message.author.username,
						icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
					},
					thumbnail: {
						url: 'https://media.discordapp.net/attachments/784858926478131240/785233935939665940/PKM_UNLIMITED_Bot_Logo-01.jpg'
					},
					image: {
						url: 'https://cdn.discordapp.com/attachments/785239103712919562/785257783464296452/PKM_UNLIMITED_Bot_Logo-04.png'
					}
				}

				return message.channel.send({ embed })
			}
		}

		// Miss part
		const attackIsSuccessful = hasChance(attackPrecision / 100)

		// TODO remplacer les images par les bonnes
		if (!attackIsSuccessful) {
			const embed = {
				color: '#ff0000',
				title: 'Le Pokémon adverse évite l\'attaque !',
				author: {
					name: message.author.username,
					icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
				},
				thumbnail: {
					url: 'https://media.discordapp.net/attachments/784858926478131240/785233935939665940/PKM_UNLIMITED_Bot_Logo-01.jpg'
				},
				image: {
					url: 'https://cdn.discordapp.com/attachments/785239103712919562/785257783464296452/PKM_UNLIMITED_Bot_Logo-04.png'
				}
			}

			return message.channel.send({ embed })
		}

		// Calculation part
		const isStabbedAttack = isOk.includes(stab)
		const stabValue = isStabbedAttack ? stabbedAttackCoef : normalAttackCoef

		const isCriticalHit = hasChance(criticalChance)

		const damages = Math.ceil(((attackerLvl / defenderLvl) * attackPower) * stabValue * resistance)
		const finalDamages = isCriticalHit ? damages * criticalMultiplier : damages


		// TODO coup critique
		const embed = {
			color: '#00ff00',
			title: 'Votre Pokémon vient de lancer une attaque !',
			author: {
				name: message.author.username,
				icon_url: 'https://media.discordapp.net/attachments/785239103712919562/785242965613346816/PKM_UNLIMITED_Bot_Logo-icon.jpg'
			},
			description: `Votre Pokémon inflige **${finalDamages} point${finalDamages > 1 ? 's' : ''} de dégât${finalDamages > 1 ? 's' : ''}** à l'ennemi.\n\n*(Pensez à déduire ce montant de sa barre de points de vie)*`,
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