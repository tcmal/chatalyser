const fetch = require('node-fetch');
const {Storage} = require('@google-cloud/storage');

// How long a message should be to be considered
const MSG_LENGTH_THRESHOLD = 10;

// The bucket to put chat logs in
const BUCKET_NAME = 'htb7-chats';

const storage = new Storage();
const bucket = storage.bucket(BUCKET_NAME);


// Dump the entire chat of the given video id to a file in cloud storage
const entireChatToFile = async function(client, videoId, videoLength) {
    // Create handle to file
    const f = bucket.file(videoId);

    if (f.exists()) {
        // We're already done
    }

    const stream = f.createWriteStream();

    // TODO: This is hacky, and we should be able to just use .callApi instead.
    const { accessToken } = await client._config.authProvider.getAccessToken();
    const { clientId } = client._config.authProvider;

    // Next page loop
    let cursor = '';
    let end = false;
    let written = 0; // Sentiment analysis has a cap of 1000000 bytes, so we need to not exceed that
    while (!end) {
        // Undocumented API for video chats.
        // This could change at any time though.
        const chats = await fetch('https://api.twitch.tv/v5/videos/' + videoId + '/comments?cursor=' + cursor, {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': clientId
            }
        }).then(x => x.json());

        for (var x of chats.comments) {
            if (x.message.body.length <= MSG_LENGTH_THRESHOLD)
                continue;
            
            // When we get past the end of the video, it will sometimes start reading into live chat
            // for whatever reason (if the channel is live), so double check.
            if (x.content_offset_seconds >= videoLength) {
                end = true;
                break;
            }

            // Processing so NLP counts it as one sentence.
            const body = x.content_offset_seconds + ": " + x.message.body.replace(/[.!?]/g, ",") + ". \n";
            if (written + body.length > 1000000) {
                end = true;
                break;
            }

            stream.write(body);
            written += body.length;
        }

        cursor = chats._next;
        if (cursor == undefined) {
            break;
        }
    }

    // Save
    stream.end();
}

module.exports = {BUCKET_NAME, entireChatToFile};