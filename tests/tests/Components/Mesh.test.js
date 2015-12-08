require([
	"Components/Mesh"
], function (
	Mesh
) {

	module("Components/Mesh", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("constructor", function () {
		try {
			var mesh = new Mesh(this.engine);
			notStrictEqual(mesh, undefined, "mesh created");
		} catch (e) {
			ok(false, "exception during mesh creation : " + e);
		}
	});

});
