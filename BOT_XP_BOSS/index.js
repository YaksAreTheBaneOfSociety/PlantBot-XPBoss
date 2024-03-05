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


let xpData = fs.readFileSync("xp.json") // reads the json file
let xpObject = JSON.parse(xpData) // turns json into js
let randomWordsListData = fs.readFileSync("wordsList.json") // reads the json file
let randomWordsList = JSON.parse(randomWordsListData) // turns json into js
let randomWordData = fs.readFileSync("wordOfTheDay.json") // reads the json file
let randomWord = JSON.parse(randomWordData) // turns json into js

const xpMin = 15
const xpMax = 40
const xpMultiplierForNotRobot = 2
let newRandomWord = {}
let oldRandomWord = {}
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


var getRandomWord = function(wordList){
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
}
function levelUpCheck(xpObject,xpIndex,m){
	let xpNeeded = 75
	let i = 0
	while(xpObject[xpIndex].xp > xpNeeded) {
		i++
		xpNeeded+=75+100*i
	}
	if(i == xpObject[xpIndex].level){
		return
	}
	xpObject[xpIndex].level=i
	let roleIndex = rolesLevels.findIndex(element => element.level === xpObject[xpIndex].level)
	let addedRolesString = ``
	for (let i = 0; i < rolesLevels.length; i++) {
		if (xpObject[xpIndex].level >= rolesLevels[i].level && !m.member.roles.cache.has(rolesLevels[i].role)){
			m.member.roles.add(rolesLevels[i].role)
			addedRolesString=addedRolesString.concat(` and earned the <@&${rolesLevels[i].role}> role`)
		}
	}
	client.channels.cache.get('1182165246870310984').send(`${m.author} has reached level **${xpObject[xpIndex].level}**${addedRolesString}`)

}
function selectwordoftheday(){
	newRandomWord = getRandomWord(randomWordsList)
	newRandomWord.found = false
	if(randomWord[0] != null){
		oldRandomWord = randomWord[0]
		randomWord[1] = oldRandomWord
	}
	randomWord[0] = newRandomWord
	let jsonRandomWord = JSON.stringify(randomWord)
	fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	if(randomWord[1] != null){
		client.channels.cache.get('1182165246870310984').send(`Yesterday's random word was **${randomWord[1].word}**`)
	}
	client.channels.cache.get('1182165246870310984').send(`Today's random word has been selected! it has been used **${newRandomWord.count}** times (before March 4, 2024)`)

}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

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
	let jsonXP = JSON.stringify(xpObject) // turns js back into json
	fs.writeFileSync("xp.json", jsonXP) // the json file is now the xp variable
	cron.schedule('0 8 * * *', () => {
		selectwordoftheday()
	},{
		scheduled: true,
		timezone: "US/Central"
	  });
	if(randomWord[0] == null){
		selectwordoftheday()
	}
});

client.on("messageCreate", (m) => {
	let xpIndex = xpObject.findIndex(element => element.id === m.author.id)
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
	if(m.toString().toLowerCase().includes(randomWord[0].word.toLowerCase()) && randomWord[0].found == false){
		randomWord[0].found = true
		randomWord[0].foundBy = m.author.username
		let xpToAdd = 25*Math.floor(Math.random()*(xpMax-xpMin+1))+xpMin
		client.channels.cache.get('1182165246870310984').send(`${m.author} found the secret word: **${randomWord[0].word}** and was awarded ${xpToAdd} xp`)
		xpObject[xpIndex].xp += xpToAdd
		levelUpCheck(xpObject,xpIndex,m)
		let jsonRandomWord = JSON.stringify(randomWord)
		fs.writeFileSync("wordOfTheDay.json", jsonRandomWord)
	}
	if(xpObject[xpIndex].timeout == false){
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
})
// Log in to Discord with your client's token
client.login(token);