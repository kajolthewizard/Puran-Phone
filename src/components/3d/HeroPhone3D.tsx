import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, RotateCw, Sparkles, Zap, ShieldCheck, Eye } from 'lucide-react';

interface HeroPhone3DProps {
  scrollProgress?: number; // 0 to 1
  onInspectToggle?: (exploded: boolean) => void;
}

export const HeroPhone3D: React.FC<HeroPhone3DProps> = ({ scrollProgress = 0, onInspectToggle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Manual explode state or scroll-driven explode
  const effectiveExplode = isExploded || (scrollProgress > 0.15 && scrollProgress < 0.85);

  useEffect(() => {
    onInspectToggle?.(effectiveExplode);
  }, [effectiveExplode, onInspectToggle]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL Check
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group containing the entire phone
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Create Screen Canvas Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 2048;
    const ctx = screenCanvas.getContext('2d')!;

    const updateScreenTexture = () => {
      // Dark futuristic OLED screen with lime and purple neon accents
      const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
      grad.addColorStop(0, '#0c0f12');
      grad.addColorStop(0.5, '#12161a');
      grad.addColorStop(1, '#080a0c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 2048);

      // Ambient glow circles
      const glowGrad = ctx.createRadialGradient(512, 600, 50, 512, 600, 450);
      glowGrad.addColorStop(0, 'rgba(204, 255, 0, 0.22)');
      glowGrad.addColorStop(0.5, 'rgba(120, 80, 255, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1024, 2048);

      // Status bar time
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 64px "Space Grotesk", sans-serif';
      ctx.fillText('09:41', 120, 140);

      // Dynamic Island Pill
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(512 - 140, 80, 280, 68, 34);
      ctx.fill();

      // Brand Typography
      ctx.fillStyle = '#ccff00';
      ctx.font = '700 84px "Space Grotesk", sans-serif';
      ctx.fillText('RE:PHONE', 120, 850);

      ctx.fillStyle = '#ffffff';
      ctx.font = '400 48px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('OLD PHONE. NEW LIFE.', 120, 930);

      // Verification Badge Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(120, 1020, 784, 220, 28);
      ctx.fill();
      ctx.strokeStyle = 'rgba(204, 255, 0, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inside badge: battery & inspection
      ctx.fillStyle = '#ccff00';
      ctx.font = '700 42px "Space Grotesk", sans-serif';
      ctx.fillText('30-POINT CERTIFIED', 180, 1110);

      ctx.fillStyle = '#a1a8b3';
      ctx.font = '400 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Battery Health: 94% · 12-Mo Warranty', 180, 1175);

      // Bottom unlock bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.roundRect(512 - 180, 1960, 360, 12, 6);
      ctx.fill();
    };
    updateScreenTexture();

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.generateMipmaps = true;

    // Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a8782,
      metalness: 0.88,
      roughness: 0.28,
    });

    const backGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x98938d,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.35,
      transparent: true,
      opacity: 0.96,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });

    const batteryMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2326,
      metalness: 0.5,
      roughness: 0.4,
    });

    const logicBoardMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a3328, // Deep circuit green
      metalness: 0.6,
      roughness: 0.3,
    });

    const cameraRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a5753,
      metalness: 0.95,
      roughness: 0.1,
    });

    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.8,
      reflectivity: 0.9,
      clearcoat: 1.0,
    });

    // LAYER 1: Titanium Chassis Frame
    const frameGeo = new THREE.BoxGeometry(2.4, 4.9, 0.22);
    const frameMesh = new THREE.Mesh(frameGeo, titaniumMaterial);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;

    // LAYER 2: OLED Screen
    const screenGeo = new THREE.BoxGeometry(2.3, 4.78, 0.03);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.z = 0.12;

    // LAYER 3: Internal Logic Board
    const logicGeo = new THREE.BoxGeometry(2.0, 2.2, 0.05);
    const logicMesh = new THREE.Mesh(logicGeo, logicBoardMaterial);
    logicMesh.position.set(0, 1.1, 0.02);

    // Tiny chips on logic board
    const chipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.04);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const chipMesh = new THREE.Mesh(chipGeo, chipMat);
    chipMesh.position.set(0.2, 1.2, 0.05);
    phoneGroup.add(chipMesh);

    // LAYER 4: Lithium Battery Pack
    const batteryGeo = new THREE.BoxGeometry(1.8, 2.3, 0.07);
    const batteryMesh = new THREE.Mesh(batteryGeo, batteryMaterial);
    batteryMesh.position.set(-0.05, -1.1, 0.02);

    // LAYER 5: Back Glass
    const backGeo = new THREE.BoxGeometry(2.32, 4.82, 0.03);
    const backMesh = new THREE.Mesh(backGeo, backGlassMaterial);
    backMesh.position.z = -0.12;

    // LAYER 6: Camera Bump Island
    const cameraIslandGeo = new THREE.BoxGeometry(1.05, 1.1, 0.1);
    const cameraIsland = new THREE.Mesh(cameraIslandGeo, backGlassMaterial);
    cameraIsland.position.set(-0.55, 1.7, -0.18);

    // Triple Camera Lenses
    const lensGroup = new THREE.Group();
    const addLens = (x: number, y: number) => {
      const ringGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, cameraRingMaterial);
      ring.position.set(x, y, -0.22);

      const glassGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.082, 32);
      glassGeo.rotateX(Math.PI / 2);
      const glass = new THREE.Mesh(glassGeo, lensMaterial);
      glass.position.set(x, y, -0.22);

      lensGroup.add(ring);
      lensGroup.add(glass);
    };

    addLens(-0.75, 1.95);
    addLens(-0.75, 1.45);
    addLens(-0.35, 1.7);

    // Assemble Layers
    phoneGroup.add(frameMesh);
    phoneGroup.add(screenMesh);
    phoneGroup.add(logicMesh);
    phoneGroup.add(batteryMesh);
    phoneGroup.add(backMesh);
    phoneGroup.add(cameraIsland);
    phoneGroup.add(lensGroup);

    // Floating subtle particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 45;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xccff00,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 6, 6);
    scene.add(dirLight1);

    // Lime futuristic rim light
    const limeRimLight = new THREE.DirectionalLight(0xccff00, 1.8);
    limeRimLight.position.set(-5, 4, 3);
    scene.add(limeRimLight);

    // Restrained purple accent backlight
    const purpleRimLight = new THREE.PointLight(0x7850ff, 2.5, 10);
    purpleRimLight.position.set(2, -3, -4);
    scene.add(purpleRimLight);

    // Mouse and Touch Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.5;
      mouseY = y * 1.5;
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Resize Handler with ResizeObserver
    const updateDimensions = (newWidth: number, newHeight: number) => {
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        updateDimensions(w, h);
      }
    });
    resizeObserver.observe(container);

    const handleResize = () => {
      if (!container) return;
      updateDimensions(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    // Layer separation targets for exploded view
    let explodeFactor = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Smooth target interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Explode factor interpolation (either manual or scroll progress)
      const targetExplode = effectiveExplode ? 1.0 : 0.0;
      explodeFactor += (targetExplode - explodeFactor) * 0.07;

      // Base idle floating
      const floatY = Math.sin(elapsedTime * 1.2) * 0.12;
      phoneGroup.position.y = floatY;

      // Rotation
      if (effectiveExplode) {
        // When exploded, show isometric 3D separation view
        phoneGroup.rotation.y = THREE.MathUtils.lerp(phoneGroup.rotation.y, 0.75 + targetX * 0.5, 0.08);
        phoneGroup.rotation.x = THREE.MathUtils.lerp(phoneGroup.rotation.x, 0.35 - targetY * 0.5, 0.08);
        phoneGroup.rotation.z = THREE.MathUtils.lerp(phoneGroup.rotation.z, -0.15, 0.08);
      } else {
        // Idle smooth rotation with mouse responsiveness
        const idleRot = autoRotate && !prefersReducedMotion ? Math.sin(elapsedTime * 0.6) * 0.25 : 0;
        phoneGroup.rotation.y = THREE.MathUtils.lerp(phoneGroup.rotation.y, idleRot + targetX * 0.8, 0.06);
        phoneGroup.rotation.x = THREE.MathUtils.lerp(phoneGroup.rotation.x, -targetY * 0.6, 0.06);
        phoneGroup.rotation.z = THREE.MathUtils.lerp(phoneGroup.rotation.z, targetX * 0.1, 0.06);
      }

      // Explode layers along Z and slightly Y
      screenMesh.position.z = THREE.MathUtils.lerp(0.12, 1.2, explodeFactor);
      logicMesh.position.z = THREE.MathUtils.lerp(0.02, 0.6, explodeFactor);
      chipMesh.position.z = THREE.MathUtils.lerp(0.05, 0.64, explodeFactor);
      batteryMesh.position.z = THREE.MathUtils.lerp(0.02, -0.4, explodeFactor);
      backMesh.position.z = THREE.MathUtils.lerp(-0.12, -1.3, explodeFactor);
      cameraIsland.position.z = THREE.MathUtils.lerp(-0.18, -1.7, explodeFactor);
      lensGroup.position.z = THREE.MathUtils.lerp(0, -0.7, explodeFactor);

      // Rotate subtle particles
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [effectiveExplode, autoRotate]);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] md:h-[620px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Fallback if WebGL unavailable */}
      {!webGLSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FDFCF9] rounded-none border border-black/10">
          <div className="w-48 h-80 bg-[#0A0A0A] rounded-none p-4 border border-black relative flex flex-col justify-between">
            <div className="w-20 h-3 bg-black border border-white/20 rounded-none mx-auto" />
            <div className="text-center text-white">
              <span className="text-[#C0FF00] font-display font-black text-xl block uppercase">RE:PHONE</span>
              <span className="text-[10px] font-mono text-white/50">OLD PHONE. NEW LIFE.</span>
            </div>
            <div className="w-20 h-1 bg-[#C0FF00] mx-auto" />
          </div>
          <p className="text-xs font-mono text-black/50 mt-4">3D hardware acceleration unavailable on your device.</p>
        </div>
      )}

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono">
        <div className="pointer-events-auto flex items-center gap-1 bg-[#FDFCF9] border border-black/20 p-1.5 rounded-none shadow-none">
          <button
            type="button"
            onClick={() => setIsExploded(!isExploded)}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 rounded-none transition-all border ${
              effectiveExplode
                ? 'bg-[#0A0A0A] text-[#C0FF00] border-black'
                : 'text-black/80 border-transparent hover:bg-[#F5F4F0]'
            }`}
            title="Inspect internal refurbished layers"
          >
            <Layers className="w-3.5 h-3.5" />
            {effectiveExplode ? 'Reassemble' : 'Explode View'}
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-none text-xs transition-colors border border-transparent ${
              autoRotate ? 'text-[#0A0A0A] hover:bg-[#F5F4F0]' : 'text-black/30'
            }`}
            title="Toggle gentle rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Certification Pill */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-[#0A0A0A] text-white border border-black px-3 py-1.5 rounded-none text-[11px] font-mono">
          <span className="w-2 h-2 rounded-none bg-[#C0FF00] animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">Titanium Chassis · 94% OEM Battery</span>
        </div>
      </div>

      {/* Exploded Inspection Annotations */}
      {effectiveExplode && (
        <div className="absolute top-6 left-4 sm:left-8 flex flex-col gap-2 max-w-xs animate-in fade-in slide-in-from-left-4 duration-300 pointer-events-none font-mono">
          <div className="bg-[#FDFCF9] border border-black/20 p-3 rounded-none text-left pointer-events-auto shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-1">
              <Eye className="w-3.5 h-3.5 text-[#0A0A0A]" />
              Super Retina OLED
            </div>
            <p className="text-[11px] text-black/70 leading-snug">
              Dead-pixel sweep & 120Hz ProMotion touch digitized verification passed.
            </p>
          </div>

          <div className="bg-[#FDFCF9] border border-black/20 p-3 rounded-none text-left pointer-events-auto shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 text-[#0A0A0A]" />
              OEM Battery Cell
            </div>
            <p className="text-[11px] text-black/70 leading-snug">
              Thermal load checked. 94% capacity retention guaranteed for 500+ cycles.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
