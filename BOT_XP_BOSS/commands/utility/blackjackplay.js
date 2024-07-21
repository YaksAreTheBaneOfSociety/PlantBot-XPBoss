const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('blackjackplay')
		.setDescription('plays in a game of blackjack.')
        .addStringOption(option =>
			option.setName('play')
			.setDescription('what to play')
			.setRequired(true)
            .addChoices(
                { name: 'hit', value: "hit" },
                { name: 'double down', value: "double" },
                { name: 'stand', value: "stand" }
            )),
	async execute(interaction, xpObject, client) {
        await interaction.deferReply();
		const cardDeck = {
			"AS": "+-----+\n| A<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>A | \n+-----+",
			"2S": "+-----+\n| 2<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>2 | \n+-----+",
			"3S": "+-----+\n| 3<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>3 | \n+-----+",
			"4S": "+-----+\n| 4<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>4 | \n+-----+",
			"5S": "+-----+\n| 5<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>5 | \n+-----+",
			"6S": "+-----+\n| 6<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>6 | \n+-----+",
			"7S": "+-----+\n| 7<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>7 | \n+-----+",
			"8S": "+-----+\n| 8<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>8 | \n+-----+",
			"9S": "+-----+\n| 9<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>9 | \n+-----+",
			"10S":"+-----+\n|10<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>10| \n+-----+",
			"JS": "+-----+\n| J<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>J | \n+-----+",
			"QS": "+-----+\n| Q<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>Q | \n+-----+",
			"KS": "+-----+\n| K<:HappyChannukah:1185716571637825626> | \n| <:HappyChannukah:1185716571637825626>K | \n+-----+",
			"AH": "+-----+\n| A<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>A | \n+-----+",
			"2H": "+-----+\n| 2<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>2 | \n+-----+",
			"3H": "+-----+\n| 3<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>3 | \n+-----+",
			"4H": "+-----+\n| 4<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>4 | \n+-----+",
			"5H": "+-----+\n| 5<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>5 | \n+-----+",
			"6H": "+-----+\n| 6<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>6 | \n+-----+",
			"7H": "+-----+\n| 7<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>7 | \n+-----+",
			"8H": "+-----+\n| 8<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>8 | \n+-----+",
			"9H": "+-----+\n| 9<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>9 | \n+-----+",
			"10H":"+-----+\n|10<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>10| \n+-----+",
			"JH": "+-----+\n| J<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>J | \n+-----+",
			"QH": "+-----+\n| Q<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>Q | \n+-----+",
			"KH": "+-----+\n| K<:Tominator:1118577596985245817> | \n| <:Tominator:1118577596985245817>K | \n+-----+",
			"AD": "+-----+\n| A<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>A | \n+-----+",
			"2D": "+-----+\n| 2<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>2 | \n+-----+",
			"3D": "+-----+\n| 3<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>3 | \n+-----+",
			"4D": "+-----+\n| 4<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>4 | \n+-----+",
			"5D": "+-----+\n| 5<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>5 | \n+-----+",
			"6D": "+-----+\n| 6<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>6 | \n+-----+",
			"7D": "+-----+\n| 7<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>7 | \n+-----+",
			"8D": "+-----+\n| 8<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>8 | \n+-----+",
			"9D": "+-----+\n| 9<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>9 | \n+-----+",
			"10D": "+-----+\n|10<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>10| \n+-----+",
			"JD": "+-----+\n| J<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>J | \n+-----+",
			"QD": "+-----+\n| Q<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>Q | \n+-----+",
			"KD": "+-----+\n| K<:Hmph:1236418571463163954> | \n| <:harumph:1236426921328246824>K | \n+-----+",
			"AC": "+-----+\n| A<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>A | \n+-----+",
			"2C": "+-----+\n| 2<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>2 | \n+-----+",
			"3C": "+-----+\n| 3<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>3 | \n+-----+",
			"4C": "+-----+\n| 4<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>4 | \n+-----+",
			"5C": "+-----+\n| 5<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>5 | \n+-----+",
			"6C": "+-----+\n| 6<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>6 | \n+-----+",
			"7C": "+-----+\n| 7<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>7 | \n+-----+",
			"8C": "+-----+\n| 8<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>8 | \n+-----+",
			"9C": "+-----+\n| 9<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>9 | \n+-----+",
			"10C": "+-----+\n|10<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>10| \n+-----+",
			"JC": "+-----+\n| J<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>J | \n+-----+",
			"QC": "+-----+\n| Q<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>Q | \n+-----+",
			"KC": "+-----+\n| K<:uniondragon:1138958921663529013> | \n| <:uniondragon:1138958921663529013>K | \n+-----+",
            "??": "+-----+\n|  ? ?   | \n|  ? ?   | \n+-----+"
		};
		function displayCardsInLine(cardKeys) {
			const cardLines = cardKeys.map(key => cardDeck[key].split('\n'));
			const combinedLines = [];
		
			for (let i = 0; i < cardLines[0].length; i++) {
				combinedLines.push(cardLines.map(lines => lines[i]).join('  '));
			}
		
			return combinedLines.join('\n');
		}
        function getCardValue(card) {
            const rank = card.slice(0, -1);
            if (rank === 'A') {
                return 11;
            } else if (['K', 'Q', 'J'].includes(rank)) {
                return 10;
            } else {
                return parseInt(rank, 10);
            }
        }
        function scoreHand(cardKeys) {
            let score = 0;
            let aceCount = 0;
        
            for (let card of cardKeys) {
                const value = getCardValue(card);
                score += value;
                if (value === 11) {
                    aceCount++;
                }
            }
        
            while (score > 21 && aceCount > 0) {
                score -= 10;
                aceCount--;
            }
        
            return score;
        }
		let bjData = fs.readFileSync("blackjack.json") // reads the json file
		let activeDeck = JSON.parse(bjData)[0]
		let playersObject = JSON.parse(bjData)[1]
        let dealerHand = JSON.parse(bjData)[2]
		if(interaction.channel.id != '1254796802612527224' && interaction.channel.id != '1255277558875029585'){
			await interaction.editReply("Take a good long look at yourself in the mirror and realize that you just tried gambling before even going to the casino.\n1-800-GAMBLER can connect you to a variety of resources related to gambling-related issues. The specific services and resources available through 1-800-GAMBLER may vary depending on the region you are calling from, but may include: Information and education about problem gambling, including its signs and symptoms.")
		}else if(interaction.channel.id != playersObject[0].gameMsg.channelId){
            await interaction.editReply("A game of blackjack is in progress at another table")
            return
        }else if(playersObject[0] == null){
			await interaction.editReply("A game of blackjack is not in progress. Use /blackjackstart to start a game")
			return
		}else{
		    const playType = interaction.options.getString('play');
			const targetuser = interaction.user;
			let playerIndex = playersObject.findIndex(element => element.id === targetuser.id)
			if(playerIndex == -1){
                await interaction.editReply("You are not a player in the current game of blackjack.")
                return
			}
            for (let i = 0; i < playerIndex; i++) {
                if(playersObject[i].done == false && i != playerIndex){
                    await interaction.editReply(`It is <@${playersObject[i].id}>'s turn.`)
                    return
                }
            }
            if(playersObject[playerIndex].done == true){
                await interaction.editReply(`Your turn has ended.`)
                return
            }
            if(playersObject[0].joinable == true){
                await interaction.editReply("You cannot play until the game has started")
                return
            }
            if(playType == "hit"){
                if(playersObject[playerIndex].doubledown != null){
                    await interaction.editReply("You cannot hit after doubling down.")
                    return
                }
                if(playersObject[playerIndex].score > 21){
                    await interaction.editReply("You cannot hit after busting.")
                    return
                }
                playersObject[playerIndex].playerCards.push(activeDeck.shift())
                dealerCardsString = displayCardsInLine(dealerHand)
                playersObject[playerIndex].score = scoreHand(playersObject[playerIndex].playerCards)
                if(playersObject[playerIndex].score > 21){
                    await interaction.editReply(`**<@${targetuser.id}> busted**`)
                    playersObject[playerIndex].done = true
                }else{
                    await interaction.editReply(`**<@${targetuser.id}> hit**`)
                }
                let playersAndCardsString = ``
                let currentTurnIndex = -1
                for (let i = playersObject.length-1; i >= 0; i--) {
                    if(playersObject[i].done == false){
                        currentTurnIndex = i
                    }
                }
                for (let i = 0; i < playersObject.length; i++) {
                    let playerCardsString = displayCardsInLine(playersObject[i].playerCards)
                    playersObject[i].score = scoreHand(playersObject[i].playerCards)
                    if(i == currentTurnIndex){
                        playersAndCardsString = playersAndCardsString.concat(`⭐ <@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                    }else{
                        playersAndCardsString = playersAndCardsString.concat(`<@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                    }
                }
                interaction.channel.messages.fetch(playersObject[0].gameMsg.id).then(msg => msg.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\n${dealerCardsString}\n${playersAndCardsString}`))
                let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
            }else if(playType == 'double'){
                let xpIndex = xpObject.findIndex(element => element.id === targetuser.id)
                if(xpObject[xpIndex].xp < playersObject[playerIndex].bet){
                    await interaction.editReply("You do not have enough xp to double down.")
                    return
                }
                if(playersObject[playerIndex].doubledown != null){
                    await interaction.editReply("You can only double down once per hand.")
                    return
                }
                if(playersObject[playerIndex].playerCards.length > 2){
                    await interaction.editReply("You cannot double down after hitting.")
                    return
                }
                xpObject[xpIndex].xp-=playersObject[playerIndex].bet
                playersObject[playerIndex].bet*=2
                playersObject[playerIndex].playerCards.push(activeDeck.shift())
                dealerCardsString = displayCardsInLine(dealerHand)
                let playersAndCardsString = ``
                playersObject[playerIndex].done = true
                playersObject[playerIndex].doubledown = true
                let currentTurnIndex = -1
                for (let i = playersObject.length-1; i >= 0; i--) {
                    if(playersObject[i].done == false){
                        currentTurnIndex = i
                    }
                }
                for (let i = 0; i < playersObject.length; i++) {
                    let playerCardsString = displayCardsInLine(playersObject[i].playerCards)
                    playersObject[i].score = scoreHand(playersObject[i].playerCards)
                    if(i == currentTurnIndex){
                        playersAndCardsString = playersAndCardsString.concat(`⭐ <@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                    }else{
                        playersAndCardsString = playersAndCardsString.concat(`<@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                    }
                }
                interaction.channel.messages.fetch(playersObject[0].gameMsg.id).then(msg => msg.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\n${dealerCardsString}\n${playersAndCardsString}`))
                if(playersObject[playerIndex].score > 21){
                    await interaction.editReply(`**<@${targetuser.id}> doubled down and busted**`)
                }else{
                    await interaction.editReply(`**<@${targetuser.id}> doubled down**`)
                }
                let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
            }else if(playType == "stand"){
                await interaction.editReply(`**<@${targetuser.id}> stood**`)
                playersObject[playerIndex].done = true
                let currentTurnIndex = -1
                for (let i = playersObject.length-1; i >= 0; i--) {
                    if(playersObject[i].done == false){
                        currentTurnIndex = i
                    }
                }
                let playersAndCardsString = ``
                for (let i = 0; i < playersObject.length; i++) {
                    let playerCardsString = displayCardsInLine(playersObject[i].playerCards)
                    playersObject[i].score = scoreHand(playersObject[i].playerCards)
                    if(i == currentTurnIndex){
                        playersAndCardsString = playersAndCardsString.concat(`⭐ <@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)
                    }else{
                        playersAndCardsString = playersAndCardsString.concat(`<@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)
                    }
                }
                interaction.channel.messages.fetch(playersObject[0].gameMsg.id).then(msg => msg.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\n${dealerCardsString}\n${playersAndCardsString}`))
                let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
            }
		}
	},
};