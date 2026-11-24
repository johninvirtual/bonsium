import * as THREE from 'three';
import { createCausticsTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

export function createAquariumModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'aquarium_freshwater_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Sleek Cylindrical Glass Tank
	const tankGeo = new THREE.CylinderGeometry(1.35, 1.35, 2.2, 36, 1, true);
	disposables.push(tankGeo);
	const tankMat = new THREE.MeshPhysicalMaterial({
		color: 0xecfeff,
		transparent: true,
		opacity: 0.22,
		roughness: 0.04,
		metalness: 0.0,
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

	// Caustic Sandy Floor (Offset Y to eliminate z-fighting)
	const floorGeo = new THREE.CircleGeometry(1.3, 32);
	disposables.push(floorGeo);
	const causticsTex = createCausticsTexture();
	disposables.push(causticsTex);
	const floorMat = new THREE.MeshStandardMaterial({
		map: causticsTex,
		color: 0x0284c7,
		roughness: 0.8,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(floorMat);
	const floorMesh = new THREE.Mesh(floorGeo, floorMat);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -0.96;
	group.add(floorMesh);

	// 2. Animated Water Surface
	const waterGeo = new THREE.CircleGeometry(1.32, 32);
	disposables.push(waterGeo);
	const waterMat = new THREE.MeshStandardMaterial({
		color: 0x38bdf8,
		transparent: true,
		opacity: 0.35,
		roughness: 0.1
	});
	disposables.push(waterMat);
	const waterSurface = new THREE.Mesh(waterGeo, waterMat);
	waterSurface.rotation.x = -Math.PI / 2;
	waterSurface.position.y = 1.0;
	group.add(waterSurface);

	// 3. Aquarium Decorations: Driftwood & River Stones
	const woodMat = new THREE.MeshStandardMaterial({
		color: 0x3b2314,
		roughness: 0.9
	});
	disposables.push(woodMat);

	// Arching Bogwood branch
	const woodCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.6, -0.95, -0.3),
		new THREE.Vector3(-0.3, -0.6, -0.1),
		new THREE.Vector3(0.1, -0.4, 0.2),
		new THREE.Vector3(0.4, -0.7, 0.35),
		new THREE.Vector3(0.7, -0.95, 0.2)
	]);
	const woodGeo = new THREE.TubeGeometry(woodCurve, 24, 0.08, 8, false);
	disposables.push(woodGeo);
	const driftwood = new THREE.Mesh(woodGeo, woodMat);
	driftwood.castShadow = true;
	group.add(driftwood);

	// Decorative River Pebbles around driftwood
	const stoneMat = new THREE.MeshStandardMaterial({
		color: 0x475569,
		roughness: 0.6,
		flatShading: true
	});
	disposables.push(stoneMat);
	const stoneCoords = [
		{ x: -0.65, z: -0.35, s: 0.14 },
		{ x: -0.45, z: -0.4, s: 0.1 },
		{ x: 0.3, z: 0.45, s: 0.12 },
		{ x: 0.5, z: 0.25, s: 0.16 },
		{ x: -0.1, z: 0.5, s: 0.11 }
	];
	for (const s of stoneCoords) {
		const sGeo = new THREE.DodecahedronGeometry(s.s, 1);
		disposables.push(sGeo);
		const sMesh = new THREE.Mesh(sGeo, stoneMat);
		sMesh.position.set(s.x, -0.92, s.z);
		sMesh.rotation.set(Math.random(), Math.random(), Math.random());
		group.add(sMesh);
	}

	// 4. Aquarium Water Plants (Vallisneria swaying in current)
	const plantMat = new THREE.MeshStandardMaterial({
		color: 0x10b981,
		roughness: 0.45,
		side: THREE.DoubleSide
	});
	disposables.push(plantMat);

	interface SwayBlade {
		mesh: THREE.Mesh;
		baseAngle: number;
		height: number;
		speed: number;
		phase: number;
	}
	const plantBlades: SwayBlade[] = [];

	const plantClusters = [
		{ bx: -0.5, bz: -0.2, count: 6, maxH: 1.3 },
		{ bx: 0.4, bz: -0.4, count: 5, maxH: 1.1 },
		{ bx: -0.2, bz: 0.45, count: 5, maxH: 1.2 }
	];

	for (const cluster of plantClusters) {
		for (let i = 0; i < cluster.count; i++) {
			const bladeH = cluster.maxH * (0.7 + Math.random() * 0.4);
			const bladeGeo = new THREE.PlaneGeometry(0.06, bladeH, 1, 8);
			disposables.push(bladeGeo);
			bladeGeo.translate(0, bladeH / 2, 0);

			const blade = new THREE.Mesh(bladeGeo, plantMat);
			const offsetAngle = (i / cluster.count) * Math.PI * 2;
			const offR = Math.random() * 0.12;
			blade.position.set(
				cluster.bx + Math.cos(offsetAngle) * offR,
				-0.95,
				cluster.bz + Math.sin(offsetAngle) * offR
			);
			blade.rotation.y = offsetAngle;
			group.add(blade);

			plantBlades.push({
				mesh: blade,
				baseAngle: offsetAngle,
				height: bladeH,
				speed: 1.2 + Math.random() * 0.5,
				phase: Math.random() * Math.PI * 2
			});
		}
	}

	// 5. Schooling Tropical Fish (5 colorful species)
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
		{ color: 0x06b6d4, radius: 0.85, height: -0.1, speed: 0.8, phase: 0 }, // Neon Cyan
		{ color: 0xf97316, radius: 0.65, height: 0.3, speed: 1.1, phase: 1.5 }, // Mandarin Orange
		{ color: 0x10b981, radius: 0.75, height: -0.45, speed: 0.95, phase: 3.0 }, // Emerald
		{ color: 0xef4444, radius: 0.9, height: 0.1, speed: 0.75, phase: 4.2 }, // Ruby
		{ color: 0xeab308, radius: 0.55, height: -0.25, speed: 1.25, phase: 5.4 } // Golden
	];

	for (const config of fishConfigs) {
		const fishGroup = new THREE.Group();

		// Streamlined Fish Body
		const bodyGeo = new THREE.ConeGeometry(0.08, 0.32, 8);
		disposables.push(bodyGeo);
		bodyGeo.rotateZ(Math.PI / 2);
		const fishMat = new THREE.MeshStandardMaterial({
			color: config.color,
			roughness: 0.25,
			metalness: 0.35,
			emissive: config.color,
			emissiveIntensity: 0.15
		});
		disposables.push(fishMat);
		const bodyMesh = new THREE.Mesh(bodyGeo, fishMat);
		fishGroup.add(bodyMesh);

		// Articulated Tail Fin
		const tailGeo = new THREE.BufferGeometry();
		disposables.push(tailGeo);
		const tailVertices = new Float32Array([-0.16, 0, 0, -0.28, 0.08, 0, -0.28, -0.08, 0]);
		tailGeo.setAttribute('position', new THREE.BufferAttribute(tailVertices, 3));
		tailGeo.computeVertexNormals();
		const tailMesh = new THREE.Mesh(tailGeo, fishMat);
		fishGroup.add(tailMesh);

		group.add(fishGroup);
		fishes.push({
			group: fishGroup,
			tail: tailMesh,
			speed: config.speed,
			radius: config.radius,
			height: config.height,
			phase: config.phase
		});
	}

	// 6. Rising Aerator Air Bubbles
	const bubbleCount = 60;
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
		opacity: 0.7
	});
	disposables.push(bubbleMat);
	const bubbleSystem = new THREE.Points(bubbleGeo, bubbleMat);
	group.add(bubbleSystem);

	return {
		group,
		update: (time: number) => {
			// Water surface gentle ripple
			waterSurface.position.y = 1.0 + Math.sin(time * 2.0) * 0.015;

			// Aquatic plants swaying with underwater current
			for (const b of plantBlades) {
				const sway = Math.sin(time * b.speed + b.phase) * 0.15;
				b.mesh.rotation.z = sway;
			}

			// Fish swimming navigation and tail wag
			for (const fish of fishes) {
				const angle = time * fish.speed * 0.65 + fish.phase;
				const x = Math.cos(angle) * fish.radius;
				const z = Math.sin(angle) * fish.radius;
				const y = fish.height + Math.sin(time * 1.6 + fish.phase) * 0.08;

				fish.group.position.set(x, y, z);
				// Face direction of motion
				fish.group.rotation.y = -angle;

				// Tail wag
				fish.tail.rotation.y = Math.sin(time * 9.0 * fish.speed) * 0.45;
			}

			// Rising bubbles
			const pos = bubbleGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < bubbleCount; i++) {
				pos[i * 3 + 1] += 0.0075;
				pos[i * 3] += Math.sin(time * 2.5 + i) * 0.002;
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
