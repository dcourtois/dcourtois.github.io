require(["Core/Engine", "States/BlendState"], function (Engine, BlendState) {

	module("States/BlendState", {
		setup: function () {
			this.canvas = document.createElement("canvas");
			this.canvas.width = 4;
			this.canvas.height = 4;
			this.engine = new Engine(this.canvas);
			this.gl = this.engine.gl;
			
			// override the WebGL functions to verify they are called
			var self = this,
				blendEquation = this.gl.blendEquation.bind(this.gl),
				blendFunc = this.gl.blendFunc.bind(this.gl);
			this.calls = 0;
			this.gl.blendEquation = function (a) { self.calls++; blendEquation(a); };
			this.gl.blendFunc = function (a, b) { self.calls++; blendFunc(a, b); };
		},
		teardown: function () {
			this.engine.clear();
		}
	});

	test("constructor", function () {
		var state = new BlendState({ mode: this.gl.FUNC_ADD, foo: "bar" });
		strictEqual(state.mode, this.gl.FUNC_ADD, "override parameter");
		strictEqual(state.foo, undefined, "do not create unknown properties");
	});

	test("set", function () {
		var state = new BlendState();

		state.set(this.gl);
		strictEqual(this.calls, 0,	"no redundant calls");

		this.calls = 0;
		state.mode = this.gl.FUNC_ADD;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.blendFunc set when state.mode changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.source = this.gl.DST_COLOR;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.blendEquation set when state.source changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.source = this.gl.ZERO;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.blendEquation set when state.destination changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")
	});

});
