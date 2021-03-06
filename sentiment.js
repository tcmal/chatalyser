const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

const { BUCKET_NAME } = require('./twitch');

// Analyze the sentiment of the given video's chat
// This assumes the chat is in gcp://BUCKET_NAME/videoId, see twitch.entireChatToFile
const analyzeChat = async function (videoId) {
    const [sentiment] = await client.analyzeSentiment({
        document: {
            gcsContentUri: 'gs://' + BUCKET_NAME + '/' + videoId,
            type: 'PLAIN_TEXT'
        }
    });

    return sentiment.sentences.map(x => ({
        sentiment: x.sentiment,
        seconds: parseInt(x.text.content.split(": ")[0]),
        text: x.text.content.split(": ")[1],
    }));
}

module.exports = { analyzeChat };