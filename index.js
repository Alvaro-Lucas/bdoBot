const functions = require('./utils/commands.js');
const data = require("./config.json");
const comandos = {
	help:functions.help,
	next:functions.next,
	corcel:functions.corcel,
	fls:functions.fls,
	boss:functions.boss
}


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
	
	try{
		comandos[command]({client, "args":args[0]})
	}
	catch(e){
		client.channels.cache.get(data.channelResponse).send("Comando desconocido, redireccionando a la lista de comandos:");
		functions.help(client);
	}
});

client.login(data.token);