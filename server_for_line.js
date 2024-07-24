// const HomePlayer = require("google-home-player");
// const { exit } = require("process");

// // 初期設定
// const ip = "192.168.50.35"
// const lang = "ja"
// const googleHome = new HomePlayer(ip, lang);

// ; (async () => {
//     await googleHome.say("first text")
//     await googleHome.say("second text", "en") // 第二引数で言語を指定
//     await googleHome.say("final text", "en", true) // 第三引数でslowの有効/無効を指定
// })()

var GoogleHomePlayer = require('google-home-player');

var ip = '192.168.50.35'

var googleHome = new GoogleHomePlayer(ip, 'en');
googleHome
  .say('first text')
  .then(function() {
    return googleHome.say('second text', 'ja', true);
  })
  .then(function() {
    return googleHome.say('final text');
  })
  .then(function() {
    console.log('done');
  })
  .catch(function(err) {
    console.error(err);
  });