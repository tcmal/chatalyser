// Gets secrets from GCP secret manager
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;

const getConfig = async function() {
    const [twitchClientId] = await client.accessSecretVersion({
        name: "projects/" + GCP_PROJECT + "/secrets/twitch_client_id/versions/latest"
    });
    const [twitchClientSecret] = await client.accessSecretVersion({
        name: "projects/" + GCP_PROJECT + "/secrets/twitch_client_secret/versions/latest"
    });
    return {
        twitchClientId: twitchClientId.payload.data.toString('utf8'),
        twitchClientSecret: twitchClientSecret.payload.data.toString('utf8')
    };
}

module.exports = {getConfig};