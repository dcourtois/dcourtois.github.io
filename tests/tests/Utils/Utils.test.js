require(["Utils/Utils"], function (Utils) {

	module("Utils/Utils");

	test("clone", function () {
		var a = {
				a: "a",
				b: [
					{ c: 0, d: "d" },
					0,
					"e"
				]
			},
			b = Utils.clone(a);

		notStrictEqual(a,	b,	"different objects");
		deepEqual(a,		b,	"content equal");
	});

	test("getMember", function () {
		var obj = {
			child: {
				grandChild: true
			}
		}

		strictEqual(Utils.getMember(undefined, undefined),				undefined,				"both undefined");
		strictEqual(Utils.getMember(undefined, "child"),				undefined,				"object undefined");
		strictEqual(Utils.getMember(obj, undefined),					undefined,				"member undefined");
		strictEqual(Utils.getMember(obj, "badChild"),					undefined,				"invalid child");
		strictEqual(Utils.getMember(obj, "child"),						obj.child,				"child");
		strictEqual(Utils.getMember(obj, [ "child" ]),					obj.child,				"child (array)");
		strictEqual(Utils.getMember(obj, [ "child", "grandChild" ]),	obj.child.grandChild,	"grand child");
	});

	test("inherits", function () {
		function Base() {
		};
		Base.prototype = {
			foo: function () {
				return 1;
			},
		};

		function A() {
		};
		A.prototype = {
		};

		function B() {
		};
		B.prototype = {
			foo: function () {
				return this._base.foo() + 1;
			},
		};

		Utils.inherits(A, Base);
		Utils.inherits(B, Base);

		a = new A();
		b = new B();
		base = new Base();

		strictEqual(base.foo(),	1,	"base");
		strictEqual(a.foo(),	1,	"no override");
		strictEqual(b.foo(),	2,	"override");
	});

});
