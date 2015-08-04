(function(window) {
	"use strict";

	// Require Soundio and AudioObject.
	var Soundio = window.Soundio;
	var AudioObject = window.AudioObject;

	// Alias useful functions
	var assign = Object.assign;

	// Declare some useful defaults
	var defaults = { gain: 1 };

	// Optionally declare some defaults for use by Soundio's
	// control system.
	var controlDefaults = {
		gain: { min: 0, max: 1, transform: 'cubic', value: 1 }
	};

	// A Soundio plugin is created with an object constructor.
	// The constructor must create an instance of AudioObject.
	// One way to do this is to use AudioObject as a mix-in.
	function MyObject(audio, settings, clock) {
		var options = assign({}, defaults, settings);
		var inputNode = audio.createGain();
		var outputNode = audio.createGain();

		// Initialise this as an AudioObject.
		AudioObject.call(this, inputNode, outputNode, {
			gain: {
				param: inputNode.gain,
				curve: 'linear',
				duration: 0.008
			}
		});

		// Connect up the graph
		inputNode.connect(outputNode);

		// Overwrite destroy so that it disconnects the graph
		this.destroy = function() {
			inputNode.disconnect();
			outputNode.disconnect();
		};
	}

	// Mix AudioObject prototype into MyObject prototype
	assign(MetronomeObject.prototype, AudioObject.prototype);

	// Register the object constructor with Soundio. The last
	// parameter, controls, is optional but recommended if the
	// intent is to make the object controllable, eg. via MIDI.
	Soundio.register('my-object', MyObject, controlDefaults);
})(window);