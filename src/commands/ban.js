const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");



exports.run = async (client, message, args, con) => {
    message.delete();

    if(!message.member.permissions.has("BAN_MEMBER")) return message.reply({content: `You do not have permission to use this command!`}).then(msg => { setTimeout(() => msg.delete(), 10000); });
    let member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
    if(!member) return message.reply({content: `You must mention a user or provide a user ID!`}).then(msg => { setTimeout(() => msg.delete(), 10000); });
    if (member.permissions.has("ADMINISTRATOR")) return message.reply({content: `You cannot ban this user!`}).then(msg => { setTimeout(() => msg.delete(), 10000); });
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided.";

    con.query('INSERT INTO `moderation` (`action`, `perpid`, `reason`, `moderator`) VALUES (?, ?, ?, ?)', ["Ban", member.id, reason, message.author.id], async (err, rows) => {
        if(err) throw err;
        message.channel.send({ content: `**${member} has been banned for:** ${reason}` }).then(() => {
            member.send(`You have been banned from ${message.guild.name} for: ${reason}`).then(() => {
                member.ban({ deleteMessageDays: 7, reason: reason });
            })
        });

        con.query('SELECT * FROM `moderation` WHERE `caseid` = ?', [rows.insertId], async (err, rows) => {
            let embed = new MessageEmbed()
            .setColor("#FAD69E")
            .setTitle("New Ban Entry")
            .setDescription(`Perp: ${member} (${member.id})\nModerator: ${message.author} (${message.author.id})\nReason: ${reason}\nCase ID: \`${rows[0].caseid}\``)
            .setTimestamp() 
            let logch = await client.channels.fetch(config.logging.modlog);  
            logch.send({ embeds: [embed] }); 
        });
    });
}

exports.info = {
    name: "ban",
    description: "See if im alive!",
    aliases: []
}