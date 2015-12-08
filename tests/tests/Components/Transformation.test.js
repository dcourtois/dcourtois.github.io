require([
	"Components/Transformation"
], function (
	Transformation
) {

	module("Components/Transformation", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("constructor", function () {
		try {
			var transformation = new Transformation(this.engine);
			notStrictEqual(transformation, undefined, "transformation created");
		} catch (e) {
			ok(false, "exception during transformation creation : " + e);
		}
	});

});
