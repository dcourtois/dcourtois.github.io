require(["Utils/String"], function () {

	module("Utils/String");

	test("hashCode", function () {
		strictEqual(typeof (new String("test")).hashCode(), "number", "ok");
		strictEqual(typeof "test".hashCode(), "number", "ok");
		notStrictEqual("testA".hashCode(), "testB".hashCode(), "ok");
		strictEqual("testA".hashCode(), "testA".hashCode(), "ok");
	});

});
