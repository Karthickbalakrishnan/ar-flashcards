import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// Hotspot definitions with 3D positions and label content
const HOTSPOTS_DATA = {
  "H₂O": [
    { id: "h1", pos: [0, 0.1, 0.5], label: "Oxygen Lone Pair", detail: "Exerts repulsive force bending H-O-H angle to 104.5°" },
    { id: "h2", pos: [0.76, 0.59, 0.2], label: "O–H Bond", detail: "Polar covalent bond with strong dipole moment" }
  ],
  "CH₄": [
    { id: "h1", pos: [0, 0, 0], label: "sp³ Carbon", detail: "Symmetrical tetrahedral electron geometry" }
  ]
};

export function HotspotViewer({ molecule, spin }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [badgePositions, setBadgePositions] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xfff3e6, 1.15);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    scene.add(new THREE.AmbientLight(0x404850, 0.9));

    const group = new THREE.Group();
    scene.add(group);

    let raf;
    const rotState = { x: -0.3, y: 0.5, dragging: false, lastX: 0, lastY: 0 };
    const hotspots3D = [];

    const onDown = (e) => {
      rotState.dragging = true;
      const p = e.touches ? e.touches[0] : e;
      rotState.lastX = p.clientX;
      rotState.lastY = p.clientY;
    };

    const onMove = (e) => {
      if (!rotState.dragging) return;
      const p = e.touches ? e.touches[0] : e;
      rotState.y += (p.clientX - rotState.lastX) * 0.008;
      rotState.x += (p.clientY - rotState.lastY) * 0.008;
      rotState.lastX = p.clientX;
      rotState.lastY = p.clientY;
    };

    const onUp = () => (rotState.dragging = false);

    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
    renderer.domElement.addEventListener("touchmove", onMove, { passive: true });
    renderer.domElement.addEventListener("touchend", onUp);

    // Render loop: Projects 3D vectors into 2D screen percentage points
    const animate = () => {
      raf = requestAnimationFrame(animate);

      if (!rotState.dragging && stateRef.current.spin) {
        rotState.y += 0.004;
      }

      group.rotation.x = rotState.x;
      group.rotation.y = rotState.y;

      renderer.render(scene, camera);

      // Project 3D Hotspot Coordinates to 2D HTML Screen Coordinates
      if (hotspots3D.length > 0 && mountRef.current) {
        const projected = hotspots3D.map((item) => {
          const worldPos = new THREE.Vector3();
          item.mesh.getWorldPosition(worldPos);

          // Project vector from 3D camera space to NDC (-1 to +1)
          worldPos.project(camera);

          // Convert NDC (-1 to +1) to screen percentage coords
          const x = (worldPos.x * 0.5 + 0.5) * 100;
          const y = (-(worldPos.y * 0.5) + 0.5) * 100;
          const isBehind = worldPos.z > 1; // Check if point is behind camera frustum

          return {
            ...item.data,
            x: `${x}%`,
            y: `${y}%`,
            visible: !isBehind && x >= 5 && x <= 95 && y >= 5 && y <= 95
          };
        });

        setBadgePositions(projected);
      }
    };

    animate();

    stateRef.current = { scene, camera, renderer, group, hotspots3D, spin };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update molecule geometry and 3D hotspot anchors
  useEffect(() => {
    const s = stateRef.current;
    if (!s.group) return;

    while (s.group.children.length) s.group.remove(s.group.children[0]);
    s.hotspots3D.length = 0;

    // Render 3D Molecule Mesh
    if (molecule.atoms) {
      molecule.atoms.forEach(({ el, pos }) => {
        const radius = el === "H" ? 0.34 : 0.5;
        const color = el === "O" ? 0xd1594a : el === "C" ? 0x2b2f33 : 0xf2f4f3;
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(radius, 24, 24),
          new THREE.MeshStandardMaterial({ color, roughness: 0.35 })
        );
        mesh.position.set(...pos);
        s.group.add(mesh);
      });
    }

    // Attach invisible 3D position anchors for hotspots
    const hotspots = HOTSPOTS_DATA[molecule.formula] || [];
    hotspots.forEach((data) => {
      const anchor = new THREE.Object3D();
      anchor.position.set(...data.pos);
      s.group.add(anchor);
      s.hotspots3D.push({ mesh: anchor, data });
    });
  }, [molecule]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Three.js WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />

      {/* 2D HTML Floating Badges Overlay */}
      {badgePositions.map((spot) =>
        spot.visible ? (
          <div
            key={spot.id}
            style={{ left: spot.x, top: spot.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-transform duration-75"
          >
            <button
              onClick={() => setActiveHotspot(spot)}
              className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 shadow-md text-xs font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-300 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>{spot.label}</span>
            </button>
          </div>
        ) : null
      )}

      {/* Detail Popover Panel */}
      {activeHotspot && (
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 border border-slate-200 rounded-xl shadow-lg z-20 flex justify-between items-start text-xs">
          <div>
            <div className="font-bold text-sky-700">{activeHotspot.label}</div>
            <div className="text-slate-600 mt-0.5">{activeHotspot.detail}</div>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="text-slate-400 hover:text-slate-700 font-bold px-1.5"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
