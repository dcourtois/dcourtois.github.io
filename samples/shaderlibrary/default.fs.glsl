#if defined(NORMAL)
#	extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;

#if defined(DIFFUSE) || defined(NORMAL) || defined(SPECULAR)
#	define NEED_UV
#endif

uniform		vec4		uLightDiffuse;
uniform		vec3		uLightInverseDirection;
uniform		vec4		uMaterialDiffuse;
uniform		vec4		uMaterialAmbient;
#if defined(DIFFUSE)
uniform		sampler2D	uDiffuseSampler;
#endif
#if defined(NORMAL)
uniform		sampler2D	uNormalSampler;
#endif
#if defined(SPECULAR)
uniform		sampler2D	uSpecularSampler;
uniform		vec4		uMaterialSpecular;
uniform		float		uMaterialSpecularHardness;
uniform		float		uMaterialSpecularPower;
#endif
#if defined(NORMAL) || defined(SPECULAR)
uniform		vec3		uCameraPosition;
#endif

#if defined(NORMAL) || defined(SPECULAR)
varying vec3 vPosition;
#endif
varying vec3 vNormal;
#if defined(NEED_UV)
varying vec2 vTexcoord0;
#endif
#if defined(VERTEX_COLOR)
varying vec4 vColor;
#endif

#if defined(NORMAL)
//!
//! @brief	Get the transformation matrix needed to transform a normal from object space into world space.
//! @param	N The normalized normal into object space.
//! @param	p The point to eye normalized vector into world space.
//! @param	uv The texture coordinates.
//!
mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)
{
	vec3 dp1 = dFdx(p);
	vec3 dp2 = dFdy(p);
	vec2 duv1 = dFdx(uv);
	vec2 duv2 = dFdy(uv);

	vec3 T = normalize(dp1 * duv2.y - dp2 * duv1.y);
	vec3 B = cross(T, N);

	return mat3(T, B, N);
}
#endif

void main()
{
	// sample textures
#if defined(DIFFUSE)
	vec4 diffuseSample = texture2D(uDiffuseSampler, vTexcoord0);
#endif
#if defined(NORMAL)
	vec3 normalSample = texture2D(uNormalSampler, vTexcoord0).xyz;
#endif
#if defined(SPECULAR)
	vec4 specularSample = texture2D(uSpecularSampler, vTexcoord0);
#endif

#if defined(NORMAL)
	// convert the normal
	vec3 normal = normalSample;
	// should get rid of this and convert the textures correctly
	normal.y = 1.0 - normal.y;
	normal = normal * 2.0 - 1.0;

	// compute the cotangent frame
	mat3 cotangentFrame = cotangent_frame(normalize(vNormal), normalize(uCameraPosition - vPosition), vTexcoord0);

	// perturbe the normal
	normal = normalize(cotangentFrame * normal);
#else
	vec3 normal = normalize(vNormal);
#endif

	// compute the diffuse intensity
	float diffuseIntensity = max(dot(normal, uLightInverseDirection), 0.0);

	// compute the diffuse color
	vec4 diffuseColor = max(uLightDiffuse * uMaterialDiffuse * diffuseIntensity, uMaterialAmbient);

#if defined(DIFFUSE)
	// add the diffuse texture contribution
	diffuseColor *= diffuseSample;
#endif
#if defined(VERTEX_COLOR)
	// add the vertex color contribution
	diffuseColor *= vColor;
#endif

#if defined(SPECULAR)
	// compute the specular intensity
	vec3	positionToEye	= normalize(uCameraPosition - vPosition);
	vec3	halfVector		= normalize(uLightInverseDirection + positionToEye);
	float	specularPower	= max(dot(halfVector, normal), 0.0);
	specularPower = pow(specularPower, uMaterialSpecularHardness) * uMaterialSpecularPower;
#endif

	// compute the final fragment color
#if defined(SPECULAR)
	gl_FragColor = vec4((diffuseColor + uMaterialSpecular * specularPower * specularSample).xyz, 1);
#else
	gl_FragColor = vec4(diffuseColor.xyz, 1);
#endif
}
