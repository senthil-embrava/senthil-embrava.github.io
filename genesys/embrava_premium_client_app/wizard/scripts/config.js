export default {
    clientIDs: {
        //'mypurecloud.com': 'e93d91c6-481d-4238-835d-566c425aab46',
		'mypurecloud.com': '0b4127c4-6bd7-47a2-b9a2-e0fe274da287',
        'mypurecloud.ie': '41c93e94-ba9e-4c5e-bf9a-f9ee0b043420',
        'mypurecloud.com.au': 'd08762cb-d5fd-4447-88ae-c138a374ce31'
    },
    "redirectUri": "https://senthil-embrava.github.io/genesys/embrava_premium_client_app/wizard/index.html",
    
    //Permissions required for running the Wizard App
    "setupPermissionsRequired": ['admin'],

    // To be added to names of PureCloud objects created by the wizard
    "prefix": "STATUS_LIGHTS_FOR_PURECLOUD_",
}