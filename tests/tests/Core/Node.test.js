require(["Core/Node"], function (Node) {

	//
	// test component class
	//
	function Component() {
		this.deinitCalled = 0;
		this.attachCalled = 0;
		this.detachCalled = 0;
		this.notifications = [];
	};
	Component.prototype = {
		type: "Component",
		deinit: function () {
			++this.deinitCalled;
		},
		attach: function () {
			++this.attachCalled;
			return true;
		},
		detach: function () {
			++this.detachCalled;
		},
		notification: function (engine, node, message, component) {
			this.notifications.push({
				engine: engine,
				node: node,
				message: message,
				component: component
			});
		},
	};

	//
	// Function used to create a tree. relies on the addChild method.
	// The tree looks like :
	//     r
	//    /|\
	//   a c d
	//   |  /|\
	//   b e f g
	//
	function getTestGraph() {
		var a = new Node(null, "a"),
			b = new Node(null, "b"),
			c = new Node(null, "c"),
			d = new Node(null, "d"),
			e = new Node(null, "e"),
			f = new Node(null, "f"),
			g = new Node(null, "g"),
			root = new Node(null, "r");
		root.addChild(a);
		root.addChild(c);
		root.addChild(d);
		a.addChild(b);
		d.addChild(e);
		d.addChild(f);
		d.addChild(g);
		
		// override b'id to use it during tests
		b.id = 1234;

		// add a few properties
		b.userData = "mesh";
		e.userData = "probe";
		f.userData = "mesh";

		// return the root
		return root;
	}

	module("Core/Node", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	test("addChild", function () {
		var root = new Node(undefined, "root"),
			child = new Node(undefined, "childA");

		root.addChild(child);
		strictEqual(root.children.length, 1, "added");

		root.addChild(child);
		strictEqual(root.children.length, 1, "only added once");
	});

	test("removeChild", function () {
		var root = new Node(undefined, "root"),
			child = new Node(undefined, "childA");

		root.addChild(child);
		root.removeChild(child);

		strictEqual(root.children.length, 0, "removed");
	});

	test("addComponent", function () {
		var root = new Node(undefined, "root"),
			component = new Component("childA");

		root.addComponent(component);

		strictEqual(root.components.length, 1, "added");
	});

	test("removeComponent", function () {
		var root = new Node(undefined, "root"),
			component = new Component("childA"),
			componentDeinit = new Component("childA");

		root.addComponent(component);
		root.addComponent(componentDeinit);
		root.removeComponent(component);
		root.removeComponent(componentDeinit, true);

		strictEqual(root.components.length, 0, "removed");
		strictEqual(component.deinitCalled, 0, "deinit not called");
		strictEqual(componentDeinit.deinitCalled, 1, "deinit called");
	});

	test("attach called", function () {
		var root = new Node(undefined, "root"),
			component = new Component("childA");

		root.addComponent(component);

		strictEqual(component.attachCalled, 1, "attach called");
	});

	test("detach called", function () {
		var root = new Node(undefined, "root"),
			component = new Component("childA");

		root.addComponent(component);
		root.removeComponent(component);

		strictEqual(component.detachCalled, 1, "detach called");
	});

	test("notification called", function () {
		var root = new Node(undefined, "root"),
			component = new Component("childA"),
			componentDeinit = new Component("childA");

		root.addComponent(component);
		root.addComponent(componentDeinit);
		root.removeComponent(component);
		root.removeComponent(componentDeinit, true);

		strictEqual(componentDeinit.notifications.length,	1,	"notification called");
		strictEqual(component.notifications.length,			1,	"notification called, not on self");
		deepEqual(
			component.notifications[0],
			{
				engine: undefined,
				node: root,
				message: 'ATTACHED',
				component: componentDeinit
			},
			"attached notification received"
		);
		deepEqual(
			componentDeinit.notifications[0],
			{
				engine: undefined,
				node: root,
				message: 'DETACHED',
				component: component
			},
			"detached notification received"
		);
	});

	test("deinit", function () {
		var root = new Node(undefined, "root"),
			rootComponent = new Component(),
			child = new Node(undefined, "childA"),
			childComponent = new Component(),
			grandChild = new Node(undefined, "childA"),
			grandChildComponent = new Component();

		root.addComponent(rootComponent);
		child.addComponent(childComponent);
		grandChild.addComponent(grandChildComponent);

		root.addChild(child);
		child.addChild(grandChild);

		root.deinit();

		strictEqual(
			root.children.length + child.children.length + grandChild.children.length,
			0,
			"children recursively removed"
		);
		strictEqual(
			root.components.length + child.components.length + grandChild.components.length,
			0,
			"component recursively removed"
		);
		strictEqual(
			rootComponent.deinitCalled + childComponent.deinitCalled + grandChildComponent.deinitCalled,
			3,
			"component recursively deinit'ed"
		);
	});

	test("walk", function () {
		var root = getTestGraph(),
			pre = "",
			post = "",
			prepost = "",
			prestop = "",
			poststop = "";
		root.walk({ pre: function (n) { pre += "-" + n.name; } });
		root.walk({ post: function (n) { post += "+" + n.name; } });
		root.walk({ pre: function (n) { prestop += "-" + n.name; return n.name === "b"; } });
		root.walk({ post: function (n) { poststop += "+" + n.name; return n.name === "b"; } });
		root.walk({
			pre: function (n) { prepost += "-" + n.name; },
			post: function (n) { prepost += "+" + n.name; }
		});

		strictEqual(pre, "-r-a-b-c-d-e-f-g",						"pre");
		strictEqual(post, "+b+a+c+e+f+g+d+r",						"post");
		strictEqual(prepost, "-r-a-b+b+a-c+c-d-e+e-f+f-g+g+d+r",	"pre & post");
		strictEqual(prestop, "-r-a-b",								"pre stops at 'b'");
		strictEqual(poststop, "+b",									"post stops at 'b'");
	});

	test("find", function () {
		var root = getTestGraph(),
			probe = root.find("userData", "probe", true),
			unknown = root.find("userData", "foo", true),
			mesh = root.find("userData", "mesh", true),
			meshes = root.find("userData", "mesh", false),
			invalid = root.find("foo", "mesh", false);

		notStrictEqual(probe,		undefined,	"found");
		strictEqual(unknown,		undefined,	"not found");
		strictEqual(mesh.id,		1234,		"find first");
		strictEqual(meshes.length,	2,			"find all");
		strictEqual(meshes.length,	2,			"find invalid key");
		strictEqual(invalid.length,	0,			"find invalid key");
	});

});
