import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { RotateCcw, Check, X, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";

// ---------- Molecule data ----------
// Coordinates are illustrative (bond angles/lengths approximated for teaching clarity, not lab-precise).
const ELEMENT_STYLE = {
  H: { color: 0xf2f4f3, radius: 0.34 },
  C: { color: 0x2b2f33, radius: 0.5 },
  N: { color: 0x4f7fd1, radius: 0.5 },
  O: { color: 0xd1594a, radius: 0.5 },
};

const DECK = [
  {
    topic: "Chemistry — Molecular Geometry",
    question: "What shape does a water molecule take, and why?",
    answer:
      "Bent (V-shaped). Oxygen's two lone electron pairs push the two O–H bonds together to about 104.5°, instead of a straight line.",
    formula: "H₂O",
    atoms: [
      { el: "O", pos: [0, 0, 0] },
      { el: "H", pos: [0.76, 0.59, 0] },
      { el: "H", pos: [-0.76, 0.59, 0] },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
    ],
  },
  {
    topic: "Chemistry — Molecular Geometry",
    question: "Methane has four identical bonds. What 3D shape do they form?",
    answer:
      "A tetrahedron. Four electron pairs around carbon spread out as far apart as possible, giving 109.5° bond angles.",
    formula: "CH₄",
    atoms: [
      { el: "C", pos: [0, 0, 0] },
      { el: "H", pos: [0.82, 0.82, 0.82] },
      { el: "H", pos: [0.82, -0.82, -0.82] },
      { el: "H", pos: [-0.82, 0.82, -0.82] },
      { el: "H", pos: [-0.82, -0.82, 0.82] },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
    ],
  },
  {
    topic: "Chemistry — Molecular Geometry",
    question: "Ammonia (NH₃) has a lone pair on nitrogen. What shape results?",
    answer:
      "Trigonal pyramidal. The lone pair takes up space but stays invisible, pushing the three N–H bonds into a tripod shape.",
    formula: "NH₃",
    atoms: [
      { el: "N", pos: [0, 0.32, 0] },
      { el: "H", pos: [0.92, -0.28, 0] },
      { el: "H", pos: [-0.46, -0.28, 0.8] },
      { el: "H", pos: [-0.46, -0.28, -0.8] },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
    ],
  },
  {
    topic: "Chemistry — Bonding",
    question: "Why is carbon dioxide a straight line, not bent like water?",
    answer:
      "Carbon has no lone pairs here — both double bonds to oxygen push directly apart, giving a linear 180° shape.",
    formula: "CO₂",
    atoms: [
      { el: "O", pos: [-1.3, 0, 0] },
      { el: "C", pos: [0, 0, 0] },
      { el: "O", pos: [1.3, 0, 0] },
    ],
    bonds: [
      [0, 1, 2],
      [1, 2, 2],
    ],
  },
  {
    topic: "Chemistry — Aromatic Rings",
    question: "What makes benzene's ring structure unusually stable?",
    answer:
      "Its six carbons form a flat ring where electrons delocalize evenly around the whole loop, rather than sitting in fixed single/double bonds.",
    formula: "C₆H₆",
    atoms: (() => {
      const atoms = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ el: "C", pos: [Math.cos(a) * 1.4, 0, Math.sin(a) * 1.4] });
      }
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        atoms.push({ el: "H", pos: [Math.cos(a) * 2.3, 0, Math.sin(a) * 2.3] });
      }
      return atoms;
    })(),
    bonds: [
      [0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 5, 1], [5, 0, 1],
      [0, 6, 1], [1, 7, 1], [2, 8, 1], [3, 9, 1], [4, 10, 1], [5, 11, 1],
    ],
  },
  {
    topic: "Chemistry — Bonding",
    question: "Oxygen gas is a diatomic molecule. What kind of bond holds it together?",
    answer:
      "A double bond. Each oxygen shares two electron pairs with the other, satisfying both atoms' need for a full outer shell.",
    formula: "O₂",
    atoms: [
      { el: "O", pos: [-0.6, 0, 0] },
      { el: "O", pos: [0.6, 0, 0] },
    ],
    bonds: [[0, 1, 2]],
  },
  {
    topic: "Chemistry — Bonding",
    question: "Nitrogen gas is very unreactive. What makes its bond so strong?",
    answer:
      "A triple bond — three shared electron pairs make N₂ one of the strongest common bonds, which is why nitrogen gas resists reacting.",
    formula: "N₂",
    atoms: [
      { el: "N", pos: [-0.6, 0, 0] },
      { el: "N", pos: [0.6, 0, 0] },
    ],
    bonds: [[0, 1, 3]],
  },
  {
    topic: "Chemistry — Molecular Geometry",
    question: "Ethylene has a C=C double bond. What shape does that force?",
    answer:
      "Trigonal planar and flat. The double bond locks all six atoms into one plane, which is why ethylene can't rotate around that bond.",
    formula: "C₂H₄",
    atoms: [
      { el: "C", pos: [-0.65, 0, 0] },
      { el: "C", pos: [0.65, 0, 0] },
      { el: "H", pos: [-1.25, 0.95, 0] },
      { el: "H", pos: [-1.25, -0.95, 0] },
      { el: "H", pos: [1.25, 0.95, 0] },
      { el: "H", pos: [1.25, -0.95, 0] },
    ],
    bonds: [
      [0, 1, 2],
      [0, 2, 1],
      [0, 3, 1],
      [1, 4, 1],
      [1, 5, 1],
    ],
  },
  {
    topic: "Chemistry — Molecular Geometry",
    question: "Formaldehyde has a C=O bond and two C–H bonds. What shape results?",
    answer:
      "Trigonal planar. Three groups around carbon spread to about 120° apart in a flat triangle, same logic as ethylene's carbons.",
    formula: "CH₂O",
    atoms: [
      { el: "C", pos: [0, 0, 0] },
      { el: "O", pos: [0, 1.2, 0] },
      { el: "H", pos: [1.05, -0.55, 0] },
      { el: "H", pos: [-1.05, -0.55, 0] },
    ],
    bonds: [
      [0, 1, 2],
      [0, 2, 1],
      [0, 3, 1],
    ],
  },
  {
    topic: "Chemistry — Molecular Geometry",
    question: "Why is hydrogen peroxide's shape harder to draw flat than water's?",
    answer:
      "It's non-planar — the two O–H bonds twist out of the O–O plane like an open book, so a flat sketch can't capture it accurately.",
    formula: "H₂O₂",
    atoms: [
      { el: "O", pos: [-0.5, 0, 0] },
      { el: "O", pos: [0.5, 0, 0] },
      { el: "H", pos: [-0.9, 0.75, 0.55] },
      { el: "H", pos: [0.9, 0.75, -0.55] },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [1, 3, 1],
    ],
  },
  {
    topic: "Anatomy — Nervous System",
    question: "What lets a neuron send signals faster along its axon?",
    answer:
      "The myelin sheath — fatty segments wrapped around the axon that let electrical signals jump gap to gap instead of crawling the full length.",
    formula: "Neuron",
    parts: [
      { shape: "sphere", pos: [-0.9, 0.15, 0], scale: [0.62, 0.55, 0.62], color: 0xe0a458 },
      { shape: "cylinder", pos: [0.55, 0, 0], scale: [0.13, 2.6, 0.13], rotation: [0, 0, 90], color: 0xe0a458 },
      { shape: "torus", pos: [0, 0, 0], scale: [0.22, 0.22, 0.22], rotation: [0, 90, 0], color: 0xf2f4f3 },
      { shape: "torus", pos: [0.55, 0, 0], scale: [0.22, 0.22, 0.22], rotation: [0, 90, 0], color: 0xf2f4f3 },
      { shape: "torus", pos: [1.1, 0, 0], scale: [0.22, 0.22, 0.22], rotation: [0, 90, 0], color: 0xf2f4f3 },
      { shape: "cylinder", pos: [-1.35, 0.55, 0], scale: [0.06, 0.6, 0.06], rotation: [0, 0, -35], color: 0xe0a458 },
      { shape: "cylinder", pos: [-1.35, -0.1, 0.3], scale: [0.06, 0.6, 0.06], rotation: [30, 0, -25], color: 0xe0a458 },
      { shape: "cylinder", pos: [-1.2, -0.5, -0.2], scale: [0.06, 0.55, 0.06], rotation: [-25, 0, -20], color: 0xe0a458 },
      { shape: "sphere", pos: [1.75, 0.12, 0], scale: [0.18, 0.18, 0.18], color: 0xe0a458 },
      { shape: "sphere", pos: [1.75, -0.15, 0.12], scale: [0.16, 0.16, 0.16], color: 0xe0a458 },
    ],
  },
  {
    topic: "Anatomy — Circulatory System",
    question: "Why does the heart have two separate pumping sides?",
    answer:
      "One side pushes oxygen-poor blood to the lungs; the other pushes oxygen-rich blood to the rest of the body — two circuits kept from mixing.",
    formula: "Heart",
    parts: [
      { shape: "sphere", pos: [-0.4, -0.3, 0], scale: [0.85, 1.05, 0.8], color: 0xb23b3b },
      { shape: "sphere", pos: [0.5, -0.15, 0], scale: [0.7, 0.9, 0.7], color: 0xc9534f },
      { shape: "cylinder", pos: [-0.1, 1.0, 0], scale: [0.16, 0.9, 0.16], rotation: [0, 0, -12], color: 0xd1594a },
      { shape: "cylinder", pos: [0.3, 0.9, 0.25], scale: [0.14, 0.75, 0.14], rotation: [15, 0, 15], color: 0x4f7fd1 },
      { shape: "cylinder", pos: [0.7, 0.95, -0.15], scale: [0.13, 0.7, 0.13], rotation: [-12, 0, -18], color: 0x4f7fd1 },
    ],
  },
  {
    topic: "Anatomy — Sensory System",
    question: "How does the eye focus light onto the retina?",
    answer:
      "The lens changes shape to bend incoming light so it converges precisely at the back of the eye, where the image registers.",
    formula: "Eye",
    parts: [
      { shape: "sphere", pos: [0, 0, 0], scale: [1, 1, 1], color: 0xf2f4f3 },
      { shape: "sphere", pos: [0, 0, 0.86], scale: [0.42, 0.42, 0.16], color: 0x6f4a2b },
      { shape: "sphere", pos: [0, 0, 0.97], scale: [0.16, 0.16, 0.08], color: 0x101915 },
      { shape: "sphere", pos: [0, 0, 0.58], scale: [0.3, 0.3, 0.2], color: 0xcfe3e8, opacity: 0.65 },
      { shape: "cylinder", pos: [0, 0, -1.05], scale: [0.2, 0.55, 0.2], rotation: [90, 0, 0], color: 0xe6c9a0 },
    ],
  },
  {
    topic: "Anatomy — Respiratory System",
    question: "Why do the airways branch so many times before reaching the lungs?",
    answer:
      "Each branch from the trachea into smaller bronchi multiplies surface area, so oxygen can diffuse into the blood efficiently.",
    formula: "Lungs",
    parts: [
      { shape: "cylinder", pos: [0, 1.05, 0], scale: [0.15, 0.85, 0.15], color: 0xe6c9c2 },
      { shape: "cylinder", pos: [-0.5, 0.35, 0], scale: [0.11, 0.7, 0.11], rotation: [0, 0, 25], color: 0xe6c9c2 },
      { shape: "cylinder", pos: [0.5, 0.35, 0], scale: [0.11, 0.7, 0.11], rotation: [0, 0, -25], color: 0xe6c9c2 },
      { shape: "sphere", pos: [-0.95, -0.55, 0], scale: [0.72, 1.05, 0.52], color: 0xd98f8a },
      { shape: "sphere", pos: [0.95, -0.55, 0], scale: [0.72, 1.05, 0.52], color: 0xd98f8a },
    ],
  },
  {
    topic: "Anatomy — Excretory System",
    question: "What's the kidney's main job, in one sentence?",
    answer:
      "It filters blood continuously, pulling out waste and excess fluid, then sends that out through the ureter as urine.",
    formula: "Kidney",
    parts: [
      { shape: "sphere", pos: [0, 0.2, 0], scale: [0.8, 1.15, 0.55], color: 0x8a3a3a },
      { shape: "cylinder", pos: [0.7, 0.35, 0], scale: [0.08, 0.5, 0.08], rotation: [0, 0, -70], color: 0xd1594a },
      { shape: "cylinder", pos: [0.7, 0.05, 0], scale: [0.07, 0.5, 0.07], rotation: [0, 0, -70], color: 0x4f7fd1 },
      { shape: "cylinder", pos: [0, -1.15, 0], scale: [0.09, 0.85, 0.09], color: 0xe0a458 },
      { shape: "sphere", pos: [0, -2.0, 0], scale: [0.4, 0.32, 0.4], color: 0xc9a15a },
    ],
  },
];

// ---------- 3D viewer ----------
function MoleculeViewer({ molecule, spin }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

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

    const key = new THREE.DirectionalLight(0xfff3e6, 1.15);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fc4e8, 0.5);
    fill.position.set(-4, -2, -3);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x404850, 0.9));

    const group = new THREE.Group();
    scene.add(group);

    let raf;
    const rotState = { x: -0.3, y: 0.5, dragging: false, lastX: 0, lastY: 0 };

    const applyRotation = () => {
      group.rotation.x = rotState.x;
      group.rotation.y = rotState.y;
    };

    const onDown = (e) => {
      rotState.dragging = true;
      const p = e.touches ? e.touches[0] : e;
      rotState.lastX = p.clientX;
      rotState.lastY = p.clientY;
    };
    const onMove = (e) => {
      if (!rotState.dragging) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - rotState.lastX;
      const dy = p.clientY - rotState.lastY;
      rotState.y += dx * 0.008;
      rotState.x += dy * 0.008;
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

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!rotState.dragging && stateRef.current.spin) rotState.y += 0.004;
      applyRotation();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    stateRef.current = { scene, camera, renderer, group, rotState, spin };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep spin flag current without re-mounting the scene
  useEffect(() => {
    stateRef.current.spin = spin;
  }, [spin]);

  // rebuild the model when the card changes — either a molecule (atoms/bonds)
  // or a generic anatomy model built from primitive "parts"
  useEffect(() => {
    const s = stateRef.current;
    if (!s.group) return;
    while (s.group.children.length) s.group.remove(s.group.children[0]);

    if (molecule.parts) {
      const GEO = {
        sphere: () => new THREE.SphereGeometry(1, 26, 26),
        cylinder: () => new THREE.CylinderGeometry(1, 1, 1, 20),
        cone: () => new THREE.ConeGeometry(1, 1, 20),
        torus: () => new THREE.TorusGeometry(1, 0.32, 12, 32),
      };
      molecule.parts.forEach((part) => {
        const geo = (GEO[part.shape] || GEO.sphere)();
        const mat = new THREE.MeshStandardMaterial({
          color: part.color,
          roughness: part.roughness ?? 0.45,
          metalness: 0.05,
          transparent: part.opacity !== undefined,
          opacity: part.opacity ?? 1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...(part.pos || [0, 0, 0]));
        mesh.scale.set(...(part.scale || [1, 1, 1]));
        const rot = part.rotation || [0, 0, 0];
        mesh.rotation.set(
          THREE.MathUtils.degToRad(rot[0]),
          THREE.MathUtils.degToRad(rot[1]),
          THREE.MathUtils.degToRad(rot[2])
        );
        s.group.add(mesh);
      });
      return;
    }

    molecule.atoms.forEach(({ el, pos }) => {
      const style = ELEMENT_STYLE[el];
      const geo = new THREE.SphereGeometry(style.radius, 28, 28);
      const mat = new THREE.MeshStandardMaterial({
        color: style.color,
        roughness: 0.35,
        metalness: 0.08,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      s.group.add(mesh);
    });

    molecule.bonds.forEach(([i, j, order]) => {
      const a = new THREE.Vector3(...molecule.atoms[i].pos);
      const b = new THREE.Vector3(...molecule.atoms[j].pos);
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const offsets = order === 2 ? [-0.09, 0.09] : [0];
      offsets.forEach((off) => {
        const geo = new THREE.CylinderGeometry(0.07, 0.07, len * 0.72, 12);
        const mat = new THREE.MeshStandardMaterial({ color: 0xb9c2c8, roughness: 0.5 });
        const cyl = new THREE.Mesh(geo, mat);
        cyl.position.copy(mid);
        const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize().multiplyScalar(off);
        cyl.position.add(perp);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        s.group.add(cyl);
      });
    });
  }, [molecule]);

  return <div ref={mountRef} className="w-full h-full touch-none cursor-grab active:cursor-grabbing" />;
}

// ---------- Card ----------
function Flashcard({ card, revealed, onReveal }) {
  return (
    <div className="relative w-full h-full rounded-2xl bg-[#f4f6f5] border border-[#1c2b28]/10 shadow-[0_18px_40px_-20px_rgba(15,30,27,0.45)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <span className="text-[11px] tracking-wide text-[#4d6b62] font-medium">{card.topic}</span>
        <span className="text-[13px] font-semibold text-[#0f231e] bg-[#dce8e2] px-2.5 py-1 rounded-md">
          {card.formula}
        </span>
      </div>

      {!revealed ? (
        <div className="flex-1 flex flex-col items-center justify-center px-7 text-center gap-6">
          <p className="text-[19px] leading-snug text-[#0f231e] font-serif">{card.question}</p>
          <button
            onClick={onReveal}
            className="px-5 py-2.5 rounded-full bg-[#0f231e] text-[#f4f6f5] text-sm font-medium tracking-wide hover:bg-[#1c3a32] transition-colors"
          >
            Reveal the model
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <MoleculeViewer molecule={card} spin={true} />
          </div>
          <div className="px-5 pb-4 pt-2 border-t border-[#1c2b28]/10 bg-[#eef2f0]">
            <p className="text-[14px] leading-relaxed text-[#243b34]">{card.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mastered, setMastered] = useState(0);
  const [reviewAgain, setReviewAgain] = useState(0);
  const [showArNote, setShowArNote] = useState(false);

  const card = DECK[index];

  const advance = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i + 1) % DECK.length);
  }, []);

  const rate = (got) => {
    if (got) setMastered((m) => m + 1);
    else setReviewAgain((r) => r + 1);
    advance();
  };

  return (
    <div className="min-h-screen w-full bg-[#101915] flex flex-col items-center py-8 px-4 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Inter:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Source Serif 4', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="w-full max-w-sm flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[#f4f6f5] text-lg font-serif tracking-tight">AR Study Deck</h1>
          <p className="text-[#7fa596] text-xs mt-0.5">
            Card {index + 1} of {DECK.length}
          </p>
        </div>
        <button
          onClick={() => setShowArNote(true)}
          className="flex items-center gap-1.5 text-xs text-[#c7ded4] bg-[#1c2b28] px-3 py-1.5 rounded-full hover:bg-[#243a35] transition-colors"
        >
          <Smartphone size={13} /> View in AR
        </button>
      </div>

      <div className="w-full max-w-sm aspect-[3/4]">
        <Flashcard card={card} revealed={revealed} onReveal={() => setRevealed(true)} />
      </div>

      <div className="w-full max-w-sm mt-5">
        {revealed ? (
          <div className="flex gap-3">
            <button
              onClick={() => rate(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2a1a18] text-[#e8a89a] text-sm font-medium hover:bg-[#35221f] transition-colors"
            >
              <X size={16} /> Review again
            </button>
            <button
              onClick={() => rate(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#173226] text-[#8fd6ae] text-sm font-medium hover:bg-[#1e3f2f] transition-colors"
            >
              <Check size={16} /> Got it
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setRevealed(false);
                setIndex((i) => (i - 1 + DECK.length) % DECK.length);
              }}
              className="p-2.5 rounded-full bg-[#1c2b28] text-[#c7ded4] hover:bg-[#243a35] transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[#5c7d70] text-xs">Drag the model to rotate once revealed</span>
            <button
              onClick={advance}
              className="p-2.5 rounded-full bg-[#1c2b28] text-[#c7ded4] hover:bg-[#243a35] transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm mt-6 flex items-center justify-center gap-6 text-xs text-[#7fa596]">
        <span className="flex items-center gap-1.5">
          <Check size={13} className="text-[#8fd6ae]" /> {mastered} mastered
        </span>
        <span className="flex items-center gap-1.5">
          <RotateCcw size={13} className="text-[#e8a89a]" /> {reviewAgain} reviewing
        </span>
      </div>

      {showArNote && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50"
          onClick={() => setShowArNote(false)}
        >
          <div
            className="max-w-sm bg-[#f4f6f5] rounded-2xl p-6 text-[#0f231e]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-lg mb-2">About the AR mode</h2>
            <p className="text-sm leading-relaxed text-[#243b34]">
              This preview shows each model as a rotatable 3D object, since camera-based AR needs
              device permissions that this in-chat preview can't request. Deployed as a real web
              app, the same models drop into world-tracked AR on students' phones via
              &lt;model-viewer&gt;'s built-in AR button (Scene Viewer on Android, Quick Look on
              iOS) — no separate app needed.
            </p>
            <button
              onClick={() => setShowArNote(false)}
              className="mt-4 w-full py-2.5 rounded-full bg-[#0f231e] text-[#f4f6f5] text-sm font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
