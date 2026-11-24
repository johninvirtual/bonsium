import * as THREE from 'three';
import { createWoodTexture, createMossTexture } from '#lib/scene/textures/procedural-textures';

export interface BiosphereModel {
	group: THREE.Group;
	update: (time: number) => void;
	dispose: () => void;
}

export function createBonsaiModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'bonsai_pine_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Ceramic Pot (Traditional Japanese Unglazed Clay)
	const potGeo = new THREE.CylinderGeometry(1.65, 1.25, 0.65, 36);
	disposables.push(potGeo);
	const potMat = new THREE.MeshStandardMaterial({
		color: 0x242825,
		roughness: 0.55,
		metalness: 0.1
	});
	disposables.push(potMat);
	const potMesh = new THREE.Mesh(potGeo, potMat);
	potMesh.position.y = -1.22;
	potMesh.castShadow = true;
	potMesh.receiveShadow = true;
	group.add(potMesh);

	// Pot Lip Rim
	const lipGeo = new THREE.TorusGeometry(1.66, 0.09, 16, 36);
	disposables.push(lipGeo);
	const lipMesh = new THREE.Mesh(lipGeo, potMat);
	lipMesh.rotation.x = Math.PI / 2;
	lipMesh.position.y = -0.92;
	group.add(lipMesh);

	// Ceramic Pot Drainage Feet (Traditional 4 Corner Feet)
	for (let i = 0; i < 4; i++) {
		const footGeo = new THREE.BoxGeometry(0.25, 0.1, 0.25);
		disposables.push(footGeo);
		const foot = new THREE.Mesh(footGeo, potMat);
		const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
		foot.position.set(Math.cos(angle) * 1.15, -1.57, Math.sin(angle) * 1.15);
		group.add(foot);
	}

	// Soil Layer (Raised slightly, with polygonOffset to prevent z-fighting)
	const soilGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.12, 36);
	disposables.push(soilGeo);
	const mossTex = createMossTexture();
	disposables.push(mossTex);
	const soilMat = new THREE.MeshStandardMaterial({
		map: mossTex,
		roughness: 0.92,
		color: 0x1f3b25,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(soilMat);
	const soilMesh = new THREE.Mesh(soilGeo, soilMat);
	soilMesh.position.y = -0.87;
	soilMesh.receiveShadow = true;
	group.add(soilMesh);

	// Moss mounds on the soil surface
	const moundMat = new THREE.MeshStandardMaterial({
		color: 0x2d6a4f,
		roughness: 0.75,
		flatShading: true
	});
	disposables.push(moundMat);
	const moundCoords = [
		{ x: -0.8, z: 0.4, r: 0.28, sy: 0.4 },
		{ x: 0.7, z: -0.5, r: 0.32, sy: 0.35 },
		{ x: -0.3, z: -0.7, r: 0.24, sy: 0.45 },
		{ x: 0.6, z: 0.6, r: 0.26, sy: 0.38 }
	];
	for (const m of moundCoords) {
		const mGeo = new THREE.SphereGeometry(m.r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
		disposables.push(mGeo);
		const mound = new THREE.Mesh(mGeo, moundMat);
		mound.position.set(m.x, -0.85, m.z);
		mound.scale.set(1, m.sy, 1);
		mound.receiveShadow = true;
		group.add(mound);
	}

	// Small zen pebbles on soil
	const pebbleMat = new THREE.MeshStandardMaterial({
		color: 0x64748b,
		roughness: 0.6,
		flatShading: true
	});
	disposables.push(pebbleMat);
	const pebbleLocations = [
		{ x: 0.9, z: 0.3, s: 0.12 },
		{ x: 0.82, z: 0.45, s: 0.08 },
		{ x: -0.65, z: -0.35, s: 0.14 }
	];
	for (const p of pebbleLocations) {
		const pGeo = new THREE.DodecahedronGeometry(p.s, 1);
		disposables.push(pGeo);
		const pebble = new THREE.Mesh(pGeo, pebbleMat);
		pebble.position.set(p.x, -0.83, p.z);
		pebble.rotation.set(Math.random(), Math.random(), Math.random());
		group.add(pebble);
	}

	// 2. Gnarled Pine Trunk & Branches
	const woodTex = createWoodTexture();
	disposables.push(woodTex);
	const barkMat = new THREE.MeshStandardMaterial({
		map: woodTex,
		roughness: 0.88,
		metalness: 0.04
	});
	disposables.push(barkMat);

	// Main curved trunk
	const trunkCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -0.86, 0),
		new THREE.Vector3(0.18, -0.4, 0.08),
		new THREE.Vector3(-0.25, 0.15, -0.08),
		new THREE.Vector3(0.35, 0.75, 0.15),
		new THREE.Vector3(0.08, 1.38, 0.0)
	]);
	const trunkGeo = new THREE.TubeGeometry(trunkCurve, 36, 0.22, 14, false);
	disposables.push(trunkGeo);
	const trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
	trunkMesh.castShadow = true;
	group.add(trunkMesh);

	// Exposed aerial root flare (Nebari)
	const rootCurves = [
		[new THREE.Vector3(0, -0.8, 0), new THREE.Vector3(0.35, -0.86, 0.2)],
		[new THREE.Vector3(0, -0.8, 0), new THREE.Vector3(-0.32, -0.86, 0.15)],
		[new THREE.Vector3(0, -0.8, 0), new THREE.Vector3(-0.1, -0.86, -0.3)]
	];
	for (const pts of rootCurves) {
		const c = new THREE.CatmullRomCurve3(pts);
		const rGeo = new THREE.TubeGeometry(c, 8, 0.08, 8, false);
		disposables.push(rGeo);
		const rMesh = new THREE.Mesh(rGeo, barkMat);
		group.add(rMesh);
	}

	// Primary Branches
	const branchConfigs = [
		{
			pts: [
				new THREE.Vector3(-0.15, 0.25, -0.05),
				new THREE.Vector3(-0.65, 0.45, 0.1),
				new THREE.Vector3(-1.15, 0.65, 0.18)
			],
			radius: 0.1
		},
		{
			pts: [
				new THREE.Vector3(0.25, 0.68, 0.12),
				new THREE.Vector3(0.85, 0.88, -0.08),
				new THREE.Vector3(1.25, 1.05, -0.12)
			],
			radius: 0.09
		},
		{
			pts: [
				new THREE.Vector3(-0.05, 0.95, 0.05),
				new THREE.Vector3(-0.4, 1.15, -0.25),
				new THREE.Vector3(-0.7, 1.25, -0.35)
			],
			radius: 0.07
		}
	];

	for (const b of branchConfigs) {
		const curve = new THREE.CatmullRomCurve3(b.pts);
		const bGeo = new THREE.TubeGeometry(curve, 18, b.radius, 10, false);
		disposables.push(bGeo);
		const bMesh = new THREE.Mesh(bGeo, barkMat);
		bMesh.castShadow = true;
		group.add(bMesh);
	}

	// 3. Layered Pine Needle Cloud Pads
	const foliageMat = new THREE.MeshStandardMaterial({
		color: 0x1e5a38,
		roughness: 0.68,
		metalness: 0.04,
		flatShading: true
	});
	disposables.push(foliageMat);

	const foliageGroup = new THREE.Group();
	const foliagePads: THREE.Mesh[] = [];
	const padCoords = [
		{ pos: new THREE.Vector3(0.08, 1.48, 0), scale: new THREE.Vector3(0.85, 0.35, 0.75) },
		{ pos: new THREE.Vector3(-1.18, 0.72, 0.18), scale: new THREE.Vector3(0.65, 0.28, 0.58) },
		{ pos: new THREE.Vector3(1.28, 1.12, -0.12), scale: new THREE.Vector3(0.72, 0.3, 0.62) },
		{ pos: new THREE.Vector3(-0.72, 1.28, -0.35), scale: new THREE.Vector3(0.55, 0.25, 0.48) },
		{ pos: new THREE.Vector3(0.5, 1.25, 0.2), scale: new THREE.Vector3(0.48, 0.22, 0.42) }
	];

	for (const pad of padCoords) {
		// Multi-layered flattened dome for natural Japanese pine cloud pads
		const padGeo = new THREE.SphereGeometry(0.75, 16, 12);
		disposables.push(padGeo);
		const padMesh = new THREE.Mesh(padGeo, foliageMat);
		padMesh.position.copy(pad.pos);
		padMesh.scale.copy(pad.scale);
		padMesh.castShadow = true;
		foliageGroup.add(padMesh);
		foliagePads.push(padMesh);
	}
	group.add(foliageGroup);

	// 4. Shimmering Forest Pollen / Pine Dust Particles
	const pollenCount = 75;
	const pollenGeo = new THREE.BufferGeometry();
	disposables.push(pollenGeo);
	const pollenPositions = new Float32Array(pollenCount * 3);
	const pollenVelocities: { x: number; y: number; z: number }[] = [];

	for (let i = 0; i < pollenCount; i++) {
		pollenPositions[i * 3] = (Math.random() - 0.5) * 2.8;
		pollenPositions[i * 3 + 1] = Math.random() * 2.6 - 0.6;
		pollenPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
		pollenVelocities.push({
			x: (Math.random() - 0.5) * 0.003,
			y: 0.002 + Math.random() * 0.003,
			z: (Math.random() - 0.5) * 0.003
		});
	}
	pollenGeo.setAttribute('position', new THREE.BufferAttribute(pollenPositions, 3));

	const pollenMat = new THREE.PointsMaterial({
		color: 0x86efac, // Fresh soft green
		size: 0.045,
		transparent: true,
		opacity: 0.75
	});
	disposables.push(pollenMat);
	const pollenSystem = new THREE.Points(pollenGeo, pollenMat);
	group.add(pollenSystem);

	return {
		group,
		update: (time: number) => {
			// Subtle wind sway on foliage pads
			for (let i = 0; i < foliagePads.length; i++) {
				const pad = foliagePads[i];
				pad.rotation.y = Math.sin(time * 0.7 + i * 1.2) * 0.05;
				pad.position.y = padCoords[i].pos.y + Math.sin(time * 1.1 + i) * 0.015;
			}

			// Gentle drift of pollen particles
			const pos = pollenGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < pollenCount; i++) {
				pos[i * 3] += Math.sin(time * 0.8 + i) * 0.002 + pollenVelocities[i].x;
				pos[i * 3 + 1] += pollenVelocities[i].y;
				pos[i * 3 + 2] += Math.cos(time * 0.8 + i) * 0.002 + pollenVelocities[i].z;

				// Loop particles back to bottom
				if (pos[i * 3 + 1] > 2.2) {
					pos[i * 3 + 1] = -0.7;
					pos[i * 3] = (Math.random() - 0.5) * 2.4;
					pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
				}
			}
			pollenGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
