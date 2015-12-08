uniform sampler2D uDiffuseSampler;
uniform sampler2D uDepthSampler;
uniform sampler2D uSSAOSampler;

uniform vec2 uSSAOTextureSize;
uniform vec3 uLinearizeDepth;

uniform float uBlur;
uniform float uClamp;
uniform vec2 uSSAOContribution;
uniform vec3 uDebugComposition;

//
// Compute the size of a pixel in the SSAO textures.
//
vec2 ssaoPixelSize = 1.0 / uSSAOTextureSize;

//
// Compute the blur offset to center it.
//
const float blurOffset = float(1 - BLUR_RADIUS) / 2.0;

//
// Linearize the depth : the input depth is the sample from the depth map,
// and the output is a depth linearezed between 0 and 1
//
float linearizeDepth(float depth)
{
	return uLinearizeDepth.x / (depth * uLinearizeDepth.y + uLinearizeDepth.z);
}

//
// Compute the average of the N by N area located around the given UV.
// This function takes the depth into account to avoid leaking accross
// depth discontinuities.
//
vec4 blur(vec2 uv)
{
	// sample the center pixel (for debug)
	vec4 center = texture2D(uSSAOSampler, uv);

	// sample the center depth
	float centerDepth = linearizeDepth(texture2D(uDepthSampler, uv).r);

	// compute the average
	vec4 average = vec4(0.0);
	int samples = 0;
	for (int h = 0; h < BLUR_RADIUS; ++h)
	{
		for (int w = 0; w < BLUR_RADIUS; ++w)
		{
			// get the sample UV
			vec2 sampleUV = uv + (vec2(float(h), float(w)) + blurOffset) * ssaoPixelSize;

			// sample the depth at that location to check if we need to consider this SSAO sample
			float depth = linearizeDepth(texture2D(uDepthSampler, sampleUV).r);

			// only update the average when the depth difference is less than the chosen threshold
			if (abs(depth - centerDepth) < uClamp)
			{
				average += texture2D(uSSAOSampler, sampleUV);
				samples += 1;
			}
		}
	}

	// compute the average, taking into account the (really rare) case where
	// all the samples were too far away from the center pixel's depth.
	average = samples > 0 ? average /= float(samples) : center;

	// return the value
	return mix(center, average, uBlur);
}

void main()
{
	// sample our textures
	vec3 diffuseSample = texture2D(uDiffuseSampler, vTexCoord).rgb;
	vec3 ssaoSample = blur(vTexCoord).rgb;

	// apply the ssao contribution
	vec3 ssao = clamp(ssaoSample * uSSAOContribution.x + uSSAOContribution.y, vec3(0.0), vec3(1.0));

	// output result
	gl_FragColor = vec4(
		diffuseSample * ssao * uDebugComposition.x +
		diffuseSample * uDebugComposition.y +
		ssao * uDebugComposition.z,
		1.0);
}
