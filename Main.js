
const { Client, Collection, Intents } = require("discord.js");
const Register = require("./Helper's/MongooseSchema/RegisteryNames")
const messageUserChannel = require("./Helper's/MongooseSchema/StatisticSchema/messageUserChannelsSchema");
const voiceUserChannel = require("./Helper's/MongooseSchema/StatisticSchema/voiceUserChannelSchema");
const messageUser = require("./Helper's/MongooseSchema/StatisticSchema/messageUserSchema");
const voiceUser = require("./Helper's/MongooseSchema/StatisticSchema/voiceUserSchema");
const voiceUserParent = require("./Helper's/MongooseSchema/StatisticSchema/voiceUserParent");
const kategori = require("./Helper's/MongooseSchema/StatisticSchema/ParentsVoice")
const inviterSchema = require("./Helper's/MongooseSchema/İnviter");
const inviteMemberSchema = require("./Helper's/MongooseSchema/İnviteMember");

const client = global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});

const { readdir } = require("fs");
client.channelTime = new Map()
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
const Settings = require("./Helper's/Settings.json")
require("./Helper's/DatabaseHandler");
require("./InvıteClient")
require("./StatClient")
require("./Helper's/Function")(client)
client.Snipe = new Set()
client.blockedFromCommand = []
client.commandBlock = new Map()
client.snipe = new Map()
client.invites = global.invites = new Map();
const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require('@discordjs/voice');
const chatguard = require("./Helper's/MongooseSchema/chatGuard")
const chatguardcount = require("./Helper's/MongooseSchema/chatGuardCount")
const Database = require("./Helper's/MongooseSchema/ExecutorModel")
const sunucuVeri = require("./Helper's/MongooseSchema/_setup")

const { MessageEmbed } = require("discord.js");
const moment = require("moment")
const ms = require("ms")
var logs = require("discord-logs")
logs(client)
const rollogg = require("./Helper's/MongooseSchema/roleLog");

readdir("./Command's/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./Command's/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let prop = require(`./Command's/${f}/` + file);
        commands.set(prop.name, prop);
        prop.aliases.forEach(alias => {
        aliases.set(alias, prop.name);
        });
      });
    });
  });
});
//DEVELOPED BY RAVGAR/WEX
readdir("./Event's/", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let prop = require(`./Event's/${file}`); //DEVELOPED BY RAVGAR/WEX
    if (!prop.conf) return;
    client.on(prop.conf.name, prop);
  });
});

  client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!oldState.channelId && newState.channelId) { //DEVELOPED BY RAVGAR/WEX
      //  let users = newState.guild.members.cache.get(newState.id)
  let member = newState.guild.members.cache.get(newState.id)
  let microphone = member.voice.selfMute ? "kapalı" : "açık";
  let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
  let Embed = new MessageEmbed().setColor("GREEN")
  .setColor("GREEN")
  .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
  .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
  .setDescription(`<@${newState.member.user.id}> üyesi <#${newState.channel.id}> kanalına giriş yaptı.\n\n**Kanala girdiği anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\`\`\`Giridiği kanal: ${newState.channel.name} (${newState.channelId})\nKullanıcı: ${newState.member.user.tag} (${newState.member.user.id})\nEylem Gerçekleşme: ${moment(newState.createdAt).locale("tr").format('LLL')}\n\n\n\`\`\`\nGirdiği kanalda bulunan üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
  return client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [Embed]})}});
//DEVELOPED BY RAVGAR/WEX
//DEVELOPED BY RAVGAR/WEX
  client.on('voiceStateUpdate', async (oldState, newState) => {
    if(oldState.channelId && !newState.channelId){
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else { var makro = "Maalesef bu kanalda üye bulunmamaktadır."; }
    let SesMicEmbed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından ayrıldı.\n\n**Kanaldan Çıktığı anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\nÇıktığı kanalda bulunan üyeler:\n${makro}`)   
    return client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [SesMicEmbed]})}});
  
    client.on('voiceStateUpdate', async (oldState, newState) => {
      //console.log("sa") 
    if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
    if (oldState.channelId !== newState.channelId) {
    //console.log("sam")
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else {
    var makro = "Maalesef bu kanalda üye bulunmamaktadır.";}
    let SesMicEmbed1 = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından <#${newState.channel.id}> kanalına geçiş yaptı.\n\n**Kanal Değiştirdiği Anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\n\nEski Kanalında Bulunan Üyeler:\n${makro}\n\nYeni Kanalında Bulunan Üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
    return client.channels.cache.find(a => a.name === "ses-log").send({embeds: [SesMicEmbed1]})}}});   
  


    client.on("interactionCreate", async interaction => {
        const member = await client.guilds.cache.get(Settings.guildID).members.fetch(interaction.member.user.id)
        const convert = async (parentsArray) => {
                const data = await voiceUserParent.find({ guildID: member.guild.id, userID: member.id });
                const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
                let voiceStat = 0;
                for (var i = 0; i <= voiceUserParentData.length; i++) {
                    voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
                }
               return moment.duration(voiceStat).format("H [saat], m [dakika]");
            };
            const filteredParents = member.guild.channels.cache.filter((x) =>
        x.type === "convert" &&
        !Settings.PublicParents.includes(x.id) && !Settings.RegisterParents.includes(x.id) && !Settings.PrivateParent.includes(x.id) && !Settings.SolvingParent.includes(x.id) && !Settings.TerapiParent.includes(x.id) && !Settings.StreamerParent.includes(x.id) && !Settings.VKDCParent.includes(x.id)
        );

            
            const Active1 = await messageUserChannel.find({ guildID: member.guild.id, userID: member.id }).sort({ channelData: -1 });
            const Active2 = await voiceUserChannel.find({ guildID: member.guild.id, userID: member.id }).sort({ channelData: -1 });
            let voiceTop;
            let messageTop;
            Active1.length > 0 ? messageTop = Active1.splice(0, 5).map(x => `#${member.guild.channels.cache.get(x.channelData) ? member.guild.channels.cache.get(x.channelID).name : x.channelID }  \`${Number(x.channelData).toLocaleString()} mesaj\``).join("\n") : messageTop = "Mesaj Verisi Bulunamadı.";
            Active2.length > 0 ? voiceTop = Active2.splice(0, 5).map(x => `${member.guild.channels.cache.get(x.channelID) ? member.guild.channels.cache.get(x.channelID).name : x.channelID }: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join("\n") : voiceTop = "Ses Verisi Bulunamadı.";
            
            const messageData = await messageUser.findOne({ guildID: member.guild.id, userID: member.id });
            const voiceData = await voiceUser.findOne({ guildID: member.guild.id, userID: member.id });    
            const PublicKategori = `${Settings.PublicParenName}: \`${await convert(Settings.PublicParents)}\``
            const RegiterKategori = `${Settings.RegisterParentName}: \`${await convert(Settings.RegisterParents)}\``
            const SorunCözmeKategori = `${Settings.SolvingParentName}: \`${await convert(Settings.SolvingParent)}\``
            const TerapiKategori = `${Settings.TerapiParentName}: \`${await convert(Settings.TerapiParent)}\``
            const PrivateKategori = `${Settings.PrivateParentName}: \`${await convert(Settings.PrivateParent)}\``
            const VkDcKategori = `${Settings.VKDCParentName}: \`${await convert(Settings.VKDCParent)}\``
            const StreamerKaegori = `${Settings.StreamerParentName}: \`${await convert(Settings.StreamerParent)}\``
            const diğerKategori = `${Settings.DigerParentName}: \`${await convert(filteredParents.map(x => x.id))}\``		
//DEVELOPED BY RAVGAR/WEX
            const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
            const total = inviterData ? inviterData.total : 0;
            const regular = inviterData ? inviterData.regular : 0;
            const bonus = inviterData ? inviterData.bonus : 0;
            const leave = inviterData ? inviterData.leave : 0;
            const fake = inviterData ? inviterData.fake : 0;
            const invMember = await inviteMemberSchema.find({ guildID: member.guild.id, inviter: member.user.id });
            const daily = invMember ? member.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24).size : 0;
            const weekly = invMember ? member.guild.members.cache.filter((m) => invMember.some((x) => x.userID === m.user.id) && Date.now() - m.joinedTimestamp < 1000 * 60 * 60 * 24 * 7).size : 0;    
    
        let Embed = new MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setFooter(Settings["Client.Bot.Footer"]).setColor("ORANGE");
        let nickname = member.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName
        const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
        const rolleri = [];
        if (roles.length > 6) { const lent = roles.length - 6; let itemler = roles.slice(0, 6); itemler.map(x => rolleri.push(x)); rolleri.push(`${lent}...`); } else { roles.map(x => rolleri.push(x));};    
        if (interaction.customId === 'serverProfileUser') {await interaction.reply({ embeds: [Embed.setDescription(`**❯ Kullanıcı Bilgisi**\n\`•\` Hesap: ${member}\n\`•\` Kullanıcı ID: \`${member.id}\`\n\`•\` Kuruluş Tarihi: \`${moment(member.user.createdTimestamp).locale("tr").format("LLL")}\` - (<t:${Math.floor(Math.floor(member.user.createdTimestamp) / 1000)}:R>)\n\n**❯ Sunucu Bilgisi**\n\`•\` Sunucu İsmi: \`${nickname}\`\n\`•\` Katılım Tarihi: \`${moment(member.joinedAt).locale("tr").format("LLL")}\` -(<t:${Math.floor(Math.floor(member.joinedAt) / 1000)}:R>)\n\`•\` Rolleri (${rolleri.length}): ${rolleri.join(", ")}`)], ephemeral: true})}
        if (interaction.customId === 'serverNameHistroy') {
        Register.findOne({guildID: interaction.guild.id, victimID: member.id}, (err, res) => {
        if(!res) { return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "ravgar_carpi") || "Emoji Bulunamadı"} Databasede kayıtlı bir isim geçmişi bulunamadı.`, ephemeral: true})} else { const History = res.nicknames.reverse().map((e, i) => ` \`${i + 1}.\` \`${e.isimler}\` (**${e.rol}**) - <@${e.execID}> - <t:${Math.floor(Math.floor(e.date) / 1000)}:R>`).slice(0, 30); interaction.reply({ embeds: [Embed.setDescription(`**${interaction.guild.name}** sunucusuna ait son \`30\` isim geçmişiniz aşağıda listelenmiştir.\n\n${History.join("\n")}\n\n${client.emojis.cache.find(x => x.name === "ravgar_carpi") || "Emoji Bulunamadı"} üyenin \`${History.length}\` adet geçmiş ismi görüntülendi.`)], ephemeral: true})}})}
                
        if (interaction.customId === 'serverStatsUser') {
        const StatEmbed = new MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setThumbnail(member.user.avatarURL({dynamic: true})).setFooter(Settings["Client.Bot.Footer"]).setColor("RANDOM");
        StatEmbed.addField(`${client.emojis.cache.find(x => x.name === "ravgar_ses")} Önemli Kategori Listesi`, `${PublicKategori} \n${RegiterKategori}\n${SorunCözmeKategori}\n${TerapiKategori}`, true)
        StatEmbed.addField(`Diğer Kategori Listesi`, `\n${PrivateKategori}\n${VkDcKategori}\n${StreamerKaegori}\n${diğerKategori}`, true)
        StatEmbed.addField(`${client.emojis.cache.find(x => x.name === "ravgar_mesaj")} Genel Mesaj Listesi`, `${messageTop}`)
        StatEmbed.setDescription(`${member} üyesinin \`${member.guild.name}\` sunucusunda tüm zamanları içeren genel ses ve mesaj bilgileri aşağıda belirtilmiştir.`)    
        await interaction.reply({ embeds: [StatEmbed], ephemeral: true})}
        if (interaction.customId === 'serverDavetUser') {
        await interaction.reply({ embeds: [Embed.setDescription(`Toplam **${total}** davetin var! (**${regular}** gerçek, **${leave}** ayrılmış, **${fake}** fake, **${weekly}** haftalık)`)], ephemeral: true})}
        if (interaction.customId === 'serverSicilUser') {
                Database.find({victimID: member.id}, async (err, res) => {
                        if (res.length <= 0) return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "ravgar_carpi") || "Emoji Bulunamadı"} Databasede kayıtlı bir ceza-i işlem geçmişi bulunamadı.`, ephemeral: true})
                        let listed = res.reverse();
                      let History = listed.map((x, index) => `Ceza Durumu  => ${x.activity == true ? "🟢 (Devam Ediyor)" : x.Bitis == "null" ? "🔴 (Bitti)" : "🔴 (Bitti)"}\nID => ${x.cezaID}\nTür => ${x.Type}\nYetkili => ${interaction.guild.members.cache.get(x.execID) ? interaction.guild.members.cache.get(x.execID).displayName : x.execID } (${x.execID})\nTarih => ${moment(Number(x.dateNow)).locale("tr").format("LLL")}\nBitiş Tarihi => ${x.finishDate == "null" ? "KALICI" : x.finishDate == "KALICI" ? "KALICI" : moment(Number(x.finishDate)).locale("tr").format("LLL")}\nSebep => ${x.Reason} `, "").slice(0,1) 
                      let History2 = listed.map((x, index) => `\n \`${index + 1}.\` **[${x.Type}]** <@${x.execID}>  tarafından **${x.Reason}** sebebiyle cezalandırıldı.\`(#${x.cezaID})\``).slice(0,20) 
                      if (res.length > 20) return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "ravgar_carpi") || "Emoji Bulunamadı"} Databasede 20'den fazla ceza-i işlemin bulundugu için cezalarını listeyemiyorum.`, ephemeral: true})                
        await interaction.reply({ embeds: [Embed.setDescription(`Sunucu İçerisinde Toplam \`${res.length}\` ceza-i işlemin bulunmakta.\n**SON CEZASI**\`\`\`php\n${History}\`\`\`${History2}`)], ephemeral: true})})}
//DEVELOPED BY RAVGAR/WEX
                      })

client.login(Settings["Client.Token"]).then(() => console.log("Main_Client Aktif!")).catch(() => console.log("Main_Client Aktif Edilemedi!"));
