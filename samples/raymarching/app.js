require([
	"Core/Engine",
	"Core/Node",
	"Components/Camera",
	"Components/CameraController",
	"Passes/RenderPass",
	"Passes/UpdatePass",
	"Renderer/BackBufferTarget",
	"Utils/MeshHelper"
], function (
	Engine,
	Node,
	Camera,
	CameraController,
	RenderPass,
	UpdatePass,
	BackBufferTarget,
	MeshHelper
) {
	"use strict";

	// create the engine and fullscreen quad
	var engine	= new Engine(document.getElementById("webgl2"), { antialias: true }),
		quad	= MeshHelper.createFullscreenQuad(engine),
		node	= new Node(engine, "quad"),
		camera	= new Node(engine, "camera"),
		shader	= engine.resourceManager.createShader({
			vs: [
				"precision highp float;",
				"attribute vec3 aPosition;",
				"varying vec2 vPosition;",

				"void main()",
				"{",
				"	gl_Position = vec4(aPosition, 1);",
				"	vPosition = aPosition.xy;",
				"}"
			],
			fs: [
				"precision highp float;",
				"varying vec2 vPosition;",
				"uniform vec3 uPosition;",
				"uniform vec3 uDirection;",

				"float Union(float d1, float d2)",
				"{",
				"	return d1 < d2 ? d1 : d2;",
				"}",
				
				"float plane(vec3 position)",
				"{",
				"	return position.y;",
				"}",
				
				"float sphere(vec3 position, float radius, vec3 center)",
				"{",
				"	return length(position - center) - radius;",
				"}",

				"float cube(vec3 position, vec3 size)",
				"{",
				"	return length(max(abs(position) - size, 0.0));",
				"}",

				"mat3 setupCamera()",
				"{",
				"	vec3 z = normalize(uDirection);",
				"	vec3 x = cross(z, vec3(0.0, 1.0, 0.0));",
				"	vec3 y = cross(x, z);",
				"	return mat3(x, y, z);",
				"}",

				"float trace(vec3 position, vec3 direction)",
				"{",
				"	float tMax = 20.0;",
				"	float tMin = 0.002;",
				"	float t = 0.1;",
				"	for (int i = 0; i < 50; ++i) {",
				"		vec3 point = position + direction * t;",
				"		float result = sphere(point, 1.0, vec3(0.0, 1.5, 0.0));",
				"		result = Union(result, cube(point, vec3(1.0, 0.5, 1.0)));",
				"		result = Union(result, plane(point));",
				"		if (result < tMin || t > tMax) { break; }",
				"		t += result;",
				"	}",
				"	return 1.0 - t / tMax;",
				"}",
				
				"void main()",
				"{",
				"	vec3 direction = setupCamera() * normalize(vec3(vPosition, 2.0));",
				"	float distance = trace(uPosition, direction);",
				"	gl_FragColor = vec4(vec3(distance), 1.0);",
				"}"
			],
			attributes: [
				{ semantic: "position", name: "aPosition" },
			],
			uniforms: [
				{ name: "uPosition", reference: "cameraPosition" },
				{ name: "uDirection", reference: "cameraDirection" },
			]
	});

	// assign the shader and release the last reference
	quad.setShader(shader);
	shader.release();

	// add the camera
	camera.addComponent(new Camera(engine));
	camera.addComponent(new CameraController(engine, { position: [1.5, 2, 5], target: [0, 1, 0] }));
	engine.sceneGraph.addChild(camera);

	// add the render pass, and the quad to the scene graph
	engine.passes.push(new RenderPass(engine, { renderTarget: new BackBufferTarget(engine), camera: camera.getComponent("Camera") }));
	node.addComponent(quad);
	engine.sceneGraph.addChild(node);

	// add the update pass
	engine.passes.push(new UpdatePass(engine));

	// start the game loop
	engine.start();
});
