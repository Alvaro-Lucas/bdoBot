const fs = require('fs');
const data = require("../config.json");
const Discord = require('discord.js');
const refresco = 1000 * 60

let timedCheck = undefined;

function sleep (milliseconds) {
    let date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

module.exports = {
    help: function (client) {
        const embed = new Discord.MessageEmbed()
            .setTitle('Comandos disponibles')
            .setDescription("A continuacion se mostraran los comandos actualmente disponibles para el bot de BDO")
            .addField('-next', 'Muestra el siguiente boss que aparecerá y la hora en la que aparece')
            .addField('-corcel', 'Muestra las habilidades necesarias para que un caballo sea considerado corcel')
            .addFields(
                { name: '-fls boss', value: 'Muestra los failstacks recomendados para el equipamiento de boss', inline: true, },
                { name: '-fls acc', value: 'Muestra los failstacks recomendados para los accesorios', inline: true, },
                { name: '-fls bs', value: 'Muestra los failstacks recomendados para el equipamiento de Blackstar', inline: true, }
            )
        client.channels.cache.get(data.channelResponse).send(embed);
    },

    next: function (client) {
        let timeTable = fs.readFileSync('./timetable.json', 'utf8');
        timeTable = JSON.parse(timeTable);

        let date = new Date();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        //Se comprueba si dentro de 15 minutos hay boss
        //Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 15 minutos
        let bossNow = timeTable.filter(bossNow => bossNow.day === date.getDay() && bossNow.hour >= hour);
        //Si obtiene algun resultado, lo indica
        if (!bossNow.length == 0) {
            for (let item of bossNow) {
                if (item.hour == hour && item.min >= minutes)	//Si estoy en la zona horaria del boss pero este ya ha pasado (los minutos controlan si ha spwaneado o no)
                {
                    client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + item.boss + " a las " + item.hour + ":" + item.min, { tts: true });
                    break;
                }
                else if (item.hour > hour) {
                    client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + item.boss + " a las " + item.hour + ":" + item.min, { tts: true });
                    break;
                }
            }
        }
        else {
            bossNow = timeTable.filter(bossNow => bossNow.day === ((date.getDay() + 1) % 7));
            client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + bossNow[0].boss + " a las " + bossNow[0].hour + ":" + bossNow[0].min, { tts: true });
        }
    },

    corcel: function (client) {
        client.channels.cache.get(data.channelResponse).send(`Las habilidades para corcel T8 son:`);
        client.channels.cache.get(data.channelResponse).send(`-Carga`, { files: ["img/carga.png"] });
        client.channels.cache.get(data.channelResponse).send(`-Deslizarse`, { files: ["img/deslizarse.png"] });
        client.channels.cache.get(data.channelResponse).send(`-Esprint`, { files: ["img/esprint.png"] });
        client.channels.cache.get(data.channelResponse).send(`-Aceleración Instantanea`, { files: ["img/aceleracion.png"] });
        client.channels.cache.get(data.channelResponse).send(`-Movimiento Lateral`, { files: ["img/movimientoLateral.png"] });
        client.channels.cache.get(data.channelResponse).send(`-S:Aceleración Instantanea`, { files: ["img/aceleracionS.png"] });
        client.channels.cache.get(data.channelResponse).send(`-S:Movimiento Lateral`, { files: ["img/movimientoLateralS.png"] });
    },

    fls: function (client, equipment) {
        if (equipment === 'boss') {
            client.channels.cache.get(data.channelResponse).send("", { files: ["img/boss.png"] })
        }
        else if (equipment === 'acc') {
            client.channels.cache.get(data.channelResponse).send("", { files: ["img/accesorios.png"] })
        }
        else if (equipment === 'bs') {
            client.channels.cache.get(data.channelResponse).send("", { files: ["img/blackstar.png"] })
        }
        else {
            client.channels.cache.get(data.channelResponse).send("Desconozco los failstacks para el equipamiento del que preguntas.\nIntroduce el equipamiento correcto:")
            this.help(client);
        }
    },

    boss: function (state) {
        //Lee el json con los datos sobre los bosses
        let timeTable = fs.readFileSync('./timetable.json', 'utf8');
        timeTable = JSON.parse(timeTable);

        if (state === 'on') {
            let date = new Date();
            let second = date.getSeconds();

            //Reloj para que realice las funciones partiendo del segundo 0 (mayor precision a la hora de avisar de los boses)
            sleep((60 - second) * 1000);
            date = new Date();
            if (!timedCheck) {
                timedCheck = setInterval(() => {
                    //Comprobamos a parte el tiempo de Vell ya que se quiere que avise con una mayor antelacion
                    let vellBoss = timeTable.filter(bossNow => bossNow.boss === "Vell");
                    for (let item of vellBoss) {
                        if (item.day == date.getDay()) {
                            let hour = date.getHours();
                            let minutes = date.getMinutes() + 30;	//Queremos avisar con 30 min de antelacion

                            if (minutes > 60)	//Comprobamos que los minutos no hayan superado los 60
                            {
                                minutes = minutes - 60;	//En caso afirmativo, los reducimos a una cantidad entre 0 y 60 e incrementamos las horas en 1
                                hour++;
                            }
                            if (item.hour == hour && item.min == minutes)	//Si la hora del boss coincide con la hora actual +30 min, avisa del jefe
                                message.channel.send("<@&" + data.groupId + "> " + item.boss + " en 30 minutos", { tts: true });
                        }
                    }

                    /*Obtengo la hora y dia actuales*/
                    date = new Date();
                    let hour = date.getHours();
                    let minutes = date.getMinutes() + 10;
                    let day = date.getDay();
                    //Se comprueba si dentro de 15 minutos hay boss
                    if (minutes > 59) {
                        minutes = minutes - 60;
                        hour++;
                        if (hour > 23) {
                            hour = 0;
                            day = (day + 1) % 7;
                        }
                    }
                    //Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 10 minutos
                    let bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
                    //Si obtiene algun resultado, lo indica
                    if (!bossNow.length == 0)
                        message.channel.send("<@&" + data.groupId + "> " + bossNow[0].boss + " en 10 minutos", { tts: true });

                    date = new Date();
                    hour = date.getHours();
                    minutes = date.getMinutes() + 1;
                    day = date.getDay();

                    if (minutes > 59) {
                        minutes = minutes - 60;
                        hour++;
                        if (hour > 23) {
                            hour = 0;
                            day = (day + 1) % 7;
                        }
                    }
                    //Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 1 minutos
                    bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
                    //Si obtiene algun resultado, lo indica
                    if (!bossNow.length == 0)
                        message.channel.send("<@&" + data.groupId + "> " + bossNow[0].boss + " en 1 minutos", { tts: true });

                }, refresco);
                message.channel.send('message command started!');
            } else {
                return message.channel.send(`command already running!`);
            }
        }
        else if (state === 'off') {
            if (timedCheck) {
                message.channel.send(`has turned off command!`);
                clearInterval(timedCheck);
                timedCheck = undefined;
            } else {
                return message.channel.send(`command already offline!`);
            }
        }
        else {
            message.channel.send('invalid argument specified.');
        }
    },

    /*Nada mas encender el bot, iniciara la funcion de informar sobre los bosses*/
    bossNow: function (client) {
        let date = new Date();
        let second = date.getSeconds();
        //Reloj para que realice las funciones partiendo del segundo 0 (mayor precision a la hora de avisar de los boses)
        sleep((60 - second) * 1000);

        timedCheck = setInterval(() => {
            //Comprobamos a parte el tiempo de Vell ya que se quiere que avise con una mayor antelacion
            let timeTable = fs.readFileSync('./timetable.json', 'utf8');
            timeTable = JSON.parse(timeTable);

            let vellBoss = timeTable.filter(bossNow => bossNow.boss === "Vell");
            let date = new Date();
            for (let item of vellBoss) {
                if (item.day == date.getDay()) {
                    let date = new Date();
                    let hour = date.getHours();
                    let minutes = date.getMinutes() + 30;	//Queremos avisar con 30 min de antelacion

                    if (minutes > 59)	//Comprobamos que los minutos no hayan superado los 60
                    {
                        minutes = minutes - 60;	//En caso afirmativo, los reducimos a una cantidad entre 0 y 60 e incrementamos las horas en 1
                        hour++;
                    }
                    if (item.hour == hour && item.min == minutes)	//Si la hora del boss coincide con la hora actual +30 min, avisa del jefe
                        client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + item.boss + " en 30 minutos", { tts: true });
                }
            }

            /*Obtengo la hora y dia actuales*/
            date = new Date();
            let hour = date.getHours();
            let minutes = date.getMinutes() + 10;
            let day = date.getDay();
            //Se comprueba si dentro de 15 minutos hay boss
            if (minutes > 59) {
                minutes = minutes - 60;
                hour++;
                if (hour > 23) {
                    hour = 0;
                    day = (day + 1) % 7;
                }
            }
            //Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 10 minutos
            let bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
            //Si obtiene algun resultado, lo indica
            if (!bossNow.length == 0)
                client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + bossNow[0].boss + " en 10 minutos", { tts: true });

            date = new Date();
            hour = date.getHours();
            minutes = date.getMinutes() + 1;
            day = date.getDay();

            if (minutes > 59) {
                minutes = minutes - 60;
                hour++;
                if (hour > 23) {
                    hour = 0;
                    day = (day + 1) % 7;
                }
            }
            //Busca en el array de bosses si hay algun boss cuya hora coincida con la actual + 1 minutos
            bossNow = timeTable.filter(bossNow => bossNow.day === day && bossNow.hour === hour && bossNow.min === minutes);
            //Si obtiene algun resultado, lo indica
            if (!bossNow.length == 0)
                client.channels.cache.get(data.channelResponse).send("<@&" + data.groupId + "> " + bossNow[0].boss + " en 1 minuto", { tts: true });

        }, refresco);
        client.channels.cache.get(data.channelResponse).send('message command started!');
    },
};