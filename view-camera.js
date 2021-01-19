let cameras = [];
let camId = 0;
let currentStream = null;



document.addEventListener('readystatechange', (event) => {

	cameras = []

	if(document.readyState === 'complete') {

		const video = document.querySelector('video');

		function successCallback(stream) {
		  cameras = []
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
							
								
							
						if(media_device.kind === 'videoinput') {
								cameras = cameras.concat(media_device.deviceId);
								console.log("Media device:")
								console.log(media_device.deviceId);
								console.log(media_device.label);
								console.log(media_device.kind);
							}
						})

						console.log("Cameras: ")
						console.log(cameras)
						

				})
				
				}
			}
			
		
		}

		function errorCallback(error) {
			window.alert('Error: ', error);
		}

		

		navigator.mediaDevices.getUserMedia({ deviceId: {exact: cameras[0]}, video: {width: { ideal: 3264 },
			height: { ideal: 1868 } } })
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
						 video: {deviceId: {exact: cameras[camId]}, width: { ideal: 3264 },
			height: { ideal: 1868 } } 
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

	function toggleFullScreen(opt_elem, opt_value) {
		var doc = document, done, wasFull;
		opt_elem = opt_elem || doc.documentElement;
		'-frsexit ms-FRsExit moz-FRSCancel webkit-FRsExit'.replace(
			/(\w*)-(f)(r)(s)(\w+)/gi,
			function(_, prefix, f, r, s, exitWord) {
			s = 'ull' + s + 'creen';
			if (!done && doc[prefix + f + s + 'Enabled']) {
				// If in fullscreen mode and opt_value falsy.
				if ((wasFull = !!doc[prefix + f + s + 'Element']) && doc[exitWord = prefix + exitWord + 'F' + s] && !opt_value) {
				doc[done = exitWord]();
				}
				// If not in fullscreen mode and opt_value is truthy or opt_value is
				// undefined or null.
				else if (opt_elem[r = prefix + r + 'equestF' + s] && (opt_value || opt_value == null)) {
				opt_elem[done = r](Element && Element.ALLOW_KEYBOARD_INPUT);
				}
			}
			}
		);
		return wasFull;
		}

	function doToggleFullScreen(opt_elem, opt_value) {
		toggleFullScreen(opt_elem, opt_value)
		toggleFullScreen()
	}

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
		toggleFullScreen();
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
	hotkeys('r,f,m,z,shift+/,alt+enter,h,v,up,down,left,right,c,esc,p,space', function (event, handler){
		switch (handler.key) {
		  case 'h':
		  case 'left':
		  case 'right':
		  	video.classList.toggle('hflipped');
			break;
		  case 'f':
			toggleFullScreen();
			break;
		  case 'r':
			video.classList.toggle(`rotate_${(parseInt(video.dataset.rotated) % 4) * 90}`)
			video.dataset.rotated = parseInt(video.dataset.rotated) + 1
			video.classList.toggle(`rotate_${(parseInt(video.dataset.rotated) % 4) * 90}`)
			break;
		  case 'v':
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
		  case 'esc':
			document.querySelector('#help').classList.toggle("hidden");
			break;
		  case 'p':
		  case 'space':
		  	if (video.paused) { video.play(); } else { video.pause(); }
			break;
		  
		}
	  });

	}

});


