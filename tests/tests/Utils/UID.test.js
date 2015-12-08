require(["Utils/UID"], function (UID) {

	module("Utils/UID");

	test("newId", function () {
		strictEqual(UID.newId(),		0,	"initial id, default pool");
		strictEqual(UID.newId("test"),	0,	"initial id, test pool");
		strictEqual(UID.newId(),		1,	"second id, default pool");
		strictEqual(UID.newId("test"),	1,	"second id, test pool");
	});

});
