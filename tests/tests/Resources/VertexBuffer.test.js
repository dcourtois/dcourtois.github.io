require([
	"Core/Engine",
	"Resources/VertexBuffer"
], function (
	Engine,
	VertexBuffer
) {

	module("Resources/VertexBuffer", {
		setup: function () {
			// create a test canvas
			this.canvas = document.createElement("canvas");
			this.canvas.width	= "2px";
			this.canvas.height	= "2px";
			document.body.appendChild(this.canvas);

			// create the engine
			this.engine = new Engine(this.canvas);
			this.manager = this.engine.resourceManager;
		},
		teardown: function () {
			// delete the engine
			this.engine.clear();

			// delete the test canvas
			document.body.removeChild(this.canvas);
		}
	});

	test("no descriptor", function () {
		try {
			var vertexBuffer = new VertexBuffer(this.engine.gl);
			notStrictEqual(vertexBuffer, undefined, "vertex buffer created");
		} catch (e) {
			ok(false, "exception during vertex buffer creation : " + e);
		}
	});

});
