require(["Core/Engine","Core/Node","Components/Camera","Components/CameraController","Passes/RenderPass","Passes/UpdatePass","Renderer/BackBufferTarget","Utils/MeshHelper"],function(e,t,i,o,n,a,r,s){"use strict";var c=document.getElementById("gui"),u=new dat.GUI({width:c.clientWidth,autoPlace:!1}),d=new e(document.getElementById("webgl2"),{antialias:!0}),l=s.createFullscreenQuad(d),p=new t(d,"quad"),m=new t(d,"camera"),f={min:.1,max:20,precision:.002,iterations:50},v=d.resourceManager.createShader({vs:["precision highp float;","attribute vec3 aPosition;","varying vec2 vPosition;","void main()","{","	gl_Position = vec4(aPosition, 1);","	vPosition = aPosition.xy;","}"],fs:["precision highp float;","varying vec2 vPosition;","uniform vec3 uPosition;","uniform mat4 uInverseViewProjection;","uniform float uMin;","uniform float uMax;","uniform float uPrecision;","uniform float uIterations;","float Union(float d1, float d2)","{","	return d1 < d2 ? d1 : d2;","}","float plane(vec3 position)","{","	return position.y;","}","float sphere(vec3 position, float radius, vec3 center)","{","	return length(position - center) - radius;","}","float cube(vec3 position, vec3 size)","{","	return length(max(abs(position) - size, 0.0));","}","float trace(vec3 position, vec3 direction)","{","	float t = uMin;","	int iterations = int(uIterations);","	for (int i = 0; i < iterations; ++i) {","		vec3 point = position + direction * t;","		float result = sphere(point, 1.0, vec3(0.0, 1.5, 0.0));","		result = Union(result, cube(point, vec3(1.0, 0.5, 1.0)));","		result = Union(result, plane(point));","		if (result < uPrecision || t > uMax) { break; }","		t += result;","	}","	return 1.0 - t / uMax;","}","void main()","{","	vec4 position = uInverseViewProjection * vec4(vPosition, -1.0, 1.0);","	position.xyz /= position.w;","	float distance = trace(position.xyz, normalize(position.xyz - uPosition));","	gl_FragColor = vec4(vec3(distance), 1.0);","}"],attributes:[{semantic:"position",name:"aPosition"}],uniforms:[{name:"uPosition",reference:"cameraPosition"},{name:"uInverseViewProjection",reference:"inverseViewProjection"},{name:"uMin",type:"float",object:f,attribute:"min"},{name:"uMax",type:"float",object:f,attribute:"max"},{name:"uPrecision",type:"float",object:f,attribute:"precision"},{name:"uIterations",type:"float",object:f,attribute:"iterations"}]});l.setShader(v),v.release(),m.addComponent(new i(d)),m.addComponent(new o(d,{position:[1.5,2,8],target:[0,1,0]})),d.sceneGraph.addChild(m),d.passes.push(new n(d,{renderTarget:new r(d),camera:m.getComponent("Camera")})),p.addComponent(l),d.sceneGraph.addChild(p),d.passes.push(new a(d)),c.appendChild(u.domElement),u.add(f,"min"),u.add(f,"max"),u.add(f,"precision"),u.add(f,"iterations"),d.start()});