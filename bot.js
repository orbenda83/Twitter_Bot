const { ETwitterStreamEvent, TweetStream, TwitterApi, ETwitterApiError } = require("twitter-api-v2");
const twit = require("twit");
const config = require("./config");
const { Client } = require("twitter-api-sdk");

const tclient = new Client("AAAAAAAAAAAAAAAAAAAAAAs0dwEAAAAAZSfxtTjNQUngtGjiw7L40pxycnk%3DWuc3ilOdxLMykLsWKXLqEVkWr56x9K7tbrmYnqEc4NkEPGmKGm");

const twitterUsername = '@OmriAgree';

const twitterClient  = new TwitterApi(config);
const client = new TwitterApi();
const Twitter = new twit(config);

(async () => {
    try {
      const getCurrentUser = await twitterClient.v2.me()
      console.dir(getCurrentUser, {
        depth: null,
      });
    } catch (error) {
      console.log(error);
    }
  })();

//   (async () => {
//     try {
//       const res = await twitterClient.v2.tweet('שלום')
//       console.dir(res, {
//         depth: null,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   })();

const streamTweets = async (tweetsFrom) => {
    try {
      const stream = await twitterClient.v2.sampleStream({
        track: tweetsFrom,
      });
      stream.autoReconnect = true;
  
      stream.on(ETwitterStreamEvent.Data, async (tweet) => {
        const senderName = tweet.user.screen_name;
        const senderTweetId = tweet.id_str;
  
        const senderMessage = tweet.full_text;
        console.log('New mention from @'+ senderName + ' 🔔\nThey said: '+ senderMessage);
  
        // get original tweet
        const ogTweetId = tweet.in_reply_to_status_id_str;
        const ogTweet = await twitterClient.v1.singleTweet(ogTweetId);
        console.log(ogTweet);
      });
    } catch (error) {
      console.log('Error code: '+ error.code + '\nError: ' + error.message+ '\nData: ' + error.data);
    }
  };
  
// streamTweets("@OmriAgree");

const streamTweetsNew = async (tweetsFrom) => {
// Not needed to await this!
const stream = client.v2.sampleStream({ autoConnect: false });

// Assign yor event handlers
// Emitted on Tweet
stream.on(ETwitterStreamEvent.Data, console.log);
// Emitted only on initial connection success
stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));

// Start stream!
await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
console.log("here");
};

// streamTweetsNew("@OmriAgree");

//   await client.v1.reply('Look at my video!', tweetIdToReply);
  
// var stream = Twitter.stream('statuses/filter', { track: twitterUsername });

// // Now looking for Tweet events
// // See: https://dev.Twitter.com/streaming/userstreams
// stream.on('tweet', pressStart);

// function pressStart(tweet) {

//     var id = tweet.id_str;
//     var text = tweet.text;
//     var name = tweet.user.screen_name;

//     console.log(id + " -> " + text + ' -> ' + name);
// };


async function main() {
  const stream = tclient.tweets.sampleStream({
    "tweet.fields": ["author_id", "id", "text"],
  });
  for await (const tweet of stream) {
    console.log(tweet.data?.author_id + " -> " + tweet.data?.text);
    var text = tweet.data?.text;

    if (text.indexOf(twitterUsername) !== -1){
        console.log("Got a mention from " + tweet.data?.author_id)
    }
  }
}

main();