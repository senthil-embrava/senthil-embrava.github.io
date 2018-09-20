var DEVICE_NAME_BLYNCLIGHT_PLUS_30S = "Blynclight Plus (BLYNCUSB30S)";
var DEVICE_NAME_BLYNCLIGHT_PLUS_40S = "Blynclight Plus (BLYNCUSB40S)";
var DEVICE_NAME_BLYNCLIGHT_STANDARD_30 = "Blynclight Standard (BLYNCUSB30)";
var DEVICE_NAME_BLYNCLIGHT_STANDARD_40 = "Blynclight Standard (BLYNCUSB40)";
var DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S = "Blynclight Wireless (BLWRLS30)";
var DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S = "Blynclight Wireless (BLWRLS40)";
var DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED = "Embrava Embedded";
var DEVICE_NAME_BLYNCLIGHT_MINI_30S = "Blynclight Mini (BLMINI30)";
var DEVICE_NAME_BLYNCLIGHT_MINI_40S = "Blynclight Mini (BLMINI40)";
var DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 = "Headset Lumena 110";
var DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 = "Headset Lumena 120";
var DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA = "Headset Lumena";

// Report Buffers for Blynclight Devices
var abyBlyncUsb30ReportBuffer = new Uint8Array(8);
var abyBlyncUsbHeadsetReportBuffer = new Uint8Array(15);

var byRedValue = 0x00;
var byGreenValue = 0x00;
var byBlueValue = 0x00;
var byLightControl = 0x00;
var byMusicControl_1 = 0x00;
var byMusicControl_2 = 0x00;

var byMaskLightOnOff = 0x01;
var byMaskLightDimControl = 0x02;
var byMaskLightFlashOnOff = 0x04;
var byMaskLightFlashSpeed = 0x38;
var byMaskMusicSelect = 0x0F;
var byMaskMusicOnOff = 0x10;
var byMaskMusicRepeatOnOff = 0x20;
var byMaskBit6Bit7 = 0xC0;
var byMaskVolumeControl = 0x0F;
var byMaskMute = 0x80;

// Send report buffer to BlyncUSB30/30S device - Send the BlyncControl Command buffer to the 
// device - report id 0x00, buffer size 8 bytes excluding report id
async function SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2) {

    try {
        await device.open();
        //await device.reset();

        if (device.configuration === null) {
            await device.selectConfiguration(1);
        }
    
        //await device.claimInterface(device.configuration.interfaces[0].interfaceNumber);

        abyBlyncUsb30ReportBuffer[0] = byRedValue;
        abyBlyncUsb30ReportBuffer[1] = byBlueValue;
        abyBlyncUsb30ReportBuffer[2] = byGreenValue;
        abyBlyncUsb30ReportBuffer[3] = byLightControl;
        abyBlyncUsb30ReportBuffer[4] = byMusicControl_1;
        abyBlyncUsb30ReportBuffer[5] = byMusicControl_2;
        abyBlyncUsb30ReportBuffer[6] = 0xFF;
        abyBlyncUsb30ReportBuffer[7] = 0x22;

        await device.controlTransferOut( 
            {
                requestType: 'class',
                recipient: 'device',
                request: 0x09,
                value: 0x0200,
                index: 0x0000
            },
            abyBlyncUsb30ReportBuffer);

        await device.close();
    } catch (e) {
        console.log("Exception: " + e);
    }
}

async function SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2) {

    try {
        await device.open();
        //await device.reset();

        if (device.configuration === null) {
            await device.selectConfiguration(1);
        }
    
        //await device.claimInterface(device.configuration.interfaces[0].interfaceNumber);

        abyBlyncUsb30ReportBuffer[0] = byRedValue;
        abyBlyncUsb30ReportBuffer[1] = byBlueValue;
        abyBlyncUsb30ReportBuffer[2] = byGreenValue;
        abyBlyncUsb30ReportBuffer[3] = byLightControl;
        abyBlyncUsb30ReportBuffer[4] = byMusicControl_1;
        abyBlyncUsb30ReportBuffer[5] = byMusicControl_2;
        abyBlyncUsb30ReportBuffer[6] = 0xFF;
        abyBlyncUsb30ReportBuffer[7] = 0x22;

        await device.controlTransferOut( 
            {
                requestType: 'class',
                recipient: 'device',
                request: 0x09,
                value: 0x0200,
                index: 0x0000
            },
            abyBlyncUsb30ReportBuffer);

        await device.close();
    } catch (e) {
        console.log("Exception: " + e);
    }
}

// Send report buffer to BlyncUSB Lumena Headset device - Send the BlyncControl Command buffer to the 
// device - report id 0x05, buffer size 15 bytes excluding report id
async function SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl) {
    for (var i = 0; i < abyBlyncUsbHeadsetReportBuffer.length; i++) {
        abyBlyncUsbHeadsetReportBuffer[i] = 0;
    }
    abyBlyncUsbHeadsetReportBuffer[7] = byRedValue;
    abyBlyncUsbHeadsetReportBuffer[8] = byBlueValue;
    abyBlyncUsbHeadsetReportBuffer[9] = byGreenValue;
    abyBlyncUsbHeadsetReportBuffer[10] = byLightControl;

    /*chrome.hid.send(device, 0x05, abyBlyncUsbHeadsetReportBuffer.buffer, function () {
        if (chrome.runtime.lastError != undefined) {
            console.log(chrome.runtime.lastError);
        }
    });*/
}

/* Device API Calls */

// Request Device
async function EmbravaLib_RequestUSBDevice() { 
    await navigator.usb.requestDevice({ filters: [{}] });
}

// Enumerate Devices
async function EmbravaLib_EnumerateDevices() {
    let devices = await navigator.usb.getDevices();
    return devices;
}

// ResetLight - Parameters: device - device reference, deviceName string
// This function turns off the light of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function ResetLight(device, deviceName) {
    console.log("ResetLight Entry");
    var byBlyncControlCode = 0x00;
    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 ||deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S ||  deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOffV30Light(device, deviceName);
    } 
    console.log("ResetLight Exit");
}

// TurnOnV30Light - Parameters: device - device reference, deviceName string
// This function turns on the light of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnV30Light(device, deviceName) {
    console.log("TurnOnV30Light Entry");
    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byLightControl &= ~byMaskLightOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {
        byLightControl &= ~byMaskLightOnOff;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("TurnOnV30Light Exit");
}

// TurnOffV30Light - Parameters: device - device reference, deviceName string
// This function turns off the light of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOffV30Light(device, deviceName) {
    console.log("TurnOffV30Light Entry");
    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byLightControl |= byMaskLightOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {
        byLightControl |= byMaskLightOnOff;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }
    console.log("TurnOffV30Light Exit");
}

async function TurnOnRGBLights(device, deviceName, byRedLevel, byGreenLevel, byBlueLevel) {
    console.log("TurnOnRGBLights Entry");
    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnV30Light(device, deviceName);
        await SetRedColorBrightnessLevel(device, deviceName, byRedLevel);
        await SetGreenColorBrightnessLevel(device, deviceName, byGreenLevel);
        await SetBlueColorBrightnessLevel(device, deviceName, byBlueLevel);
    }

    console.log("TurnOnRGBLights Exit");
}

// TurnOnRedLight - Parameters: device - device reference, deviceName string
// This function turns on the red light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnRedLight(device, deviceName) {
    console.log("TurnOnRedLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, deviceName, 128, 0, 0);
        } else {
            await TurnOnRGBLights(device, deviceName, 255, 0, 0);
        }
    }

    console.log("TurnOnRedLight Exit");
}

// TurnOnGreenLight - Parameters: device - device reference, deviceName string
// This function turns on the green light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnGreenLight(device, deviceName) {
    console.log("TurnOnGreenLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, deviceName, 0, 150, 0);	        
    }

    console.log("TurnOnGreenLight Exit");
}

// TurnOnBlueLight - Parameters: device - device reference, deviceName string
// This function turns on the blue light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnBlueLight(device, deviceName) {
    console.log("TurnOnBlueLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, deviceName, 0, 0, 150);
    }

    console.log("TurnOnBlueLight Exit");
}

// TurnOnYellowLight - Parameters: device - device reference, deviceName string
// This function turns on the yellow light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnYellowLight(device, deviceName) {
    console.log("TurnOnYellowLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
            await TurnOnRGBLights(device, deviceName, 90, 60, 0);
        } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, deviceName, 100, 60, 0);
        } else {
            await TurnOnRGBLights(device, deviceName, 255, 60, 0);
        }
    }

    console.log("TurnOnYellowLight Exit");
}

// TurnOnPurpleLight - Parameters: device - device reference, deviceName string
// This function turns on the purple light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnPurpleLight(device, deviceName) {
    console.log("TurnOnPurpleLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, deviceName, 68, 0, 128);
        } else {
            await TurnOnRGBLights(device, deviceName, 128, 0, 128);
        }
    }

    console.log("TurnOnPurpleLight Exit");
}

// TurnOnWhiteLight - Parameters: device - device reference, deviceName string
// This function turns on the white light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnWhiteLight(device, deviceName) {
    console.log("TurnOnWhiteLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, deviceName, 255, 125, 50);
    }

    console.log("TurnOnWhiteLight Exit");
}

// TurnOnCyanLight - Parameters: device - device reference, deviceName string
// This function turns on the cyan light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnCyanLight(device, deviceName) {
    console.log("TurnOnCyanLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        await TurnOnRGBLights(device, deviceName, 0, 255, 255);
    }

    console.log("TurnOnCyanLight Exit");
}

// TurnOnOrangeLight - Parameters: device - device reference, deviceName string
// This function turns on the orange light on the devices of type - Blynclight Std, Plus, Mini, Wireless, Embrava Embedded
async function TurnOnOrangeLight(device, deviceName) {
    console.log("TurnOnOrangeLight Entry");

    if (device == null) {
        return;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        if (deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
            await TurnOnRGBLights(device, deviceName, 90, 20, 0);
        } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
            await TurnOnRGBLights(device, deviceName, 100, 15, 0);
        } else {
            await TurnOnRGBLights(device, deviceName, 255, 15, 0);
        }
    }

    console.log("TurnOnOrangeLight Exit");
}

// This function sets the Red level of the RGB LED
async function SetRedColorBrightnessLevel(device, deviceName, byRedLevel) {
    console.log("SetRedColorBrightnessLevel Entry");
    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byRedValue = byRedLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {
        byRedValue = byRedLevel;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }
    console.log("SetRedColorBrightnessLevel Exit");
}

// This function sets the Green level of the RGB LED
async function SetGreenColorBrightnessLevel(device, deviceName, byGreenLevel) {
    console.log("SetGreenColorBrightnessLevel Entry");
    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byGreenValue = byGreenLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {
        byGreenValue = byGreenLevel;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }
    console.log("SetGreenColorBrightnessLevel Exit");
}

// This function sets the Blue level of the RGB LED
async function SetBlueColorBrightnessLevel(device, deviceName, byBlueLevel) {
    console.log("SetBlueColorBrightnessLevel Entry");
    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
        byBlueValue = byBlueLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {
        byBlueValue = byBlueLevel;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }
    console.log("SetBlueColorBrightnessLevel Exit");
}

// This function dims the Blynclight device's brightness by 50%
async function SetLightDim(device, deviceName) {
    console.log("SetLightDim Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl |= byMaskLightDimControl;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {

        byLightControl |= byMaskLightDimControl;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("SetLightDim Exit");
}

// This function clears the dimnness of Blynclight device and restore the brightness to original level
async function ClearLightDim(device, deviceName) {
    console.log("ClearLightDim Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightDimControl;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {

        byLightControl &= ~byMaskLightDimControl;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("ClearLightDim Exit");
}

// This function selects the flash speed of the Blynclight device
async function SelectLightFlashSpeed(device, deviceName, bySelectedFlashSpeed) {
    console.log("SelectLightFlashSpeed Entry");

    if (bySelectedFlashSpeed == 0x03) {
        bySelectedFlashSpeed = 0x04;
    }

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightFlashSpeed;
        byLightControl |= ((bySelectedFlashSpeed & 0x0F) << 3);
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {

        byLightControl &= ~byMaskLightFlashSpeed;
        byLightControl |= ((bySelectedFlashSpeed & 0x0F) << 3);
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("SelectLightFlashSpeed Exit");
}

// This function starts flashing the Blynclight devices
async function StartLightFlash(device, deviceName) {
    console.log("StartLightFlash Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl |= byMaskLightFlashOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {

        byLightControl |= byMaskLightFlashOnOff;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("StartLightFlash Exit");
}

// This function stops flashing the Blynclight devices
async function StopLightFlash(device, deviceName) {
    console.log("StopLightFlash Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {

        byLightControl &= ~byMaskLightFlashOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);

    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120) {

        byLightControl &= ~byMaskLightFlashOnOff;
        await SendBlyncUSBHeadsetControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl);
    }

    console.log("StopLightFlash Exit");
}

// This function selects the music to be played on the Blynclight Plus, Mini and Wireless devices
async function SelectMusicToPlay(device, deviceName, bySelectedMusic) {
    console.log("SelectMusicToPlay Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicSelect;
        byMusicControl_1 |= (bySelectedMusic & 0x0F);
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("SelectMusicToPlay Exit");
}

// This function starts the music play on the Blynclight Plus, Mini and Wireless devices
async function StartMusicPlay(device, deviceName) {
    console.log("StartMusicPlay Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 |= byMaskMusicOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("StartMusicPlay Exit");
}

// This function stops the music play on the Blynclight Plus, Mini and Wireless devices
async function StopMusicPlay(device, deviceName) {
    console.log("StopMusicPlay Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("StopMusicPlay Exit");
}

// This function repeats the music play on the Blynclight Plus, Mini and Wireless devices
async function SetMusicRepeat(device, deviceName) {
    console.log("SetMusicRepeat Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 |= byMaskMusicRepeatOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("SetMusicRepeat Exit");
}

// This function stops repeating the music play on the Blynclight Plus, Mini and Wireless devices
async function ClearMusicRepeat(device, deviceName) {
    console.log("ClearMusicRepeat Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_1 &= ~byMaskMusicRepeatOnOff;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("ClearMusicRepeat Exit");
}

// This function mutes the music volume on the Blynclight Plus, Mini and Wireless devices
async function SetVolumeMute(device, deviceName) {
    console.log("SetVolumeMute Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 |= byMaskMute;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("SetVolumeMute Exit");
}

// This function clears the music volume mute on the Blynclight Plus, Mini and Wireless devices
async function ClearVolumeMute(device, deviceName) {
    console.log("ClearVolumeMute Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S ||
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 &= ~byMaskMute;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("ClearVolumeMute Exit");
}

// This function sets the music volume the Blynclight Plus, Mini and Wireless devices
async function SetMusicVolume(device, deviceName, byVolumeLevel) {
    console.log("SetMusicVolume Entry");

    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
        deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
        byMusicControl_2 &= ~byMaskVolumeControl;
        byMusicControl_2 |= byVolumeLevel;
        await SendBlyncUSB30ControlCommand(device, byRedValue, byGreenValue, byBlueValue, byLightControl, byMusicControl_1, byMusicControl_2);
    }
    console.log("SetMusicVolume Exit");
}
    
