import * as THREE from 'three';
import { createWoodTexture, createMossTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Creates a delicate 5-lobed Sakura cherry blossom flower geometry with notched petals.
 */
function createSakuraPetalClusterGeometry(radius: number): THREE.BufferGeometry {
	const geo = new THREE.BufferGeometry();
	const vertices: number[] = [];
	const indices: number[] = [];
	const petals = 5;

	// Center vertex
	vertices.push(0, 0, 0);

	let vertIdx = 1;
	for (let p = 0; p < petals; p++) {
		const angle = (p / petals) * Math.PI * 2;
		const halfSpan = (Math.PI * 2) / petals / 2;

		// 3 vertices per petal: left curve, notched tip, right curve
		const a1 = angle - halfSpan * 0.75;
		const a2 = angle;
		const a3 = angle + halfSpan * 0.75;

		const rOuter = radius;
		const rNotch = radius * 0.85;

		// Petal vertices with slight cupping (curved Z)
		vertices.push(Math.cos(a1) * rOuter, Math.sin(a1) * rOuter, 0.015);
		vertices.push(Math.cos(a2) * rNotch, Math.sin(a2) * rNotch, 0.025);
		vertices.push(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter, 0.015);

		// Triangle 1: center to left, tip
		indices.push(0, vertIdx, vertIdx + 1);
		// Triangle 2: center to tip, right
		indices.push(0, vertIdx + 1, vertIdx + 2);

		vertIdx += 3;
	}

	geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	geo.setIndex(indices);
	geo.computeVertexNormals();
	return geo;
}

/**
 * Creates a billowing, multi-tiered cherry blossom foliage cloud.
 * Combines branching twig supports with layered clusters of fluttering pink blossoms.
 */
function createSakuraCanopyGroup(
	size: number,
	petalMat: THREE.Material,
	twigMat: THREE.Material,
	disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): THREE.Group {
	const canopyGroup = new THREE.Group();

	// Supporting fine twigs
	const twigCount = 4;
	for (let i = 0; i < twigCount; i++) {
		const a = (i / twigCount) * Math.PI * 2 + Math.random() * 0.4;
		const tCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, -0.15, 0),
			new THREE.Vector3(Math.cos(a) * size * 0.4, 0.05, Math.sin(a) * size * 0.4),
			new THREE.Vector3(Math.cos(a) * size * 0.85, 0.12, Math.sin(a) * size * 0.85)
		]);
		const tGeo = new THREE.TubeGeometry(tCurve, 8, 0.022, 5, false);
		disposables.push(tGeo);
		const tMesh = new THREE.Mesh(tGeo, twigMat);
		canopyGroup.add(tMesh);
	}

	// Layered blossom clusters covering the canopy
	const floretGeo = createSakuraPetalClusterGeometry(0.14 * size);
	disposables.push(floretGeo);

	const clusterCount = 38;
	for (let i = 0; i < clusterCount; i++) {
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		const r = Math.pow(Math.random(), 0.5) * size;

		const x = r * Math.sin(phi) * Math.cos(theta);
		const y = Math.abs(r * Math.cos(phi)) * 0.48; // Flattened canopy dome
		const z = r * Math.sin(phi) * Math.sin(theta);

		const floretMesh = new THREE.Mesh(floretGeo, petalMat);
		floretMesh.position.set(x, y, z);
		floretMesh.rotation.set(
			Math.random() * Math.PI,
			Math.random() * Math.PI,
			Math.random() * Math.PI
		);
		const s = 0.8 + Math.random() * 0.5;
		floretMesh.scale.set(s, s, s);
		canopyGroup.add(floretMesh);
	}

	return canopyGroup;
}

/**
 * Flowering Sakura Cherry Blossom Bonsai.
 * Features an S-curved weathered trunk, glazed celadon ceramic pot with drainage feet,
 * billowing cherry blossom petal clouds, and fluttering pink sakura petals.
 */
export function createBonsaiSakuraModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'bonsai_sakura_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Authentic Glazed Celadon / Cream Porcelain Oval Pot with Feet
	const potMat = new THREE.MeshPhysicalMaterial({
		color: 0xf8fafc,
		roughness: 0.18,
		metalness: 0.05,
		clearcoat: 0.85,
		clearcoatRoughness: 0.12
	});
	disposables.push(potMat);

	// Oval pot body
	const potGeo = new THREE.CylinderGeometry(1.65, 1.25, 0.52, 36);
	disposables.push(potGeo);
	const potMesh = new THREE.Mesh(potGeo, potMat);
	potMesh.scale.set(1.18, 1, 0.84); // Traditional oval ratio
	potMesh.position.y = -1.2;
	potMesh.castShadow = true;
	potMesh.receiveShadow = true;
	group.add(potMesh);

	// Recurved Rim Lip
	const rimGeo = new THREE.TorusGeometry(1.68, 0.065, 12, 36);
	disposables.push(rimGeo);
	const rimMesh = new THREE.Mesh(rimGeo, potMat);
	rimMesh.scale.set(1.18, 0.84, 1);
	rimMesh.rotation.x = Math.PI / 2;
	rimMesh.position.y = -0.94;
	group.add(rimMesh);

	// 4 Traditional Museum Drainage Feet
	const footGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.12, 12);
	disposables.push(footGeo);
	const footOffsets = [
		{ x: -1.05, z: 0.45 },
		{ x: 1.05, z: 0.45 },
		{ x: -1.05, z: -0.45 },
		{ x: 1.05, z: -0.45 }
	];
	for (const f of footOffsets) {
		const foot = new THREE.Mesh(footGeo, potMat);
		foot.position.set(f.x, -1.48, f.z);
		group.add(foot);
	}

	// Soil Layer with Velvety Moss Bedding
	const soilGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.1, 36);
	disposables.push(soilGeo);
	const mossTex = createMossTexture();
	disposables.push(mossTex);
	const soilMat = new THREE.MeshStandardMaterial({
		map: mossTex,
		color: 0x1e3a1e,
		roughness: 0.88,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(soilMat);
	const soilMesh = new THREE.Mesh(soilGeo, soilMat);
	soilMesh.scale.set(1.16, 1, 0.82);
	soilMesh.position.y = -0.91;
	soilMesh.receiveShadow = true;
	group.add(soilMesh);

	// 2. Weathered S-Curved Cherry Blossom Trunk (Moyogi Style)
	const woodTex = createWoodTexture();
	disposables.push(woodTex);
	const barkMat = new THREE.MeshStandardMaterial({
		map: woodTex,
		color: 0x451a03, // Warm dark cherry bark
		roughness: 0.85
	});
	disposables.push(barkMat);

	// Flaring Nebari surface roots
	const nebariGroup = new THREE.Group();
	nebariGroup.position.set(0, -0.91, 0);
	for (let i = 0; i < 5; i++) {
		const a = (i / 5) * Math.PI * 2;
		const rCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 0.1, 0),
			new THREE.Vector3(Math.cos(a) * 0.32, 0.04, Math.sin(a) * 0.32),
			new THREE.Vector3(Math.cos(a) * 0.65, -0.02, Math.sin(a) * 0.65)
		]);
		const rGeo = new THREE.TubeGeometry(rCurve, 10, 0.055, 6, false);
		disposables.push(rGeo);
		const rMesh = new THREE.Mesh(rGeo, barkMat);
		nebariGroup.add(rMesh);
	}
	group.add(nebariGroup);

	// Elegant sinuous trunk
	const trunkCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0.08, -0.91, 0.0),
		new THREE.Vector3(-0.16, -0.45, 0.06),
		new THREE.Vector3(0.24, 0.12, -0.08),
		new THREE.Vector3(-0.2, 0.72, 0.1),
		new THREE.Vector3(0.06, 1.25, -0.04)
	]);
	const trunkGeo = new THREE.TubeGeometry(trunkCurve, 32, 0.18, 12, false);
	disposables.push(trunkGeo);
	const trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
	trunkMesh.castShadow = true;
	group.add(trunkMesh);

	// Primary Structural Branches
	const branchConfigs = [
		[
			new THREE.Vector3(0.18, 0.18, -0.05),
			new THREE.Vector3(0.75, 0.42, 0.16),
			new THREE.Vector3(1.22, 0.62, 0.28)
		],
		[
			new THREE.Vector3(-0.16, 0.48, 0.08),
			new THREE.Vector3(-0.68, 0.72, -0.15),
			new THREE.Vector3(-1.18, 0.92, -0.22)
		],
		[
			new THREE.Vector3(0.02, 0.98, -0.02),
			new THREE.Vector3(0.48, 1.2, -0.22),
			new THREE.Vector3(0.88, 1.32, -0.32)
		]
	];

	for (const pts of branchConfigs) {
		const bCurve = new THREE.CatmullRomCurve3(pts);
		const bGeo = new THREE.TubeGeometry(bCurve, 16, 0.075, 8, false);
		disposables.push(bGeo);
		const bMesh = new THREE.Mesh(bGeo, barkMat);
		bMesh.castShadow = true;
		group.add(bMesh);
	}

	// 3. Billowing Sakura Cherry Blossom Foliage Canopies
	const petalMat = new THREE.MeshStandardMaterial({
		color: 0xfbcfe8, // Soft sakura pink
		roughness: 0.45,
		side: THREE.DoubleSide
	});
	disposables.push(petalMat);

	const deepPetalMat = new THREE.MeshStandardMaterial({
		color: 0xf472b6, // Rich rose sakura center
		roughness: 0.48,
		side: THREE.DoubleSide
	});
	disposables.push(deepPetalMat);

	const canopyPads: { group: THREE.Group; phase: number }[] = [];
	const canopyConfigs = [
		{ pos: new THREE.Vector3(0.06, 1.38, -0.04), size: 0.88, mat: petalMat },
		{ pos: new THREE.Vector3(1.25, 0.68, 0.28), size: 0.72, mat: deepPetalMat },
		{ pos: new THREE.Vector3(-1.22, 0.98, -0.22), size: 0.76, mat: petalMat },
		{ pos: new THREE.Vector3(0.9, 1.38, -0.32), size: 0.58, mat: deepPetalMat },
		{ pos: new THREE.Vector3(-0.48, 1.26, 0.28), size: 0.54, mat: petalMat }
	];

	for (let i = 0; i < canopyConfigs.length; i++) {
		const cfg = canopyConfigs[i];
		const cGroup = createSakuraCanopyGroup(cfg.size, cfg.mat, barkMat, disposables);
		cGroup.position.copy(cfg.pos);
		group.add(cGroup);
		canopyPads.push({ group: cGroup, phase: i * 1.2 });
	}

	// 4. Drifting Fluttering Sakura Petals in the Breeze
	const petalCount = 75;
	const petalGeo = new THREE.BufferGeometry();
	disposables.push(petalGeo);
	const petalPositions = new Float32Array(petalCount * 3);

	for (let i = 0; i < petalCount; i++) {
		petalPositions[i * 3] = (Math.random() - 0.5) * 3.4;
		petalPositions[i * 3 + 1] = Math.random() * 2.8 - 0.5;
		petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 3.4;
	}
	petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

	const particlePetalMat = new THREE.PointsMaterial({
		color: 0xf472b6,
		size: 0.055,
		transparent: true,
		opacity: 0.85
	});
	disposables.push(particlePetalMat);
	const petalSystem = new THREE.Points(petalGeo, particlePetalMat);
	group.add(petalSystem);

	return {
		group,
		update: (time: number) => {
			// Blossom canopies gentle breathing flutter
			for (const pad of canopyPads) {
				pad.group.rotation.y = Math.sin(time * 0.7 + pad.phase) * 0.025;
				pad.group.position.y += Math.sin(time * 1.2 + pad.phase) * 0.0006;
			}

			// Drifting falling sakura petals
			const pos = petalGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < petalCount; i++) {
				pos[i * 3 + 1] -= 0.0045; // Gentle downward flutter
				pos[i * 3] += Math.sin(time * 1.5 + i) * 0.0025;
				pos[i * 3 + 2] += Math.cos(time * 1.2 + i) * 0.002;

				if (pos[i * 3 + 1] < -0.92) {
					pos[i * 3 + 1] = 2.2;
					pos[i * 3] = (Math.random() - 0.5) * 3.2;
					pos[i * 3 + 2] = (Math.random() - 0.5) * 3.2;
				}
			}
			petalGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
