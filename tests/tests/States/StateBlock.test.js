require([
	"Core/Engine",
	"States/DepthState",
	"States/StateBlock"
], function (
	Engine,
	DepthState,
	StateBlock
) {

	module("States/StateBlock", {
		setup: function () {
			this.canvas = document.createElement("canvas");
			this.canvas.width = 4;
			this.canvas.height = 4;
			this.engine = new Engine(this.canvas);
			this.gl = this.engine.gl;
			
			// override the WebGL functions to verify they are called
			var self = this,
				disable = this.gl.disable.bind(this.gl),
				enable = this.gl.enable.bind(this.gl);
			this.calls = 0;
			this.gl.disable = function (a) { self.calls++; disable(a); };
			this.gl.enable = function (a) { self.calls++; enable(a); };
		},
		teardown: function () {
			this.engine.clear();
		}
	});

	test("backup / set / restore", function () {
		var states = new StateBlock();
		(new DepthState()).set(this.gl);
		this.calls = 0;

		states.add(new DepthState({ enabled: false }));
		states.backup();
		strictEqual(this.calls, 0, "states backuped");

		states.set(this.gl);
		if (this.calls === 0) {
			var b = 0;
		}
		strictEqual(this.calls, 1, "states set");

		this.calls = 0;
		states.restore(this.gl);
		strictEqual(this.calls, 1, "states restored");
	});

});
