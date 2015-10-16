require([
	"Core/Engine",
	"Core/EventHandler",
	"Components/Camera",
	"Components/CameraController",
	"Loading/SceneLoader",
	"Passes/UpdatePass",
	"Passes/RenderPass",
	"Renderer/BackBufferTarget",
	"loading",
	"Math/Math"
], function (
	Engine,
	EventHandler,
	Camera,
	CameraController,
	SceneLoader,
	UpdatePass,
	RenderPass,
	BackBufferTarget,
	loading
) {
	"use strict";

	// a few "globals" (used to communicate with the UI)
	var engine,
		camera,
		cameraController,
		renderPass;

	function initialize() {
		"use strict";

		// get the camera
		var camera = engine.sceneGraph.find("name", "Camera", true).getComponent(Camera.type);

		// initialize the update pass
		var updatePass = new UpdatePass(engine);

		// initialize the render pass
		renderPass = new RenderPass(engine);
		renderPass.setRenderTarget(new BackBufferTarget(engine));
		renderPass.setCamera(camera);

		// add the passes
		engine.passes.push(updatePass);
		engine.passes.push(renderPass);
	}

	function setupUI() {
		"use strict";

		// get a few objects
		var c = engine.sceneGraph.find("name", "Camera", true).getComponent(Camera.type),
			cc = engine.sceneGraph.find("name", "Camera", true).getComponent(CameraController.type),
			ccol = renderPass.renderLayer.renderTarget.clearColor,
			bgcol = { "clearColor": [ccol[0] * 255, ccol[1] * 255, ccol[2] * 255, ccol[3]] };

		// create the GUI and attach it
		var attachment = document.getElementById('gui');
		var gui = new dat.GUI({ width: attachment.clientWidth, autoPlace: false });
		attachment.appendChild(gui.domElement);

		// setup the stats
		var stats = gui.addFolder("Stats");
		stats.add(engine.stats.renderer, "triangleCount").listen();
		stats.add(engine.stats.renderer, "vertexCount").listen();
		stats.add(engine.stats.renderer, "drawCalls").listen();
		stats.add(engine.stats, "fps").listen();
		stats.open();

		// scene options
		var scene = gui.addFolder("Scene");
		scene.addColor(bgcol, "clearColor").onChange(function(v) { ccol[0] = v[0] / 255.0; ccol[1] = v[1] / 255.0; ccol[2] = v[2] / 255.0; });

		// camera options
		var camera = gui.addFolder("Camera");
		camera.add(cc, "rotateSensitivity");
		camera.add(cc, "panSensitivity");
		camera.add(cc, "zoomSensitivity");
		camera.add(c, "near").onChange(function (v) { c.setNear(v); });
		camera.add(c, "far").onChange(function (v) { c.setFar(v); });
		camera.add({ "fov": Math.radToDeg(c.fovy) }, "fov").min(5.0).max(120.0).onChange(function (v) { c.setFovy(Math.degToRad(v)); });

		// start with the GUI closed
		gui.close();

		// connect to the event handler to resize the UI when the window size changes (size of GUI is fixed
		// in javascript, making it non-responsive ...)
		engine.eventHandler.addEventListener(this, function (event) {
			switch (event.type) {
				case EventHandler.EVENTS.VIEWPORT:
					gui.width = attachment.clientWidth;
					break;
				default:
					break;
			}
			return false;
		});
	}

	// get the canvas and create the engine
	engine = new Engine(document.getElementById("webgl2"), { antialias: true, debug: false });
	engine.gl.enable(engine.gl.DEPTH_TEST);
	engine.gl.enable(engine.gl.CULL_FACE);

	// starting the "loading" indicator
	loading.startLoading("loading", 50, "Loading ...");

	// load a test scene
	var loader = new SceneLoader(engine, { shaderLibrary: "../../shaderlibrary/shaders.json" } );
	loader.load("scene.json", function () {
		// finalize the scene : add a camera if there is none, add default
		// pass if there's none, etc.
		initialize();

		// start the game loop
		engine.start();

		// wait until we have at least 1 draw call (the scene graph might have been loaded,
		// since everything's asynchronous, we want to wait for something to actually draw
		// before disabling the loading screen)
		var done = function () {
			if (engine.stats.renderer.drawCalls === 0) {
				requestAnimationFrame(done);
			} else {
				// setup the ui
				setupUI();

				// and stop loading
				loading.stopLoading();
			}
		};
		done();
	});
});
