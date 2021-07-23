const Discord = require('discord.js')
const client = new Discord.Client()
const DisTube = require('distube')
const config = require('./config.json')
require("discord-buttons")(client);
const token = config.token;
const prefix = config.prefix;
const fs = require('fs')
const mongoose = require('mongoose')



// Handlers
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.categories = fs.readdirSync("./commands/");
module.exports = client;
["handler"].forEach(handler => {
    require(`./handlers/${handler}`)(client);







});




client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: false });

client.distube

.on("playSong", (message, queue, song) => {
    let playingEmbed = new Discord.MessageEmbed()
    playingEmbed.setColor("#FFFF00")
    playingEmbed.setTitle(`🎵 Started Playing 🎵`)
    playingEmbed.addField('Name', song.name), true
    playingEmbed.addField('Duration', song.formattedDuration, true)
    playingEmbed.addField(`Requsted by`, song.user, true)
    playingEmbed.setThumbnail(song.thumbnail)
    playingEmbed.addField('Views', song.views, '\u200b', true)
    playingEmbed.setFooter(`Likes👍:  ${song.likes} `)
    playingEmbed.setTimestamp()


    message.channel.send(playingEmbed)
})
.on("addSong", (message, queue, song) => {
    let queueEmbed = new Discord.MessageEmbed()
    .setColor("#FFFF00")
    .setTitle(`✅ Added to the Queue ✅`)
    .setDescription(`[** ${song.name} - ${song.formattedDuration} **](${song.url})`)
    .setFooter(`Requested by ${song.user.tag}`)
    message.channel.send(queueEmbed)
})
.on("playList", (message, queue, playlist, song) => {

    message.channel.send(`Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\``)
})
.on("addList", (message, queue, playlist) => message.channel.send(
    `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue`
))
// DisTubeOptions.searchSongs = true
.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
})
// DisTubeOptions.searchSongs = true
.on("searchCancel", (message) => message.channel.send(`**Searching canceled!**`))
.on("error", (message, e) => {
    console.error(e)
    message.channel.send("An error encountered: " + e);
})

.on('initQueue', queue => {
    queue.autoplay = false;
    queue.volume = 50;
})










client.login(token)