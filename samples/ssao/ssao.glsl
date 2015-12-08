uniform sampler2D uDepthSampler;
uniform sampler2D uRandomSampler;

uniform mat4 uInverseProjectionMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uDepthTextureSize;
uniform vec2 uRandomTextureSize;
uniform vec3 uLinearizeDepth;

uniform float uRadius;
uniform float uClamp;

//
// those are used to be able to sample textures at pixel's center, given a pixel's index
// (indices range from 0 to texturesize-1, instead of from 0 to 1 with UVs)
//
vec4 depthTextureOffsetScale = vec4(1.0 / uDepthTextureSize, 0.5 / uDepthTextureSize);
vec4 randomTextureOffsetScale = vec4(1.0 / uRandomTextureSize, 0.5 / uRandomTextureSize);

//
// Linearize the depth : the input depth is the sample from the depth map,
// and the output is a depth linearezed between 0 and 1
//
float linearizeDepth(float depth)
{
	return uLinearizeDepth.x / (depth * uLinearizeDepth.y + uLinearizeDepth.z);
}

//
// Given the UV of a pixel in the depth map, reconstruct the view space
// position of this point. The returned value contains this coordinate
// in xyz, and w contains the sampled depth.
//
vec4 getViewSpaceFromUV(vec2 uv)
{
	// sample depth
	float d = texture2D(uDepthSampler, uv).r;

	// get the point in screen space
	vec3 p = vec3(uv, d);

	// convert to NDC
	p = p * 2.0 - vec3(1.0);

	// convert to view space
	vec4 pp = uInverseProjectionMatrix * vec4(p, 1.0);
	pp.xyz /= pp.w;

	return vec4(pp.xyz, d);
}

//
// Given a UV of a pixel in the depth map, reconstruct the normal of
// the corresponding geometry in view space.
//
// Note that the normals at the edges will likely be incorrect.
//
vec3 getNormalFromUV(vec2 uv)
{
	vec2 uvb = uv + vec2(1.0, 0.0) * depthTextureOffsetScale.xy + depthTextureOffsetScale.zw;
	vec2 uvc = uv + vec2(0.0, 1.0) * depthTextureOffsetScale.xy + depthTextureOffsetScale.zw;

	// sample 3 points
	vec3 a = getViewSpaceFromUV(uv).xyz;
	vec3 b = getViewSpaceFromUV(uvb).xyz;
	vec3 c = getViewSpaceFromUV(uvc).xyz;

	// compute the rays
	vec3 ra = normalize(b - a);
	vec3 rb = normalize(c - a);

	// return the normal
	return normalize(cross(ra, rb));
}

//
// Sample the random vector map at the given UV.
//
vec3 sampleRandom(vec2 uv)
{
	return texture2D(uRandomSampler, uv).xyz * 2.0 - vec3(1.0);
}

void main()
{
	// get the currently sampled point's position in view space
	vec4 currentPoint = getViewSpaceFromUV(vTexCoord);

	// compute an offset in the random texture.
	vec4 randomOffset = randomTextureOffsetScale;
	randomOffset.zw += (gl_FragCoord.xy - vec2(0.5)) * float(SSAO_SAMPLES) * randomOffset.xy;

	// compute the SSAO contribution
	float ssao = 0.0;
	for (int w = 0; w < SSAO_SAMPLES; ++w)
	{
		for (int h = 0; h < SSAO_SAMPLES; ++h)
		{
			// get the random sample
			vec2 randomUV = vec2(float(h), float(w)) * randomOffset.xy + randomOffset.zw;
			vec3 random = sampleRandom(randomUV) * uRadius;

			// get the sample point in view space, and project it to screen space
			vec4 point = uProjectionMatrix * vec4(currentPoint.xyz + random, 1.0);
			point.xyz = (point.xyz / point.w) * 0.5 + vec3(0.5);

			// now use the projected sample's UV to check which depth is stored at this location
			float depth = texture2D(uDepthSampler, clamp(point.xy, vec2(0.0), vec2(1.0))).r;

			// check the depth difference with the current depth
			float diff = linearizeDepth(currentPoint.w) - linearizeDepth(depth);

			// add the ssao contribution
			ssao += mix(float(depth > point.z), 0.5, float(diff > uClamp));
		}
	}

	// compute the average
	ssao /= float(SSAO_SAMPLES * SSAO_SAMPLES);

	//ssao = ssao * ssao + ssao;

	// and output it
	gl_FragColor = vec4(vec3(ssao), 1.0);
}
