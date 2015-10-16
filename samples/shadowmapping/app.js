require([
	"Core/Engine",
	"Core/EventHandler",
	"Components/Camera",
	"Components/CameraController",
	"Loading/SceneLoader",
	"Passes/UpdatePass",
	"Passes/DebugTexturePass",
	"Passes/RenderPass",
	"Passes/ShadowPass",
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
	DebugTexturePass,
	RenderPass,
	ShadowPass,
	BackBufferTarget,
	loading
) {
	"use strict";

	// a few "globals" (used to communicate with the UI)
	var engine,
		camera,
		cameraController,
		shadowPass,
		renderPass,
		debugPass,
		renderShadowShader = {
			vs: [
				"precision highp float;",
				"uniform mat4 uWorld;",
				"uniform mat4 uNormal;",
				"uniform mat4 uWorldViewProjection;",
				"attribute vec3 aPosition;",
				"attribute vec3 aNormal;",
				"varying vec3 vPosition;",
				"varying vec3 vNormal;",
				"void main()",
				"{",
				"    gl_Position = uWorldViewProjection * vec4(aPosition, 1);",
				"    vPosition = (uWorld * vec4(aPosition, 1)).xyz;",
				"    vNormal = (uNormal * vec4(aNormal, 0)).xyz;",
				"}"
			],
			fs: [
				"precision highp float;",
				"uniform mat4 uWorldToShadowMapMatrix;",
				"uniform sampler2D uShadowMap;",
				"uniform vec3 uLightPosition;",
				"uniform vec3 uLightDirection;",
				"uniform vec2 uLightSpotRadius;",
				"uniform vec3 uLinearizeDepth;",
				"varying vec3 vPosition;",
				"varying vec3 vNormal;",
				"",
				"vec2 spotRadius = cos(uLightSpotRadius);",
				"",
				"void main()",
				"{",
				"    float ndotl = dot(normalize(vNormal), -uLightDirection);",
				"    float diffuse = dot(normalize(vPosition - uLightPosition), uLightDirection);",
				"    diffuse = smoothstep(spotRadius.y, spotRadius.x, diffuse) * ndotl;",
				"",
				"    vec4 proj = uWorldToShadowMapMatrix * vec4(vPosition, 1);",
				"    proj.xyz /= proj.w;",
				"    proj.xy = proj.xy * 0.5 + 0.5;",
				"    float shadowSample = texture2D(uShadowMap, proj.xy).x;",
				"",
				"    proj.z = uLinearizeDepth.x / (proj.z * uLinearizeDepth.y + uLinearizeDepth.z);",
				"    shadowSample = uLinearizeDepth.x / (shadowSample * uLinearizeDepth.y + uLinearizeDepth.z);",
				"",
				"    float shadow = max(0.3, float(shadowSample - proj.z > 0.05));",
				"",
				"    gl_FragColor = vec4(vec3(diffuse * shadow), 1.0);",
				"}"
			],
			attributes: [
				{ semantic: "position", name: "aPosition" },
				{ semantic: "normal", name: "aNormal" }
			],
			uniforms: [
				{ name: "uWorld", reference: "world" },
				{ name: "uNormal", reference: "normal" },
				{ name: "uWorldViewProjection", reference: "worldViewProjection" },
				{ name: "uLinearizeDepth", reference: "linearizeDepth" },
				{ name: "uLightPosition", reference: "lightPosition", index: 0 },
				{ name: "uLightDirection", reference: "lightDirection", index: 0 },
				{ name: "uLightSpotRadius", reference: "lightSpotRadius", index: 0 }
			]
		};

	function initialize() {
		"use strict";

		var renderer = engine.renderer;

		// get the camera
		var camera = engine.sceneGraph.find("name", "Camera", true).getComponent(Camera.type);

		// render shadow pass
		shadowPass = new ShadowPass(engine, { size: 1024 });

		// configure the shader used to render the scene with shadows
		renderShadowShader.uniforms.push({
			name: "uShadowMap",
			reference: "texture",
			value: shadowPass.getShadowMap()
		});
		renderShadowShader = engine.resourceManager.createShader(renderShadowShader);
		renderShadowShader.getResource().addUniform({
			location: engine.gl.getUniformLocation(renderShadowShader.getResource().program, "uWorldToShadowMapMatrix"),
			set: function (gl) {
				gl.uniformMatrix4fv(
					this.location,
					false,
					shadowPass.renderLayer.camera.viewProjectionMatrix.elements
				);
			}
		});

		// initialize the render pass
		renderPass = new RenderPass(engine);
		renderPass.setRenderTarget(new BackBufferTarget(engine));
		renderPass.setCamera(camera);
		renderPass.renderLayer.shader = renderShadowShader;

		// initialize the debug pass
		debugPass = new DebugTexturePass(engine, { "size": engine.canvas.width / 4.0 });
		debugPass.setRenderTarget(new BackBufferTarget(engine, { "clearBufferBit": -1 }));
		debugPass.setCamera(camera);
		debugPass.addDepthTexture(shadowPass.getShadowMap());

		// add the passes
		engine.passes.push(new UpdatePass(engine));
		engine.passes.push(shadowPass);
		engine.passes.push(renderPass);
		engine.passes.push(debugPass);
	}

	// get the canvas and create the engine
	engine = new Engine(document.getElementById("webgl2"), { antialias: true, debug: false });
	engine.gl.enable(engine.gl.DEPTH_TEST);
	engine.gl.enable(engine.gl.CULL_FACE);

	// starting the "loading" screen
	loading.startLoading("loading", 50, "Loading ...");

	// load a test scene
	(new SceneLoader(engine, { shaderLibrary: "shaders.json" })).load("scene.json", function () {
		// initialize and configure rendering
		initialize();

		// start the game loop
		engine.start();

		// wait until we have at least 1 draw call (the scene graph might have been loaded,
		// but since everything's asynchronous, we want to wait for something to actually
		// draw before disabling the loading screen)
		var done = function () {
			if (engine.stats.renderer.drawCalls === 0) {
				requestAnimationFrame(done);
			} else {
				// setup the ui
	//			setupUI();

				// and stop loading
				loading.stopLoading();
			}
		};
		done();
	});
});
