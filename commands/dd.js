const { MessageAttachment } = require('discord.js')
const hasChance = require('../helpers/probability')

// TODO : mettre des couleurs pour chaque args dans les messages (+ usage si possible)
// TODO : mettre en const ./assets (dans un fichier config pour le coup) --> utile pour la const de fin de message
// TODO : faire un tableau avec le nom des images (trainer-logo.jpg etc) et boucler dessus pour créer un objet contenant les MessageAttachment
module.exports = {
	name: 'dd',
	label: 'Damage Dealer',
	description: 'Permet d\'effectuer un tour de combat Pokémon.',
	args: 7,
	usage: '[lvl attaquant] [lvl défenseur] [puissance d\'attaque] [précision] [stab ? O/N (ou Y/N)] [faiblesse (0 / 0.5 / 1 / 2 / 4 / 8)] [para ? O/N (ou Y/N)]',
	execute(message, args) {
		// Imgs Attachment
		const trainerImg = new MessageAttachment('./assets/img/trainer-logo.jpg', 'trainer-logo.jpg')
		const ddImg = new MessageAttachment('./assets/img/dd-logo.jpg', 'dd-logo.jpg')
		const paraImg = new MessageAttachment('./assets/img/para-logo.png', 'para-logo.png')
		const missImg = new MessageAttachment('./assets/img/miss-logo.png', 'miss-logo.png')
		const hitImg = new MessageAttachment('./assets/img/hit-logo.png', 'hit-logo.png')
		const criticalImg = new MessageAttachment('./assets/img/critical-logo.png', 'critical-logo.png')

		// Utils
		const isOk = ['Y', 'O', 'y', 'o']
		const isNok = ['N', 'n']
		const normalAttackCoef = 1
		const stabbedAttackCoef = 1.5
		const resistanceSlots = [0, 0.5, 1, 2, 4, 8]
		const criticalChance = 1 / 16
		const criticalMultiplier = 1.5
		const paraChance = 75 / 100

		// Args
		const attackerLvl = parseInt(args[0])
		const defenderLvl = parseInt(args[1])
		const attackPower = parseInt(args[2])
		const attackPrecision = parseInt(args[3])
		const stab = args[4]
		const resistance = parseFloat(args[5].replace(',', '.'))
		const para = args[6]

		// Errors part
		const endMessage = 'Veuillez corriger et relancer la commande.'
		let reply = `${message.author}, `

		if (isNaN(attackerLvl) || attackerLvl < 1 || attackerLvl > 100) {
			reply += `le lvl de l'attaquant doit être compris entre 1 et 100. ${endMessage}`
			return message.channel.send(reply)
		}

		if (isNaN(defenderLvl) || defenderLvl < 1 || attackerLvl > 100) {
			reply += `le lvl du défenseur doit être compris entre 1 et 100. ${endMessage}`
			return message.channel.send(reply)
		}

		if (isNaN(attackPower) || attackPower < 0 || attackPower > 250) {
			reply += `la puissance de l'attaque doit être comprise entre 0 et 250. ${endMessage}`
			return message.channel.send(reply)
		}

		if (isNaN(attackPrecision) || attackPrecision < 33 || attackPrecision > 100) {
			reply += `la précision de l'attaque doit être comprise entre 33 et 100. ${endMessage}`
			return message.channel.send(reply)
		}

		if (!isOk.includes(stab) && !isNok.includes(stab)) {
			reply += `le stab doit valoir O/N (ou Y/N). ${endMessage}`
			return message.channel.send(reply)
		}

		if (isNaN(resistance) || !resistanceSlots.includes(resistance)) {
			reply += `la faiblesse doit être de ${resistanceSlots.toString().replace(/,/gi, ' / ')}. ${endMessage}`
			return message.channel.send(reply)
		}

		if (!isOk.includes(para) && !isNok.includes(para)) {
			reply += `la paralysie doit valoir O/N (ou Y/N). ${endMessage}`
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
						name: message.member.displayName,
						icon_url: 'attachment://trainer-logo.jpg'
					},
					thumbnail: {
						url: 'attachment://dd-logo.jpg'
					},
					image: {
						url: 'attachment://para-logo.png'
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
					name: message.member.displayName,
					icon_url: 'attachment://trainer-logo.jpg'
				},
				thumbnail: {
					url: 'attachment://dd-logo.jpg'
				},
				image: {
					url: 'attachment://miss-logo.png'
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
		const files = isCriticalHit ? [
			trainerImg, ddImg, criticalImg
		] : [
			trainerImg, ddImg, hitImg
		]

		const embed = {
			files,
			color: '#00ff00',
			title: 'Votre Pokémon vient de lancer une attaque !',
			author: {
				name: message.member.displayName,
				icon_url: 'attachment://trainer-logo.jpg'
			},
			description: `${isCriticalHit ? 'Coup critique ! ' : ''}Votre Pokémon inflige **${finalDamages} point${finalDamages > 1 ? 's' : ''} de dégât${finalDamages > 1 ? 's' : ''}** à l'ennemi.\n\n*(Pensez à déduire ce montant de sa barre de points de vie)*`,
			thumbnail: {
				url: 'attachment://dd-logo.jpg'
			},
			image: {
				url: `${isCriticalHit ? 'attachment://critical-logo.png' : 'attachment://hit-logo.png'}`
			}
		}

		return message.channel.send({ embed })
	}
}