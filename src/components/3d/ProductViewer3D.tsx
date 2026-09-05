import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

interface ProductViewer3DProps {
  colorHex?: string;
  colorName?: string;
  availableColors?: { name: string; hex: string }[];
  onColorSelect?: (colorName: string, hex: string) => void;
  brand?: string;
  model?: string;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  colorHex = '#9a948d',
  colorName = 'Natural Titanium',
  availableColors = [],
  onColorSelect,
  brand = 'Apple',
  model = 'iPhone 15 Pro',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(colorHex);
  const [selectedColorName, setSelectedColorName] = useState(colorName);
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewAngle, setViewAngle] = useState<'front' | 'back' | 'side' | 'iso'>('iso');

  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const backMeshRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const frameMeshRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    setSelectedColor(colorHex);
    setSelectedColorName(colorName);
  }, [colorHex, colorName]);

  // Update materials when color changes
  useEffect(() => {
    if (backMeshRef.current && frameMeshRef.current) {
      const color = new THREE.Color(selectedColor);
      backMeshRef.current.color = color;
      frameMeshRef.current.color = color.clone().offsetHSL(0, 0, -0.05);
    }
  }, [selectedColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    scene.add(phoneGroup);

    // Initial isometric tilt
    phoneGroup.rotation.y = 0.4;
    phoneGroup.rotation.x = 0.15;

    // Materials
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      metalness: 0.85,
      roughness: 0.25,
    });
    frameMeshRef.current = titaniumMat;

    const backGlassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColor),
      metalness: 0.2,
      roughness: 0.12,
      transmission: 0.4,
      transparent: true,
      opacity: 0.96,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    backMeshRef.current = backGlassMat;

    // Front Screen Canvas Texture
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 2048;
    const ctx = screenCanvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 1024, 2048);
    grad.addColorStop(0, '#0c0f13');
    grad.addColorStop(0.7, '#15191e');
    grad.addColorStop(1, '#07090b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 2048);

    // Wallpaper art
    const glow = ctx.createRadialGradient(512, 1000, 40, 512, 1000, 500);
    glow.addColorStop(0, 'rgba(204, 255, 0, 0.25)');
    glow.addColorStop(0.6, 'rgba(110, 80, 255, 0.12)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 2048);

    // Top status & dynamic island
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 64px "Space Grotesk", sans-serif';
    ctx.fillText('9:41', 120, 140);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(512 - 130, 80, 260, 64, 32);
    ctx.fill();

    // Brand lockscreen message
    ctx.fillStyle = '#ccff00';
    ctx.font = '700 78px "Space Grotesk", sans-serif';
    ctx.fillText('RE:PHONE', 120, 950);
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Certified Pre-Owned', 120, 1025);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });

    // Procedural Phone Body
    const frameGeo = new THREE.BoxGeometry(2.35, 4.8, 0.22);
    const frameMesh = new THREE.Mesh(frameGeo, titaniumMat);
    phoneGroup.add(frameMesh);

    // Front Screen
    const screenGeo = new THREE.BoxGeometry(2.26, 4.68, 0.02);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.115;
    phoneGroup.add(screenMesh);

    // Back Glass
    const backGeo = new THREE.BoxGeometry(2.28, 4.7, 0.02);
    const backMesh = new THREE.Mesh(backGeo, backGlassMat);
    backMesh.position.z = -0.115;
    phoneGroup.add(backMesh);

    // Camera Bump Island
    const bumpGeo = new THREE.BoxGeometry(1.05, 1.1, 0.08);
    const bump = new THREE.Mesh(bumpGeo, backGlassMat);
    bump.position.set(-0.55, 1.7, -0.16);
    phoneGroup.add(bump);

    // Lenses
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.95, roughness: 0.1 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x05070a, metalness: 0.9, roughness: 0.05, transmission: 0.7 });

    const createLens = (x: number, y: number) => {
      const ringGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.07, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, -0.2);

      const glassGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.072, 32);
      glassGeo.rotateX(Math.PI / 2);
      const glass = new THREE.Mesh(glassGeo, lensMat);
      glass.position.set(x, y, -0.2);

      phoneGroup.add(ring);
      phoneGroup.add(glass);
    };

    createLens(-0.75, 1.95);
    createLens(-0.75, 1.45);
    createLens(-0.35, 1.7);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambient);

    const dir1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dir1.position.set(4, 5, 5);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dir2.position.set(-4, -2, -4);
    scene.add(dir2);

    const limePoint = new THREE.PointLight(0xccff00, 1.2, 8);
    limePoint.position.set(-3, 3, 3);
    scene.add(limePoint);

    // Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !phoneGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      phoneGroupRef.current.rotation.y += deltaX * 0.01;
      phoneGroupRef.current.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && phoneGroupRef.current) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        phoneGroupRef.current.rotation.y += deltaX * 0.015;
        phoneGroupRef.current.rotation.x += deltaY * 0.015;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasEl.addEventListener('touchstart', onTouchStart);
    canvasEl.addEventListener('touchmove', onTouchMove);

    // Responsive Resize with ResizeObserver
    const updateSize = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        updateSize(w, h);
      }
    });
    resizeObserver.observe(container);

    const onResize = () => {
      if (!container) return;
      updateSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);
      if (autoRotate && phoneGroupRef.current) {
        phoneGroupRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    render();

    return () => {
      canvasEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasEl.removeEventListener('touchstart', onTouchStart);
      canvasEl.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const setPresetAngle = (angle: 'front' | 'back' | 'side' | 'iso') => {
    setViewAngle(angle);
    if (!phoneGroupRef.current) return;
    setAutoRotate(false);
    switch (angle) {
      case 'front':
        phoneGroupRef.current.rotation.set(0, 0, 0);
        break;
      case 'back':
        phoneGroupRef.current.rotation.set(0, Math.PI, 0);
        break;
      case 'side':
        phoneGroupRef.current.rotation.set(0, Math.PI / 2, 0);
        break;
      case 'iso':
        phoneGroupRef.current.rotation.set(0.15, 0.4, 0);
        break;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const targetZ = direction === 'in' ? Math.max(5.0, cameraRef.current.position.z - 0.8) : Math.min(10.0, cameraRef.current.position.z + 0.8);
    cameraRef.current.position.z = targetZ;
  };

  const handleColorChange = (name: string, hex: string) => {
    setSelectedColor(hex);
    setSelectedColorName(name);
    onColorSelect?.(name, hex);
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] bg-[#F5F4F0] rounded-none border border-black/10 overflow-hidden flex flex-col items-center justify-between p-4 shadow-none select-none">
      {/* Top Bar: Brand, 360 badge, Zoom controls */}
      <div className="w-full flex items-center justify-between z-10 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase px-2.5 py-1 bg-[#FDFCF9] border border-black/15 text-[#0A0A0A] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-none bg-[#0A0A0A]" />
            360° Inspection View
          </span>
          <span className="hidden sm:inline-block text-[11px] text-black/50">
            Drag to rotate
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#FDFCF9] p-1 border border-black/15">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-none hover:bg-black/5 text-[#0A0A0A] transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-none hover:bg-black/5 text-[#0A0A0A] transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-none transition-colors ${
              autoRotate ? 'bg-[#0A0A0A] text-[#C0FF00]' : 'hover:bg-black/5 text-[#0A0A0A]'
            }`}
            title="Toggle 360 spin"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center my-auto"
      />

      {/* Bottom Bar: Viewpoint buttons + Color Switcher */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 z-10 pt-2 border-t border-black/10 font-mono">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1 bg-[#FDFCF9] p-1 border border-black/15 text-xs">
          {(['iso', 'front', 'back', 'side'] as const).map((angle) => (
            <button
              key={angle}
              type="button"
              onClick={() => setPresetAngle(angle)}
              className={`px-3 py-1 font-bold uppercase transition-all rounded-none ${
                viewAngle === angle
                  ? 'bg-[#0A0A0A] text-[#C0FF00]'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              {angle === 'iso' ? '3D' : angle}
            </button>
          ))}
        </div>

        {/* Dynamic Color Palette Switcher */}
        {availableColors.length > 0 && (
          <div className="flex items-center gap-2 bg-[#FDFCF9] px-3 py-1.5 border border-black/15 text-xs">
            <span className="text-[11px] text-black/50 uppercase hidden md:inline">Color:</span>
            <div className="flex items-center gap-1.5">
              {availableColors.map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => handleColorChange(col.name, col.hex)}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  className={`w-4 h-4 rounded-none border transition-transform ${
                    selectedColorName === col.name
                      ? 'scale-125 border-black ring-1 ring-[#0A0A0A] ring-offset-1'
                      : 'border-black/30 hover:scale-110'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#0A0A0A] ml-1 uppercase">{selectedColorName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
