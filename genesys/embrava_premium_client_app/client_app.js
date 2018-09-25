/* 
*   NOTE: This sample uses ES6.
*/
import clientIDs from './clientIDs.js';

let clientApp = {};

// PureCloud OAuth information
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
// const redirectUri = "http://localhost:3000/";
const redirectUri = "https://senthil-embrava.github.io/genesys/embrava_premium_client_app/";

// API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const analyticsApi = new platformClient.AnalyticsApi();
const routingApi = new platformClient.RoutingApi();

// Will Authenticate through PureCloud and subscribe to User Conversation Notifications
clientApp.setup = function(pcEnv, langTag, html){
    let clientId = clientIDs[pcEnv] || clientIDs['mypurecloud.com'];
    clientApp.langTag = langTag;

    // Authenticate via PureCloud
    client.setPersistSettings(true);
    client.loginImplicitGrant(clientId, redirectUri + html, { state: "state" })
    .then(data => {
        console.log(data);
        
        // Get Details of current User and save to Client App
        return usersApi.getUsersMe();
    }).then( userMe => {
        clientApp.userId = userMe.id;

        // Create a Notifications Channel
        return notificationsApi.postNotificationsChannels();
    }).then(data => {
        clientApp.websocketUri = data.connectUri;
        clientApp.channelID = data.id;
        clientApp.socket = new WebSocket(clientApp.websocketUri);
        clientApp.socket.onmessage = clientApp.onSocketMessage;
        //clientApp.topicIdAgent = "v2.users." + clientApp.userId + ".presence";

        // Subscribe to Call Conversations of Current user.
        //let topic = [{"id": clientApp.topicIdAgent}];
        //return notificationsApi.postNotificationsChannelSubscriptions(clientApp.channelID, topic);
    }).then(
        $.getJSON('./language.json', function(data) {
            clientApp.language = data;
        })
    ).then(
        data => console.log("Succesfully set-up Client App.")
    )

    // Error Handling
    .catch(e => console.log(e));


};

// Handler for every Websocket message
clientApp.onSocketMessage = function(event){
    let data = JSON.parse(event.data);
    let topic = data.topicName;
    let eventBody = data.eventBody;

    console.log(topic);
    console.log(eventBody);    
};

export default clientApp
