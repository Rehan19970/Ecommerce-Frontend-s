import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Threads = () => {
  const groupRef = useRef();
  const { mouse } = useThree();

  const verticalThreads = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 50; i++) {
      const x = (i - 25) * 0.25;
      const points = [];
      for (let j = 0; j <= 80; j++) {
        const y = (j - 40) * 0.12;
        const z = Math.sin(j * 0.25 + i * 0.4) * 0.35;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 80, 0.018, 8, false);
      arr.push({ geo, key: `v-${i}` });
    }
    return arr;
  }, []);

  const horizontalThreads = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const y = (i - 20) * 0.3;
      const points = [];
      for (let j = 0; j <= 80; j++) {
        const x = (j - 40) * 0.12;
        const z = Math.cos(j * 0.2 + i * 0.25) * 0.35;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 80, 0.012, 8, false);
      arr.push({ geo, key: `h-${i}` });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.4 + mouse.x * 0.6;
      groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.15 + mouse.y * 0.3;
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {verticalThreads.map((t) => (
        <mesh key={t.key} geometry={t.geo}>
          <meshStandardMaterial
            color="#C9A227"
            metalness={0.95}
            roughness={0.15}
            emissive="#C9A227"
            emissiveIntensity={0.35}
          />
        </mesh>
      ))}
      {horizontalThreads.map((t) => (
        <mesh key={t.key} geometry={t.geo}>
          <meshStandardMaterial
            color="#E5C76B"
            metalness={0.9}
            roughness={0.2}
            emissive="#E5C76B"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 5, 5]} intensity={2.2} color="#C9A227" />
    <directionalLight position={[-5, -5, -5]} intensity={1} color="#ffffff" />
    <pointLight position={[0, 0, 3]} intensity={1.8} color="#E5C76B" />
    <Threads />
  </>
);

const Loader3D = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-brand-black">
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-white/60 text-xs uppercase tracking-widest">Loading...</p>
    </div>
  </div>
);

const Hero3D = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative h-[calc(100vh-170px)] min-h-137.5 max-h-225 overflow-hidden bg-brand-black">
      <div className="absolute inset-0">
        {mounted && (
          <Suspense fallback={<Loader3D />}>
            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <Scene />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/30 to-black/60 pointer-events-none"></div>
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20 pointer-events-none"></div>

      <div className="relative z-20 h-full flex items-center pointer-events-none">
        <div className="container-brand">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-3 mb-6 animate-fade-up">
              <span className="w-12 h-px bg-brand-gold"></span>
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-brand-gold font-medium">
                ✦ New Collection 2025
              </p>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-up">
              Elegance
              <br />
              <span className="text-brand-gold italic">Redefined</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mb-10 max-w-lg leading-relaxed animate-fade-up">
              Discover our latest collection — crafted for the modern Pakistani.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up pointer-events-auto">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 bg-brand-gold text-white px-8 md:px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-brand-black transition-all duration-500"
              >
                Shop Now
                <span className="transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 border border-white/40 text-white px-8 md:px-10 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-brand-black hover:border-white transition-all duration-500"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex absolute bottom-10 right-10 z-30 items-center gap-3 text-white/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-white/40 relative overflow-hidden">
          <div className="absolute top-0 w-full h-4 bg-brand-gold animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero3D;