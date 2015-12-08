require(["Utils/Array"], function () {

	module("Utils/Array");

	test("remove", function () {
		var a = ['a', 'b', 'c'];
		var b = ['b', 'b', 'c'];
		var c = ['b', 'b', 'b'];
		a.remove('b');
		b.remove('b');
		c.remove('b');
		ok(a.length === 2 && a[0] === 'a' && a[1] === 'c', "remove single");
		ok(b.length === 1 && b[0] === 'c', "remove multiple");
		ok(c.length === 0, "remove all");
	});

	test("removeIf", function () {
		var a = ['a', 'b', 'c'];
		var b = ['b', 'b', 'c'];
		var c = ['b', 'b', 'b'];
		a.removeIf(function (o) { return o === 'b' });
		b.removeIf(function (o) { return o === 'b' });
		c.removeIf(function (o) { return o === 'b' });
		ok(a.length === 2 && a[0] === 'a' && a[1] === 'c', "remove single");
		ok(b.length === 1 && b[0] === 'c', "remove multiple");
		ok(c.length === 0, "remove all");
	});

	test("contains", function () {
		var a = ['a', 'b', 'c'];
		ok(a.contains('c') === true, "contains");
		ok(a.contains('d') === false, "doesn't contain");
	});

	test("clear", function () {
		var a = ['a', 'b'];
		var b = [];
		ok(a.clear().length === 0 && a[0] === undefined, "clear 2 elements");
		ok(b.clear().length === 0, "clear empty array");
	});

});
