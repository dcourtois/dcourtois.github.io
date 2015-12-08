require(["Core/Engine", "States/DepthState"], function (Engine, DepthState) {

	module("States/DepthState", {
		setup: function () {
			this.canvas = document.createElement("canvas");
			this.canvas.width = 4;
			this.canvas.height = 4;
			this.engine = new Engine(this.canvas);
			this.gl = this.engine.gl;
			
			// override the WebGL functions to verify they are called
			var self = this,
				disable = this.gl.disable.bind(this.gl);
			this.calls = 0;
			this.gl.disable = function (a) { self.calls++; disable(a); };
		},
		teardown: function () {
			this.engine.clear();
		}
	});

	test("constructor", function () {
		var state = new DepthState({ enabled: false, foo: "bar" });
		strictEqual(state.enabled, false, "override parameter");
		strictEqual(state.foo, undefined, "do not create unknown properties");
	});

	test("set", function () {
		var state = new DepthState();
		(new DepthState()).set(this.gl);
		this.calls = 0;

		state.set(this.gl);
		strictEqual(this.calls, 0,	"no redundant calls");

		this.calls = 0;
		state.enabled = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.disable set when state.enabled changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")
	});

});
