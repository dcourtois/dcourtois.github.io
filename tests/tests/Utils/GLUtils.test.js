require(["Utils/GLUtils"], function (GLUtils) {

	module("Utils/GLUtils");

	test("stringToGLenum", function () {
		var ctx = WebGLRenderingContext;

		strictEqual(GLUtils.stringToGLenum("GL_STREAM_DRAW"),		ctx.STREAM_DRAW,	"GL_STREAM_DRAW");
		strictEqual(GLUtils.stringToGLenum("GL_STATIC_DRAW"),		ctx.STATIC_DRAW,	"GL_STATIC_DRAW");
		strictEqual(GLUtils.stringToGLenum("GL_DYNAMIC_DRAW"),		ctx.DYNAMIC_DRAW,	"GL_DYNAMIC_DRAW");
		strictEqual(GLUtils.stringToGLenum("GL_BYTE"),				ctx.BYTE,			"GL_BYTE");
		strictEqual(GLUtils.stringToGLenum("GL_UNSIGNED_BYTE"),		ctx.UNSIGNED_BYTE,	"GL_UNSIGNED_BYTE");
		strictEqual(GLUtils.stringToGLenum("GL_SHORT"),				ctx.SHORT,			"GL_SHORT");
		strictEqual(GLUtils.stringToGLenum("GL_UNSIGNED_SHORT"),	ctx.UNSIGNED_SHORT,	"GL_UNSIGNED_SHORT");
		strictEqual(GLUtils.stringToGLenum("GL_INT"),				ctx.INT,			"GL_INT");
		strictEqual(GLUtils.stringToGLenum("GL_UNSIGNED_INT"),		ctx.UNSIGNED_INT,	"GL_UNSIGNED_INT");
		strictEqual(GLUtils.stringToGLenum("GL_FLOAT"),				ctx.FLOAT,			"GL_FLOAT");

		strictEqual(GLUtils.stringToGLenum("STREAM_DRAW"),		ctx.STREAM_DRAW,	"STREAM_DRAW");
		strictEqual(GLUtils.stringToGLenum("STATIC_DRAW"),		ctx.STATIC_DRAW,	"STATIC_DRAW");
		strictEqual(GLUtils.stringToGLenum("DYNAMIC_DRAW"),		ctx.DYNAMIC_DRAW,	"DYNAMIC_DRAW");
		strictEqual(GLUtils.stringToGLenum("BYTE"),				ctx.BYTE,			"BYTE");
		strictEqual(GLUtils.stringToGLenum("UNSIGNED_BYTE"),	ctx.UNSIGNED_BYTE,	"UNSIGNED_BYTE");
		strictEqual(GLUtils.stringToGLenum("SHORT"),			ctx.SHORT,			"SHORT");
		strictEqual(GLUtils.stringToGLenum("UNSIGNED_SHORT"),	ctx.UNSIGNED_SHORT,	"UNSIGNED_SHORT");
		strictEqual(GLUtils.stringToGLenum("INT"),				ctx.INT,			"INT");
		strictEqual(GLUtils.stringToGLenum("UNSIGNED_INT"),		ctx.UNSIGNED_INT,	"UNSIGNED_INT");
		strictEqual(GLUtils.stringToGLenum("FLOAT"),			ctx.FLOAT,			"FLOAT");

		// one check for GLenum's
		strictEqual(GLUtils.stringToGLenum(ctx.FLOAT),	ctx.FLOAT,	"GLenum");
	});

	test("getTypeSize", function () {
		var ctx = WebGLRenderingContext;
		strictEqual(GLUtils.getTypeSize(ctx.BYTE),				Int8Array.BYTES_PER_ELEMENT,	"sizeof BYTE" );
		strictEqual(GLUtils.getTypeSize(ctx.UNSIGNED_BYTE),		Uint8Array.BYTES_PER_ELEMENT,	"sizeof UNSIGNED_BYTE" );
		strictEqual(GLUtils.getTypeSize(ctx.SHORT),				Int16Array.BYTES_PER_ELEMENT,	"sizeof SHORT" );
		strictEqual(GLUtils.getTypeSize(ctx.UNSIGNED_SHORT),	Uint16Array.BYTES_PER_ELEMENT,	"sizeof UNSIGNED_SHORT" );
		strictEqual(GLUtils.getTypeSize(ctx.INT),				Int32Array.BYTES_PER_ELEMENT,	"sizeof INT" );
		strictEqual(GLUtils.getTypeSize(ctx.UNSIGNED_INT),		Uint32Array.BYTES_PER_ELEMENT,	"sizeof UNSIGNED_INT" );
		strictEqual(GLUtils.getTypeSize(ctx.FLOAT),				Float32Array.BYTES_PER_ELEMENT,	"sizeof FLOAT" );
	});

	test("createTypedArray", function () {
		function mytest(t) {
			var typeEnum = GLUtils.stringToGLenum(t),
				typedarray = GLUtils.createTypedArray(typeEnum, 1, 0);
			notStrictEqual(typedarray,			undefined, t + " - created");
			strictEqual(typedarray.byteLength,	GLUtils.getTypeSize(typeEnum), t + " - valid");
		};

		var ctx = WebGLRenderingContext;
		mytest("BYTE");
		mytest("UNSIGNED_BYTE");
		mytest("SHORT");
		mytest("UNSIGNED_SHORT");
		mytest("INT");
		mytest("UNSIGNED_INT");
		mytest("FLOAT");
	});

});
