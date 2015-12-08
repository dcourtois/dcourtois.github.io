require([
	"Components/CameraController"
], function (
	CameraController
) {

	module("Components/CameraController", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("constructor", function () {
		try {
			var cameraController = new CameraController(this.engine);
			notStrictEqual(cameraController, undefined, "camera controller created");
		} catch (e) {
			ok(false, "exception during camera controller creation : " + e);
		}
	});

});
