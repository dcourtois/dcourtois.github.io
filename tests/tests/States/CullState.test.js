require(["Core/Engine", "States/CullState"], function (Engine, CullState) {

	module("States/CullState", {
		setup: function () {
			this.canvas = document.createElement("canvas");
			this.canvas.width = 4;
			this.canvas.height = 4;
			this.engine = new Engine(this.canvas);
			this.gl = this.engine.gl;
			
			// override the WebGL functions to verify they are called
			var self = this,
				disable = this.gl.disable.bind(this.gl),
				cullFace = this.gl.cullFace.bind(this.gl);
			this.calls = 0;
			this.gl.disable = function (a) { self.calls += a === self.gl.CULL_FACE ? 1 : 0; disable(a); };
			this.gl.cullFace = function (a) { self.calls++; cullFace(a); };
		},
		teardown: function () {
			this.engine.clear();
		}
	});

	test("constructor", function () {
		var state = new CullState({ face: this.gl.FRONT, foo: "bar" });
		strictEqual(state.face, this.gl.FRONT, "override parameter");
		strictEqual(state.foo, undefined, "do not create unknown properties");
	});

	test("set", function () {
		var state = new CullState();

		state.set(this.gl);
		strictEqual(this.calls, 0,	"no redundant calls");

		this.calls = 0;
		state.face = this.gl.FRONT;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.cullFace called when state.face changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")

		this.calls = 0;
		state.enabled = false;
		state.set(this.gl);
		strictEqual(this.calls, 1, "gl.disable called when state.disable changes");
		strictEqual(this.gl.getError(), this.gl.NO_ERROR, "no WebGL error")
	});

});
