(function() {
	
	var imported = document.createElement("script");
	imported.src = "embrava-lib.js";
	document.getElementsByTagName("head")[0].appendChild(imported);

    var ui = {
        deviceSelector: null,
	    displayLight: null,
	    redValue: null,
	    greenValue: null,
	    blueValue: null,
	    buttonSetLight: null,
	    dimLight: null,
	    flashLight: null,
	    flashSpeedSelector: null,
	    playMusic: null,
	    musicSelector: null,
	    volumeRange: null,
	    repeatMusic: null,
		
		buttonAddDevice:null
	};
  
	var arrMusicListForBlyncUSB30S = ["Music 1", "Music 2", "Music 3", "Music 4", "Music 5", 
									"Music 6", "Music 7", "Music 8", "Music 9", "Music 10"];
									
	var arrMusicListForBlyncMiniWireless = ["Music 1", "Music 2", "Music 3", "Music 4", "Music 5", 
									"Music 6", "Music 7", "Music 8", "Music 9", "Music 10", 
									"Music 11", "Music 12", "Music 13", "Music 14"];
									
	var arrFlashSpeed = ["Slow", "Med", "Fast"];

	var bySelectedMusic = 1;
	var bySelectedFlashSpeed = 1;
	var byVolumeLevel = 5;

	var initializeWindow = function() {
		console.log("initializeWindow is called");
	  
		for (var k in ui) {
		  var id = k;
		  //console.log(id);
		  var element = document.getElementById(id);
		  if (!element) {
			  throw "Missing UI element: " + k;
			}
			ui[k] = element;
			//console.log(ui[k]);
		}
		
		for (var k in ui) {
			console.log(ui[k]);
		}
		
		
		
		// Add flash speed list
		addFlashSpeedList();
		
		// Add Music list
		addMusicList1();
	
		ui.deviceSelector.addEventListener('change', onDeviceSelectionChanged);
		ui.displayLight.addEventListener('change', onCheckboxDisplayLightChanged);
		ui.buttonSetLight.addEventListener('click', onButtonSetLightClicked);
		ui.dimLight.addEventListener('change', onCheckboxDimLightChanged);
		ui.flashLight.addEventListener('change', onCheckboxFlashLightChanged);
		ui.flashSpeedSelector.addEventListener('change', onFlashSpeedSelectionChanged);
		ui.playMusic.addEventListener('change', onCheckboxPlayMusicChanged);
		ui.musicSelector.addEventListener('change', onMusicSelectionChanged);
		ui.volumeRange.addEventListener('change', onVolumeRangeValueChanged);
		ui.repeatMusic.addEventListener('change', onCheckboxRepeatMusicChanged);

		ui.buttonAddDevice.addEventListener('click', onButtonAddDeviceClicked);
		
		enableIOControlsForBlyncUSB30_30S_Devices(false);
		
		navigator.usb.addEventListener('connect', event => {
			// event.device will bring the connected device
			enumerateDevices();
		});

		navigator.usb.addEventListener('disconnect', event => {
			// event.device will bring the disconnected device
			enumerateDevices();	
		}); 
	};

	var onButtonAddDeviceClicked = async function() {
		try {
			let device1 = await EmbravaLib_RequestUSBDevice();
			enumerateDevices();		
		}
		catch (err) {
			enumerateDevices();	
		}
	};
	
    var onDeviceSelectionChanged = function() { 
		var selectedItem = ui.deviceSelector.options[ui.deviceSelector.selectedIndex];
	    if (!selectedItem) {
	        return;
	    }

	    if (ui.deviceSelector.selectedIndex == -1) {
	        return;
	    }
		
		// Check for the device type and enable light / music or both functions
		enableIOControlsForLightForBlyncUSB30_30S_Devices(false);
	    enableIOControlsForMusicForBlyncUSB30S_Devices(false);
		
	    deviceName = selectedItem.text;

	    selectedDevice = finalDevices[ui.deviceSelector.selectedIndex];

	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S ||  
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
				
	        enableIOControlsForLightForBlyncUSB30_30S_Devices(true);
	        enableIOControlsForMusicForBlyncUSB30S_Devices(true);

	        // Update music list combobox items based on the device type
	        if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S) {
	            clearMusicList();
	            addMusicList1();
	        } else {
	            clearMusicList();
	            addMusicList2();
	        }
	    } else if (deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
            deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40) {
	        enableIOControlsForLightForBlyncUSB30_30S_Devices(true);
	        enableIOControlsForMusicForBlyncUSB30S_Devices(false);	        
	    }
	};
	
    var onCheckboxDisplayLightChanged = async function () {
        var bDisplayLight = ui.displayLight.checked;
        
        if (bDisplayLight == true) {
            await SetRGBValues(selectedDevice, deviceName);
        } else {
            await ResetLight(selectedDevice, deviceName);
        } 
	}; 

    var onButtonSetLightClicked = async function () {
        if (ui.displayLight.checked == true) {
            await SetRGBValues(selectedDevice, deviceName);
        }
	};
	
    var onCheckboxDimLightChanged = async function () {
        var bDimLight = ui.dimLight.checked;

        if (bDimLight == true) {
            await SetLightDim(selectedDevice, deviceName);
        } else {
            await ClearLightDim(selectedDevice, deviceName);
        }
	};
	
	var onCheckboxFlashLightChanged = async function() {
	    var bFlashLight = ui.flashLight.checked;

	    if (bFlashLight == true) {
	        await StartLightFlash(selectedDevice, deviceName);
	        await SelectLightFlashSpeed(selectedDevice, deviceName, bySelectedFlashSpeed);
	    } else {
	        await StopLightFlash(selectedDevice, deviceName);
	    }
	};
	
	var onFlashSpeedSelectionChanged = async function() {
	    bySelectedFlashSpeed = ui.flashSpeedSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_30 || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_STANDARD_40 || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110 ||
            deviceName == DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120 || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S ||
            deviceName == DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S ||  deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S) {
	        await SelectLightFlashSpeed(selectedDevice, deviceName, bySelectedFlashSpeed);
	    }
	};
	
	var onCheckboxPlayMusicChanged = async function() {
	    var bPlayMusic = ui.playMusic.checked;
	    byVolumeLevel = ui.volumeRange.value;

	    await StopMusicPlay(selectedDevice, deviceName);
	    await SelectMusicToPlay(selectedDevice, deviceName, bySelectedMusic);
	    await SetMusicVolume(selectedDevice, deviceName, byVolumeLevel);
	    await ClearVolumeMute(selectedDevice, deviceName);

	    if (bPlayMusic == true) {
	        if (ui.repeatMusic.checked == true) {
	            await SetMusicRepeat(selectedDevice, deviceName);
	        } else {
	            await ClearMusicRepeat(selectedDevice, deviceName);
	        }
	        await StartMusicPlay(selectedDevice, deviceName);
	    } else {
	        await (selectedDevice, deviceName);
	    }
	};
	
	var onMusicSelectionChanged = async function() {
	    bySelectedMusic = ui.musicSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDevice, deviceName);
	            await SelectMusicToPlay(selectedDevice, deviceName, bySelectedMusic);
	            if (ui.repeatMusic.checked == true) {
	                await SetMusicRepeat(selectedDevice, deviceName);
	            } else {
	                await ClearMusicRepeat(selectedDevice, deviceName);
	            }
	            await StartMusicPlay(selectedDevice, deviceName);
	        }
	    }
	};
	
	var onVolumeRangeValueChanged = async function() {
	    byVolumeLevel = ui.volumeRange.value;
	    bySelectedMusic = ui.musicSelector.selectedIndex + 1;
	    if (deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_PLUS_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_MINI_40S || 
            deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S || deviceName == DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDevice, deviceName);
	            await SelectMusicToPlay(selectedDevice, deviceName, bySelectedMusic);
	            await SetMusicVolume(selectedDevice, deviceName, byVolumeLevel);
	            if (ui.repeatMusic.checked == true) {
	                await SetMusicRepeat(selectedDevice, deviceName);
	            } else {
	                await ClearMusicRepeat(selectedDevice, deviceName);
	            }
	            await StartMusicPlay(selectedDevice, deviceName);
	        }
	    }

	};
	
	var onCheckboxRepeatMusicChanged = async function() {
	    var bMusicRepeat = ui.repeatMusic.checked;

	    if (bMusicRepeat == true) {
	        if (ui.playMusic.checked == true) {
	            await StopMusicPlay(selectedDevice, deviceName);
	            await SelectMusicToPlay(selectedDevice, deviceName, bySelectedMusic);
	            await SetMusicVolume(selectedDevice, deviceName, byVolumeLevel);
	            await SetMusicRepeat(selectedDevice, deviceName);
	            await StartMusicPlay(selectedDevice, deviceName);
	        }
	    } else {
	        await StopMusicPlay(selectedDevice, deviceName);
	        await ClearMusicRepeat(selectedDevice, deviceName);
	        await StartMusicPlay(selectedDevice, deviceName);
	        await StopMusicPlay(selectedDevice, deviceName);
	    }
	};	
	
	var addFlashSpeedList = function () {
		for(var i = 0; i < arrFlashSpeed.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrFlashSpeed[i];
			opt.value = arrFlashSpeed[i];
			ui.flashSpeedSelector.appendChild(opt);
		}
	};
	
	var addMusicList1 = function () {
		for(var i = 0; i < arrMusicListForBlyncUSB30S.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrMusicListForBlyncUSB30S[i];
			opt.value = arrMusicListForBlyncUSB30S[i];
			ui.musicSelector.appendChild(opt);
		}		
	};
	
	var addMusicList2 = function () {
		for(var i = 0; i < arrMusicListForBlyncMiniWireless.length; i++) {
			var opt = document.createElement('option');
			opt.innerHTML = arrMusicListForBlyncMiniWireless[i];
			opt.value = arrMusicListForBlyncMiniWireless[i];
			ui.musicSelector.appendChild(opt);
		}		
	};
	
	var clearMusicList = function () {
		while (ui.musicSelector.options.length > 0) {		
			ui.musicSelector.remove(0);
		}
	};

	var enableIOControlsForBlyncUSB30_30S_Devices = function (bEnabled) {
		ui.displayLight.disabled = !bEnabled;
		ui.redValue.disabled = !bEnabled;
		ui.greenValue.disabled = !bEnabled;
		ui.blueValue.disabled = !bEnabled;
		ui.buttonSetLight.disabled = !bEnabled;
		ui.dimLight.disabled = !bEnabled;
		ui.flashLight.disabled = !bEnabled;
		ui.flashSpeedSelector.disabled = !bEnabled;
		ui.playMusic.disabled = !bEnabled;
		ui.musicSelector.disabled = !bEnabled;
		ui.volumeRange.disabled = !bEnabled;
		ui.repeatMusic.disabled = !bEnabled;
	};

	var enableIOControlsForLightForBlyncUSB30_30S_Devices = function (bEnabled) {
		ui.displayLight.disabled = !bEnabled;
		ui.redValue.disabled = !bEnabled;
		ui.greenValue.disabled = !bEnabled;
		ui.blueValue.disabled = !bEnabled;
		ui.buttonSetLight.disabled = !bEnabled;
		ui.dimLight.disabled = !bEnabled;
		ui.flashLight.disabled = !bEnabled;
		ui.flashSpeedSelector.disabled = !bEnabled;
	};

	var enableIOControlsForMusicForBlyncUSB30S_Devices = function (bEnabled) {
	    ui.playMusic.disabled = !bEnabled;
	    ui.musicSelector.disabled = !bEnabled;
	    ui.volumeRange.disabled = !bEnabled;
	    ui.repeatMusic.disabled = !bEnabled;
	};

	window.addEventListener('load', initializeWindow);

    /******************************************************************************************************************************************************************/
    // Device Access related functions, Device Enumeration Send device commands through output reports etc
    /******************************************************************************************************************************************************************/
  
	var numberOfDevices = 0;
	var deviceName = "";

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

	let devices = [];
	let finalDevices = [];

	let selectedDevice;
	
    /* Device Enumeration */
	var enumerateDevices =  async function () {
	    console.log("enumerateDevices start");
	    
		devices = await EmbravaLib_EnumerateDevices();
		
		onDevicesEnumerated(devices);
			
	    console.log("enumerateDevices exit");
	};

	var onDevicesEnumerated = function (devices) {
		
	    console.log("onDevicesEnumerated start");

	    do {			
			// Add all the devices detected
			numberOfDevices = 0;
			UpdateDeviceList(devices);	        

	        if (devices.length < 1) {
	            ui.deviceSelector.disabled = true;
	        } else {
	            ui.deviceSelector.disabled = false;
	        }

	    } while (false);

	    
	    console.log("onDevicesEnumerated exit");
	}

    /* Update Device List */
	var UpdateDeviceList = function (devices) {
	    console.log("UpdateDeviceList start");
		
		// Clear Device list
		for (var i = 0; i < ui.deviceSelector.length; i++) {
			ui.deviceSelector.remove(i);
		}
				
		for (var device of devices) {
			do {
				/*var optionId = 'device-' + device.deviceId;
				if (ui.deviceSelector.namedItem(optionId)) {
					break;
				}*/

				var selectedIndex = ui.deviceSelector.selectedIndex;
				var option = document.createElement('option');

				var deviceName = null;
				
				/* 	var DEVICE_NAME_BLYNCLIGHT_PLUS_30S = "Blynclight Plus (BLYNCUSB30S)";
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
					var DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA = "Headset Lumena"*/

				if ((device.vendorId == 0x0E53 && device.productId == 0x2517) || (device.vendorId == 0x2C0D && device.productId == 0x0002)) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_PLUS_30S;
				} else if ((device.vendorId == 0x2C0D && device.productId == 0x0010)) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_PLUS_40S;
				} else if ((device.vendorId == 0x0E53 && device.productId == 0x2516) || (device.vendorId == 0x2C0D && device.productId == 0x0001)) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_STANDARD_30;
				} else if ((device.vendorId == 0x2C0D && device.productId == 0x000C)) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_STANDARD_40;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x0004) { 
					deviceName = DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA110;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x0005) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA120;
				} else if (device.vendorId == 0x0D8C && device.productId == 0x0031) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_HEADSET_LUMENA;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x0006) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_WIRELESS_30S;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x000B) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_WIRELESS_40S;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x0009) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_EMBRAVA_EMBEDDED;
				} else if ((device.vendorId == 0x0E53 && device.productId == 0x2519) || (device.vendorId == 0x2C0D && device.productId == 0x0003)) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_MINI_30S;
				} else if (device.vendorId == 0x2C0D && device.productId == 0x000A) {
					deviceName = DEVICE_NAME_BLYNCLIGHT_MINI_40S;
				}

				if (deviceName !== null) {
					option.text = deviceName;
					//option.id = optionId;
					ui.deviceSelector.options.add(option);
					if (selectedIndex != -1) {
						ui.deviceSelector.selectedIndex = selectedIndex;
					}

					finalDevices[numberOfDevices] = device;
					
					numberOfDevices++;

					if (numberOfDevices < 1) {
						ui.deviceSelector.disabled = true;
					} else {
						ui.deviceSelector.disabled = false;
					}
				}				

			} while (false);
		}

		onDeviceSelectionChanged();
	    
	    console.log("UpdateDeviceList exit");
	};

	async function SetRGBValues(selectedDevice, deviceName) {
	    var byRedLevel = 255;
	    var byGreenLevel = 255;
	    var byBlueLevel = 255;

	    try {
	        byRedLevel = parseInt(ui.redValue.value);
	        byGreenLevel = parseInt(ui.greenValue.value);
	        byBlueLevel = parseInt(ui.blueValue.value);

	        await TurnOnRGBLights(selectedDevice, deviceName, byRedLevel, byGreenLevel, byBlueLevel);

	    } catch (e) {

	    }
	}

    /* Device disconnection */
	var onDeviceRemoved = function () {
	    console.log("onDeviceRemoved start");
	    do {
	        
			enumerateDevices();

	        if (numberOfDevices < 1) {
	            ui.deviceSelector.disabled = true;
	        } else {
	            ui.deviceSelector.disabled = false;
	        }

	    } while (false);

	    console.log("onDeviceRemoved exit");
	};
}());