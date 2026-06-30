import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";

export type TimePhase = "morning" | "afternoon" | "sunset" | "night";

export interface TimePreset {
  ambientColor: string;
  ambientIntensity: number;
  sunColor: string;
  sunIntensity: number;
  sunPos: [number, number, number];
  fogColor: string;
  petalColor: string;
  starColor: string;
  starEmissive: string;
}

export const PRESETS: Record<TimePhase, TimePreset> = {
  morning: {
    ambientColor: "#ffd1a4",
    ambientIntensity: 1.4,
    sunColor: "#ffca28",
    sunIntensity: 2.0,
    sunPos: [8, 10, 6],
    fogColor: "#fbc2eb",
    petalColor: "#ffccd2",
    starColor: "#ffd54f",
    starEmissive: "#ff8f00",
  },
  afternoon: {
    ambientColor: "#b3e5fc",
    ambientIntensity: 1.6,
    sunColor: "#fff9c4",
    sunIntensity: 2.6,
    sunPos: [10, 15, 8],
    fogColor: "#e8f5ff",
    petalColor: "#ffccd2",
    starColor: "#ffca28",
    starEmissive: "#ff8f00",
  },
  sunset: {
    ambientColor: "#ff7043",
    ambientIntensity: 1.2,
    sunColor: "#ff5722",
    sunIntensity: 2.3,
    sunPos: [12, 4, 6],
    fogColor: "#fc5c7d",
    petalColor: "#ffe082",
    starColor: "#ff7043",
    starEmissive: "#ff3d00",
  },
  night: {
    ambientColor: "#303f9f",
    ambientIntensity: 0.6,
    sunColor: "#c5cae9",
    sunIntensity: 1.0,
    sunPos: [-8, 12, -4],
    fogColor: "#0f2027",
    petalColor: "#40c4ff",
    starColor: "#00e5ff",
    starEmissive: "#00b0ff",
  },
};

interface FloatingIslandCanvasProps {
  timeOfDay: TimePhase;
}

export default function FloatingIslandCanvas({ timeOfDay }: FloatingIslandCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  // References to keep track of WebGL elements for smooth real-time GSAP state updates
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fogRef = useRef<THREE.FogExp2 | null>(null);
  const petalMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const starMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Secondary effect to transition properties when timeOfDay changes
  useEffect(() => {
    const preset = PRESETS[timeOfDay];
    if (!preset) return;

    // Transition Ambient Light
    if (ambientLightRef.current) {
      gsap.to(ambientLightRef.current.color, {
        r: new THREE.Color(preset.ambientColor).r,
        g: new THREE.Color(preset.ambientColor).g,
        b: new THREE.Color(preset.ambientColor).b,
        duration: 1.8,
        ease: "power2.out",
      });
      gsap.to(ambientLightRef.current, {
        intensity: preset.ambientIntensity,
        duration: 1.8,
        ease: "power2.out",
      });
    }

    // Transition Sun Light
    if (sunLightRef.current) {
      gsap.to(sunLightRef.current.color, {
        r: new THREE.Color(preset.sunColor).r,
        g: new THREE.Color(preset.sunColor).g,
        b: new THREE.Color(preset.sunColor).b,
        duration: 1.8,
        ease: "power2.out",
      });
      gsap.to(sunLightRef.current, {
        intensity: preset.sunIntensity,
        duration: 1.8,
        ease: "power2.out",
      });
      gsap.to(sunLightRef.current.position, {
        x: preset.sunPos[0],
        y: preset.sunPos[1],
        z: preset.sunPos[2],
        duration: 2.2,
        ease: "power2.out",
      });
    }

    // Transition Fog
    if (fogRef.current) {
      gsap.to(fogRef.current.color, {
        r: new THREE.Color(preset.fogColor).r,
        g: new THREE.Color(preset.fogColor).g,
        b: new THREE.Color(preset.fogColor).b,
        duration: 1.8,
        ease: "power2.out",
      });
    }

    // Transition Petal Material
    if (petalMatRef.current) {
      gsap.to(petalMatRef.current.color, {
        r: new THREE.Color(preset.petalColor).r,
        g: new THREE.Color(preset.petalColor).g,
        b: new THREE.Color(preset.petalColor).b,
        duration: 1.8,
        ease: "power2.out",
      });
    }

    // Transition Star Candy Material
    if (starMatRef.current) {
      gsap.to(starMatRef.current.color, {
        r: new THREE.Color(preset.starColor).r,
        g: new THREE.Color(preset.starColor).g,
        b: new THREE.Color(preset.starColor).b,
        duration: 1.8,
        ease: "power2.out",
      });
      gsap.to(starMatRef.current.emissive, {
        r: new THREE.Color(preset.starEmissive).r,
        g: new THREE.Color(preset.starEmissive).g,
        b: new THREE.Color(preset.starEmissive).b,
        duration: 1.8,
        ease: "power2.out",
      });
    }
  }, [timeOfDay]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Get current preset colors to initialize beautifully
    const initialPreset = PRESETS[timeOfDay];

    // --- SCENE & CAMERA SETUP ---
    const scene = new THREE.Scene();
    
    // Add fog to enhance the atmospheric depth (Miyazaki-esque sky glow)
    const fog = new THREE.FogExp2(initialPreset.fogColor, 0.015);
    scene.fog = fog;
    fogRef.current = fog;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Initial camera position (will be influenced by mouse parallax)
    camera.position.set(0, 3, 11);

    // --- WebGL RENDERER ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- LIGHTS (Miyazaki summer sunshine) ---
    // Warm, ambient sky light
    const ambientLight = new THREE.AmbientLight(initialPreset.ambientColor, initialPreset.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // High intensity warm sun light that casts beautiful shadows
    const sunLight = new THREE.DirectionalLight(initialPreset.sunColor, initialPreset.sunIntensity);
    sunLight.position.set(initialPreset.sunPos[0], initialPreset.sunPos[1], initialPreset.sunPos[2]);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Soft secondary light from the grass bounce
    const bounceLight = new THREE.DirectionalLight("#a2d149", 0.5);
    bounceLight.position.set(-10, -5, -8);
    scene.add(bounceLight);

    // --- SCENE GROUPS ---
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    const secondaryIslandGroup = new THREE.Group();
    secondaryIslandGroup.position.set(4.5, -1.8, -3);
    secondaryIslandGroup.scale.set(0.4, 0.4, 0.4);
    scene.add(secondaryIslandGroup);

    // --- MATERIALS (Anime hand-painted feel) ---
    const grassMaterial = new THREE.MeshStandardMaterial({
      color: "#6bb94c", // Saturated soft green
      roughness: 0.8,
      metalness: 0.1,
      shadowSide: THREE.DoubleSide,
    });

    const rockMaterial = new THREE.MeshStandardMaterial({
      color: "#8d6e63", // Warm terra-cotta brown
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true, // Gives low-poly faceted shading
    });

    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true,
    });

    // --- 1. BUILD FLOATING ISLAND ---
    // Main Meadow Top
    const meadowGeom = new THREE.CylinderGeometry(3.5, 3.7, 0.6, 16);
    const meadow = new THREE.Mesh(meadowGeom, grassMaterial);
    meadow.receiveShadow = true;
    islandGroup.add(meadow);

    // Low-poly Rock Bottom
    const rockGeom = new THREE.ConeGeometry(3.7, 4.5, 10);
    // Perturb vertices of the cone to make it look organic, rugged and hand-carved
    const pos = rockGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      if (y > 2.0) continue; // Keep top rim matching the cylinder
      
      const angle = Math.atan2(z, x);
      const noise = (Math.sin(angle * 4) + Math.cos(y * 3)) * 0.4;
      pos.setX(i, x + Math.cos(angle) * noise);
      pos.setZ(i, z + Math.sin(angle) * noise);
      pos.setY(i, y - Math.random() * 0.2); // make bottom point irregular
    }
    rockGeom.computeVertexNormals();

    const rockBottom = new THREE.Mesh(rockGeom, rockMaterial);
    rockBottom.position.y = -2.25;
    rockBottom.rotation.x = Math.PI; // Flip cone upside down
    rockBottom.castShadow = true;
    islandGroup.add(rockBottom);

    // --- BUILD SECONDARY MINI-ISLAND ---
    const secMeadow = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.2, 0.4, 10),
      grassMaterial
    );
    secondaryIslandGroup.add(secMeadow);

    const secRockGeom = new THREE.ConeGeometry(2.2, 3, 8);
    const secPos = secRockGeom.attributes.position;
    for (let i = 0; i < secPos.count; i++) {
      const x = secPos.getX(i);
      const y = secPos.getY(i);
      const z = secPos.getZ(i);
      if (y > 1.2) continue;
      const angle = Math.atan2(z, x);
      const noise = Math.sin(angle * 3) * 0.3;
      secPos.setX(i, x + Math.cos(angle) * noise);
      secPos.setZ(i, z + Math.sin(angle) * noise);
    }
    secRockGeom.computeVertexNormals();
    const secRock = new THREE.Mesh(secRockGeom, rockMaterial);
    secRock.position.y = -1.5;
    secRock.rotation.x = Math.PI;
    secondaryIslandGroup.add(secRock);

    // --- 2. GENERATE SWAYING GRASS & WILDFLOWERS ---
    const grasses: THREE.Group[] = [];
    const flowers: THREE.Group[] = [];

    // Grass geometry - simple flat triangle blade
    const grassBladeGeom = new THREE.ConeGeometry(0.04, 0.4, 3);
    grassBladeGeom.translate(0, 0.2, 0); // Offset pivot to bottom of blade

    const flowerStemGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 4);
    flowerStemGeom.translate(0, 0.15, 0);

    const flowerColors = ["#ef5350", "#fdd835", "#29b6f6", "#ffffff", "#ff8a65"];

    const scatterCount = 280;
    for (let i = 0; i < scatterCount; i++) {
      // Scatter within the top radius of main island
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 3.3; // slightly inside rim
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      const py = 0.3; // On top of the meadow

      if (Math.random() > 0.18) {
        // Create grass clump
        const grassClump = new THREE.Group();
        grassClump.position.set(px, py, pz);

        const bladeCount = 1 + Math.floor(Math.random() * 3);
        for (let b = 0; b < bladeCount; b++) {
          const bladeMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setStyle(Math.random() > 0.4 ? "#8cc63f" : "#a2d149"),
            roughness: 0.9,
            metalness: 0.0,
          });
          const blade = new THREE.Mesh(grassBladeGeom, bladeMat);
          // random scale
          const h = 0.5 + Math.random() * 0.7;
          blade.scale.set(1, h, 1);
          // random rotation/lean
          blade.rotation.set(
            (Math.random() - 0.5) * 0.3,
            Math.random() * Math.PI,
            (Math.random() - 0.5) * 0.3
          );
          grassClump.add(blade);
        }
        islandGroup.add(grassClump);
        grasses.push(grassClump);
      } else {
        // Create Wildflower
        const flowerGroup = new THREE.Group();
        flowerGroup.position.set(px, py, pz);

        // Stem
        const stemMat = new THREE.MeshStandardMaterial({ color: "#558b2f" });
        const stem = new THREE.Mesh(flowerStemGeom, stemMat);
        flowerGroup.add(stem);

        // Flower Head (Petals)
        const petalColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        const petalMat = new THREE.MeshStandardMaterial({
          color: petalColor,
          roughness: 0.8,
          flatShading: true,
        });

        const petalGeom = new THREE.SphereGeometry(0.06, 5, 5);
        const petalMesh = new THREE.Mesh(petalGeom, petalMat);
        petalMesh.position.y = 0.3; // Top of stem
        petalMesh.scale.set(1.4, 0.6, 1.4); // flat flower shape
        flowerGroup.add(petalMesh);

        // Small yellow center core
        if (petalColor !== "#fdd835") {
          const centerMat = new THREE.MeshStandardMaterial({ color: "#fdd835" });
          const centerGeom = new THREE.SphereGeometry(0.025, 4, 4);
          const centerMesh = new THREE.Mesh(centerGeom, centerMat);
          centerMesh.position.y = 0.33;
          flowerGroup.add(centerMesh);
        }

        // Random starting rotation/scale
        flowerGroup.scale.setScalar(0.7 + Math.random() * 0.6);
        flowerGroup.rotation.y = Math.random() * Math.PI;

        islandGroup.add(flowerGroup);
        flowers.push(flowerGroup);
      }
    }

    // Add a few flowers to secondary island too!
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * 1.8;
      const px = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      const py = 0.2;

      const flowerGroup = new THREE.Group();
      flowerGroup.position.set(px, py, pz);

      const stemMat = new THREE.MeshStandardMaterial({ color: "#558b2f" });
      const stem = new THREE.Mesh(flowerStemGeom, stemMat);
      flowerGroup.add(stem);

      const petalColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
      const petalMat = new THREE.MeshStandardMaterial({ color: petalColor, flatShading: true });
      const petalMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 5, 5), petalMat);
      petalMesh.position.y = 0.3;
      petalMesh.scale.set(1.4, 0.6, 1.4);
      flowerGroup.add(petalMesh);

      secondaryIslandGroup.add(flowerGroup);
      flowers.push(flowerGroup);
    }

    // --- 3. BEAUTIFUL PROCEDURAL WINDMILL ---
    // A classic Ghibli-style rustic windmill
    const windmillGroup = new THREE.Group();
    windmillGroup.position.set(-1.2, 0.3, -1.2); // Positioned nicely on the main island
    islandGroup.add(windmillGroup);

    // Windmill Body (Cone-cylinder base)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: "#faf3e0", // Antique white
      roughness: 0.9,
      flatShading: true,
    });
    const bodyGeom = new THREE.CylinderGeometry(0.3, 0.5, 1.6, 8);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;
    body.receiveShadow = true;
    windmillGroup.add(body);

    // Windmill Roof (Red cone)
    const roofMat = new THREE.MeshStandardMaterial({
      color: "#e57373", // Soft terracotta red
      roughness: 0.8,
      flatShading: true,
    });
    const roofGeom = new THREE.ConeGeometry(0.42, 0.6, 8);
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.position.y = 1.9;
    windmillGroup.add(roof);

    // Windmill Rotor Axis / Hub
    const hubMat = new THREE.MeshStandardMaterial({ color: "#795548", roughness: 0.9 });
    const hubGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 6);
    hubGeom.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeom, hubMat);
    hub.position.set(0, 1.5, 0.42);
    windmillGroup.add(hub);

    // Windmill Sails (Blades) Group
    const sailsGroup = new THREE.Group();
    sailsGroup.position.set(0, 1.5, 0.5);
    windmillGroup.add(sailsGroup);

    const sailWoodMat = new THREE.MeshStandardMaterial({ color: "#a1887f", roughness: 0.8 });
    const sailClothMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.9,
      side: THREE.DoubleSide,
    });

    // Create 4 sails
    for (let s = 0; s < 4; s++) {
      const sailPivot = new THREE.Group();
      sailPivot.rotation.z = (s * Math.PI) / 2;

      // Stick (Spoke)
      const stickGeom = new THREE.BoxGeometry(0.03, 1.2, 0.03);
      stickGeom.translate(0, 0.6, 0);
      const stick = new THREE.Mesh(stickGeom, sailWoodMat);
      sailPivot.add(stick);

      // Cloth panel (The sail)
      const clothGeom = new THREE.PlaneGeometry(0.2, 0.8);
      clothGeom.translate(0.08, 0.7, 0.01);
      const cloth = new THREE.Mesh(clothGeom, sailClothMat);
      cloth.rotation.y = 0.15; // angle to catch imaginary wind
      sailPivot.add(cloth);

      sailsGroup.add(sailPivot);
    }

    // Scale windmill up beautifully
    windmillGroup.scale.set(1.2, 1.2, 1.2);

    // --- 4. HUGE BACKDROP CLOUDS (Cumulonimbus 積雨雲) ---
    const cloudsGroup = new THREE.Group();
    scene.add(cloudsGroup);

    // Helper to build a majestic multi-sphere cloud
    function createFluffyCloud(x: number, y: number, z: number, scale = 1) {
      const cloud = new THREE.Group();
      cloud.position.set(x, y, z);
      cloud.scale.setScalar(scale);

      const sphereCount = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < sphereCount; i++) {
        // Fluffy clusters
        const r = 1.0 + Math.random() * 1.8;
        const geom = new THREE.SphereGeometry(r, 6, 6); // Low-poly count
        const mesh = new THREE.Mesh(geom, cloudMaterial);

        // Position spheres relative to center to form a puffy mountain
        const px = (Math.random() - 0.5) * r * 1.8;
        const py = Math.random() * r * 0.8;
        const pz = (Math.random() - 0.5) * r * 1.5;
        mesh.position.set(px, py, pz);
        cloud.add(mesh);
      }
      cloudsGroup.add(cloud);
      return cloud;
    }

    // Construct several massive summer clouds far in the back
    const mainCloud1 = createFluffyCloud(-8, 1.5, -12, 1.8);
    const mainCloud2 = createFluffyCloud(7, 2.5, -14, 2.2);
    const mainCloud3 = createFluffyCloud(-1, 4.0, -18, 2.8); // Towering thunderhead

    // Smaller, faster clouds in midground
    const driftCloud1 = createFluffyCloud(-15, -1.0, -8, 0.7);
    const driftCloud2 = createFluffyCloud(12, 0.5, -9, 0.9);

    const driftClouds = [
      { mesh: driftCloud1, speed: 0.003, resetX: -16, targetX: 18 },
      { mesh: driftCloud2, speed: 0.004, resetX: -18, targetX: 18 },
    ];

    // --- 5. DRIFTING CHERRY BLOSSOM PETALS (🌸 Petal Particles) ---
    const petalCount = 45;
    const petals: THREE.Mesh[] = [];
    
    const petalMat = new THREE.MeshStandardMaterial({
      color: initialPreset.petalColor,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    petalMatRef.current = petalMat;
    // Create soft irregular shape
    const petalGeom = new THREE.BoxGeometry(0.06, 0.01, 0.1);

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeom, petalMat);
      
      // Distribute in a large volume in front of camera
      petal.position.set(
        -8 + Math.random() * 18,
        -3 + Math.random() * 10,
        -4 + Math.random() * 10
      );
      
      petal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Custom attributes for drifting speed
      petal.userData = {
        speedX: 0.01 + Math.random() * 0.02,
        speedY: 0.006 + Math.random() * 0.01,
        speedZ: 0.003 + Math.random() * 0.005,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
      };

      scene.add(petal);
      petals.push(petal);
    }

    // --- 5.1 COAL SPRITE (Susuwatari / Soot Sprite) ---
    const sootSprite = new THREE.Group();

    // Body: Low poly dark grey fuzzy ball
    const sootBodyMat = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      roughness: 0.95,
      flatShading: true,
    });
    const sootBodyGeom = new THREE.IcosahedronGeometry(0.18, 1);
    const sootBody = new THREE.Mesh(sootBodyGeom, sootBodyMat);
    sootSprite.add(sootBody);

    // Eyes: Big white circles with pupils
    const eyeMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.9 });

    const eyeGeom = new THREE.SphereGeometry(0.06, 6, 6);
    eyeGeom.scale(1, 1, 0.4); // flattened
    const pupilGeom = new THREE.SphereGeometry(0.025, 6, 6);
    pupilGeom.scale(1, 1, 0.4);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
    leftEye.position.set(-0.06, 0.05, 0.15);
    leftEye.rotation.y = 0.2;
    const leftPupil = new THREE.Mesh(pupilGeom, pupilMat);
    leftPupil.position.set(-0.06, 0.05, 0.17);
    leftPupil.rotation.y = 0.2;
    sootSprite.add(leftEye);
    sootSprite.add(leftPupil);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
    rightEye.position.set(0.06, 0.05, 0.15);
    rightEye.rotation.y = -0.2;
    const rightPupil = new THREE.Mesh(pupilGeom, pupilMat);
    rightPupil.position.set(0.06, 0.05, 0.17);
    rightPupil.rotation.y = -0.2;
    sootSprite.add(rightEye);
    sootSprite.add(rightPupil);

    // Kompeito (Star Candy) that the sprite carries!
    const starMat = new THREE.MeshStandardMaterial({
      color: initialPreset.starColor,
      emissive: initialPreset.starEmissive,
      emissiveIntensity: 0.4,
      roughness: 0.6,
      flatShading: true,
    });
    starMatRef.current = starMat;
    const starGeom = new THREE.OctahedronGeometry(0.07, 0);
    const star = new THREE.Mesh(starGeom, starMat);
    star.position.set(0, -0.16, 0.12);
    sootSprite.add(star);

    scene.add(sootSprite);

    // --- 6. GSAP FLOATING BREATHING ANIMATION ---
    // Floating yoyo effect on Main Island (Slow and therapeutic)
    const floatAnim = gsap.to(islandGroup.position, {
      y: 0.35,
      duration: 5.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Secondary island floats out of phase to make it feel detached and magical
    const secFloatAnim = gsap.to(secondaryIslandGroup.position, {
      y: -1.6,
      duration: 4.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 1.2,
    });

    // Subtly float the main backdrop clouds for wind realism
    gsap.to(mainCloud1.position, {
      y: 1.8,
      duration: 12,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    gsap.to(mainCloud2.position, {
      y: 2.8,
      duration: 15,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });

    // Scale-in intro animation (grows beautifully from seeds)
    islandGroup.scale.set(0.01, 0.01, 0.01);
    secondaryIslandGroup.scale.set(0.01, 0.01, 0.01);
    
    gsap.to(islandGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2.2,
      ease: "elastic.out(1, 0.75)",
      delay: 0.2,
    });

    gsap.to(secondaryIslandGroup.scale, {
      x: 0.4,
      y: 0.4,
      z: 0.4,
      duration: 2.4,
      ease: "elastic.out(1, 0.75)",
      delay: 0.5,
    });

    // --- 6.1 SOOT SPRITE GSAP ANIMATIONS ---
    // Cute squishy bouncing hop
    const sootBounce = gsap.to(sootBody.scale, {
      y: 0.75,
      x: 1.15,
      z: 1.15,
      duration: 0.35,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    const sootHop = gsap.to(sootBody.position, {
      y: 0.2,
      duration: 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const starSpin = gsap.to(star.rotation, {
      y: Math.PI * 2,
      x: Math.PI,
      duration: 2.5,
      repeat: -1,
      ease: "none",
    });

    // --- 7. CAMERA PARALLAX MOUSE TRACKING ---
    const mouse = { x: 0, y: 0 };
    
    const onMouseMove = (e: MouseEvent) => {
      // Normalize coordinate from -1 to 1
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // --- 8. ANIMATION RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Windmill spinning blades
      sailsGroup.rotation.z += 0.015;

      // Grass swaying wave (using coordinates to offset waves)
      grasses.forEach((clump) => {
        // Multi-frequency wave for rich, organic motion
        const wave = Math.sin(time * 2.5 + clump.position.x * 1.2 + clump.position.z * 0.8) * 0.12;
        const subWave = Math.cos(time * 1.5 + clump.position.z * 1.5) * 0.04;
        clump.rotation.z = wave + subWave + 0.03; // slight permanent bend direction
        clump.rotation.x = Math.sin(time * 1.8 + clump.position.z * 1.0) * 0.05;
      });

      // Flowers swaying in the wind (slightly stiffer than grass)
      flowers.forEach((flower) => {
        flower.rotation.z = Math.sin(time * 2.0 + flower.position.x * 1.0 + flower.position.z * 0.6) * 0.08;
        flower.rotation.x = Math.cos(time * 1.4 + flower.position.z * 1.2) * 0.04;
      });

      // Drifting midground clouds
      driftClouds.forEach((cloudData) => {
        cloudData.mesh.position.x += cloudData.speed;
        if (cloudData.mesh.position.x > cloudData.targetX) {
          cloudData.mesh.position.x = cloudData.resetX;
          cloudData.mesh.position.y = -1.5 + Math.random() * 3.0; // randomize height on respawn
        }
      });

      // Drifting pink flower petals
      petals.forEach((p) => {
        p.position.x -= p.userData.speedX;
        p.position.y -= p.userData.speedY;
        p.position.z += p.userData.speedZ;
        
        // Swaying tumbling motion
        p.rotation.x += p.userData.rotSpeedX;
        p.rotation.y += p.userData.rotSpeedY;
        p.rotation.z += 0.01;

        // Reset if drifted too far
        if (p.position.x < -10 || p.position.y < -5 || p.position.z > 8) {
          p.position.set(
            8 + Math.random() * 8,
            2 + Math.random() * 6,
            -6 + Math.random() * 10
          );
        }
      });

      // --- 8.1 SOOT SPRITE ORBIT TRAJECTORY ---
      const orbitRadius = 5.2;
      const orbitSpeed = 0.45; // radians per second
      const angle = time * orbitSpeed;

      sootSprite.position.x = Math.cos(angle) * orbitRadius;
      sootSprite.position.z = Math.sin(angle) * orbitRadius;
      // High-altitude floating path with a slow sine wave vertical hover
      sootSprite.position.y = Math.sin(time * 1.8) * 0.35 + 0.4;

      // Face the soot sprite directly in the direction of orbital travel
      sootSprite.rotation.y = -angle + Math.PI / 2;

      // Parallax camera movement (Smooth LERP)
      // Standard camera pivot at (0, 3, 11)
      const targetCamX = mouse.x * 2.0;
      const targetCamY = 2.8 + mouse.y * 1.2;
      
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      
      // Make camera track slightly above center of island
      camera.lookAt(0, 0.4, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- 9. RESIZE HANDLER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      floatAnim.kill();
      secFloatAnim.kill();
      sootBounce.kill();
      sootHop.kill();
      starSpin.kill();
      
      container.removeChild(renderer.domElement);
      
      // Dispose Geometries and Materials to avoid memory leaks
      meadowGeom.dispose();
      rockGeom.dispose();
      secRockGeom.dispose();
      grassBladeGeom.dispose();
      flowerStemGeom.dispose();
      bodyGeom.dispose();
      roofGeom.dispose();
      hubGeom.dispose();
      petalGeom.dispose();
      sootBodyGeom.dispose();
      eyeGeom.dispose();
      pupilGeom.dispose();
      starGeom.dispose();
      
      grassMaterial.dispose();
      rockMaterial.dispose();
      cloudMaterial.dispose();
      bodyMat.dispose();
      roofMat.dispose();
      hubMat.dispose();
      sailWoodMat.dispose();
      sailClothMat.dispose();
      petalMat.dispose();
      sootBodyMat.dispose();
      eyeMat.dispose();
      pupilMat.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div
      id="3d-island-canvas-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
    />
  );
}
