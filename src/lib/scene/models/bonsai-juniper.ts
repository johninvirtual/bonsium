import * as THREE from 'three';
import { createWoodTexture, createMossTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Windswept Juniper Bonsai (Fukinagashi).
 * Features a muscular, twisted Shimpaku juniper trunk with spiraling living bark
 * and carved bleached deadwood (Shari & Jin), cascading tiered needle clouds,
 * and a natural slate slab container with moss and accent stones.
 */
export function createBonsaiJuniperModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'bonsai_juniper_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Hand-carved Natural Slate Stone Slab Container
	const slabGeo = new THREE.CylinderGeometry(1.7, 1.55, 0.32, 28);
	disposables.push(slabGeo);
	const slabMat = new THREE.MeshStandardMaterial({
		color: 0x1f242d,
		roughness: 0.8,
		metalness: 0.1
	});
	disposables.push(slabMat);
	const slabMesh = new THREE.Mesh(slabGeo, slabMat);
	slabMesh.scale.set(1.25, 1, 0.78);
	slabMesh.position.y = -1.15;
	slabMesh.castShadow = true;
	slabMesh.receiveShadow = true;
	group.add(slabMesh);

	// Slab drainage feet
	for (let i = 0; i < 4; i++) {
		const footGeo = new THREE.BoxGeometry(0.22, 0.08, 0.22);
		disposables.push(footGeo);
		const foot = new THREE.Mesh(footGeo, slabMat);
		const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
		foot.position.set(Math.cos(a) * 1.3, -1.35, Math.sin(a) * 0.85);
		group.add(foot);
	}

	// Mounded Rocky Soil Layer
	const soilGeo = new THREE.CylinderGeometry(1.6, 1.5, 0.14, 28);
	disposables.push(soilGeo);
	const mossTex = createMossTexture();
	disposables.push(mossTex);
	const soilMat = new THREE.MeshStandardMaterial({
		map: mossTex,
		color: 0x1e3625,
		roughness: 0.9,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(soilMat);
	const soilMesh = new THREE.Mesh(soilGeo, soilMat);
	soilMesh.scale.set(1.22, 1, 0.75);
	soilMesh.position.y = -0.96;
	soilMesh.receiveShadow = true;
	group.add(soilMesh);

	// Moss mounding on the windward side
	const mossMat = new THREE.MeshStandardMaterial({
		color: 0x22c55e,
		roughness: 0.7,
		flatShading: true
	});
	disposables.push(mossMat);
	const mossCoords = [
		{ x: -0.9, z: 0.2, r: 0.35, sy: 0.4 },
		{ x: -0.5, z: -0.25, r: 0.3, sy: 0.35 },
		{ x: 0.8, z: 0.15, r: 0.28, sy: 0.3 }
	];
	for (const m of mossCoords) {
		const mGeo = new THREE.SphereGeometry(m.r, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2);
		disposables.push(mGeo);
		const mound = new THREE.Mesh(mGeo, mossMat);
		mound.position.set(m.x, -0.94, m.z);
		mound.scale.set(1, m.sy, 1);
		group.add(mound);
	}

	// 2. Weathered Red-Brown Living Bark Material (Fibrous & muscular)
	const woodTex = createWoodTexture();
	disposables.push(woodTex);
	const barkMat = new THREE.MeshStandardMaterial({
		map: woodTex,
		color: 0x3d2117,
		roughness: 0.85,
		metalness: 0.05
	});
	disposables.push(barkMat);

	// Bleached Deadwood (Shari & Jin) Ivory Driftwood Material
	const deadwoodMat = new THREE.MeshStandardMaterial({
		color: 0xede8df,
		roughness: 0.6,
		metalness: 0.08
	});
	disposables.push(deadwoodMat);

	// Muscular Main Trunk: Leaning horizontally under constant alpine wind
	const trunkCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.95, -0.95, 0),
		new THREE.Vector3(-0.7, -0.55, 0.08),
		new THREE.Vector3(-0.35, -0.15, -0.05),
		new THREE.Vector3(0.15, 0.15, 0.1),
		new THREE.Vector3(0.75, 0.35, 0.02),
		new THREE.Vector3(1.35, 0.48, -0.05)
	]);
	const trunkGeo = new THREE.TubeGeometry(trunkCurve, 40, 0.17, 14, false);
	disposables.push(trunkGeo);
	const trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
	trunkMesh.castShadow = true;
	group.add(trunkMesh);

	// Anchoring Root Nebari gripping into the stone
	const rootCoords = [
		[new THREE.Vector3(-0.95, -0.85, 0), new THREE.Vector3(-1.3, -0.96, 0.25)],
		[new THREE.Vector3(-0.95, -0.85, 0), new THREE.Vector3(-1.15, -0.96, -0.28)]
	];
	for (const pts of rootCoords) {
		const c = new THREE.CatmullRomCurve3(pts);
		const rGeo = new THREE.TubeGeometry(c, 10, 0.09, 8, false);
		disposables.push(rGeo);
		const rMesh = new THREE.Mesh(rGeo, barkMat);
		group.add(rMesh);
	}

	// Carved Bleached Shari Deadwood Ribbon (spiraling along trunk contour)
	const shariCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.9, -0.8, 0.08),
		new THREE.Vector3(-0.55, -0.35, 0.14),
		new THREE.Vector3(-0.1, -0.05, 0.05),
		new THREE.Vector3(0.4, 0.22, 0.15),
		new THREE.Vector3(1.0, 0.4, 0.08)
	]);
	const shariGeo = new THREE.TubeGeometry(shariCurve, 30, 0.075, 10, false);
	disposables.push(shariGeo);
	const shariMesh = new THREE.Mesh(shariGeo, deadwoodMat);
	group.add(shariMesh);

	// Spire Jin Deadwood Spike (Bleached wind-broken apex pointing with the wind)
	const jinCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(1.35, 0.48, -0.05),
		new THREE.Vector3(1.68, 0.58, -0.08)
	]);
	const jinGeo = new THREE.TubeGeometry(jinCurve, 12, 0.06, 8, false);
	disposables.push(jinGeo);
	const jinMesh = new THREE.Mesh(jinGeo, deadwoodMat);
	group.add(jinMesh);

	// Secondary Jin on branch stubs
	const subJinCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.35, -0.15, -0.05),
		new THREE.Vector3(-0.2, 0.1, -0.22)
	]);
	const subJinGeo = new THREE.TubeGeometry(subJinCurve, 8, 0.045, 6, false);
	disposables.push(subJinGeo);
	const subJinMesh = new THREE.Mesh(subJinGeo, deadwoodMat);
	group.add(subJinMesh);

	// Trailing Branch Framework
	const branches = [
		[
			new THREE.Vector3(0.2, 0.15, 0.05),
			new THREE.Vector3(0.7, 0.22, -0.2),
			new THREE.Vector3(1.2, 0.25, -0.25)
		],
		[
			new THREE.Vector3(0.75, 0.35, 0.02),
			new THREE.Vector3(1.25, 0.42, 0.18),
			new THREE.Vector3(1.6, 0.44, 0.22)
		],
		[
			new THREE.Vector3(-0.2, -0.05, 0.02),
			new THREE.Vector3(0.25, 0.02, 0.16),
			new THREE.Vector3(0.75, 0.08, 0.22)
		]
	];
	for (const pts of branches) {
		const curve = new THREE.CatmullRomCurve3(pts);
		const bGeo = new THREE.TubeGeometry(curve, 16, 0.07, 8, false);
		disposables.push(bGeo);
		const bMesh = new THREE.Mesh(bGeo, barkMat);
		bMesh.castShadow = true;
		group.add(bMesh);
	}

	// 3. Realistic Tiered Juniper Needle Foliage Clouds
	const foliageDarkMat = new THREE.MeshStandardMaterial({
		color: 0x064e3b, // Deep interior shadow foliage
		roughness: 0.7,
		flatShading: true
	});
	disposables.push(foliageDarkMat);

	const foliageLightMat = new THREE.MeshStandardMaterial({
		color: 0x059669, // Bright windward tips
		roughness: 0.65,
		flatShading: true
	});
	disposables.push(foliageLightMat);

	const foliageGroup = new THREE.Group();
	const foliagePads: THREE.Mesh[] = [];

	const padConfigs = [
		// Apex trailing pad
		{
			pos: new THREE.Vector3(1.65, 0.48, 0.08),
			scale: new THREE.Vector3(0.75, 0.25, 0.5),
			mat: foliageLightMat
		},
		// Mid right branch pad
		{
			pos: new THREE.Vector3(1.3, 0.26, -0.22),
			scale: new THREE.Vector3(0.65, 0.22, 0.44),
			mat: foliageDarkMat
		},
		// Lower forward trailing pad
		{
			pos: new THREE.Vector3(1.58, 0.42, 0.25),
			scale: new THREE.Vector3(0.6, 0.2, 0.4),
			mat: foliageLightMat
		},
		// Mid central pad
		{
			pos: new THREE.Vector3(0.85, 0.12, 0.22),
			scale: new THREE.Vector3(0.55, 0.18, 0.38),
			mat: foliageDarkMat
		},
		// Leftward resilient pad
		{
			pos: new THREE.Vector3(0.3, 0.18, -0.15),
			scale: new THREE.Vector3(0.48, 0.16, 0.32),
			mat: foliageLightMat
		}
	];

	for (const p of padConfigs) {
		// Flattened layered dome geometry characteristic of Japanese pine/juniper pads
		const padGeo = new THREE.SphereGeometry(0.72, 14, 10);
		disposables.push(padGeo);
		const pad = new THREE.Mesh(padGeo, p.mat);
		pad.position.copy(p.pos);
		pad.scale.copy(p.scale);
		pad.castShadow = true;
		foliageGroup.add(pad);
		foliagePads.push(pad);
	}
	group.add(foliageGroup);

	// 4. Shimmering Mountain Pollen & Alpine Air Particles
	const particleCount = 65;
	const particleGeo = new THREE.BufferGeometry();
	disposables.push(particleGeo);
	const particlePos = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i++) {
		particlePos[i * 3] = (Math.random() - 0.5) * 3.4;
		particlePos[i * 3 + 1] = -0.4 + Math.random() * 2.0;
		particlePos[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
	}
	particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

	const particleMat = new THREE.PointsMaterial({
		color: 0xa7f3d0,
		size: 0.04,
		transparent: true,
		opacity: 0.75
	});
	disposables.push(particleMat);
	const particles = new THREE.Points(particleGeo, particleMat);
	group.add(particles);

	return {
		group,
		update: (time: number) => {
			// Windswept pads fluttering with high-frequency gust vibration
			for (let i = 0; i < foliagePads.length; i++) {
				const pad = foliagePads[i];
				const flutter = Math.sin(time * 3.5 + i * 2.0) * 0.03;
				pad.rotation.z = flutter;
				pad.position.y = padConfigs[i].pos.y + Math.sin(time * 2.2 + i) * 0.012;
			}

			// Wind gust particles streaming rapidly horizontally
			const pos = particleGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < particleCount; i++) {
				pos[i * 3] += 0.022; // Swift horizontal drift
				pos[i * 3 + 1] += Math.sin(time * 2 + i) * 0.002;
				pos[i * 3 + 2] += Math.cos(time * 2 + i) * 0.001;

				if (pos[i * 3] > 2.2) {
					pos[i * 3] = -2.2;
					pos[i * 3 + 1] = -0.4 + Math.random() * 2.0;
				}
			}
			particleGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
