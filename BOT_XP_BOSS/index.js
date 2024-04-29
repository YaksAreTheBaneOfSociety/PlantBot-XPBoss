const { Client, Collection, Events, GatewayIntentBits, Discord } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	],
});

const fs = require("fs")
const path = require("path")

var cron = require('node-cron');

client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

let laughStrings = ['haha', 'hehe', 'hoho', 'lul', 'lol', 'lmao', '😂', '🤣']
let laughObject = []
let xpData = fs.readFileSync("xp.json") // reads the json file
let xpObject = JSON.parse(xpData) // turns json into js
let randomWordsListData = fs.readFileSync("wordsListNew.json") // reads the json file
let randomWordsList = JSON.parse(randomWordsListData) // turns json into js
let dailyWordsListData = fs.readFileSync("wordsListDaily.json") // reads the json file
let dailyWordsList = JSON.parse(dailyWordsListData) // turns json into js
let singleWordsListData = fs.readFileSync("wordsListSingle.json") // reads the json file
let singleWordsList = JSON.parse(singleWordsListData) // turns json into js
let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
let randomWord = JSON.parse(randomWordData) // turns json into js
let murderData = fs.readFileSync("murder.json")
let murderObject = JSON.parse(murderData)[0] // turns json into js
let victimObject = JSON.parse(murderData)[2]
const segmenterEn = new Intl.Segmenter('en', { granularity: 'word' });//used for word of the day for breaking messages into wordlikes
const xpMin = 15
const xpMax = 40
const xpMultiplierForNotRobot = 2
let newRandomWord = {}
let oldRandomWord = {}
let newRandomEvilWord = {}
let oldRandomEvilWord = {}
let rolesLevels = [
	{
		'role': '1182169777825927178',
		'level': 1
	},
	{
		'role': '1182169821429907456',
		'level': 5
	},
	{
		'role': '1182169863821725727',
		'level': 10
	},
	{
		'role': '1182169907425718303',
		'level': 25
	},
	{
		'role': '1182169962899587153',
		'level': 50
	},
	{
		'role': '1182170032864755722',
		'level': 69
	},
	{
		'role': '1182170091450798151',
		'level': 75
	},
	{
		'role': '1182166525386432642',
		'level': 100
	},
	{
		'role': '1182169175779709008',
		'level': 600
	},
]

function hasNumbers(inputString) {
	return /\d/.test(inputString);
}
var getRandomWord = function(wordList){
    const randomIndex = Math.floor(Math.random() * wordList.length);
	let wordPicked = wordList[randomIndex]
	if(wordPicked.count > 5 || wordPicked.nonword == null)
    	return wordPicked
	else{
		return getRandomWord(wordList)
	}
}
function countAndSortWords(){
	while(dailyWordsList.length > 0){
		wordsListIndex = randomWordsList.findIndex(element => element.word == dailyWordsList[0].toLowerCase())
		if(wordsListIndex != -1){
			randomWordsList[wordsListIndex].count++
		}else if(singleWordsList.includes(dailyWordsList[0].toLowerCase())){
			let wordObject = {
				word: dailyWordsList[0].toLowerCase(),
				count: 2
			}
			randomWordsList.push(wordObject)
			singleWordsList.splice(singleWordsList.indexOf(dailyWordsList[0].toLowerCase()), 1)
		}else{
			singleWordsList.push(dailyWordsList[0].toLowerCase())
		}
		dailyWordsList.shift()
	}
	function compareObjects(a, b) {
		if (a.count !== b.count) {
			return b.count - a.count
		}
	}
	randomWordsList.sort(compareObjects);
	let jsonwordsdaily = JSON.stringify(dailyWordsList)
	fs.writeFileSync("wordsListDaily.json", jsonwordsdaily)
	let jsonsinglewords = JSON.stringify(singleWordsList)
	fs.writeFileSync("wordsListSingle.json", jsonsinglewords)
	// Function to read words_alpha.txt
	function readWordsAlpha() {
		return new Promise((resolve, reject) => {
			fs.readFile('words_alpha.txt', 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} else {
					const words = new Set(data.trim().split('\n').map(word => word.trim()));
					resolve(words);
				}
			});
		});
	}
	// Function to add nonword property
	async function addNonwordProperty() {
		try {
			const wordsAlpha = await readWordsAlpha();
			const updatedList = randomWordsList.map(obj => {
				if (obj.count <= 5 && !wordsAlpha.has(obj.word)) {
					return { ...obj, nonword: true };
				}
				return obj;
			});

			fs.writeFile('wordsListNew.json', JSON.stringify(updatedList, null, 2), 'utf8', err => {
				if (err) throw err;
				console.log('File has been saved!');
			});

		} catch (err) {
			console.error('Error:', err);
		}
	}

	// Call the function to add nonword property
	addNonwordProperty();
	let jsonwords = JSON.stringify(randomWordsList)
	fs.writeFileSync("wordsListNew.json", jsonwords)

}
function levelUpCheck(xpObject,xpIndex,m){
	let xpNeeded = 75
	let i = 0
	while(xpObject[xpIndex].xp > xpNeeded) {
		i++
		xpNeeded+=75+100*i
	}
	if(i == xpObject[xpIndex].level){
		let addedRolesString = ``
		for (let i = 0; i < rolesLevels.length; i++) {
			if (xpObject[xpIndex].level >= rolesLevels[i].level && !m.member.roles.cache.has(rolesLevels[i].role)){
				m.member.roles.add(rolesLevels[i].role)
				addedRolesString=addedRolesString.concat(`${m.author} has earned the <@&${rolesLevels[i].role}> role\n`)
			}
		}
		if(addedRolesString != ``){
			client.channels.cache.get('1182165246870310984').send(addedRolesString)
		}
	}else{
		xpObject[xpIndex].level=i
		client.channels.cache.get('1182165246870310984').send(`${m.author} has reached level **${xpObject[xpIndex].level}**`)
	}
}
function selectwordoftheday(){
	randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
	randomWord = JSON.parse(randomWordData) // turns json into js
	newRandomWord = getRandomWord(randomWordsList)
	newRandomWord.found = false
	if(randomWord[0] != null){
		oldRandomWord = randomWord[0]
		randomWord[1] = oldRandomWord
	}
	randomWord[0] = newRandomWord
	let streakString = ""
	if(randomWord[1].found == false){
		randomWord[4] = 0
		streakString = " Yesterday's word was not found. Streak reset to 0."
	}else{
		streakString = `Yesterday's word was found. Current secret word streak: **${randomWord[4]}** day(s).`
	}
	let jsonRandomWord = JSON.stringify(randomWord)
	fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	if(randomWord[1] != null){
		client.channels.cache.get('1182165246870310984').send(`Yesterday's secret word was **${randomWord[1].word}**.${streakString}`)
	}
	client.channels.cache.get('1182165246870310984').send(`Today's secret word has been selected! it has been used **${newRandomWord.count}** times`)

}
function selectevilwordoftheday(){
	randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
	randomWord = JSON.parse(randomWordData) // turns json into js
	newRandomEvilWord = getRandomWord(randomWordsList)
	if(randomWord[2] != null){
		oldRandomEvilWord = randomWord[2]
		randomWord[3] = oldRandomEvilWord
	}
	randomWord[2] = newRandomEvilWord
	let jsonRandomWord = JSON.stringify(randomWord)
	fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	if(randomWord[3] != null){
		client.channels.cache.get('1182165246870310984').send(`Yesterday's illegal word was **${randomWord[3].word}**`)
	}
	client.channels.cache.get('1182165246870310984').send(`Today's illegal word has been selected! it has been used **${newRandomEvilWord.count}** times`)

}
function selectvictimoftheday(){
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	let victimId = murderObject[Math.floor(Math.random() * murderObject.length)].id
	let victimUser = client.users.fetch(victimId)
	victimUser.then(function(victim){
		newRandomVictim = {
			id: victim.id,
			username: victim.username,
			timesMurdered: 0
		}
		victimObject=newRandomVictim
		let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
		fs.writeFileSync("murder.json", jsonMurder)
		client.channels.cache.get('1182165246870310984').send(`Today's random victim has been selected! **${newRandomVictim.username}** should watch out for any comedically timed falling pianos in their vicinity.`)
	})
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const { cooldowns } = interaction.client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1_000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}
	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction, xpObject, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	for (let i = 0; i < xpObject.length; i++) {
		xpObject[i].timeout = false;
	}
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	for (let i = 0; i < murderObject.length; i++) {
		murderObject[i].banned = 0;
	}
	let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
	fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
	let jsonXP = JSON.stringify(xpObject) // turns js back into json
	fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
	cron.schedule('0 5 * * *', () => {
		selectwordoftheday()
		selectvictimoftheday()
	},{
		scheduled: true,
		timezone: "US/Central"
	});
	cron.schedule('0 17 * * *', () => {
		selectevilwordoftheday()
	},{
		scheduled: true,
		timezone: "US/Central"
	});
	cron.schedule('59 23 * * *', () => {
		countAndSortWords()
	},{
		scheduled: true,
		timezone: "US/Central"
	});
	if(randomWord[0] == null){
		selectwordoftheday()
	}
	if(randomWord[2] == null){
		selectevilwordoftheday()
	}
	if(victimObject == null){
		selectvictimoftheday()
	}
});

client.on("messageCreate", (m) => {

	let message = m.toString()
	if(m.author.id != '1213683278113144832'){
		let segmentedMessage = segmenterEn.segment(message)
		segmentedMessage = [...segmentedMessage].filter(s => s.isWordLike)
		for(let segment of segmentedMessage){
			if(segment.segment.replace(/\s/g, '').length>0 && !hasNumbers(segment.segment)) { 
				dailyWordsList.push(segment.segment)
			}
		}
		let jsonwordsdaily = JSON.stringify(dailyWordsList) // turns js back into json
		fs.writeFileSync("wordsListDaily.json", jsonwordsdaily) // the json file is now the xp variable
	}
	if(m.author.roles == null){
		return //exit if member is not actually capable of earning roles
	}
	murderData = fs.readFileSync("murder.json")
	murderObject = JSON.parse(murderData)[0] // turns json into js
	victimObject = JSON.parse(murderData)[2]
	let xpIndex = xpObject.findIndex(element => element.id === m.author.id)
	let murderIndex = murderObject.findIndex(element => element.id === m.author.id)
//PART THAT BANS LAUGHING
/*
	const message = m.toString()
	let laughBanned = 0
	let laughIndex = laughObject.findIndex(element => element.id === m.author.id)
	if(laughIndex == -1){
		let usertoadd = {
			id: m.author.id,
			username: m.author.username,
			banned: 0
		}
		laughObject.push(usertoadd)
		laughIndex = laughObject.findIndex(element => element.id === m.author.id)
	}
	try{
		if(laughObject[laughIndex].username != m.member.displayName){
			laughObject[laughIndex].username = m.member.displayName
		}
	}catch{
		laughObject[laughIndex].username = m.author.username
	}
	laughBanned = laughObject[laughIndex].banned
	if(laughBanned){
		m.channel.send(`${m.author} is currently timed out for laughing`)
		m.delete()
		return
	}else{
		for(i in laughStrings){
			if(message.includes(laughStrings[i])){
				m.channel.send(`${m.author} stop laughing.`)
				laughObject[laughIndex].banned = true
				m.delete()
				setTimeout(() => {
					laughObject[laughIndex].banned = false
				}, 7200000);
				break;
			}
		}
	}
*/
//END PART THAT BANS LAUGHING
	if(xpIndex == -1){
		let userxp = {
			id: m.author.id,
			username: "test",
			xp: 0,
			level: 0,
			timeout: false
		}
		xpObject.push(userxp)
		xpIndex = xpObject.findIndex(element => element.id === m.author.id)
	}
	try{
		if(xpObject[xpIndex].username != m.member.displayName){
			xpObject[xpIndex].username = m.member.displayName
		}
	}catch{
		xpObject[xpIndex].username = m.author.username
	}
	try{
		let murderBanned = 0
		if(murderIndex != -1){
			try{
				if(murderObject[murderIndex].username != m.member.displayName){
					murderObject[murderIndex].username = m.member.displayName
				}
			}catch{
				murderObject[murderIndex].username = m.author.username
			}
			let jsonMurder = JSON.stringify([murderObject,JSON.parse(murderData)[1],victimObject]) // turns js back into json
			fs.writeFileSync("murder.json", jsonMurder) // the json file is now the xp variable
			murderBanned = murderObject[murderIndex].banned
		}
		if(murderBanned == 2){
			m.channel.send(`${m.author} is currently timed out`)
			m.delete()
			return
		}
		if(xpObject[xpIndex].timeout == false && murderBanned == 0){
			let xpToAdd = Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin
			xpObject[xpIndex].xp += xpToAdd
			xpObject[xpIndex].timeout=true
			setTimeout(() => {
				xpObject[xpIndex].timeout=false
			}, 60000);
			let jsonXP = JSON.stringify(xpObject) // turns js back into json
			fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
		}	
		levelUpCheck(xpObject,xpIndex,m)
		
		let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
		let randomWord = JSON.parse(randomWordData) // turns json into js

		if(m.toString().toLowerCase().includes(randomWord[0].word.toLowerCase()) && randomWord[0].found == false){
			randomWord[0].found = true
			randomWord[0].foundBy = m.author.username
			randomWord[4]++
			let wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			if(wordUserIndex==-1){
				let userword = {
					id: m.author.id,
					secret: 0,
					illegal: 0
				}
				randomWord[5].push(userword)
				wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			}
			randomWord[5][wordUserIndex].secret++
			let xpToAdd = randomWord[4]*25*(Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin)
			m.channel.send(`${m.author} found the secret word: **${randomWord[0].word}**`)
			client.channels.cache.get('1182165246870310984').send(`${m.author} found the secret word: **${randomWord[0].word}** and was awarded ${xpToAdd} xp. Current secret word streak: **${randomWord[4]}** day(s).`)
			xpObject[xpIndex].xp += xpToAdd
			levelUpCheck(xpObject,xpIndex,m)
			let jsonRandomWord = JSON.stringify(randomWord)
			fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
		}
		if(m.toString().toLowerCase().includes(randomWord[2].word.toLowerCase())){
			let wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			if(wordUserIndex==-1){
				let userword = {
					id: m.author.id,
					secret: 0,
					illegal: 0
				}
				randomWord[5].push(userword)
				wordUserIndex = randomWord[5].findIndex(element => element.id === m.author.id)
			}
			randomWord[5][wordUserIndex].illegal++
			let xpToRemove = -5*(Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin)
			if(randomWord[4]!=0){
				xpToRemove *= randomWord[4]
			}
			setTimeout(() => {
				xpObject[xpIndex].xp += xpToRemove
				levelUpCheck(xpObject,xpIndex,m)
				let randomWordInfo = randomWord[5]
				randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
				randomWord = JSON.parse(randomWordData) // turns json into js
				randomWord[5] = randomWordInfo
				client.channels.cache.get('1182165246870310984').send(`${m.author} said the illegal word and was fined ${-xpToRemove} xp`)
				let jsonRandomWord = JSON.stringify(randomWord)
				fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
			}, Math.floor(600000*Math.random()))
		}
	} catch (err){
		console.log('an error occured')
		console.log(err)
		xpIndex = xpObject.findIndex(element => element.id === m.author.id)
		setTimeout(() => {
			xpObject[xpIndex].timeout=false
		}, 60000);
	}
})
// Log in to Discord with your client's token
client.login(token);