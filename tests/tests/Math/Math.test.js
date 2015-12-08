require(["Math/Math"], function (Vec3) {

	module( "Math/Math" );

	test( "clamp", function () {
		strictEqual( Math.clamp(-1, 1, 2), 1,		"inferior" );
		strictEqual( Math.clamp(1.5, 1, 2), 1.5,	"in range" );
		strictEqual( Math.clamp(3, 1, 2), 2,		"superior" );
	});

	test("nextPowerOfTwo", function () {
		strictEqual( Math.nextPowerOfTwo(1), 1,			"1");
		strictEqual( Math.nextPowerOfTwo(3), 4,			"3");
		strictEqual( Math.nextPowerOfTwo(4), 4,			"4");
		strictEqual( Math.nextPowerOfTwo(779), 1024,	"779");
	});

	test("isPowerOfTwo", function () {
		strictEqual( Math.isPowerOfTwo(1), true,	"1");
		strictEqual( Math.isPowerOfTwo(2), true,	"2");
		strictEqual( Math.isPowerOfTwo(4), true,	"4");
		strictEqual( Math.isPowerOfTwo(5), false,	"5");
	});

});
