"use client";

 

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  WebGLErrorBoundary,
  WebGLFallback,
} from "./webgl-error-boundary";
import { cn } from "@/lib/utils";
import {
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import {
  Suspense,
  type MutableRefObject,
  type WheelEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";

export interface Spiral3DSlide {
  /** Optional unique identifier for the slide/project */
  id?: string;
  /** Image source rendered inside the slide. */
  src: string;
  /** Accessible description for the image. */
  alt: string;
  /** Optional associated project data object */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project?: any;
}

export interface Spiral3DSliderProps {
  /** Images arranged along the spiral. */
  items: Spiral3DSlide[];
  /** Callback when a slide is clicked. */
  onSelect?: (id: string) => void;
  /** Callback when hovering over a slide. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHover?: (project: any | null) => void;
  /** Additional classes for the WebGL stage. */
  className?: string;
  /** Maximum horizontal radius of the spiral in pixels. */
  radius?: number;
  /** Vertical distance between neighboring images in pixels. */
  verticalGap?: number;
  /** Maximum width of every image plane in pixels. */
  cardWidth?: number;
  /** Width divided by height for every image plane. */
  cardAspectRatio?: number;
  /** Whether the spiral advances automatically while idle. */
  autoRotate?: boolean;
  /** Automatic movement in slides per second. */
  autoSpeed?: number;
  /** Amount of scroll required to move along the spiral. */
  scrollSensitivity?: number;
  /** Motion smoothing between 0 and 1. */
  smoothing?: number;
  /** Maximum blur applied to distant images. */
  blurStrength?: number;
  /** Amount each image plane bends into the spiral. */
  bend?: number;
  /** Perspective camera field of view in degrees. */
  fov?: number;
  /** Accessible name for the gallery region. */
  ariaLabel?: string;
}

const vertexShader = `
  uniform float uBend;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    float curve = 1.0 - cos(position.x * 3.14159265);
    transformed.z -= curve * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uImageAspect;
  uniform float uPlaneAspect;
  uniform float uBlur;
  uniform float uDim;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    vec2 scale = vec2(1.0);
    if (uImageAspect > uPlaneAspect) {
      scale.x = uPlaneAspect / uImageAspect;
    } else {
      scale.y = uImageAspect / uPlaneAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 stepSize = vec2(0.005) * uBlur;
    vec4 color = texture2D(uTexture, uv) * 0.23;

    color += texture2D(uTexture, uv + vec2(stepSize.x, 0.0)) * 0.12;
    color += texture2D(uTexture, uv - vec2(stepSize.x, 0.0)) * 0.12;
    color += texture2D(uTexture, uv + vec2(stepSize.x * 2.0, 0.0)) * 0.06;
    color += texture2D(uTexture, uv - vec2(stepSize.x * 2.0, 0.0)) * 0.06;
    color += texture2D(uTexture, uv + vec2(0.0, stepSize.y)) * 0.12;
    color += texture2D(uTexture, uv - vec2(0.0, stepSize.y)) * 0.12;
    color += texture2D(uTexture, uv + vec2(0.0, stepSize.y * 2.0)) * 0.06;
    color += texture2D(uTexture, uv - vec2(0.0, stepSize.y * 2.0)) * 0.06;
    color += texture2D(uTexture, uv + stepSize) * 0.025;
    color += texture2D(uTexture, uv - stepSize) * 0.025;

    float luminance = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    color.rgb = mix(vec3(luminance), color.rgb, 1.18);
    color.rgb = (color.rgb - 0.5) * 1.08 + 0.5;
    float brightness = clamp(uDim, 0.15, 1.0);
    gl_FragColor = vec4(clamp(color.rgb * brightness, 0.0, 1.0), 1.0);
  }
`;

function wrappedPosition(value: number, length: number) {
  const wrapped = ((value % length) + length) % length;
  return wrapped > length / 2 ? wrapped - length : wrapped;
}

function imageAspect(texture: Texture) {
  const image = texture.image as
    | {
        naturalWidth?: number;
        naturalHeight?: number;
        width?: number;
        height?: number;
      }
    | undefined;
  const width = image?.naturalWidth ?? image?.width ?? 1;
  const height = image?.naturalHeight ?? image?.height ?? 1;
  return width / Math.max(height, 1);
}

function createPlaceholderTexture(): Texture {
  if (typeof document === "undefined") return new Texture();
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, 16, 16);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

interface SpiralSceneProps {
  items: Spiral3DSlide[];
  targetProgressRef: MutableRefObject<number>;
  radius: number;
  verticalGap: number;
  cardWidth: number;
  cardAspectRatio: number;
  autoRotate: boolean;
  autoSpeed: number;
  smoothing: number;
  blurStrength: number;
  bend: number;
  reducedMotionRef: MutableRefObject<boolean>;
  lastInteractionRef: MutableRefObject<number>;
  onSelect?: (id: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHover?: (project: any | null) => void;
}

function SpiralScene({
  items,
  targetProgressRef,
  radius,
  verticalGap,
  cardWidth,
  cardAspectRatio,
  autoRotate,
  autoSpeed,
  smoothing,
  blurStrength,
  bend,
  reducedMotionRef,
  lastInteractionRef,
  onSelect,
  onHover,
}: SpiralSceneProps) {
  const sceneItems = useMemo(
    () =>
      Array.from(
        { length: Math.max(items.length, 16) },
        (_, index) => items[index % items.length]!,
      ),
    [items],
  );

  const { gl, viewport } = useThree();
  const progress = useRef(0);
  const meshes = useRef<(Mesh | null)[]>([]);
  const materials = useRef<(ShaderMaterial | null)[]>([]);
  const placeholder = useMemo(() => createPlaceholderTexture(), []);

  // Initialize shader uniforms with instant placeholder (0 blocking time)
  const uniforms = useMemo(
    () =>
      sceneItems.map(() => ({
        uTexture: { value: placeholder },
        uImageAspect: { value: cardAspectRatio },
        uPlaneAspect: { value: cardAspectRatio },
        uBlur: { value: 0 },
        uDim: { value: 1.0 },
        uBend: { value: 0 },
      })),
    [cardAspectRatio, placeholder, sceneItems],
  );

  // Progressive background texture loader
  useEffect(() => {
    const loader = new TextureLoader();
    let isCancelled = false;
    const loadedMap = new Map<string, Texture>();

    // Sort loading priority: visible cards closest to index 0 first
    const indices = Array.from({ length: sceneItems.length }, (_, i) => i);
    indices.sort((a, b) => {
      const distA = Math.min(a, sceneItems.length - a);
      const distB = Math.min(b, sceneItems.length - b);
      return distA - distB;
    });

    const loadTextureForIndex = (index: number) => {
      if (isCancelled) return;
      const item = sceneItems[index];
      if (!item) return;

      if (loadedMap.has(item.src)) {
        const tex = loadedMap.get(item.src)!;
        if (uniforms[index]) {
          uniforms[index].uTexture.value = tex;
          uniforms[index].uImageAspect.value = imageAspect(tex);
        }
        return;
      }

      loader.load(
        item.src,
        (tex) => {
          if (isCancelled) return;
          tex.colorSpace = SRGBColorSpace;
          tex.minFilter = LinearFilter;
          tex.magFilter = LinearFilter;
          tex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
          tex.needsUpdate = true;
          loadedMap.set(item.src, tex);

          if (uniforms[index]) {
            uniforms[index].uTexture.value = tex;
            uniforms[index].uImageAspect.value = imageAspect(tex);
          }
        },
        undefined,
        () => {
          // On error, keep placeholder
        }
      );
    };

    // Load initial 10 visible cards immediately in parallel
    const initialBatch = indices.slice(0, 10);
    initialBatch.forEach(loadTextureForIndex);

    // Stream remaining cards in small asynchronous intervals to keep frame rate silky smooth
    const remaining = indices.slice(10);
    let queueIndex = 0;
    const interval = setInterval(() => {
      if (isCancelled || queueIndex >= remaining.length) {
        clearInterval(interval);
        return;
      }
      // Load 3 at a time
      for (let k = 0; k < 3 && queueIndex < remaining.length; k++) {
        loadTextureForIndex(remaining[queueIndex]);
        queueIndex++;
      }
    }, 60);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [gl, sceneItems, uniforms]);

  useFrame((_state, delta) => {
    const safeDelta = Math.min(delta, 0.1);

    if (
      autoRotate &&
      performance.now() - lastInteractionRef.current > 300
    ) {
      targetProgressRef.current -= autoSpeed * safeDelta;
    }

    const frameScale = Math.min(safeDelta * 60, 3);
    const ease = reducedMotionRef.current
      ? 1
      : 1 - Math.pow(1 - smoothing, frameScale);
    progress.current += (targetProgressRef.current - progress.current) * ease;

    const factor = Math.max(viewport.factor, 1);
    const planeWidth = Math.min(cardWidth / factor, viewport.width * 0.225);
    const planeHeight = planeWidth / cardAspectRatio;
    const spiralRadius = Math.min(radius / factor, viewport.width * 0.245);
    const gap = Math.min(verticalGap / factor, viewport.height * 0.082);
    const count = sceneItems.length;

    meshes.current.forEach((mesh, index) => {
      const material = materials.current[index];
      if (!mesh || !material) return;

      const position = wrappedPosition(index - progress.current, count);
      const angle = position * 0.78;
      const depth = (Math.cos(angle) + 1) / 2;
      const scale = 0.74 + depth * 0.26;

      mesh.position.set(
        Math.sin(angle) * spiralRadius,
        -position * gap,
        Math.cos(angle) * 2.55,
      );
      mesh.rotation.set(0, Math.sin(angle) * -1.12, 0);
      mesh.scale.set(planeWidth * scale, planeHeight * scale, 1);

      // Middle 3 cards (|position| <= 1.25) are unblurred & 100% bright.
      // Distant cards outside the 3 middle cards get blur and vignette dimming.
      const distFromMiddle3 = Math.max(0, Math.abs(position) - 1.25);
      const effectiveBlur = Math.pow(distFromMiddle3, 1.5) * (blurStrength > 0 ? blurStrength * 1.5 : 2.5);
      const effectiveDim = Math.max(0.18, 1.0 - Math.pow(distFromMiddle3, 1.2) * 0.32);

      material.uniforms.uBlur!.value = effectiveBlur;
      material.uniforms.uDim!.value = effectiveDim;
      material.uniforms.uBend!.value = planeWidth * bend;
      material.uniforms.uPlaneAspect!.value = cardAspectRatio;
    });
  });

  return (
    <>
      {sceneItems.map((item, index) => (
        <mesh
          key={`${item.src}-${index}`}
          ref={(node) => {
            meshes.current[index] = node;
          }}
          frustumCulled={false}
          onClick={(e) => {
            e.stopPropagation();
            if (item.id) onSelect?.(item.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            if (item.project) onHover?.(item.project);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
            onHover?.(null);
          }}
        >
          <planeGeometry args={[1, 1, 48, 2]} />
          <shaderMaterial
            ref={(node) => {
              materials.current[index] = node;
            }}
            uniforms={uniforms[index]}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            side={DoubleSide}
            depthTest
            depthWrite
          />
        </mesh>
      ))}
    </>
  );
}

import { Html } from "@react-three/drei";
import { OrigamiLoop } from "./origami-loop";

export function Spiral3DSlider({
  items,
  onSelect,
  onHover,
  className,
  radius = 235,
  verticalGap = 64,
  cardWidth = 255,
  cardAspectRatio = 3 / 2,
  autoRotate = true,
  autoSpeed = 0.35,
  scrollSensitivity = 0.0024,
  smoothing = 0.065,
  blurStrength = 0,
  bend = 0.17,
  fov = 44,
  ariaLabel = "Spiral image gallery",
}: Spiral3DSliderProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const previousScroll = useRef(0);
  const lastWheelTime = useRef(0);
  const lastInteraction = useRef(0);
  const visible = useRef(true);
  const reducedMotion = useRef(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartX = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    previousScroll.current = window.scrollY;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      reducedMotion.current = motionQuery.matches;
    };
    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = Boolean(entry?.isIntersecting);
      },
      { threshold: 0.08 },
    );
    observer.observe(stage);

    const handlePageScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - previousScroll.current;
      previousScroll.current = scrollY;
      if (Math.abs(delta) > 0.5 && visible.current && performance.now() - lastWheelTime.current > 80) {
        lastInteraction.current = performance.now();
        const boundedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 160);
        targetProgress.current -= boundedDelta * scrollSensitivity;
      }
    };
    window.addEventListener("scroll", handlePageScroll, { passive: true });

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", syncMotionPreference);
      window.removeEventListener("scroll", handlePageScroll);
    };
  }, [scrollSensitivity]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    lastWheelTime.current = performance.now();
    lastInteraction.current = lastWheelTime.current;
    const delta =
      Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 160);
    targetProgress.current -= delta * scrollSensitivity;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragStartY.current = event.clientY;
    dragStartX.current = event.clientX;
    lastInteraction.current = performance.now();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    lastInteraction.current = performance.now();
    const deltaY = event.clientY - dragStartY.current;
    const deltaX = event.clientX - dragStartX.current;
    dragStartY.current = event.clientY;
    dragStartX.current = event.clientX;
    const dragDelta = deltaY * 1.2 - deltaX * 0.4;
    targetProgress.current -= dragDelta * scrollSensitivity * 1.4;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  if (!items.length) return null;

  return (
    <div
      ref={stageRef}
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "relative min-h-168 w-full overflow-hidden bg-transparent select-none transition-colors duration-300 touch-none",
        className,
      )}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <WebGLErrorBoundary
        fallback={<WebGLFallback className="absolute inset-0 h-full w-full" />}
      >
        <div className="absolute inset-0">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 10], fov, near: 0.1, far: 100 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={<Html center><OrigamiLoop /></Html>}>
              <SpiralScene
                items={items}
                targetProgressRef={targetProgress}
                radius={radius}
                verticalGap={verticalGap}
                cardWidth={cardWidth}
                cardAspectRatio={cardAspectRatio}
                autoRotate={autoRotate}
                autoSpeed={autoSpeed}
                smoothing={smoothing}
                blurStrength={blurStrength}
                bend={bend}
                reducedMotionRef={reducedMotion}
                lastInteractionRef={lastInteraction}
                onSelect={onSelect}
                onHover={onHover}
              />
            </Suspense>
          </Canvas>
        </div>
      </WebGLErrorBoundary>

      <div className="sr-only">
        <p>{ariaLabel}</p>
        <ul>
          {items.map((item, index) => (
            <li key={`${item.src}-description-${index}`}>{item.alt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
