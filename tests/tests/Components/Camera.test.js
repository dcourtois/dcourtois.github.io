require([
	"Components/Camera",
	"Core/Engine",
	"Math/Vec3"
], function (
	Camera,
	Engine,
	Vec3
) {

	module("Components/Camera", {
		setup: function () {
			// create a test canvas
			this.canvas = document.createElement("canvas");
			this.canvas.width	= "2px";
			this.canvas.height	= "2px";
			document.body.appendChild(this.canvas);
			this.engine = new Engine(this.canvas);
		},
		teardown: function () {
			this.engine.clear();
			document.body.removeChild(this.canvas);
		}
	});

	test("constructor", function (assert) {
		try {
			var camera = new Camera(this.engine);
			notStrictEqual(camera,			undefined,				"camera created");
			assert.close(camera.position,	[0, 0, 1],	0.000001,	"position initialized");
			assert.close(camera.direction,	[0, 0, -1],	0.000001,	"direction initialized");
			assert.close(camera.side,		[1, 0, 0],	0.000001,	"side initialized");
			assert.close(camera.up,			[0, 1, 0],	0.000001,	"up initialized");
		} catch (e) {
			ok(false, "exception during camera creation : " + e);
		}
	});

	test("setLookAt", function (assert) {
		var camera = new Camera(this.engine);
		camera.setLookAt(new Vec3(0, 0, 0), new Vec3(1, 0, 0));

		assert.close(camera.position,	[0, 0, 0],	0.000001,	"position");
		assert.close(camera.direction,	[1, 0, 0],	0.000001,	"direction");
		assert.close(camera.side,		[0, 0, -1],	0.000001,	"side");
		assert.close(camera.up,			[0, 1, 0],	0.000001,	"up");
	});

	test("project", function (assert) {
		var camera = new Camera(this.engine);
		camera.setProjection(0.78, 1.0, 0.1, 100.0);

		assert.close(camera.project(new Vec3(0, 0, -100)), [0, 0, 1],	0.000001,	"project far");
		assert.close(camera.project(new Vec3(0, 0, -0.1)), [0, 0, -1],	0.000001,	"project near");
	});

	test("unProject", function (assert) {
		var camera = new Camera(this.engine);
		camera.setProjection(0.78, 1.0, 0.1, 100.0);

		assert.close(camera.unProject(new Vec3(0, 0, 1.0)),		[0, 0, -100.0],	0.0001,	"unproject far");
		assert.close(camera.unProject(new Vec3(0, 0, -1.0)),	[0, 0, -0.1],	0.0001,	"unproject near");
	});

});
