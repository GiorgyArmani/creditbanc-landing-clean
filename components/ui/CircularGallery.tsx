'use client';

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: number;
  return function (this: unknown, ...args: Parameters<T>) {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object): void {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (
      key !== 'constructor' &&
      typeof (instance as Record<string, unknown>)[key] === 'function'
    ) {
      (instance as Record<string, unknown>)[key] = (
        (instance as Record<string, (...a: unknown[]) => unknown>)[key]
      ).bind(instance);
    }
  });
}

function getFontSize(font: string): number {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(
  gl: GL,
  text: string,
  font: string = 'bold 30px monospace',
  color: string = '#ffffff'
): { texture: Texture; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d context');

  context.font = font;
  const metrics = context.measureText(text);
  const fontSize = getFontSize(font);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(fontSize * 1.25);
  const pad = Math.round(fontSize * 0.4);

  canvas.width = textWidth + pad * 2;
  canvas.height = textHeight + pad * 2;

  context.font = font;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Soft shadow for readability on lighter image areas
  context.shadowColor = 'rgba(0, 0, 0, 0.55)';
  context.shadowBlur = Math.round(fontSize * 0.25);
  context.shadowOffsetY = 1;

  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

interface TitleProps {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
}

class Title {
  gl: GL;
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({
    gl,
    plane,
    renderer,
    text,
    textColor = '#545050',
    font = '30px sans-serif',
  }: TitleProps) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(
      this.gl,
      this.text,
      this.font,
      this.textColor
    );
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.05) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeightScaled = 0.22;
    const textWidthScaled = textHeightScaled * aspect;
    const maxTextWidth = 0.92;
    const finalWidth = Math.min(textWidthScaled, maxTextWidth);
    const finalHeight = finalWidth / aspect;
    this.mesh.scale.set(finalWidth, finalHeight, 1);
    this.mesh.position.y = -0.5 + finalHeight * 0.5 + 0.06;
    this.mesh.position.z = 0.05;
    this.mesh.renderOrder = 10;
    this.mesh.setParent(this.plane);
  }
}

interface ScreenSize {
  width: number;
  height: number;
}

interface Viewport {
  width: number;
  height: number;
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius?: number;
  font?: string;
}

class Media {
  extra: number = 0;
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: ScreenSize;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font?: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  scale!: number;
  padding!: number;
  width!: number;
  widthTotal!: number;
  x!: number;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;
  targetGrayscale: number = 1;
  currentGrayscale: number = 1;
  planarX: number = 0;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
  }: MediaProps) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uGrayscale;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          vec3 finalColor = mix(color.rgb, vec3(luma), clamp(uGrayscale, 0.0, 1.0));

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);

          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
        uGrayscale: { value: 1 },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(
    scroll: { current: number; last: number },
    direction: 'right' | 'left'
  ) {
    if (this.bend === 0) {
      const planarX = this.x - scroll.current - this.extra;
      this.planarX = planarX;
      this.plane.position.x = planarX;
      this.plane.position.y = 0;
      this.plane.position.z = 0;
      this.plane.rotation.y = 0;
      this.plane.rotation.z = 0;
      this.plane.visible = true;

      const planeOffset = this.plane.scale.x / 2;
      const viewportOffset = this.viewport.width / 2;
      this.isBefore = planarX + planeOffset < -viewportOffset;
      this.isAfter = planarX - planeOffset > viewportOffset;
      if (direction === 'right' && this.isBefore) {
        this.extra -= this.widthTotal;
        this.isBefore = this.isAfter = false;
      }
      if (direction === 'left' && this.isAfter) {
        this.extra += this.widthTotal;
        this.isBefore = this.isAfter = false;
      }
    } else {
      // 3D ring: every card has a fixed angular slot; scroll rotates the
      // whole ring uniformly. The ring radius is sized so all N cards fit
      // around one full revolution.
      const baseAngle = (this.index / this.length) * 2 * Math.PI;
      const angle = baseAngle - scroll.current * 0.04;
      const R = this.widthTotal / (2 * Math.PI);
      this.plane.position.x = R * Math.sin(angle);
      this.plane.position.z = R * (Math.cos(angle) - 1);
      this.plane.position.y = 0;
      this.plane.rotation.y = -angle;
      this.plane.rotation.z = 0;
      // Hide cards on the back half of the ring (facing away from camera).
      this.plane.visible = Math.cos(angle) > -0.1;
      // planarX used for tap/hover lookup — track the projected screen-X
      // of this card so click detection matches what the user sees.
      const camDist = 20; // camera.position.z, mirrors createCamera()
      const persp = camDist / (camDist - this.plane.position.z);
      this.planarX = this.plane.position.x * persp;
      this.isBefore = false;
      this.isAfter = false;
    }

    // Render back-to-front so the side cards properly tuck behind the
    // center cards as the arc curves away from the camera.
    this.plane.renderOrder = this.plane.position.z;

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    this.currentGrayscale = lerp(
      this.currentGrayscale,
      this.targetGrayscale,
      0.12
    );
    this.program.uniforms.uGrayscale.value = this.currentGrayscale;
  }

  onResize({
    screen,
    viewport,
  }: { screen?: ScreenSize; viewport?: Viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    // Plane matches the 2:3 (400×600) program-card aspect exactly so the
    // shader's object-cover doesn't crop the baked-in headers/CTAs.
    const targetHeight = this.viewport.height * 0.85;
    this.plane.scale.y = targetHeight;
    this.plane.scale.x = targetHeight * (2 / 3);
    this.scale = this.plane.scale.y / this.viewport.height;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

interface AppConfig {
  items?: { image: string; text: string; id?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  autoScrollSpeed?: number;
  onItemClick?: (id: string) => void;
}

class App {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: {
    ease: number;
    current: number;
    target: number;
    last: number;
    position?: number;
  };
  onCheckDebounce: (...args: unknown[]) => void;
  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  medias: Media[] = [];
  mediasImages: { image: string; text: string; id?: string }[] = [];
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  raf: number = 0;
  onItemClick?: (id: string) => void;

  boundOnResize!: () => void;
  boundOnWheel!: (e: Event) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: (e: MouseEvent | TouchEvent) => void;

  isDown: boolean = false;
  paused: boolean = false;
  start: number = 0;
  startY: number = 0;
  movedDist: number = 0;
  downAt: number = 0;
  lastClientX: number | null = null;
  lastClientY: number | null = null;
  boundOnPointerLeave!: () => void;
  autoScrollSpeed: number = 0;
  bend: number = 0;

  constructor(
    container: HTMLElement,
    {
      items,
      bend = 1,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px Figtree',
      scrollSpeed = 2,
      scrollEase = 0.05,
      autoScrollSpeed = 0,
      onItemClick,
    }: AppConfig
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.autoScrollSpeed = autoScrollSpeed;
    this.bend = bend;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.onItemClick = onItemClick;
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.renderer.gl.canvas as HTMLCanvasElement);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: { image: string; text: string; id?: string }[] | undefined,
    bend: number = 1,
    textColor: string,
    borderRadius: number,
    font: string
  ) {
    const galleryItems = items && items.length ? items : [];
    if (galleryItems.length === 0) return;
    // 3D ring mode shows each card once around the loop; the linear flat
    // mode duplicates the list so cards refill the screen during scroll.
    this.mediasImages = bend !== 0 ? galleryItems : galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
      });
    });
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.movedDist = 0;
    this.downAt = performance.now();
    this.scroll.position = this.scroll.current;
    this.start = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.startY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    if (clientX !== undefined) this.lastClientX = clientX;
    if (clientY !== undefined) this.lastClientY = clientY;

    if (!this.isDown) return;
    if (clientX === undefined) return;
    const distance = (this.start - clientX) * (this.scrollSpeed * 0.025);
    const dx = Math.abs(this.start - clientX);
    const dy = clientY !== undefined ? Math.abs(this.startY - clientY) : 0;
    this.movedDist = Math.max(this.movedDist, Math.max(dx, dy));
    this.scroll.target = (this.scroll.position ?? 0) + distance;
  }

  onPointerLeave(e: MouseEvent | TouchEvent) {
    this.lastClientX = null;
    this.lastClientY = null;
    this.onTouchUp(e);
  }

  onTouchUp(e: MouseEvent | TouchEvent) {
    this.isDown = false;
    const heldFor = performance.now() - this.downAt;
    // Treat as a tap only if it was short and barely moved. We don't check
    // scroll momentum here — auto-scroll keeps target ahead of current, so
    // any momentum-based gate would block legitimate clicks on the ring.
    const isTap = this.movedDist < 12 && heldFor < 400;
    if (isTap && this.onItemClick) {
      const tappedId = this.findTappedId(e);
      if (tappedId) {
        this.onItemClick(tappedId);
      }
    }
    // Touch has no persistent "hover" — clear the hover position so the
    // auto-scroll resumes after a swipe/tap on mobile. (For mouse, the
    // hover state persists naturally until mouseleave.)
    if ('changedTouches' in e) {
      this.lastClientX = null;
      this.lastClientY = null;
    }
    this.onCheck();
  }

  findTappedId(e: MouseEvent | TouchEvent): string | undefined {
    if (!this.medias || this.medias.length === 0) return;
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const rect = this.container.getBoundingClientRect();
    const localX = x - rect.left;
    const ndcX = (localX / rect.width) * 2 - 1;
    const worldX = (ndcX * this.viewport.width) / 2;
    let closest: Media | undefined;
    let bestDist = Infinity;
    for (const m of this.medias) {
      if (!m.plane.visible) continue;
      const dist = Math.abs(m.planarX - worldX);
      if (dist < bestDist) {
        bestDist = dist;
        closest = m;
      }
    }
    if (!closest) return;
    const data = this.mediasImages[closest.index];
    return data?.id;
  }

  onWheel(e: Event) {
    const wheelEvent = e as WheelEvent;
    const delta =
      wheelEvent.deltaY ||
      (wheelEvent as unknown as { wheelDelta?: number }).wheelDelta ||
      (wheelEvent as unknown as { detail?: number }).detail;
    this.scroll.target +=
      ((delta ?? 0) > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    // 3D ring mode flows continuously — don't snap to grid (it would
    // jerk every wheel tick or drag-release).
    if (this.bend !== 0) return;
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    const isHovering = this.lastClientX !== null && this.lastClientY !== null;
    // While paused (e.g. a program modal is open) freeze the ring in place so
    // it neither auto-advances nor drifts — closing the modal resumes from the
    // exact same position the user left off at.
    if (
      this.autoScrollSpeed > 0 &&
      !this.isDown &&
      !isHovering &&
      !this.paused
    ) {
      this.scroll.target += this.autoScrollSpeed;
    }

    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';

    let hoverWorldX: number | null = null;
    let hoverWorldY: number | null = null;
    if (this.lastClientX !== null && this.lastClientY !== null && !this.isDown) {
      const rect = this.container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const ndcX = ((this.lastClientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -(((this.lastClientY - rect.top) / rect.height) * 2 - 1);
        hoverWorldX = (ndcX * this.viewport.width) / 2;
        hoverWorldY = (ndcY * this.viewport.height) / 2;
      }
    }

    if (this.medias) {
      this.medias.forEach((media) => {
        media.update(this.scroll, direction);
        if (
          hoverWorldX !== null &&
          hoverWorldY !== null &&
          media.plane.visible
        ) {
          const halfW = media.plane.scale.x / 2;
          const halfH = media.plane.scale.y / 2;
          // planarX is the projected screen-X (set in Media.update),
          // so hit-testing matches what the user actually sees.
          const inX = Math.abs(media.planarX - hoverWorldX) <= halfW;
          const inY = Math.abs(media.plane.position.y - hoverWorldY) <= halfH;
          media.targetGrayscale = inX && inY ? 0 : 1;
        } else {
          media.targetGrayscale = 1;
        }
      });
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnPointerLeave = this.onPointerLeave.bind(this) as () => void;
    window.addEventListener('resize', this.boundOnResize);
    this.container.addEventListener('wheel', this.boundOnWheel, {
      passive: true,
    });
    this.container.addEventListener('mousedown', this.boundOnTouchDown);
    this.container.addEventListener('mousemove', this.boundOnTouchMove);
    this.container.addEventListener('mouseup', this.boundOnTouchUp);
    this.container.addEventListener('mouseleave', this.boundOnPointerLeave);
    this.container.addEventListener('touchstart', this.boundOnTouchDown, {
      passive: true,
    });
    this.container.addEventListener('touchmove', this.boundOnTouchMove, {
      passive: true,
    });
    this.container.addEventListener('touchend', this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.boundOnResize);
    this.container.removeEventListener('wheel', this.boundOnWheel);
    this.container.removeEventListener('mousedown', this.boundOnTouchDown);
    this.container.removeEventListener('mousemove', this.boundOnTouchMove);
    this.container.removeEventListener('mouseup', this.boundOnTouchUp);
    this.container.removeEventListener('mouseleave', this.boundOnPointerLeave);
    this.container.removeEventListener('touchstart', this.boundOnTouchDown);
    this.container.removeEventListener('touchmove', this.boundOnTouchMove);
    this.container.removeEventListener('touchend', this.boundOnTouchUp);
    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas as HTMLCanvasElement
      );
    }
  }
}

interface CircularGalleryProps {
  items?: { image: string; text: string; id?: string }[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  autoScrollSpeed?: number;
  paused?: boolean;
  onItemClick?: (id: string) => void;
}

export default function CircularGallery({
  items,
  bend = -1,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px Figtree',
  scrollSpeed = 2,
  scrollEase = 0.05,
  autoScrollSpeed = 0,
  paused = false,
  onItemClick,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | undefined>(undefined);
  // Track the latest `paused` value so the init effect can seed it without
  // listing `paused` as a dependency (which would rebuild the whole WebGL app).
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (!containerRef.current) return;
    let app: App | undefined;
    let cancelled = false;

    const init = () => {
      if (cancelled || !containerRef.current) return;
      app = new App(containerRef.current, {
        items,
        bend,
        textColor,
        borderRadius,
        font,
        scrollSpeed,
        scrollEase,
        autoScrollSpeed,
        onItemClick,
      });
      app.paused = pausedRef.current;
      appRef.current = app;
    };

    if (typeof document !== 'undefined' && document.fonts?.load) {
      document.fonts.load(font).then(init).catch(init);
    } else {
      init();
    }

    return () => {
      cancelled = true;
      app?.destroy();
      appRef.current = undefined;
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, autoScrollSpeed, onItemClick]);

  // Apply pause/resume on the live app without tearing it down, so the ring
  // keeps its current scroll position across open/close of a program modal.
  useEffect(() => {
    if (appRef.current) appRef.current.paused = paused;
  }, [paused]);
  return (
    <div
      className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
      ref={containerRef}
    />
  );
}
