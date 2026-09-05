import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Smartphone, BatteryCharging, Cpu, Camera, Shield, Layers, CheckCircle2 } from 'lucide-react';

interface ComponentInspectionDetail {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  icon: any;
  tests: string[];
  metrics: string;
  meshZ: number;
}

const INSPECTION_COMPONENTS: ComponentInspectionDetail[] = [
  {
    id: 'display',
    name: 'DISPLAY',
    title: 'Super Retina XDR / LTPO AMOLED',
    subtitle: 'Digitizer & Optical Integrity',
    icon: Smartphone,
    tests: ['Multi-touch grid test (100% responsive)', 'Full-spectrum brightness test (up to 2000+ nits)', 'Dead & stuck pixel sub-pixel microscope scan', 'TrueTone / Color temperature calibration'],
    metrics: 'Passed: Zero burn-in, zero micro-lines',
    meshZ: 1.4,
  },
  {
    id: 'battery',
    name: 'BATTERY',
    title: 'Lithium-Ion Polymer OEM Pack',
    subtitle: 'Health & Thermal Longevity',
    icon: BatteryCharging,
    tests: ['Accurate milliamp-hour (mAh) capacity measurement', 'Thermal dissipation check during rapid charge (0-80%)', 'Voltage impedance & cycle degradation rating', 'Over-current & short-circuit safety verification'],
    metrics: 'Certified: ≥88% - 99% Health Retention',
    meshZ: -0.3,
  },
  {
    id: 'logic',
    name: 'LOGIC BOARD',
    title: 'SoC & Motherboard Assembly',
    subtitle: 'Silicon Diagnostics & Biometrics',
    icon: Cpu,
    tests: ['BGA micro-solder stress and power-management check', 'Face ID Dot Projector / Ultrasonic Fingerprint sensor', 'Liquid ingress sticker inspection (100% dry)', 'BTRC & GSMA global blacklist IMEI verification'],
    metrics: 'Verified: Clean Bangladesh PTA/BTRC status',
    meshZ: 0.6,
  },
  {
    id: 'camera',
    name: 'CAMERA MODULE',
    title: 'Optical Sensor Array & OIS',
    subtitle: 'Lens Alignment & Autofocus',
    icon: Camera,
    tests: ['Dual-pixel / Quad-pixel autofocus laser speed', 'Sensor-shift Optical Image Stabilization (OIS) gyro', '4K / 8K video capture at 60fps thermal duration', 'Macro, Ultra-wide distortion correction test'],
    metrics: 'Passed: 100% Optical clarity & sensor hygiene',
    meshZ: -1.7,
  },
  {
    id: 'frame',
    name: 'CHASSIS & FRAME',
    title: 'Aerospace-Grade Aluminum or Titanium',
    subtitle: 'Structural Rigidity & Antennas',
    icon: Shield,
    tests: ['Torsional structural integrity (anti-bend assessment)', '5G Sub-6 & mmWave antenna signal attenuation test', 'USB-C / Lightning port pin erosion check', 'Stereo microphone & acoustic speaker chamber clean'],
    metrics: 'Rated: Grade-A chassis rigidity',
    meshZ: 0.0,
  },
  {
    id: 'backglass',
    name: 'BACK GLASS & COIL',
    title: 'Ceramic / Frosted Back Glass',
    subtitle: 'Wireless Induction & Hermetic Seal',
    icon: Layers,
    tests: ['Qi / MagSafe wireless power induction coil test', 'NFC payment and transit antenna continuity', 'Acoustic seal & dust gasket verification', 'Precision surface cosmetic defect classification'],
    metrics: 'Classified: Certified Cosmetic Standard',
    meshZ: -1.1,
  },
];

export const ExplodedInspection3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('display');
  const meshesRef = useRef<Record<string, THREE.Mesh | THREE.Group>>({});

  const activeComponent = INSPECTION_COMPONENTS.find((c) => c.id === selectedId) || INSPECTION_COMPONENTS[0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(3.8, 1.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Initial angled isometric viewpoint
    group.rotation.y = 0.55;
    group.rotation.x = 0.25;

    // Materials
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x0c2514,
      emissiveIntensity: 0.4,
    });
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x222629, roughness: 0.3, metalness: 0.6 });
    const logicMat = new THREE.MeshStandardMaterial({ color: 0x143b2b, roughness: 0.3, metalness: 0.7 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x888580, roughness: 0.25, metalness: 0.9 });
    const backGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x7a7772, roughness: 0.1, metalness: 0.3, transmission: 0.5, opacity: 0.9, transparent: true });

    // 1. Display Layer
    const displayMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.6, 0.04), displayMat);
    displayMesh.position.z = 1.4;
    group.add(displayMesh);
    meshesRef.current.display = displayMesh;

    // 2. Logic Board Layer
    const logicMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.0, 0.06), logicMat);
    logicMesh.position.set(0, 1.0, 0.6);
    group.add(logicMesh);
    meshesRef.current.logic = logicMesh;

    // 3. Frame
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.3, 4.7, 0.14), frameMat);
    frameMesh.position.z = 0.0;
    group.add(frameMesh);
    meshesRef.current.frame = frameMesh;

    // 4. Battery
    const batteryMesh = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.2, 0.08), batteryMat);
    batteryMesh.position.set(-0.1, -1.0, -0.3);
    group.add(batteryMesh);
    meshesRef.current.battery = batteryMesh;

    // 5. Back Glass
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(2.24, 4.64, 0.04), backGlassMat);
    backMesh.position.z = -1.1;
    group.add(backMesh);
    meshesRef.current.backglass = backMesh;

    // 6. Camera bump
    const cameraGroup = new THREE.Group();
    const cameraIsland = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.05, 0.12), backGlassMat);
    cameraIsland.position.set(-0.5, 1.6, -1.6);
    cameraGroup.add(cameraIsland);
    group.add(cameraGroup);
    meshesRef.current.camera = cameraGroup;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 7, 5);
    scene.add(dirLight);

    const limeGlow = new THREE.PointLight(0xccff00, 2.0, 8);
    limeGlow.position.set(0, 0, 2);
    scene.add(limeGlow);

    const purpleGlow = new THREE.PointLight(0x7c3aed, 1.5, 7);
    purpleGlow.position.set(-3, -2, -2);
    scene.add(purpleGlow);

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

    // Anim loop
    let animId: number;
    let clock = new THREE.Clock();
    const render = () => {
      animId = requestAnimationFrame(render);
      const time = clock.getElapsedTime();
      group.rotation.y = 0.55 + Math.sin(time * 0.4) * 0.08;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] text-white rounded-none p-6 md:p-10 border border-black relative overflow-hidden font-mono">
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Interactive 3D Exploded View */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-[#C0FF00] animate-pulse" />
              <span className="text-xs uppercase tracking-widest text-[#C0FF00] font-mono font-bold">
                RE:PHONE 30-Point Disassembly Matrix
              </span>
            </div>
            <span className="text-[10px] text-white/50 font-mono uppercase tracking-wider">LAB CERTIFIED</span>
          </div>

          <div
            ref={containerRef}
            className="w-full h-[340px] md:h-[400px] cursor-pointer"
          />

          <p className="text-[11px] text-white/50 text-center mt-2 font-mono">
            Interactive engineering breakdown · Select a subsystem below to inspect diagnostic protocols.
          </p>
        </div>

        {/* Right Column: Diagnostic & Inspection Deep-Dive */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Subsystem tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-6 bg-[#16181D] p-1 rounded-none border border-white/10">
            {INSPECTION_COMPONENTS.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-none text-center transition-all border ${
                    isSelected
                      ? 'bg-[#C0FF00] text-[#0A0A0A] border-[#C0FF00] font-bold'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[9px] tracking-wider uppercase leading-none font-mono">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Subsystem Detail Card */}
          <div className="bg-[#14161B] border border-white/15 rounded-none p-6">
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#C0FF00] tracking-widest uppercase block mb-1">
                  Subsystem Verification {activeComponent.name}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-display text-white uppercase tracking-tight">
                  {activeComponent.title}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">{activeComponent.subtitle}</p>
              </div>

              <div className="px-3 py-1 rounded-none bg-black border border-[#C0FF00] text-[#C0FF00] text-xs font-mono font-bold shrink-0 uppercase tracking-wider">
                100% PASSED
              </div>
            </div>

            {/* Checklist of engineering tests */}
            <div className="space-y-2.5 my-5">
              {activeComponent.tests.map((test, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-white/80 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-[#C0FF00] shrink-0 mt-0.5" />
                  <span>{test}</span>
                </div>
              ))}
            </div>

            {/* Verification summary banner */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white/50 uppercase tracking-wider text-[11px]">Certification Outcome:</span>
              <span className="text-[#C0FF00] font-bold">{activeComponent.metrics}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
