export type WaterQuality = "lite" | "full";

const PRESETS: Record<WaterQuality, { steps: number; rayIter: number; normalIter: number }> = {
  full: { steps: 72, rayIter: 12, normalIter: 34 },
  lite: { steps: 44, rayIter: 9, normalIter: 20 },
};

export const WATER_VERTEX = /* glsl */ `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

function heightFn(name: string, iterations: number) {
  return /* glsl */ `
float ${name}(vec2 p) {
  float seed = 0.0;
  float freq = 1.0;
  float speed = 1.55;
  float weight = 1.0;
  float sum = 0.0;
  float total = 0.0;
  for (int i = 0; i < ${iterations}; i++) {
    vec2 dir = normalize(vec2(sin(seed), cos(seed)) + WIND);
    vec2 w = wave(p, dir, freq, uTime * speed);
    p += dir * w.y * weight * DRAG;
    sum += w.x * weight;
    total += weight;
    weight *= 0.8;
    freq *= 1.19;
    speed *= 1.075;
    seed += 2.39996;
  }
  return sum / total;
}`;
}

export function buildWaterFragment(quality: WaterQuality) {
  const q = PRESETS[quality];
  return /* glsl */ `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLook;
uniform vec3 uScan;
uniform float uSide;
varying vec2 vUv;

#define DEPTH 1.0
#define DRAG 0.3
#define WIND vec2(0.32, 0.58)
#define SCALE 0.62

const vec3 SIGNAL = vec3(1.0, 0.384, 0.141);

vec2 wave(vec2 p, vec2 dir, float freq, float phase) {
  float x = dot(dir, p) * freq + phase;
  float w = exp(sin(x) - 1.0);
  return vec2(w, -w * cos(x));
}

${heightFn("heightRay", q.rayIter)}
${heightFn("heightFine", q.normalIter)}

float surfaceAt(vec2 xz) {
  return heightRay(xz * SCALE) * DEPTH - DEPTH;
}

float march(vec3 ro, vec3 rd) {
  vec3 pos = ro + rd * (-ro.y / rd.y);
  for (int i = 0; i < ${q.steps}; i++) {
    float h = surfaceAt(pos.xz);
    if (h + 0.01 > pos.y) break;
    pos += rd * (pos.y - h);
  }
  return distance(pos, ro);
}

vec3 normalAt(vec2 xz, float e) {
  vec2 p = xz * SCALE;
  float es = e * SCALE;
  float h = heightFine(p) * DEPTH;
  float hx = heightFine(p - vec2(es, 0.0)) * DEPTH;
  float hz = heightFine(p + vec2(0.0, es)) * DEPTH;
  vec3 a = vec3(e, h - hx, 0.0);
  vec3 b = vec3(0.0, h - hz, -e);
  return normalize(cross(a, b));
}

vec3 sky(vec3 d, vec3 sun, float disc) {
  float y = max(d.y, 0.0);
  vec3 zenith = vec3(0.0008, 0.0018, 0.0034);
  vec3 haze = vec3(0.05, 0.066, 0.073);
  vec3 col = zenith + (haze - zenith) * (0.72 * exp(-y * 16.0) + 0.28 * exp(-y * 3.2));
  float s = max(dot(d, sun), 0.0);
  float band = exp(-y * 9.0);
  col += SIGNAL * pow(s, 8.0) * 0.06 * band;
  col += vec3(1.0, 0.42, 0.18) * pow(s, 48.0) * 0.22 * band;
  col += vec3(1.0, 0.56, 0.3) * pow(s, 500.0) * 0.8 * disc;
  col += vec3(1.0, 0.82, 0.64) * smoothstep(0.99976, 0.99992, s) * 7.0 * disc;
  col += vec3(0.08, 0.1, 0.105) * exp(-y * 180.0) * 0.6;
  return col;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 cameraRay(vec2 uv) {
  float portrait = 1.0 - clamp(uRes.x / uRes.y, 0.55, 1.0);
  float focal = 1.25 * pow(1.0 - portrait, 0.6);
  float pitch = 0.135 + portrait * 0.2 - uLook.y * 0.022;
  float yaw = uLook.x * 0.05;
  vec3 rd = normalize(vec3(uv, focal));
  float cp = cos(pitch), sp = sin(pitch);
  rd = vec3(rd.x, rd.y * cp - rd.z * sp, rd.y * sp + rd.z * cp);
  float cy = cos(yaw), sy = sin(yaw);
  return vec3(rd.x * cy + rd.z * sy, rd.y, -rd.x * sy + rd.z * cy);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(uTime * 0.08, 2.1, uTime * 0.32);
  vec3 rd = cameraRay(uv);
  float aspect = uRes.x / uRes.y;
  vec3 sun = normalize(vec3(clamp(0.24 * aspect, 0.1, 0.5) * uSide + uLook.x * 0.03, 0.017, 1.0));

  vec3 col;
  if (rd.y >= -0.0005) {
    col = sky(rd, sun, 1.0);
  } else {
    float dist = march(ro, rd);
    vec3 pos = ro + rd * dist;
    vec3 N = normalAt(pos.xz, 0.012);
    N = mix(N, vec3(0.0, 1.0, 0.0), 0.8 * min(1.0, sqrt(dist * 0.01) * 1.1));

    float fres = 0.04 + 0.96 * pow(1.0 - max(0.0, dot(-N, rd)), 5.0);
    vec3 R = reflect(rd, N);
    R.y = abs(R.y);
    vec3 refl = sky(R, sun, 0.0) + vec3(1.0, 0.54, 0.3) * pow(max(dot(R, sun), 0.0), 1800.0) * 85.0;

    float h = clamp((pos.y + DEPTH) / DEPTH, 0.0, 1.0);
    vec3 scatter = vec3(0.003, 0.017, 0.022) * (0.3 + h * h * 1.8);
    scatter += vec3(0.01, 0.045, 0.044) * pow(h, 4.0) * pow(max(dot(rd, sun), 0.0), 2.0);
    col = fres * refl + (1.0 - fres) * scatter;

    if (uScan.z > 0.001) {
      vec3 sd = cameraRay(uScan.xy);
      if (sd.y < -0.002) {
        vec3 hit = ro + sd * ((-0.45 * DEPTH - ro.y) / sd.y);
        float d = length(pos.xz - hit.xz);
        float radius = 3.4 + 0.025 * length(hit - ro);
        float mask = (1.0 - smoothstep(radius * 0.2, radius, d)) * uScan.z;
        vec2 f = fract(pos.xz * 1.8) - 0.5;
        float r = 0.05 + dist * 0.0045;
        float dots = 1.0 - smoothstep(r * 0.45, r, length(f));
        vec2 g = abs(f) * 2.0;
        float w = 0.025 + dist * 0.003;
        float grid = max(smoothstep(1.0 - w, 1.0, g.x), smoothstep(1.0 - w, 1.0, g.y));
        float sweep = mod(uTime * 2.2, radius * 1.25);
        float ring = exp(-abs(d - sweep) * 9.0) * (1.0 - sweep / (radius * 1.25));
        float fade = exp(-dist * 0.03);
        col += SIGNAL * (dots * 0.55 + grid * 0.07 + ring * 0.16) * mask * fade;
      }
    }

    float fog = 1.0 - exp(-dist * 0.014);
    col = mix(col, sky(normalize(vec3(rd.x, 0.001, rd.z)), sun, 0.0), fog * 0.9);
  }

  col = aces(col * 1.55);
  col = pow(col, vec3(0.4545));
  vec2 v = vUv - 0.5;
  col *= 1.0 - 0.42 * dot(v, v) * 1.6;
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5) * (2.0 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
`;
}
