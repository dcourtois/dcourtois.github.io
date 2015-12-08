require([
	"Core/Engine",
	"Resources/ResourceManager",
	"Resources/Shader",
	"Resources/Texture",
	"Resources/IndexBuffer",
	"Resources/VertexBuffer"
], function (
	Engine,
	ResourceManager,
	Shader,
	Texture,
	IndexBuffer,
	VertexBuffer
) {

	module("Resources/ResourceManager", {
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

	test("create (empty)", function () {
		var shader = this.manager.create(ResourceManager.SHADER),
			texture = this.manager.create(ResourceManager.TEXTURE),
			indexBuffer = this.manager.create(ResourceManager.VERTEX_BUFFER),
			vertexBuffer = this.manager.create(ResourceManager.INDEX_BUFFER);

		// ensure we can create each type of resource
		notStrictEqual(shader,			undefined,	"shader handle created");
		notStrictEqual(texture,			undefined,	"texture handle created");
		notStrictEqual(indexBuffer,		undefined,	"index buffer handle created");
		notStrictEqual(vertexBuffer,	undefined,	"vertex buffer handle created");

		// ensure they are valid
		notStrictEqual(shader.getResource(),		undefined,	"shader resource created");
		notStrictEqual(texture.getResource(),		undefined,	"texture resource created");
		notStrictEqual(indexBuffer.getResource(),	undefined,	"index buffer resource created");
		notStrictEqual(vertexBuffer.getResource(),	undefined,	"vertex buffer resource created");

		// ensure their type is initialize
		strictEqual(shader.getResource().type,			ResourceManager.SHADER,			"shader type initialized");
		strictEqual(texture.getResource().type,			ResourceManager.TEXTURE,		"texture type initialized");
		strictEqual(indexBuffer.getResource().type,		ResourceManager.VERTEX_BUFFER,	"index buffer type initialized");
		strictEqual(vertexBuffer.getResource().type,	ResourceManager.INDEX_BUFFER,	"vertex buffer type initialized");

		// check resource handle initialization
		strictEqual(shader.resourcePointer.refCount,	1,	"ref count initialized to 1");
	});

	test("createShader", function () {
		notStrictEqual(this.manager.createShader(), undefined, "empty shader created");
	});

	test("createTexture", function () {
		notStrictEqual(this.manager.createTexture(), undefined, "empty texture created");
	});

	test("createIndexBuffer", function () {
		notStrictEqual(this.manager.createIndexBuffer(), undefined, "empty vertex buffer created");
	});

	test("createVertexBuffer", function () {
		notStrictEqual(this.manager.createVertexBuffer(), undefined, "empty index buffer created");
	});

});
