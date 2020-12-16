const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

// TODO mettre des couleurs pour chaque args dans les messages (+ usage si possible)
// TODO : mettre en const ../assets
// TODO : faire un tableau avec le nom des images (trainer-logo.jpg etc) et boucler dessus pour créer un objet contenant les MessageAttachment
module.exports = {
	name: 'dd',
	label: 'Damage Dealer',
	description: 'Permet d\'effectuer un tour de combat Pokémon.',
	args: 7,
	usage: '[attacker lvl] [defender lvl] [attack power] [attack precision] [stab ? Y/N] [resistance (0 / 0.5 / 1 / 2 / 4 / 8)] [para ? Y/N]',
	execute(message, args) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('../assets/img/trainer-logo.jpg', 'trainer-logo')
		const ddImg = new MessageAttachment('../assets/img/dd-logo.jpg', 'dd-logo')
		const paraImg = new MessageAttachment('../assets/img/para-logo.png', 'para-logo.png')
		const missImg = new MessageAttachment('../assets/img/miss-logo.png', 'miss-logo.png')
		const hitImg = new MessageAttachment('../assets/img/hit-logo.png', 'hit-logo.png')
		const criticalImg = new MessageAttachment('../assets/img/critical-logo.png', 'critical-logo.png')

		// Utils
		const isOk = ['Y', 'O', 'y', 'o']
		const isNok = ['N', 'n']
		const normalAttackCoef = 1
		const stabbedAttackCoef = 1.5
		const resistanceSlots = [0, 0.5, 1, 2, 4, 8]
		const criticalChance = 1 / 16
		const criticalMultiplier = 1.5
		const paraChance = 25 / 100

		// Args
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

			if (!canAttack) {
				const embed = {
					files: [
						trainerImg, ddImg, paraImg
					],
					color: '#ffde00',
					title: 'Votre Pokémon est paralysé, il ne peut pas attaquer !',
					author: {
						name: message.author.username,
						icon_url: 'trainerImg://trainer-logo.jpg'
					},
					thumbnail: {
						url: 'ddImg://dd-logo.jpg'
					},
					image: {
						url: 'paraImg://para-logo.png'
					}
				}

				return message.channel.send({ embed })
			}
		}

		// Miss part
		const attackIsSuccessful = hasChance(attackPrecision / 100)

		if (!attackIsSuccessful) {
			const embed = {
				files: [
					trainerImg, ddImg, missImg
				],
				color: '#ff0000',
				title: 'Le Pokémon adverse évite l\'attaque !',
				author: {
					name: message.author.username,
					icon_url: 'trainerImg://trainer-logo.jpg'
				},
				thumbnail: {
					url: 'ddImg://dd-logo.jpg'
				},
				image: {
					url: 'missImg://miss-logo.png'
				}
			}

			return message.channel.send({ embed })
		}

		// Calculation part
		const isStabbedAttack = isOk.includes(stab)
		const stabValue = isStabbedAttack ? stabbedAttackCoef : normalAttackCoef
		const damages = Math.ceil(((attackerLvl / defenderLvl) * attackPower) * stabValue * resistance)
		const isCriticalHit = hasChance(criticalChance)
		const finalDamages = isCriticalHit ? damages * criticalMultiplier : damages

		const embed = {
			files: [
				trainerImg, ddImg, hitImg, criticalImg
			],
			color: '#00ff00',
			title: 'Votre Pokémon vient de lancer une attaque !',
			author: {
				name: message.author.username,
				icon_url: 'trainerImg://trainer-logo.jpg'
			},
			description: `${isCriticalHit ? 'Coup critique ! ' : ''}Votre Pokémon inflige **${finalDamages} point${finalDamages > 1 ? 's' : ''} de dégât${finalDamages > 1 ? 's' : ''}** à l'ennemi.\n\n*(Pensez à déduire ce montant de sa barre de points de vie)*`,
			thumbnail: {
				url: 'ddImg://dd-logo.jpg'
			},
			image: {
				url: `${isCriticalHit ? 'criticalImg://critical-logo.png' : 'hitImg://hit-logo.png'}`
			}
		}

		return message.channel.send({ embed })
	}
}