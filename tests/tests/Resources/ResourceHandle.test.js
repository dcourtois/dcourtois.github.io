require([
	"Core/Engine",
	"Resources/ResourceManager",
	"Resources/Shader"
], function (
	Engine,
	ResourceManager,
	Shader
) {

	module("Resources/ResourceHandle", {
		setup: function () {
			// create a test canvas
			this.canvas = document.createElement("canvas");
			this.canvas.id		= "test-canvas";
			this.canvas.width	= "1024px";
			this.canvas.height	= "768px";
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

	test("release", function () {
		var shader = this.manager.createShader(),
			resourcePointer = shader.resourcePointer;
		shader.release();

		strictEqual(shader.resourcePointer,			undefined,	"resource");
		strictEqual(this.manager.resources.length,	0,			"resource removed from manager");

		// now create a handle with 2 instances, and check that release decrement
		// the refcount without releasing the resource
		shader = this.manager.createShader();
		shader.resourcePointer.grab();
		resourcePointer = shader.resourcePointer;
		shader.release();

		notStrictEqual(resourcePointer.resource,	undefined,	"doesn't release referenced resources");
		strictEqual(this.manager.resources.length,	1,			"resource still in manager");
		strictEqual(resourcePointer.refCount,		1,			"decrement ref count");
		throws(function () { shader.release(); },				"throws when releasing a handle on an already released resource");
	});

	test("clone", function () {
		var shader = this.manager.createShader(),
			count = shader.resourcePointer.refCount,
			clone = shader.clone();

		deepEqual(clone.resourcePointer,			shader.resourcePointer,	"cloned");
		strictEqual(clone.resourcePointer.refCount,	count + 1,				"refCount incremented");
	});

	test("getResource", function () {
		var shader = this.manager.createShader();

		notStrictEqual(shader.getResource(),			undefined,	"get resource");
		notStrictEqual(shader.getResource().uniforms,	undefined,	"get resource");
	});

});
