
/**
 * this test module is not about testing the engine, it's just there to test a few language features.
 * I'm still quite new to Javascript and some behavior of it are not really natural to me, thus those
 * tests that I can check whenever I'm not sure about something.
 */

module("Language");

test("object members", function () {

	var obj = { a: true, b: false },
		undef = undefined,
		f = false;

	ok( obj.c === undefined,					"ok" );
	ok( !obj.c,									"ok" );
	ok( !obj.b,									"ok" );
	ok( obj.a,									"ok" );
	ok( obj.hasOwnProperty('c') === false,		"ok" );
	ok( !undef,									"ok" );
	ok( !f,										"ok" );
	throws( function () { foo === undefined },	"ok" );

});

test("statics", function () {

	function Test() {
		this.value = Test.stat++;
	}
	Test.stat = 0;

	var a = new Test();
	var b = new Test();

	ok( Test.stat === 2,		"accessible" );
	ok( a.stat === undefined,	"not accessible through instance" );
	ok( a.value === 0,			"works" );
	ok( b.value === 1,			"works" );

});

test("array", function () {

	var a = [];
	a[2] = "foo";
	a["bar"] = "bar";

	ok( a[0] === undefined,	"ok" );
	ok( a[2] === "foo",		"ok" );
	ok( a["bar"] === "bar",	"ok" );
	ok( a.length === 3,		"ok" );

});

test("modulo", function () {

	ok( 4 % 3 === 1,		"modulo" );
	ok( -4 % 3 === -1,		"negative modulo" );
	ok( 5.1 % 2.3 === 0.5,	"decimal modulo" );

});

test("references", function () {

	var obj = { value: 1 },
		bigobj = { "obj": obj },
		copy = obj,
		arr = [ bigobj ]
	for (var i = 0; i < 100; ++i) {
		arr.push({ "foo": "bar" });
	}
	copy.value = 2;

	strictEqual( obj["value"], 2,			"ok" );
	strictEqual( bigobj.obj["value"], 2,	"ok" );
	strictEqual( arr[0].obj["value"], 2,	"ok" );

});
