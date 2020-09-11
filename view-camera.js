let cameras = [];
let camId = 0;
let currentStream = null;

document.addEventListener('readystatechange', (event) => {

	if(document.readyState === 'complete') {

		const video = document.querySelector('video');

		function successCallback(stream) {
		  currentStream = stream;
		  video.srcObject = stream;
		  video.play();
			if(location.href.includes('&debug')) {
				console.log(`stream: ${stream}`);
			}

			if('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
			
				if(navigator.mediaDevices.enumerateDevices) {
					
					navigator.mediaDevices.enumerateDevices().then(media_devices => {
						media_devices.forEach(media_device => {
							
								console.log(media_device);
							
						if(media_device.kind === 'videoinput') {
								cameras = cameras.concat(media_device.deviceId);
							}
						})
				})
				}
			}
		
		}

		function errorCallback(error) {
			window.alert('Error: ', error);
		}

		navigator.mediaDevices.getUserMedia({ audio: false, video: true })
		  .then(successCallback)
		  .catch(errorCallback);

		
		  function swapCameras() {
			console.log(cameras);
			console.log(camId);
			console.log(currentStream);
			
			if((camId + 1) < cameras.length) {
				camId = camId +1;
			} else {
				camId = 0;
			}
			if(cameras.length > 1) {
				if(navigator.mediaDevices || navigator.mediaDevices.enumerateDevices) {
					currentStream.getTracks().forEach(track => {
						track.stop();
  				});
					video.srcObject = null;
					navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
								deviceId: {
									exact: cameras[camId]
								}
							}
					}).then(successCallback).catch(errorCallback);
				}
			}
		  }
		
		  /*
		video.addEventListener('click',event => {
			event.preventDefault();
			
			swapCameras();
			
		});
		*/

	// Touch events
	// Depends: https://hammerjs.github.io/
	
	// We create a manager object, which is the same as Hammer(), but without the presetted recognizers. 
	var mc = new Hammer.Manager(video, {recognizers: [
		[Hammer.Swipe],
		[Hammer.Pinch]
		]}
	);


	// Tap recognizer with minimal 2 taps
	mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
	// Single tap recognizer
	mc.add( new Hammer.Tap({ event: 'singletap' }) );



	// we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
	mc.get('doubletap').recognizeWith('singletap');
	// we only want to trigger a tap, when we don't have detected a doubletap
	mc.get('singletap').requireFailure('doubletap');


	mc.on("doubletap", function(ev) {
		swapCameras();
	});

	mc.on("singletap", function(ev) {
		document.querySelector('#help').classList.add("hidden");
	});

	mc.on("swipeleft swiperight", function(ev) {
		video.classList.toggle('hflipped');
	});

	mc.on("swipeup swipedown", function(ev) {
		video.classList.toggle('vflipped');
	});

	mc.on("pinchin", function(ev) {
		video.classList.remove('zoomed');
		
	});

	mc.on("pinchout", function(ev) {
		video.classList.add('zoomed');
		
	});
		

	// Depends: https://github.com/jaywcjlove/hotkeys
	hotkeys('r,f,m,z,shift+/,h,up,down,left,right,c', function (event, handler){
		switch (handler.key) {
		  case 'r': 
		  case 'm':
		  case 'left':
		  case 'right':
		  	video.classList.toggle('hflipped');
			break;
		  case 'f':
		  case 'up':
		  case 'down':
			video.classList.toggle('vflipped');
			break;
		  case 'z': 
		  	video.classList.toggle('zoomed');
			break;
		  case 'c':
			swapCameras();
			break;
		  case 'shift+/':
		  case 'h':
			document.querySelector('#help').classList.toggle("hidden");
			break;
		  
		}
	  });

	}

});


