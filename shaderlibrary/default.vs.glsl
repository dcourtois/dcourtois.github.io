precision mediump float;

#if defined(DIFFUSE) || defined(NORMAL) || defined(SPECULAR)
#	define NEED_UV
#endif
#if defined(NORMAL) || defined(SPECULAR)
#	define NEED_WORLD_POSITION
#endif

uniform mat4 uNormal;
uniform mat4 uWorldViewProjection;
#if defined(NEED_WORLD_POSITION)
uniform mat4 uWorld;
#endif

attribute vec3 aPosition;
attribute vec3 aNormal;
#if defined(NEED_UV)
attribute vec2 aTexcoord0;
#endif
#if defined(VERTEX_COLOR)
attribute vec4 aColor;
#endif

#if defined(NEED_WORLD_POSITION)
varying vec3 vPosition;
#endif
varying vec3 vNormal;
#if defined(NEED_UV)
varying vec2 vTexcoord0;
#endif
#if defined(VERTEX_COLOR)
varying vec4 vColor;
#endif

void main()
{
	// project the position on the screen
	gl_Position = uWorldViewProjection * vec4(aPosition, 1);

	// convert the position and normal into world space
#if defined(NEED_WORLD_POSITION)
	vPosition = (uWorld * vec4(aPosition, 1)).xyz;
#endif
	vNormal = (uNormal * vec4(aNormal, 0)).xyz;

#if defined(NEED_UV)
	// forward the texture coordinates
	vTexcoord0 = aTexcoord0;
#endif

#if defined(VERTEX_COLOR)
	// forward the vertex color
	vColor = aColor;
#endif
}
