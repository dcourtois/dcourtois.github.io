require(["Utils/File"], function (File) {
	"use strict";

	module("Utils/File");

	// helper function to print correct results
	var normalizeTest = function (source, destination, type) {
			strictEqual(File.normalize(source, type),
						destination,
						source + "   -->   " + destination);
		};

	test("File.normalize (file)", function () {
		normalizeTest("foo\\bar.html",						"foo/bar.html",					File.File);
		normalizeTest("./bar.html",							"bar.html",						File.File);
		normalizeTest("foo/baz/../bar.html",				"foo/bar.html",					File.File);
		normalizeTest("foo/./bar.html",						"foo/bar.html",					File.File);
		normalizeTest("foo/./../bar.html",					"bar.html",						File.File);
		normalizeTest("http://foo.com/../bar.html",			"http://foo.com/../bar.html",	File.File);
		normalizeTest("http://foo.com/bar/../bar.html",		"http://foo.com/bar.html",		File.File);
	});

	test("File.normalize (directory)", function () {
		normalizeTest("foo\\",			"foo/",		File.DIRECTORY);
		normalizeTest("",				"./",		File.DIRECTORY);
		normalizeTest("./",				"./",		File.DIRECTORY);
		normalizeTest("foo/../",		"./",		File.DIRECTORY);
		normalizeTest("foo/../../",		"../",		File.DIRECTORY);
		normalizeTest("foo/?bar=bar",	"foo/",		File.DIRECTORY);
	});

	test("File.getDirectory", function () {
		strictEqual(File.getDirectory("test/index.html"),	"test/",	"ok");
		strictEqual(File.getDirectory("index.html"),		"./",		"ok");
		strictEqual(File.getDirectory("foo/?bar=bar"),		"foo/",		"ok");
	});

	test("File.isAbsolute", function () {
		strictEqual( File.isAbsolute("http://index.html"),	true,	"ok" );
		strictEqual( File.isAbsolute("index.html"),			false,		"ok" );
	});

	test("File.isRelative", function () {
		strictEqual( File.isRelative("http://index.html"),	false,	"ok" );
		strictEqual( File.isRelative("index.html"),			true,	"ok" );
	});

	test("File.createFileSystem", function () {
		notStrictEqual(File.createFileSystem(), undefined, "ok");
	});

	asyncTest("File.exists", function () {
		var tests = 2, restart = function () { if (--tests === 0) { QUnit.start(); } };

		File.exists("foo.html", function (result) {
			strictEqual(result, false, "doesn't exist");
			restart();
		});

		File.exists("index.html", function (result) {
			strictEqual(result, true, "exists");
			restart();
		});
	});

	asyncTest("File.load", function () {
		var tests = 3,
			restart = function () { if (--tests === 0) { QUnit.start(); } },
			invalid = function () { ok(false, "should never reach here"); restart(); };

		File.load("foo.html", File.TEXT, invalid, function (status) {
			strictEqual(status, 404, "file not found");
			restart();
		});

		File.load("tests/Utils/data/foo.txt", File.TEXT, function (content) {
			strictEqual(content, "foo", "successfully loaded as text");
			restart();
		}, invalid);

		File.load("tests/Utils/data/bar.json", File.JSON, function (content) {
			deepEqual(content, { bar: "bar" }, "successfully loaded as json object");
			restart();
		}, invalid);
	});

	asyncTest("File.FileSystem.loadMultiple", function () {
		var fs = File.createFileSystem(),
			tests = 2,
			restart = function () { if (--tests === 0) { QUnit.start(); } },
			invalid = function () { ok(false, "should never reach here"); restart(); };

		fs.loadMultiple(
			[
				{ type: File.TEXT, url: "foo.html" },
				{ type: File.TEXT, url: "tests/Utils/data/foo.txt" }
			],
			invalid,
			function () {
				ok(true, "failure called");
				restart();
			}
		);

		fs.loadMultiple(
			[
				{ type: File.TEXT, url: "tests/Utils/data/foo.txt" },
				{ type: File.JSON, url: "tests/Utils/data/bar.json" }
			],
			function (contents) {
				strictEqual(contents.length, 2, "correct number of contents");
				strictEqual(contents[0].content, "foo", "correctly loaded text file");
				deepEqual(contents[1].content, {bar:"bar"}, "correctly loaded json file");
				restart();
			},
			invalid
		);
	});

});
