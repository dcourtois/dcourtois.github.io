require([
	"Components/Light"
], function (
	Light
) {

	module("Components/Light", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("constructor", function () {
		try {
			var light = new Light(this.engine);
			notStrictEqual(light, undefined, "light created");
		} catch (e) {
			ok(false, "exception during light creation : " + e);
		}
	});

});
