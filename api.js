const { entireChatToFile } = require('./twitch');
const { analyzeChat } = require('./sentiment');

// Get minute-by-minute sentiment data for the chat of the given video
const chatByMinute = async (req, res) => {
    const videoId = req.params.videoId;
    const apiClient = req.app.get('apiClient');
    
    try {
        // Get video metadata
        const video = (await apiClient.helix.videos.getVideoById(videoId));

        // Get chat
        await entireChatToFile(apiClient, videoId, video.durationInSeconds);

        // Run sentiment analysis
        const sentiments = await analyzeChat(videoId);

        // Get minute-by-minute magnitude data
        let minuteData = {};
        for (var msg of sentiments) {
            const minute = Math.floor(msg.seconds / 60);

            if (minuteData[minute] === undefined) {
                minuteData[minute] = {
                    sum: 0,
                    count: 0,
                };
            }

            minuteData[minute].sum += (msg.sentiment.magnitude * msg.sentiment.score);
            minuteData[minute].count++;
        }

        res.status(200);
        res.json({
            video: {
                id: video.id,
                title: video.title,
                url: video.url
            },
            magnitudeAvgs: minuteData,
            success: true,
        });
    } catch (e) {
        console.error(e);
        res.status(500);
        res.json({
            error: "Internal server error",
            success: false
        })
    }    
};

module.exports = (app) => {
    app.get('/chatByMinute/:videoId', chatByMinute);
};