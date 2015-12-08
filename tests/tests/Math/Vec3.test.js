require(["Math/Vec3"], function (Vec3) {

	module( "Math/Vec3" );

	test( "constructor", function() {
		var a = new Vec3();
		var b = new Vec3(0, 1, 2);
		var c = new Vec3([2, 1, 0]);
		var d = new Vec3(a);
		ok( a[0] === 0 && a[1] === 0 && a[2] === 0, "empty constructur" );
		ok( b[0] === 0 && b[1] === 1 && b[2] === 2, "scalar constructor" );
		ok( c[0] === 2 && c[1] === 1 && c[2] === 0, "array constructor" );
		ok( d !== a && d[0] === a[0] && d[1] === a[1] && d[2] === d[2], "copy constructor" );
	});

	test( "equals", function() {
		var a = new Vec3(1, 0, 2);
		var e = new Vec3(1, 0, 2);
		var d = new Vec3(1, 2, 2);

		ok( a.equals(e), "equals" );
		ok( a.equals([1, 0, 2]), "equals array" );
		ok( a.equals(d) === false, "not equals" );
	});

	test( "addition", function() {
		var v = new Vec3();
		var a = new Vec3(1, 2, 3);
		var b = new Vec3(2, 1, 0);

		ok( v.add(a, b).equals([3, 3, 3]), "add" );
		ok( v.addSelf(a).equals([4, 5, 6]), "addSelf" );
		ok( v.addScalar(a, 1).equals([2, 3, 4]), "addScalar" );
		ok( v.addScalarSelf(1).equals([3, 4, 5]), "addScalarSelf" );
	});

	test( "substraction", function() {
		var v = new Vec3();
		var a = new Vec3(3, 3, 3);
		var b = new Vec3(2, 1, 0);

		ok( v.sub(a, b).equals([1, 2, 3]), "sub" );
		ok( v.subSelf(a).equals([-2, -1, 0]), "subSelf" );
		ok( v.subScalar(a, 1).equals([2, 2, 2]), "subScalar" );
		ok( v.subScalarSelf(1).equals([1, 1, 1]), "subScalarSelf" );
	});

	test("clone", function (assert) {
		var v = new Vec3(0, 1, 2),
			c = v.clone();
		assert.close(v, c, 0, "content equal");
		notStrictEqual(v, c, "different instances");
	});

});
