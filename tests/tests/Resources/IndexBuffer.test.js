require([
	"Core/Engine",
	"Resources/IndexBuffer"
], function (
	Engine,
	IndexBuffer
) {

	module("Resources/IndexBuffer", {
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
			var indexBuffer = new IndexBuffer(this.engine.gl);
			notStrictEqual(indexBuffer, undefined, "index buffer created");
		} catch (e) {
			ok(false, "exception during index buffer creation : " + e);
		}
	});

});
