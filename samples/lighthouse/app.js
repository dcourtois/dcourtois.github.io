require(["Core/Engine","Core/EventHandler","Components/Camera","Components/CameraController","Loading/SceneLoader","Passes/UpdatePass","Passes/RenderPass","Renderer/BackBufferTarget","loading","Math/Math"],function(e,a,n,t,r,d,o,s,i){"use strict";function l(){var e=c.sceneGraph.find("name","Camera",!0).getComponent(n.type),a=new d(c);g=new o(c),g.setRenderTarget(new s(c)),g.setCamera(e),c.passes.push(a),c.passes.push(g)}function C(){var e=c.sceneGraph.find("name","Camera",!0).getComponent(n.type),r=c.sceneGraph.find("name","Camera",!0).getComponent(t.type),d=g.renderLayer.renderTarget.clearColor,o={clearColor:[255*d[0],255*d[1],255*d[2],d[3]]},s=document.getElementById("gui"),i=new dat.GUI({width:s.clientWidth,autoPlace:!1});s.appendChild(i.domElement);var l=i.addFolder("Stats");l.add(c.stats.renderer,"triangleCount").listen(),l.add(c.stats.renderer,"vertexCount").listen(),l.add(c.stats.renderer,"drawCalls").listen(),l.add(c.stats,"fps").listen(),l.open();var C=i.addFolder("Scene");C.addColor(o,"clearColor").onChange(function(e){d[0]=e[0]/255,d[1]=e[1]/255,d[2]=e[2]/255});var m=i.addFolder("Camera");m.add(r,"rotateSensitivity"),m.add(r,"panSensitivity"),m.add(r,"zoomSensitivity"),m.add(e,"near").onChange(function(a){e.setNear(a)}),m.add(e,"far").onChange(function(a){e.setFar(a)}),m.add({fov:Math.radToDeg(e.fovy)},"fov").min(5).max(120).onChange(function(a){e.setFovy(Math.degToRad(a))}),i.close(),c.eventHandler.addEventListener(this,function(e){switch(e.type){case a.EVENTS.VIEWPORT:i.width=s.clientWidth}return!1})}var c,g;c=new e(document.getElementById("webgl2"),{antialias:!0,debug:!1}),c.gl.enable(c.gl.DEPTH_TEST),c.gl.enable(c.gl.CULL_FACE),i.startLoading("loading",50,"Loading ...");var m=new r(c,{shaderLibrary:"../shaderlibrary/shaders.json"});m.load("scene.json",function(){l(),c.start();var e=function(){0===c.stats.renderer.drawCalls?requestAnimationFrame(e):(C(),i.stopLoading())};e()})});