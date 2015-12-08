require(["Core/Engine", "States/WriteMaskState"], function (Engine, WriteMaskState) {

	module("States/WriteMaskState", {
		setup: function () {
			this.canvas = document.createElement("canvas");
			this.canvas.width = 4;
			this.canvas.height = 4;
			this.engine = new Engine(this.canvas);
			this.gl = this.engine.gl;
			
			// override the WebGL functions to verify they are called
			var self = this,
				colorMask = this.gl.colorMask.bind(this.gl),
				depthMask = this.gl.depthMask.bind(this.gl);
			this.calls = 0;
			this.gl.colorMask = function (a, b, c, d) { self.calls++; colorMask(a, b, c, d); };
			this.gl.depthMask = function (a) { self.calls++; depthMask(a); };
		},
		teardown: function () {
			this.engine.clear();
		}
	});

	test("constructor", function () {
		var state = new WriteMaskState({ enableRed: false, foo: "bar" });
		strictEqual(state.enableRed, false, "override parameter");
		strictEqual(state.foo, undefined, "do not create unknown properties");
	});

	test("set", function () {
		var state = new WriteMaskState();

		state.set(this.gl);
		strictEqual(this.calls, 0,	"no redundant calls");

		this.calls = 0;
		state.enableRed = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.colorMask called when state.enableRed changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.enableGreen = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.colorMask called when state.enableGreen changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.enableBlue = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.colorMask called when state.enableBlue changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.enableAlpha = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.colorMask called when state.enableAlpha changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.enableDepth = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.depthMask called when state.enableDepth changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")
	});

});
