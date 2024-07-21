const { SlashCommandBuilder,  Client, Collection, Events, GatewayIntentBits, Discord  } = require('discord.js');
const fs = require("fs")
const path = require("path")
const lockfile = require('proper-lockfile');
module.exports = {
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('blackjackstart')
		.setDescription('starts a game of blackjack. other players have 1 minute to join.')
        .addIntegerOption(option =>
			option.setName('bet')
			.setDescription('xp to bet on your hand')
			.setRequired(true)
            .addChoices(
                { name: '10', value: 10 },
                { name: '50', value: 50 },
                { name: '100', value: 100 },
                { name: '250', value: 250 },
                { name: '500', value: 500 },
                { name: '2500', value: 2500 },
                { name: '10000', value: 10000 },
                { name: '25000', value: 25000 }
            )),
	async execute(interaction, xpObject, client) {
        await interaction.deferReply();
        try {
            await lockfile.lock('blackjack.json');
        
            // Check if a game is already active
            let gameData = JSON.parse(fs.readFileSync('blackjack.json', 'utf8'));
            if (gameData.active) {
                await interaction.editReply("A game is already in progress.")
            } else {
              // Start a new game
              gameData.active = true;
              fs.writeFileSync('blackjack.json', JSON.stringify(gameData));
              
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
		function shuffleDeck(deckKeys) {
			for (let i = deckKeys.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[deckKeys[i], deckKeys[j]] = [deckKeys[j], deckKeys[i]];
			}
			return deckKeys;
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
        function softSeventeen(cardKeys){
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
            if (score == 17 && aceCount > 0){
                return true
            }else{
                return false
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
        let deckKeys = Object.keys(cardDeck).filter(key => key !== "??"); // Exclude "??" key
        deckKeys = deckKeys.concat(deckKeys)
        const shuffledDeck = shuffleDeck(deckKeys.slice()); // Use slice() to create a copy of the array and shuffle it
        
		let bjData = fs.readFileSync("blackjack.json") // reads the json file
		let activeDeck = JSON.parse(bjData)[0]
		let playersObject = JSON.parse(bjData)[1]
        let dealerHand = JSON.parse(bjData)[2]
		if(interaction.channel.id != '1254796802612527224' && interaction.channel.id != '1255277558875029585'){
			await interaction.editReply("Take a good long look at yourself in the mirror and realize that you just tried to start gambling before even going to the casino.\n1-800-GAMBLER can connect you to a variety of resources related to gambling-related issues. The specific services and resources available through 1-800-GAMBLER may vary depending on the region you are calling from, but may include: Information and education about problem gambling, including its signs and symptoms.")
		}else if(playersObject[0] != null){
			await interaction.editReply("A game of blackjack is already in progress. Use /blackjackjoin to join")
			return
		}else{
		    const betAmount = interaction.options.getInteger('bet');
            if(interaction.channel.id == '1254796802612527224' && betAmount > 500){
                await interaction.editReply("You cannot bet more than 500xp outside of the high rollers' table")
                return
            }
            if(interaction.channel.id == '1255277558875029585' && betAmount < 2500){
                await interaction.editReply("You cannot bet less than 2500xp at the high rollers' table")
                return
            }
			const targetuser = interaction.user;
			let xpIndex = xpObject.findIndex(element => element.id === targetuser.id)
			if(xpIndex == -1){
				let userxp = {
					id: targetuser.id,
					username: targetuser.username,
					xp: 0,
					level: 0,
					timeout: false
				}
				xpObject.push(userxp)
				xpIndex = xpObject.findIndex(element => element.id === targetuser.id)
			}
            let userPlayer = {
                id: targetuser.id,
                username: targetuser.username,
                bet: betAmount,
                joinable: true,
                playerCards: [],
                score: 0,
                gameMsg: null,
                done: false
            }
            playersObject.push(userPlayer)
            if(xpObject[xpIndex].xp < betAmount){
                await interaction.editReply("You cannot bet more money than you have. Loan sharks can be found in the alley behind the casino. Plant Casino is not liable for any kneecaps broken as a result of failing to repay loans.")
                return
            }
            xpObject[xpIndex].xp-=betAmount
			let jsonXP = JSON.stringify(xpObject) // turns js back into json
			fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
            var timeLimitDate = new Date();
            timeLimitDate = Math.floor((timeLimitDate?.getTime() ?? Date.now()) / 1e3);
            const relativeTime = `<t:${timeLimitDate+60}:R>`
			await interaction.editReply(`You have started a game of blackjack with a bet of ${betAmount} xp. Other players can join before: ${relativeTime}`)
            let blackjackTableMessage = await client.channels.cache.get(interaction.channel.id).send(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+`)
            playersObject[0].gameMsg = blackjackTableMessage
			let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
			fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
            setTimeout(() => {
                bjData = fs.readFileSync("blackjack.json") // reads the json file
                activeDeck = JSON.parse(bjData)[0]
                playersObject = JSON.parse(bjData)[1]
                if(activeDeck.length < playersObject.length*4 || activeDeck.length < 20){
                    activeDeck = shuffledDeck
                    client.channels.cache.get(interaction.channel.id).send(`**Deck reshuffled**`)
                }
                playersObject[0].joinable = false
                let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
                setTimeout(() => {
                    let dealerCards = []
                    dealerCards.push(activeDeck.shift(), "??")
                    dealerHand = dealerCards
                    dealerHiddenCard = activeDeck.shift()
                    dealerScore = scoreHand([dealerCards[0],dealerHiddenCard])
                    let playersAndCardsString = ``
                    let currentTurnIndex = -1
                    for (let i = playersObject.length-1; i >= 0; i--) {
                        if(playersObject[i].done == false){
                            currentTurnIndex = i
                        }
                    }
                    for (let i = 0; i < playersObject.length; i++) {
                        playersObject[i].playerCards.push(activeDeck.shift())
                        playersObject[i].playerCards.push(activeDeck.shift())
                        let playerCardsString = displayCardsInLine(playersObject[i].playerCards)
                        playersObject[i].score = scoreHand(playersObject[i].playerCards)
                        if(i == currentTurnIndex && dealerScore != 21){
                            playersAndCardsString = playersAndCardsString.concat(`⭐ <@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                        }else{
                            playersAndCardsString = playersAndCardsString.concat(`<@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)

                        }
                    }
                    let resultsString = ``
                    let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                    fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
                    if(dealerScore == 21){
                        dealerCards[1]=dealerHiddenCard
                        dealerCardsString = displayCardsInLine(dealerCards)
                        blackjackTableMessage.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\nHand: 21\n${dealerCardsString}\n${playersAndCardsString}`)
                        resultsString = resultsString.concat(`**Dealer Blackjack**\n`)
                        for (let i = 0; i < playersObject.length; i++) {
                            if(playersObject[i].score == 21){
                                let xpIndex = xpObject.findIndex(element => element.id === playersObject[i].id)
                                xpObject[xpIndex].xp+=playersObject[i].bet
                                resultsString = resultsString.concat(`<@${playersObject[i].id}> ties and breaks even.\n`)
                            }else{
                                resultsString = resultsString.concat(`<@${playersObject[i].id}> loses their bet of ${playersObject[i].bet} xp.\n`)
                            }
                        }
                        client.channels.cache.get(interaction.channel.id).send(resultsString)
                        let jsonXP = JSON.stringify(xpObject) // turns js back into json
                        fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
                        playersObject = []
                        let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                        fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
                    }else{
                        client.channels.cache.get(interaction.channel.id).send(`**Game started.**`)
                        dealerCardsString = displayCardsInLine(dealerCards)
                        blackjackTableMessage.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\n${dealerCardsString}\n${playersAndCardsString}`)
                        for (let i = 0; i < playersObject.length; i++) {
                            if(playersObject[i].score==21){
                                resultsString = resultsString.concat(`<@${playersObject[i].id}> wins with blackjack and earns ${playersObject[i].bet*1.5} xp.\n`)
                                let xpIndex = xpObject.findIndex(element => element.id === playersObject[i].id)
                                xpObject[xpIndex].xp+=playersObject[i].bet*2.5
                                playersObject[i].done = true
                            }
                        }
                        playersAndCardsString = ``
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
                        blackjackTableMessage.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\n${dealerCardsString}\n${playersAndCardsString}`)       
                        if (resultsString != ``){
                            client.channels.cache.get(interaction.channel.id).send(resultsString)
                            let jsonXP = JSON.stringify(xpObject) // turns js back into json
                            fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
                            resultsString = ``
                        }
                        let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                        fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
                        let waiting = true
                        let resultsReady = true
                        function Wait(){
                            bjData = fs.readFileSync("blackjack.json") // reads the json file
                            activeDeck = JSON.parse(bjData)[0]
                            playersObject = JSON.parse(bjData)[1]
                            dealerHand = JSON.parse(bjData)[2]
                            resultsReady = true
                            for (let i = 0; i < playersObject.length; i++) {
                                if(playersObject[i].done == false){
                                    resultsReady = false
                                }
                            }
                            if(resultsReady){
                                playersAndCardsString = ``
                                let totalBlackjack = true
                                for (let i = 0; i < playersObject.length; i++) {
                                    let playerCardsString = displayCardsInLine(playersObject[i].playerCards)
                                    playersAndCardsString = playersAndCardsString.concat(`<@${playersObject[i].id}>'s Cards:\nBet: ${playersObject[i].bet} | Hand: ${playersObject[i].score}\n${playerCardsString}\n`)
                                    playersObject[i].score = scoreHand(playersObject[i].playerCards)
                                    if(playersObject[i].score != 21 || playersObject[i].playerCards.length>2){
                                        totalBlackjack = false
                                    }
                                }
                                dealerCards[1]=dealerHiddenCard
                                dealerCardsString = displayCardsInLine(dealerCards)
                                blackjackTableMessage.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\nHand: ${scoreHand(dealerCards)}\n${dealerCardsString}\n${playersAndCardsString}`)
                                if(totalBlackjack == false){
                                    while(17 > dealerScore || softSeventeen(dealerCards)){
                                        dealerCards.push(activeDeck.shift())
                                        dealerCardsString = displayCardsInLine(dealerCards)
                                        blackjackTableMessage.edit(`+---------------------------+\n|              Blackjack                   | \n+---------------------------+\nDealer's Cards:\nHand: ${scoreHand(dealerCards)}\n${dealerCardsString}\n${playersAndCardsString}`)
                                        client.channels.cache.get(interaction.channel.id).send(`**Dealer hit**`)
                                        dealerScore = scoreHand(dealerCards)
                                    }
                                }
                                for (let i = 0; i < playersObject.length; i++) {
                                    xpIndex = xpObject.findIndex(element => element.id === playersObject[i].id)
                                    if(!(playersObject[i].score == 21 && playersObject[i].playerCards.length == 2)){
                                        if(playersObject[i].score < 22 && dealerScore < 22){
                                            if(playersObject[i].score > dealerScore){
                                                resultsString = resultsString.concat(`<@${playersObject[i].id}> wins and earns ${playersObject[i].bet} xp.\n`)
                                                xpObject[xpIndex].xp+=playersObject[i].bet*2
                                            }else if(playersObject[i].score == dealerScore){
                                                resultsString = resultsString.concat(`<@${playersObject[i].id}> ties and breaks even.\n`)
                                                xpObject[xpIndex].xp+=playersObject[i].bet
                                            }else if(playersObject[i].score < dealerScore){
                                                resultsString = resultsString.concat(`<@${playersObject[i].id}> loses their bet of ${playersObject[i].bet} xp.\n`)
                                            }
                                        }else if(playersObject[i].score > 21 && dealerScore < 22){
                                            resultsString = resultsString.concat(`<@${playersObject[i].id}> loses their bet of ${playersObject[i].bet} xp.\n`)
                                        }else if(playersObject[i].score < 22 && dealerScore > 21){
                                            resultsString = resultsString.concat(`<@${playersObject[i].id}> wins and earns ${playersObject[i].bet} xp.\n`)
                                            xpObject[xpIndex].xp+=playersObject[i].bet*2
                                        }else{
                                            resultsString = resultsString.concat(`<@${playersObject[i].id}> ties and breaks even.\n`)
                                            xpObject[xpIndex].xp+=playersObject[i].bet
                                        }
                                    }
                                }
                                if (resultsString != ``){
                                    client.channels.cache.get(interaction.channel.id).send(resultsString)
                                    let jsonXP = JSON.stringify(xpObject) // turns js back into json
                                    fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
                                }
                                playersObject = []
                                dealerHand = []
                                let jsonBJ = JSON.stringify([activeDeck,playersObject,dealerHand]) // turns js back into json
                                fs.writeFileSync("blackjack.json", jsonBJ) // the json file is now the xp variable
                                waiting = false
                            }else{
                                if(waiting){
                                    setTimeout(() => {
                                        Wait()
                                    }, 1000)
                                }
                            }
                        }
                        Wait()
                    }
                }, 2000);
            }, 60000);
		}
            }
          } catch (error) {
            await interaction.editReply("An error occurred while starting the game.");
          } finally {
            lockfile.unlock('blackjack.json').catch(() => {});
          }
	},
};

