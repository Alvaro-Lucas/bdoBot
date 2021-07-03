const {prefix, token} = require('./config.json');
const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();

var timedCheck = undefined;

client.on('ready', ()=>{
	var date = new Date();
	var second = date.getSeconds();
	//Reloj para que realice las funciones partiendo del segundo 0 (mayor precision a la hora de avisar de los boses)
	sleep((60-second)*1000);

	bossNow();
});

function sleep(milliseconds) {
  var date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	message.delete();
});

/* Ejecucion continua que avisa cuando van a aparecer los siguientes bosses (si la funcion automatica cuando se inicia el bot funciona, este metodo se puede eliminar)*/
client.on('message', async message =>{
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	//Lee el json con los datos sobre los bosses
	var timeTable = fs.readFileSync('timetable.json', 'utf8');
	timeTable = JSON.parse(timeTable);

	if (command === 'boss')
	{
		switch (args[0]) 
		  {
		    default: 
		    {
		      message.channel.send('invalid argument specified.');
		      break;
		    }
		    case "on":
		      {
		        if(!timedCheck){
		          timedCheck = setInterval(() =>{
		          	//Comprobamos a parte el tiempo de Vell ya que se quiere que avise con una mayor antelacion
		          	var vellBoss = timeTable.filter(bossNow => bossNow.boss === "Vell");
		          	var date = new Date();
		          	for (item of vellBoss)
		          	{
		          		if(item.day == date.getDay())
		          		{
		          			var date = new Date();
		          			var hour = date.getHours();
							var minutes = date.getMinutes()+30;	//Queremos avisar con 30 min de antelacion

							if(minutes > 60)	//Comprobamos que los minutos no hayan superado los 60
							{
								minutes = minutes - 60;	//En caso afirmativo, los reducimos a una cantidad entre 0 y 60 e incrementamos las horas en 1
								hour++;
							}
							if(item.hour == hour && item.min == minutes)	//Si la hora del boss coincide con la hora actual +30 min, avisa del jefe
								message.channel.send("<@&838448154797408326> "+item.boss + " en 30 minutos",{tts: true});
		          		}
		          	}

					/*Obtengo la hora y dia actuales*/
					date = new Date();
					var hour = date.getHours();
					var minutes = date.getMinutes()+10;
					var day = date.getDay();
					//Se comprueba si dentro de 15 minutos hay boss
					if(minutes > 59)
					{
						minutes = minutes - 60;
						hour++;
						if(hour > 23)
						{
							hour = 0;
							day = (day+1)%7;
						}
					}
					//Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 10 minutos
					var bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
					//Si obtiene algun resultado, lo indica
					console.log("Hora del server: "+hour+":"+minutes);
					console.log(bossNow.length);
					if(!bossNow.length == 0)
						console.log("Hora del boss: "+bossNow[0].hour+":"+bossNow[0].min);
					if(!bossNow.length == 0)
						message.channel.send("<@&838448154797408326> "+bossNow[0].boss + " en 10 minutos",{tts: true});

					date = new Date();
					hour = date.getHours();
					minutes = date.getMinutes()+1;
					day = date.getDay();

					if(minutes > 59)
					{
						minutes = minutes - 60;
						hour++;
						if(hour > 23)
						{
							hour = 0;
							day = (day+1)%7;
						}
					}
					//Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 1 minutos
					var bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
					//Si obtiene algun resultado, lo indica
					console.log("Hora del server: "+hour+":"+minutes);
					console.log(bossNow.length);
					if(!bossNow.length == 0)
						console.log("Hora del boss: "+bossNow[0].hour+":"+bossNow[0].min);
					if(!bossNow.length == 0)
						message.channel.send("<@&838448154797408326> "+bossNow[0].boss + " en 1 minutos",{tts: true});

		          }, 1000*60);
		          message.channel.send('message command started!');
		        } else {
		          return message.channel.send(`command already running!`);
		        }
		        break;
		      }
		    case "off":
		      {
		        if (timedCheck){
		        	message.channel.send(`has turned off command!`);
		        	clearInterval(timedCheck);
		        	timedCheck = undefined;
		        } else {
		          return message.channel.send(`command already offline!`);
		        }
		        break;
		      }
		  }
	}
});

/*Nada mas encender el bot, iniciara la funcion de informar sobre los bosses*/
function bossNow()
{
	timedCheck = setInterval(() =>{
	//Comprobamos a parte el tiempo de Vell ya que se quiere que avise con una mayor antelacion
	var timeTable = fs.readFileSync('timetable.json', 'utf8');
	timeTable = JSON.parse(timeTable);

	var vellBoss = timeTable.filter(bossNow => bossNow.boss === "Vell");
	var date = new Date();
	for (item of vellBoss)
		{
		    if(item.day == date.getDay())
		    {
		        var date = new Date();
		        var hour = date.getHours();
				var minutes = date.getMinutes()+30;	//Queremos avisar con 30 min de antelacion

				if(minutes > 59)	//Comprobamos que los minutos no hayan superado los 60
				{
					minutes = minutes - 60;	//En caso afirmativo, los reducimos a una cantidad entre 0 y 60 e incrementamos las horas en 1
					hour++;
				}
				if(item.hour == hour && item.min == minutes)	//Si la hora del boss coincide con la hora actual +30 min, avisa del jefe
					client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+item.boss + " en 30 minutos",{tts: true});
		    }
		}

		/*Obtengo la hora y dia actuales*/
		date = new Date();
		var hour = date.getHours();
		var minutes = date.getMinutes()+10;
		var day = date.getDay();
		//Se comprueba si dentro de 15 minutos hay boss
		if(minutes > 59)
		{
			minutes = minutes - 60;
			hour++;
			if(hour > 23)
			{
				hour = 0;
				day = (day+1)%7;
			}
		}
		//Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 10 minutos
		var bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
		//Si obtiene algun resultado, lo indica
		console.log("Hora del server: "+hour+":"+minutes);
		console.log(bossNow.length);
		if(!bossNow.length == 0)
			console.log("Hora del boss: "+bossNow[0].hour+":"+bossNow[0].min);
		if(!bossNow.length == 0)
			client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+bossNow[0].boss + " en 10 minutos",{tts: true});

		date = new Date();
		hour = date.getHours();
		minutes = date.getMinutes()+1;
		day = date.getDay();

		if(minutes > 59)
		{
			minutes = minutes - 60;
			hour++;
			if(hour > 23)
			{
				hour = 0;
				day = (day+1)%7;
			}
		}
		//Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 1 minutos
		var bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
		//Si obtiene algun resultado, lo indica
		console.log("Hora del server: "+hour+":"+minutes);
		console.log(bossNow.length);
		if(!bossNow.length == 0)
			console.log("Hora del boss: "+bossNow[0].hour+":"+bossNow[0].min);
		if(!bossNow.length == 0)
			client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+bossNow[0].boss + " en 1 minuto",{tts: true});

	}, 1000*60);
	client.channels.cache.get('838440044494192681').send('message command started!');
};

client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	//message.delete();
	if(command === 'help')
	{
		const embed = new Discord.MessageEmbed()
		.setTitle('Comandos disponibles')
		.setDescription("A continuacion se mostraran los comandos actualmente disponibles para el bot de BDO")
		.addField('-next', 'Muestra el siguiente boss que aparecerá y la hora en la que aparece')
		.addField('-corcel', 'Muestra las habilidades necesarias para que un caballo sea considerado corcel')
		.addFields(
			{name: '-fs boss', value: 'Muestra los failstacks recomendados para el equipamiento de boss', inline: true,},
			{name: '-fs acc', value: 'Muestra los failstacks recomendados para los accesorios', inline: true,},
			{name: '-fs bs', value: 'Muestra los failstacks recomendados para el equipamiento de Blackstar', inline: true,}
			)
		client.channels.cache.get('838440044494192681').send(embed)
	}
});

/* Comando para indicar cual es el siguiente box*/
client.on('message', message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	//message.delete();
	if(command === 'next')
	{
		var timeTable = fs.readFileSync('timetable.json', 'utf8');
		timeTable = JSON.parse(timeTable);
		
		var date = new Date();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		//Se comprueba si dentrod e 15 minutos hay boss
		//Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 15 minutos
		var bossNow = timeTable.filter(bossNow => bossNow.day === date.getDay() && bossNow.hour >= hour);
		//Si obtiene algun resultado, lo indica
		if(!bossNow.length == 0)
		{
			for(item of bossNow)
			{
				if(item.hour == hour && item.min >= minutes)	//Si estoy en la zona horaria del boss pero este ya ha pasado (los minutos controlan si ha spwaneado o no)
				{
					client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+item.boss+" a las "+item.hour+":"+item.min, {tts: true});
					break;
				}
				else if(item.hour > hour)
				{
					client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+item.boss+" a las "+item.hour+":"+item.min, {tts: true});
					break;
				}
			}
		}
		else
		{
			bossNow = timeTable.filter(bossNow => bossNow.day === ((date.getDay()+1)%7));
			client.channels.cache.get('838440044494192681').send("<@&838448154797408326> "+bossNow[0].boss+" a las "+bossNow[0].hour+":"+bossNow[0].min, {tts: true});
		}
	}
});

client.on('message', message =>{
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	//message.delete();
	if(command === 'corcel')
	{
		client.channels.cache.get('838440044494192681').send(`Las habilidades para corcel T8 son:`);
		client.channels.cache.get('838440044494192681').send(`-Carga`, {files:["img/carga.png"]});
		client.channels.cache.get('838440044494192681').send(`-Deslizarse`, {files:["img/deslizarse.png"]});
		client.channels.cache.get('838440044494192681').send(`-Esprint`, {files:["img/esprint.png"]});
		client.channels.cache.get('838440044494192681').send(`-Aceleración Instantanea`, {files:["img/aceleracion.png"]});
		client.channels.cache.get('838440044494192681').send(`-Movimiento Lateral`, {files:["img/movimientoLateral.png"]});
		client.channels.cache.get('838440044494192681').send(`-S:Aceleración Instantanea`, {files:["img/aceleracionS.png"]});
		client.channels.cache.get('838440044494192681').send(`-S:Movimiento Lateral`, {files:["img/movimientoLateralS.png"]});
	}
});

client.on('message', message =>{
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	//message.delete();

	if(command === 'fs')
	{
		switch(args[0])
		{
			case "boss":
			{
				client.channels.cache.get('838440044494192681').send("",{files:["img/boss.png"]})
				break;
			}
			case "acc":
			{
				client.channels.cache.get('838440044494192681').send("",{files:["img/accesorios.png"]})
				break;
			}
			case "bs":
			{
				client.channels.cache.get('838440044494192681').send("",{files:["img/blackstar.png"]})
				break;
			}
		}
	}
});

client.login(token);

//Se conecta al servidor de discord con el token almacenado en la variable de entorno