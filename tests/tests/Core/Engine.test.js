require(["Core/Engine"], function (Engine) {

	module("Core/Engine", {
		setup: function () {
			// create a test canvas
			this.canvas = document.createElement("canvas");
			this.canvas.id		= "test-canvas";
			this.canvas.width	= "1024px";
			this.canvas.height	= "768px";
			document.body.appendChild(this.canvas);
		},
		teardown: function () {
			// delete the test canvas
			document.body.removeChild(this.canvas);
		}
	});

	test("init", function () {
		var engine = new Engine(this.canvas);

		notStrictEqual(engine.gl,				null,		"webGL context created");
		notStrictEqual(engine.fileSystem,		undefined,	"file system");
		notStrictEqual(engine.animationSystem,	undefined,	"animation system");
		notStrictEqual(engine.resourceManager,	undefined,	"resource manager");
		notStrictEqual(engine.renderer,			undefined,	"renderer");
		notStrictEqual(engine.sceneGraph,		undefined,	"scene graph");
		strictEqual(engine.passes.length,		0,			"passes");
	});

});
