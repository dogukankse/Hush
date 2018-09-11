/* jshint esversion: 6 */
const Discord = require('discord.js');
const client = new Discord.Client();

const regex = new RegExp('(!spoil)( )(100|[1-9][1-9]?)$');

let spoiler = [];

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log('Connected as ' + client.user.tag + ' to');
  client.guilds.forEach(guild => {
    console.log('    ' + guild.name + ' - ' + guild.id);
  });
});

client.on('message', receivedMessage => {
  if (receivedMessage.author == client.user) {
    return;
  }

  /*
  comments
    !cleanhush
    !spoiler
    !spoil #id
  */

  if (receivedMessage.content.startsWith('!spoilerlist')) {
    spoiler.forEach(spoiler => {
      receivedMessage.channel.send(spoiler.spoiler, spoiler.author);
    });
  }

  if (receivedMessage.content.startsWith('!cleanhush')) {
    receivedMessage.delete();
    receivedMessage.channel.send('Spoilerler temizlendi');
    spoiler = [];
  }

  if (
    receivedMessage.content.startsWith('!spoiler') &&
    !receivedMessage.content.startsWith('!spoilerlist')
  ) {
    let element = {
      spoiler: receivedMessage.content.slice(8),
      author: receivedMessage.author,
      recived: []
    };
    spoiler.push(element);
    receivedMessage.delete();
    console.log(spoiler);
    checkStatus(receivedMessage);
    receivedMessage.channel.send(
      receivedMessage.author.username +
        ' tarafından yeni bir spoiler, almak için "!spoil ' +
        spoiler.length +
        '" yazınız. '
    );
  }

  if (regex.test(receivedMessage.content)) {
    let id = receivedMessage.content.split(' ');
    let username = receivedMessage.author.username;
    id = id[1] - 1;
    spoiler[id].recived.push(username);
    receivedMessage.author.send(spoiler[id].spoiler);
    receivedMessage.channel.send(
      username + ' spoiler alarak tüm heycanı bozdu :('
    );
  }
});

function checkStatus(receivedMessage) {
  if (spoiler.length == 50) {
    return receivedMessage.channel.send('Spoiler listesinin yarısı doldu!');
  }
  if (spoiler.length == 90) {
    return receivedMessage.channel.send('Spoiler listesi dolmak üzere!');
  }
  if (spoiler.length == 100) {
    spoiler = [];
    return receivedMessage.channel.send('Spoiler listesi doldu!');
  }
}
