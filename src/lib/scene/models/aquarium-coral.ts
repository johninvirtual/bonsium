import * as THREE from 'three';
import { createCausticsTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Coral Reef Lagoon Aquarium.
 * Features branching staghorn corals, sea anemone, tropical clownfish & blue tangs,
 * white reef sand, and submerged caustic lighting.
 */
export function createAquariumCoralModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'aquarium_coral_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Cylindrical Glass Tank
	const tankGeo = new THREE.CylinderGeometry(1.35, 1.35, 2.2, 36, 1, true);
	disposables.push(tankGeo);
	const tankMat = new THREE.MeshPhysicalMaterial({
		color: 0xe0f2fe,
		transparent: true,
		opacity: 0.22,
		roughness: 0.04,
		transmission: 0.92,
		ior: 1.333
	});
	disposables.push(tankMat);
	const tankMesh = new THREE.Mesh(tankGeo, tankMat);
	tankMesh.position.y = 0.1;
	group.add(tankMesh);

	// Tank Base
	const baseGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 36);
	disposables.push(baseGeo);
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x0f172a,
		roughness: 0.55,
		metalness: 0.2
	});
	disposables.push(baseMat);
	const baseMesh = new THREE.Mesh(baseGeo, baseMat);
	baseMesh.position.y = -1.1;
	group.add(baseMesh);

	// White Coral Sand Floor
	const floorGeo = new THREE.CircleGeometry(1.3, 32);
	disposables.push(floorGeo);
	const causticsTex = createCausticsTexture();
	disposables.push(causticsTex);
	const floorMat = new THREE.MeshStandardMaterial({
		map: causticsTex,
		color: 0x38bdf8,
		roughness: 0.75,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(floorMat);
	const floorMesh = new THREE.Mesh(floorGeo, floorMat);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -0.96;
	group.add(floorMesh);

	// Water Surface
	const waterGeo = new THREE.CircleGeometry(1.32, 32);
	disposables.push(waterGeo);
	const waterMat = new THREE.MeshStandardMaterial({
		color: 0x0ea5e9,
		transparent: true,
		opacity: 0.35,
		roughness: 0.1
	});
	disposables.push(waterMat);
	const waterSurface = new THREE.Mesh(waterGeo, waterMat);
	waterSurface.rotation.x = -Math.PI / 2;
	waterSurface.position.y = 1.0;
	group.add(waterSurface);

	// 2. Branching Staghorn Corals (Vivid coral pink/red)
	const staghornMat = new THREE.MeshStandardMaterial({
		color: 0xf43f5e,
		roughness: 0.65,
		flatShading: true
	});
	disposables.push(staghornMat);

	const staghornBranches = [
		[
			new THREE.Vector3(-0.4, -0.95, -0.2),
			new THREE.Vector3(-0.45, -0.6, -0.2),
			new THREE.Vector3(-0.55, -0.3, -0.15)
		],
		[new THREE.Vector3(-0.45, -0.6, -0.2), new THREE.Vector3(-0.25, -0.4, -0.25)],
		[new THREE.Vector3(-0.55, -0.3, -0.15), new THREE.Vector3(-0.7, -0.1, -0.1)]
	];
	for (const pts of staghornBranches) {
		const curve = new THREE.CatmullRomCurve3(pts);
		const bGeo = new THREE.TubeGeometry(curve, 10, 0.055, 6, false);
		disposables.push(bGeo);
		const bMesh = new THREE.Mesh(bGeo, staghornMat);
		group.add(bMesh);
	}

	// Purple Tiered Shelf / Brain Coral
	const shelfMat = new THREE.MeshStandardMaterial({
		color: 0x9333ea,
		roughness: 0.55,
		flatShading: true
	});
	disposables.push(shelfMat);
	const shelfCoords = [
		{ x: 0.45, y: -0.75, z: 0.25, r: 0.35 },
		{ x: 0.5, y: -0.58, z: 0.22, r: 0.26 },
		{ x: 0.42, y: -0.42, z: 0.28, r: 0.18 }
	];
	for (const s of shelfCoords) {
		const sGeo = new THREE.CylinderGeometry(s.r, s.r * 0.85, 0.06, 16);
		disposables.push(sGeo);
		const sMesh = new THREE.Mesh(sGeo, shelfMat);
		sMesh.position.set(s.x, s.y, s.z);
		sMesh.rotation.z = 0.15;
		group.add(sMesh);
	}

	// 3. Waving Sea Anemone (Center-left)
	const anemoneMat = new THREE.MeshStandardMaterial({
		color: 0x2dd4bf,
		roughness: 0.4
	});
	disposables.push(anemoneMat);

	const tentacleCount = 18;
	const tentacles: { mesh: THREE.Mesh; angle: number; r: number; phase: number }[] = [];
	const anemoneGroup = new THREE.Group();
	anemoneGroup.position.set(-0.1, -0.92, 0.35);

	for (let i = 0; i < tentacleCount; i++) {
		const angle = (i / tentacleCount) * Math.PI * 2;
		const r = 0.08 + Math.random() * 0.12;
		const tGeo = new THREE.ConeGeometry(0.025, 0.32, 5);
		disposables.push(tGeo);
		tGeo.translate(0, 0.16, 0);

		const tMesh = new THREE.Mesh(tGeo, anemoneMat);
		tMesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
		anemoneGroup.add(tMesh);
		tentacles.push({ mesh: tMesh, angle, r, phase: Math.random() * Math.PI * 2 });
	}
	group.add(anemoneGroup);

	// 4. Tropical Reef Fishes (Clownfish & Blue Tangs)
	interface FishData {
		group: THREE.Group;
		tail: THREE.Mesh;
		speed: number;
		radius: number;
		height: number;
		phase: number;
	}

	const fishes: FishData[] = [];
	const fishConfigs = [
		{ color: 0xf97316, radius: 0.72, height: -0.15, speed: 0.9, phase: 0 }, // Clownfish Orange
		{ color: 0x2563eb, radius: 0.88, height: 0.25, speed: 1.15, phase: 1.8 }, // Blue Tang
		{ color: 0xfbbf24, radius: 0.62, height: -0.4, speed: 0.85, phase: 3.5 }, // Yellow Tang
		{ color: 0xf43f5e, radius: 0.8, height: 0.05, speed: 1.0, phase: 4.8 } // Coral Fairy Basslet
	];

	for (const config of fishConfigs) {
		const fGroup = new THREE.Group();

		const bodyGeo = new THREE.ConeGeometry(0.085, 0.3, 8);
		disposables.push(bodyGeo);
		bodyGeo.rotateZ(Math.PI / 2);
		const fMat = new THREE.MeshStandardMaterial({
			color: config.color,
			roughness: 0.25,
			metalness: 0.25,
			emissive: config.color,
			emissiveIntensity: 0.18
		});
		disposables.push(fMat);
		const bodyMesh = new THREE.Mesh(bodyGeo, fMat);
		fGroup.add(bodyMesh);

		const tailGeo = new THREE.BufferGeometry();
		disposables.push(tailGeo);
		const tailVertices = new Float32Array([-0.15, 0, 0, -0.26, 0.07, 0, -0.26, -0.07, 0]);
		tailGeo.setAttribute('position', new THREE.BufferAttribute(tailVertices, 3));
		tailGeo.computeVertexNormals();
		const tailMesh = new THREE.Mesh(tailGeo, fMat);
		fGroup.add(tailMesh);

		group.add(fGroup);
		fishes.push({
			group: fGroup,
			tail: tailMesh,
			speed: config.speed,
			radius: config.radius,
			height: config.height,
			phase: config.phase
		});
	}

	// 5. Rising Micro Bubbles
	const bubbleCount = 55;
	const bubbleGeo = new THREE.BufferGeometry();
	disposables.push(bubbleGeo);
	const bubblePos = new Float32Array(bubbleCount * 3);

	for (let i = 0; i < bubbleCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 0.75;
		bubblePos[i * 3] = Math.cos(angle) * r;
		bubblePos[i * 3 + 1] = -0.9 + Math.random() * 1.85;
		bubblePos[i * 3 + 2] = Math.sin(angle) * r;
	}
	bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePos, 3));

	const bubbleMat = new THREE.PointsMaterial({
		color: 0xbae6fd,
		size: 0.045,
		transparent: true,
		opacity: 0.75
	});
	disposables.push(bubbleMat);
	const bubbleSystem = new THREE.Points(bubbleGeo, bubbleMat);
	group.add(bubbleSystem);

	return {
		group,
		update: (time: number) => {
			// Water surface ripple
			waterSurface.position.y = 1.0 + Math.sin(time * 2.0) * 0.015;

			// Anemone tentacles undulating in current
			for (const t of tentacles) {
				t.mesh.rotation.x = Math.sin(time * 2.2 + t.phase) * 0.2;
				t.mesh.rotation.z = Math.cos(time * 1.8 + t.phase) * 0.15;
			}

			// Fishes swimming
			for (const fish of fishes) {
				const angle = time * fish.speed * 0.65 + fish.phase;
				const x = Math.cos(angle) * fish.radius;
				const z = Math.sin(angle) * fish.radius;
				const y = fish.height + Math.sin(time * 1.8 + fish.phase) * 0.07;

				fish.group.position.set(x, y, z);
				fish.group.rotation.y = -angle;
				fish.tail.rotation.y = Math.sin(time * 9.5 * fish.speed) * 0.45;
			}

			// Rising bubbles
			const pos = bubbleGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < bubbleCount; i++) {
				pos[i * 3 + 1] += 0.0075;
				pos[i * 3] += Math.sin(time * 2.2 + i) * 0.002;
				if (pos[i * 3 + 1] > 0.98) {
					pos[i * 3 + 1] = -0.94;
				}
			}
			bubbleGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
