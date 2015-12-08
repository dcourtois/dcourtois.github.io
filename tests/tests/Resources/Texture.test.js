require([
	"Core/Engine",
	"Resources/Texture"
], function (
	Engine,
	Texture
) {

	module("Resources/Texture", {
		setup: function () {
			// create a test canvas
			this.canvas = document.createElement("canvas");
			this.canvas.width	= "2px";
			this.canvas.height	= "2px";

			// create the engine
			this.engine = new Engine(this.canvas);
			this.manager = this.engine.resourceManager;
			
			// override console's functions to catch errors
			this.warn = 0;
			this.error = 0;
			this.oldwarn = console.warn;
			this.olderror = console.error;
			console.warn = function () { this.warn += 1; }.bind(this);
			console.warn = function () { this.error += 1; }.bind(this);
		},
		teardown: function () {
			// delete the engine
			this.engine.clear();

			// restore the console
			console.warn = this.oldwarn;
			console.error = this.olderror;
		}
	});

	function loadImages(images, done) {
		if (images.length === undefined) {
			images = [images];
		}

		// this will check that all images have been loaded, and will call
		// the done function when so.
		var loaded = 0;
		function check() {
			loaded === images.length && done(images);
		}

		for (var i = 0; i < images.length; ++i) {
			var image = new Image();
			image.onload = function () { loaded++; check(); };
			image.onerror = function () { throw "couldn't load image" };
			image.src = images[i];
			images[i] = image;
		};
	}

	test("no descriptor", function () {
		try {
			var texture = new Texture(this.engine.gl);
			notStrictEqual(texture, undefined, "texture created");
		} catch (e) {
			ok(false, "exception during texture creation : " + e);
		}
	});

	asyncTest("cube map", function () {
		var gl = this.engine.gl;

		loadImages([
			"tests/Resources/data/cubemap.left.png",
			"tests/Resources/data/cubemap.right.png",
			"tests/Resources/data/cubemap.bottom.png",
			"tests/Resources/data/cubemap.top.png",
			"tests/Resources/data/cubemap.back.png",
			"tests/Resources/data/cubemap.front.png"
		], function (images) {
			var texture = new Texture(gl, { size: 96, target: gl.TEXTURE_CUBE_MAP, data: images, mipmap: false });
			strictEqual(this.warn, 0, "cube map created without warning");
			strictEqual(this.error, 0, "cube map created without error");
			strictEqual(gl.getError(), gl.NO_ERROR, "created without gl error");

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.texture);
			strictEqual(gl.getError(), gl.NO_ERROR, "can bind to TEXTURE_CUBE_MAP");

			gl.bindTexture(gl.TEXTURE_2D, texture.texture);
			strictEqual(gl.getError(), gl.INVALID_OPERATION, "cannot bind to TEXTURE_2D");

			QUnit.start();
		}.bind(this));
	});

});
