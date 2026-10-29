"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const OCEAN_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uBigWavesSpeed;
  uniform float uSmallWavesElevation;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesSpeed;
  uniform float uSmallIterations;
  
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }
  
  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    
    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;
    
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
  
  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;
    
    for(float i = 1.0; i <= uSmallIterations; i++) {
      elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }
    
    modelPosition.y += elevation;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    
    vElevation = elevation;
    vPosition = modelPosition.xyz;
    vUv = uv;
    
    float delta = 0.01;
    vec3 neighbor1 = position + vec3(delta, 0.0, 0.0);
    vec3 neighbor2 = position + vec3(0.0, 0.0, delta);
    
    float elev1 = sin(neighbor1.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                  sin(neighbor1.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                  uBigWavesElevation;
    float elev2 = sin(neighbor2.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                  sin(neighbor2.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                  uBigWavesElevation;
    
    vec3 tangent = normalize(vec3(delta, elev1 - elevation, 0.0));
    vec3 bitangent = normalize(vec3(0.0, elev2 - elevation, delta));
    vNormal = normalize(cross(tangent, bitangent));
  }
`;

const OCEAN_FRAGMENT_SHADER = `
  uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;
  uniform vec3 uSunColor;
  uniform vec3 uSunDirection;
  uniform float uColorOffset;
  uniform float uColorMultiplier;
  uniform float uTime;
  uniform float uFoamIntensity;
  uniform float uFresnelPower;
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = clamp(mixStrength, 0.0, 1.0);
    
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), uFresnelPower);
    
    float sunReflection = pow(max(dot(reflect(-uSunDirection, vNormal), viewDirection), 0.0), 256.0);
    vec3 specular = uSunColor * sunReflection * 2.0;
    
    float foam = smoothstep(0.2, 0.5, vElevation) * uFoamIntensity;
    vec3 foamColor = vec3(1.0, 0.98, 0.95);
    
    color = mix(color, uSunColor * 0.3, fresnel * 0.3);
    color += specular;
    color = mix(color, foamColor, foam * 0.15);
    
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(uFogNear, uFogFar, depth);
    color = mix(color, uFogColor, fogFactor * 0.5);
    
    gl_FragColor = vec4(color, 0.95);
  }
`;

function Ocean({ scrollProgress = 0 }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBigWavesElevation: { value: 0.15 },
      uBigWavesFrequency: { value: new THREE.Vector2(1.5, 1.2) },
      uBigWavesSpeed: { value: 0.5 },
      uSmallWavesElevation: { value: 0.1 },
      uSmallWavesFrequency: { value: 2.0 },
      uSmallWavesSpeed: { value: 0.15 },
      uSmallIterations: { value: 3.0 },
      uDepthColor: { value: new THREE.Color("#0a1628") },
      uSurfaceColor: { value: new THREE.Color("#2a5a8c") },
      uSunColor: { value: new THREE.Color("#ffd699") },
      uSunDirection: { value: new THREE.Vector3(0.5, 0.3, 0.5).normalize() },
      uColorOffset: { value: 0.15 },
      uColorMultiplier: { value: 3.5 },
      uFoamIntensity: { value: 0.8 },
      uFresnelPower: { value: 2.0 },
      uFogColor: { value: new THREE.Color("#ff8844") },
      uFogNear: { value: 5 },
      uFogFar: { value: 50 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    
    const camera = state.camera;
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetY = 5 - scrollProgress * 12;
      const targetRotationX = -0.1 - scrollProgress * 0.5;
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotationX, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[100, 100, 512, 512]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={OCEAN_VERTEX_SHADER}
        fragmentShader={OCEAN_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Sky() {
  return (
    <mesh>
      <sphereGeometry args={[500, 32, 32]} />
      <meshBasicMaterial side={THREE.BackSide}>
        <primitive
          attach="map"
          object={(() => {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext("2d")!;
            const gradient = ctx.createLinearGradient(0, 0, 0, 512);
            gradient.addColorStop(0, "#0a1628");
            gradient.addColorStop(0.3, "#1a3a5c");
            gradient.addColorStop(0.5, "#2a5a8c");
            gradient.addColorStop(0.7, "#f5a623");
            gradient.addColorStop(0.85, "#ff6b35");
            gradient.addColorStop(1, "#ff8844");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            const texture = new THREE.CanvasTexture(canvas);
            return texture;
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

function Sun() {
  return (
    <mesh position={[50, 15, -100]}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshBasicMaterial color="#ffe4b5" />
      <pointLight color="#ffd699" intensity={2} distance={500} />
    </mesh>
  );
}

interface OceanSceneProps {
  scrollProgress?: number;
  isVisible?: boolean;
}

export default function OceanScene({ scrollProgress = 0, isVisible = true }: OceanSceneProps) {
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 55 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
        frameloop={isVisible ? "always" : "never"}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[50, 30, -50]}
          intensity={1.5}
          color="#ffd699"
        />
        <Sky />
        <Sun />
        <Ocean scrollProgress={scrollProgress} />
        <fog attach="fog" args={["#ff8844", 10, 100]} />
      </Canvas>
    </div>
  );
}
