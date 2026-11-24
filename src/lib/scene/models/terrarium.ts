import * as THREE from 'three';
import { createMossTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Creates an organic, plush cushion moss dome with natural surface undulating mounds.
 */
function createMossCushionGeometry(
	radius: number,
	heightScale: number,
	noiseSeed: number
): THREE.BufferGeometry {
	const geo = new THREE.SphereGeometry(radius, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2);
	const pos = geo.attributes.position;
	const v = new THREE.Vector3();

	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		// Flatten sphere vertically
		v.y *= heightScale;

		// Add organic undulating bumps and micro-ridges
		const angle = Math.atan2(v.z, v.x);
		const dist = Math.sqrt(v.x * v.x + v.z * v.z);
		const bump =
			Math.sin(angle * 5 + noiseSeed) * 0.035 * (dist / radius) +
			Math.cos(v.y * 12 + noiseSeed) * 0.025;

		v.x += (v.x / (dist || 1)) * bump;
		v.z += (v.z / (dist || 1)) * bump;
		v.y += Math.abs(bump) * 0.5;

		pos.setXYZ(i, v.x, v.y, v.z);
	}

	geo.computeVertexNormals();
	return geo;
}

/**
 * Creates an authentic, fleshy spoon-shaped Echeveria succulent leaf.
 * Cupped concave upper surface, keeled convex lower surface, tapering to a pointed tip.
 */
function createSucculentLeafGeometry(
	length: number,
	width: number,
	arch: number
): THREE.BufferGeometry {
	const segmentsU = 10;
	const segmentsV = 6;
	const vertices: number[] = [];
	const indices: number[] = [];

	for (let u = 0; u <= segmentsU; u++) {
		const progressU = u / segmentsU; // 0 (base) to 1 (tip)
		// Leaf width profile: narrow base, wide middle, tapering to pointed apex
		const w = Math.sin(Math.pow(progressU, 0.6) * Math.PI) * width;
		// Gentle upward arch along length
		const y = progressU * length;
		const zOffset = -Math.sin(progressU * Math.PI * 0.6) * arch;

		for (let v = 0; v <= segmentsV; v++) {
			const progressV = (v / segmentsV - 0.5) * 2; // -1 to 1 across width
			const x = progressV * (w * 0.5);
			// Concave spoon hollow on upper surface
			const cup = -(1 - progressV * progressV) * (w * 0.28);
			vertices.push(x, y, zOffset + cup);
		}
	}

	const stride = segmentsV + 1;
	for (let u = 0; u < segmentsU; u++) {
		for (let v = 0; v < segmentsV; v++) {
			const a = u * stride + v;
			const b = (u + 1) * stride + v;
			const c = (u + 1) * stride + (v + 1);
			const d = u * stride + (v + 1);
			indices.push(a, b, d);
			indices.push(b, c, d);
		}
	}

	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	geo.setIndex(indices);
	geo.computeVertexNormals();
	return geo;
}

/**
 * Creates a raw hexagonal quartz crystal with a 6-sided faceted pyramidal termination.
 */
function createQuartzCrystalGroup(
	r: number,
	h: number,
	disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[],
	material: THREE.Material
): THREE.Group {
	const group = new THREE.Group();
	const shaftH = h * 0.72;
	const capH = h * 0.28;

	// Hexagonal Column Shaft
	const shaftGeo = new THREE.CylinderGeometry(r, r, shaftH, 6);
	disposables.push(shaftGeo);
	const shaft = new THREE.Mesh(shaftGeo, material);
	shaft.position.y = shaftH * 0.5;
	group.add(shaft);

	// Hexagonal Pyramid Termination
	const capGeo = new THREE.ConeGeometry(r, capH, 6);
	disposables.push(capGeo);
	const cap = new THREE.Mesh(capGeo, material);
	cap.position.y = shaftH + capH * 0.5;
	group.add(cap);

	return group;
}

/**
 * Living Moss, Succulent & Quartz Dome Terrarium.
 * Features organically sculpted Leucobryum velvet moss mounds, an authentic Echeveria rosette,
 * sparkling hexagonal quartz crystals, an inquisitive garden snail, drifting fireflies,
 * and a Victorian blown-glass apothecary cloche on a turned hardwood base.
 */
export function createTerrariumModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'terrarium_moss_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Turned Dark Walnut Hardwood Base Tray with Beveled Lip
	const woodBaseGeo = new THREE.CylinderGeometry(1.38, 1.42, 0.22, 40);
	disposables.push(woodBaseGeo);
	const woodBaseMat = new THREE.MeshStandardMaterial({
		color: 0x271912, // Rich dark walnut
		roughness: 0.45,
		metalness: 0.1
	});
	disposables.push(woodBaseMat);
	const woodBaseMesh = new THREE.Mesh(woodBaseGeo, woodBaseMat);
	woodBaseMesh.position.y = -1.16;
	group.add(woodBaseMesh);

	// Inset Cloche Ring Channel
	const ringGeo = new THREE.TorusGeometry(1.27, 0.04, 12, 36);
	disposables.push(ringGeo);
	const ringMesh = new THREE.Mesh(ringGeo, woodBaseMat);
	ringMesh.rotation.x = Math.PI / 2;
	ringMesh.position.y = -1.04;
	group.add(ringMesh);

	// 2. Layered Substrate Bedding (Eliminates z-fighting with distinct heights)
	// Lower Drainage Layer: Natural River Pebbles
	const pebbleGeo = new THREE.CylinderGeometry(1.22, 1.18, 0.16, 36);
	disposables.push(pebbleGeo);
	const pebbleMat = new THREE.MeshStandardMaterial({
		color: 0xb4b8c2,
		roughness: 0.65,
		flatShading: true
	});
	disposables.push(pebbleMat);
	const pebbleMesh = new THREE.Mesh(pebbleGeo, pebbleMat);
	pebbleMesh.position.y = -0.98;
	group.add(pebbleMesh);

	// Charcoal Filtration Layer
	const charcoalGeo = new THREE.CylinderGeometry(1.23, 1.22, 0.12, 36);
	disposables.push(charcoalGeo);
	const charcoalMat = new THREE.MeshStandardMaterial({
		color: 0x1c1917,
		roughness: 0.95
	});
	disposables.push(charcoalMat);
	const charcoalMesh = new THREE.Mesh(charcoalGeo, charcoalMat);
	charcoalMesh.position.y = -0.84;
	group.add(charcoalMesh);

	// Rich Forest Peat & Humus Soil Topography
	const mossTex = createMossTexture();
	disposables.push(mossTex);
	const soilGeo = new THREE.CylinderGeometry(1.24, 1.23, 0.18, 36);
	disposables.push(soilGeo);
	const soilMat = new THREE.MeshStandardMaterial({
		map: mossTex,
		color: 0x142b17,
		roughness: 0.85,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(soilMat);
	const soilMesh = new THREE.Mesh(soilGeo, soilMat);
	soilMesh.position.y = -0.7;
	group.add(soilMesh);

	// 3. Plush Velvet Leucobryum Cushion Moss Mounds
	const mossMatDeep = new THREE.MeshStandardMaterial({
		color: 0x166534, // Rich deep forest moss
		roughness: 0.8,
		flatShading: true
	});
	disposables.push(mossMatDeep);

	const mossMatSpring = new THREE.MeshStandardMaterial({
		color: 0x22c55e, // Fresh vibrant spring moss
		roughness: 0.75,
		flatShading: true
	});
	disposables.push(mossMatSpring);

	const mossMatGolden = new THREE.MeshStandardMaterial({
		color: 0x4ade80, // Sunlit chartreuse moss
		roughness: 0.7,
		flatShading: true
	});
	disposables.push(mossMatGolden);

	const mossConfigs = [
		{ x: -0.48, z: 0.42, r: 0.44, sy: 0.58, mat: mossMatDeep, seed: 1.2 },
		{ x: 0.55, z: -0.32, r: 0.48, sy: 0.52, mat: mossMatSpring, seed: 3.4 },
		{ x: -0.42, z: -0.48, r: 0.38, sy: 0.65, mat: mossMatDeep, seed: 5.6 },
		{ x: 0.36, z: 0.52, r: 0.36, sy: 0.62, mat: mossMatGolden, seed: 2.1 },
		{ x: -0.05, z: 0.62, r: 0.28, sy: 0.5, mat: mossMatSpring, seed: 4.8 }
	];

	for (const m of mossConfigs) {
		const moundGeo = createMossCushionGeometry(m.r, m.sy, m.seed);
		disposables.push(moundGeo);
		const mound = new THREE.Mesh(moundGeo, m.mat);
		mound.position.set(m.x, -0.61, m.z);
		group.add(mound);
	}

	// 4. Botanical Echeveria Succulent Rosette
	const succulentMat = new THREE.MeshStandardMaterial({
		color: 0x10b981, // Jade green
		roughness: 0.38,
		metalness: 0.05,
		side: THREE.DoubleSide
	});
	disposables.push(succulentMat);

	const leafCount = 28;
	const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
	const succulentGroup = new THREE.Group();
	succulentGroup.position.set(0.06, -0.6, -0.02);

	for (let i = 0; i < leafCount; i++) {
		const t = i / leafCount; // 0 (outermost, largest) to 1 (innermost, smallest)
		const angle = i * goldenAngle;
		const distance = (1 - Math.pow(t, 0.7)) * 0.42 + 0.05;
		const leafLength = 0.32 * (1 - t * 0.55);
		const leafWidth = 0.16 * (1 - t * 0.55);
		const leafArch = 0.12 * (1 - t * 0.4);

		const leafGeo = createSucculentLeafGeometry(leafLength, leafWidth, leafArch);
		disposables.push(leafGeo);
		const leaf = new THREE.Mesh(leafGeo, succulentMat);

		// Position on rosette dome
		const yHeight = Math.pow(t, 0.8) * 0.22;
		leaf.position.set(Math.cos(angle) * distance, yHeight, Math.sin(angle) * distance);

		// Rotation: outward flare at bottom, cupped tight at center
		const outwardTilt = (1 - t) * 0.65 + 0.15;
		leaf.rotation.x = outwardTilt;
		leaf.rotation.y = angle + Math.PI / 2;
		succulentGroup.add(leaf);
	}
	group.add(succulentGroup);

	// 5. Raw Hexagonal Quartz Crystals
	const crystalMat = new THREE.MeshPhysicalMaterial({
		color: 0xf0fdf4,
		emissive: 0xa7f3d0,
		emissiveIntensity: 0.2,
		roughness: 0.08,
		transmission: 0.85,
		ior: 1.54, // Real quartz refractive index
		transparent: true,
		opacity: 0.92
	});
	disposables.push(crystalMat);

	const crystalConfigs = [
		{ x: -0.45, z: 0.08, h: 0.46, r: 0.075, rx: 0.14, rz: -0.22 },
		{ x: -0.38, z: 0.18, h: 0.36, r: 0.06, rx: -0.12, rz: 0.28 },
		{ x: -0.52, z: 0.22, h: 0.28, r: 0.05, rx: 0.22, rz: -0.1 },
		{ x: -0.32, z: 0.04, h: 0.22, r: 0.045, rx: -0.2, rz: -0.18 }
	];

	for (const c of crystalConfigs) {
		const cGroup = createQuartzCrystalGroup(c.r, c.h, disposables, crystalMat);
		cGroup.position.set(c.x, -0.61, c.z);
		cGroup.rotation.set(c.rx, 0, c.rz);
		group.add(cGroup);
	}

	// 6. Anatomically Detailed Miniature Garden Snail (Cepaea nemoralis)
	const snailGroup = new THREE.Group();
	snailGroup.position.set(0.48, -0.58, 0.26);
	snailGroup.scale.set(0.65, 0.65, 0.65);

	// Banded Helicoid Spiral Shell
	const shellMat = new THREE.MeshStandardMaterial({
		color: 0xd97706, // Warm amber/honey shell
		roughness: 0.5,
		metalness: 0.05
	});
	disposables.push(shellMat);

	const shellGeo = new THREE.TorusGeometry(0.12, 0.075, 14, 24);
	disposables.push(shellGeo);
	const shellMesh = new THREE.Mesh(shellGeo, shellMat);
	shellMesh.position.set(0, 0.14, 0);
	shellMesh.rotation.y = Math.PI / 4;
	shellMesh.rotation.z = 0.2;
	snailGroup.add(shellMesh);

	// Inner Spiral Whorl
	const innerWhorlGeo = new THREE.TorusGeometry(0.06, 0.04, 10, 18);
	disposables.push(innerWhorlGeo);
	const innerWhorl = new THREE.Mesh(innerWhorlGeo, shellMat);
	innerWhorl.position.set(0.03, 0.14, 0.03);
	innerWhorl.rotation.y = Math.PI / 4;
	snailGroup.add(innerWhorl);

	// Fleshy Translucent Muscular Foot
	const footMat = new THREE.MeshStandardMaterial({
		color: 0xfef9c3, // Soft creamy ivory
		roughness: 0.42,
		transparent: true,
		opacity: 0.92
	});
	disposables.push(footMat);

	const footGeo = new THREE.CylinderGeometry(0.045, 0.07, 0.3, 10);
	disposables.push(footGeo);
	footGeo.rotateX(Math.PI / 2);
	const footMesh = new THREE.Mesh(footGeo, footMat);
	footMesh.position.set(0.08, 0.035, 0);
	snailGroup.add(footMesh);

	// Eye Tentacles (Ommatophores) with Dark Eyespots
	const eyeStalks: THREE.Mesh[] = [];
	const eyeMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
	disposables.push(eyeMat);

	for (let i = 0; i < 2; i++) {
		const stalkGeo = new THREE.CylinderGeometry(0.009, 0.014, 0.11, 8);
		disposables.push(stalkGeo);
		const stalk = new THREE.Mesh(stalkGeo, footMat);
		stalk.position.set(0.2, 0.09, (i - 0.5) * 0.05);
		stalk.rotation.z = -0.4;
		stalk.rotation.x = (i - 0.5) * 0.15;
		snailGroup.add(stalk);
		eyeStalks.push(stalk);

		const tipGeo = new THREE.SphereGeometry(0.015, 8, 8);
		disposables.push(tipGeo);
		const tip = new THREE.Mesh(tipGeo, eyeMat);
		tip.position.set(0.23, 0.14, (i - 0.5) * 0.05);
		snailGroup.add(tip);
	}
	group.add(snailGroup);

	// 7. Drifting Golden Fireflies & Spore Motes
	const fireflyCount = 5;
	const fireflyGroup = new THREE.Group();
	const fireflies: {
		mesh: THREE.Mesh;
		light: THREE.PointLight;
		basePos: THREE.Vector3;
		phase: number;
	}[] = [];

	const fireflyMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
	disposables.push(fireflyMat);

	const fireflyOffsets = [
		new THREE.Vector3(-0.35, 0.3, 0.3),
		new THREE.Vector3(0.4, 0.55, -0.2),
		new THREE.Vector3(-0.25, 0.75, -0.35),
		new THREE.Vector3(0.28, 0.25, 0.42),
		new THREE.Vector3(0.0, 0.9, 0.1)
	];

	for (let i = 0; i < fireflyCount; i++) {
		const fGeo = new THREE.SphereGeometry(0.026, 8, 8);
		disposables.push(fGeo);
		const fMesh = new THREE.Mesh(fGeo, fireflyMat);

		const fLight = new THREE.PointLight(0xfacc15, 0.65, 1.4);
		fMesh.add(fLight);
		fireflyGroup.add(fMesh);

		fireflies.push({
			mesh: fMesh,
			light: fLight,
			basePos: fireflyOffsets[i],
			phase: i * 1.4
		});
	}
	group.add(fireflyGroup);

	// 8. Blown-Glass Apothecary Bell Cloche with Top Finial Loop
	const glassMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.22,
		roughness: 0.03,
		metalness: 0.0,
		transmission: 0.95,
		ior: 1.48, // Real soda-lime glass
		thickness: 0.15
	});
	disposables.push(glassMat);

	// Main Cylindrical Glass Wall
	const clocheWallGeo = new THREE.CylinderGeometry(1.25, 1.25, 2.1, 40, 1, true);
	disposables.push(clocheWallGeo);
	const clocheWall = new THREE.Mesh(clocheWallGeo, glassMat);
	clocheWall.position.y = 0.15;
	group.add(clocheWall);

	// Elegant Hemispherical Dome Cap
	const domeCapGeo = new THREE.SphereGeometry(1.25, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
	disposables.push(domeCapGeo);
	const domeCap = new THREE.Mesh(domeCapGeo, glassMat);
	domeCap.position.y = 1.2;
	group.add(domeCap);

	// Crystal Glass Finial Sphere Handle on Top
	const finialGeo = new THREE.SphereGeometry(0.12, 16, 16);
	disposables.push(finialGeo);
	const finialMesh = new THREE.Mesh(finialGeo, glassMat);
	finialMesh.position.y = 2.5;
	group.add(finialMesh);

	const finialStemGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.1, 16);
	disposables.push(finialStemGeo);
	const finialStem = new THREE.Mesh(finialStemGeo, glassMat);
	finialStem.position.y = 2.42;
	group.add(finialStem);

	// 9. Rising Humid Morning Mist Particles
	const mistCount = 60;
	const mistGeo = new THREE.BufferGeometry();
	disposables.push(mistGeo);
	const mistPos = new Float32Array(mistCount * 3);

	for (let i = 0; i < mistCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 0.92;
		mistPos[i * 3] = Math.cos(angle) * r;
		mistPos[i * 3 + 1] = -0.5 + Math.random() * 2.2;
		mistPos[i * 3 + 2] = Math.sin(angle) * r;
	}
	mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));

	const mistMat = new THREE.PointsMaterial({
		color: 0x6ee7b7,
		size: 0.042,
		transparent: true,
		opacity: 0.45
	});
	disposables.push(mistMat);
	const mistPoints = new THREE.Points(mistGeo, mistMat);
	group.add(mistPoints);

	return {
		group,
		update: (time: number) => {
			// Succulent gentle breathing rotation
			succulentGroup.rotation.y = time * 0.05;

			// Snail slow crawl animation along moss terrain
			const snailAngle = time * 0.2;
			const snailX = 0.46 + Math.cos(snailAngle) * 0.08;
			const snailZ = 0.26 + Math.sin(snailAngle) * 0.08;
			snailGroup.position.x = snailX;
			snailGroup.position.z = snailZ;
			snailGroup.rotation.y = -snailAngle + Math.PI / 2;

			// Snail eye tentacles gentle inquisitive sensory movement
			for (let i = 0; i < eyeStalks.length; i++) {
				eyeStalks[i].rotation.z = -0.4 + Math.sin(time * 1.8 + i) * 0.1;
			}

			// Fireflies hovering and softly pulsating
			for (const f of fireflies) {
				const hoverX = f.basePos.x + Math.sin(time * 1.1 + f.phase) * 0.12;
				const hoverY = f.basePos.y + Math.cos(time * 1.4 + f.phase) * 0.08;
				const hoverZ = f.basePos.z + Math.sin(time * 0.8 + f.phase) * 0.1;
				f.mesh.position.set(hoverX, hoverY, hoverZ);
				const pulse = 0.45 + Math.sin(time * 3.2 + f.phase) * 0.35;
				f.light.intensity = pulse;
			}

			// Gentle rising mist
			const pos = mistGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < mistCount; i++) {
				pos[i * 3 + 1] += 0.003;
				pos[i * 3] += Math.sin(time * 1.6 + i) * 0.0015;
				if (pos[i * 3 + 1] > 2.2) {
					pos[i * 3 + 1] = -0.55;
				}
			}
			mistGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
