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

var accessToken = null;
var requestParams = new Object();

// Will Authenticate through PureCloud and subscribe to User Conversation Notifications
clientApp.setup = function(pcEnv, langTag, html){
    let clientId = clientIDs[pcEnv] || clientIDs['mypurecloud.com'];
    clientApp.langTag = langTag;

    // Authenticate via PureCloud
    client.setPersistSettings(true);
    client.loginImplicitGrant(clientId, redirectUri + html, { state: "state" })
    .then(data => {
        console.log(data);
        
        if (data != null) {
            accessToken = data.accessToken;
            var appActiveSignalInterval = setInterval(sendAccessTokenAsHeartBeat, 5000);
        }
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
    }).then(
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

window.onbeforeunload = function () {		
    
    return;
}; 

window.onunload = function () {
    
    return;
};
	
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function sendAccessTokenAsHeartBeat() {
    console.log("Access Token:" + accessToken);

    /*if (accessToken != null) {
        var http = new XMLHttpRequest();
        var url = "http://localhost:9052" + "/" + "?" + "accessToken=" + accessToken;
			
        http.open("GET", url, true);
        http.timeout = 5000;
        //http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //http.send(JSON.stringify({ response: { accessToken: accessToken } }));
        http.send();
    }  */  

    if (accessToken != null) {
        requestParams.pameterType = "AccessToken";
        requestParams.accessToken = accessToken;
        $.ajax({
            type: "GET",
            data: JSON.stringify(requestParams),
            url: "http://localhost:9052",
            dataType: "jsonp"
        });
    }

    /*if (accessToken != null) {
        jQuery.post("http://localhost:9052",accessToken).complete(function(data) {
            console.log(data); 
        });
    }*/
};

export default clientApp
