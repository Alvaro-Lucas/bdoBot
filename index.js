const functions = require('./utils/commands.js');
const data = require("./config.json");


const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	try {
		functions.bossNow(client);
	}
	catch (e) {
		console.error(e)
	}
});

client.on('message', message => {
	if (!message.content.startsWith(data.prefix) || message.author.bot) return;
	if (!data.channelListener.includes(message	.channel.id)) return;
	const args = message.content.slice(data.prefix.length).trim().split(/\s+/);
	const command = args.shift().toLowerCase();
	message.delete()
		.then(msg => console.log("El mensaje "+msg.content+" ha sido borrado correctamente"))
		.catch(console.error);

	if (command === 'help') {
		try {
			functions.help(client);
		}
		catch (e) {
			console.error("Fallo en el metodo help")
			console.error(e)
		}
	}
	else if (command === 'next') {
		try {
			functions.next(client);
		}
		catch (e) {
			console.error("Fallo en el metodo next")
			console.error(e)
		}
	}
	else if (command === 'corcel') {
		try {
			functions.corcel(client)
		}
		catch (e) {
			console.error("Fallo en el metodo corcel")
			console.error(e)
		}
	}
	else if (command === 'fls') {
		try {
			functions.fls(client, args[0])
		}
		catch (e) {
			console.error(e)
		}
	}
	else if (command == 'boss') {
		try {
			functions.boss(args[0])
		}
		catch (e) {
			console.error("Fallo en el metodo boss")
			console.error(e)
		}
	}
	else {
		client.channels.cache.get(data.channelResponse).send("Comando desconocido, redireccionando a la lista de comandos:");
		functions.help(client);
	}
});

client.login(data.token);