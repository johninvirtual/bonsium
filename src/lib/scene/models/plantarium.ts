import * as THREE from 'three';
import { createPetalGradientTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Creates a smooth, curved concave spoon-shaped lotus petal.
 */
function createLotusPetalGeometry(width: number, length: number): THREE.BufferGeometry {
	const segmentsU = 10;
	const segmentsV = 14;
	const vertices: number[] = [];
	const uvs: number[] = [];
	const indices: number[] = [];

	for (let j = 0; j <= segmentsV; j++) {
		const v = j / segmentsV; // from base (0) to tip (1)
		// Petal profile width: narrow at base, widest at ~0.55, curving to rounded tip
		const profileWidth = Math.sin(Math.pow(v, 0.65) * Math.PI) * width;
		// Curvature along length (arching outward and upward)
		const arch = Math.sin(v * Math.PI * 0.85) * 0.12;

		for (let i = 0; i <= segmentsU; i++) {
			const u = i / segmentsU;
			const x = (u - 0.5) * profileWidth;
			const y = v * length;
			// Spoon concavity (cupped inward)
			const cup = -Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * (width * 0.35);
			const z = arch + cup;

			vertices.push(x, y, z);
			uvs.push(u, v);
		}
	}

	for (let j = 0; j < segmentsV; j++) {
		for (let i = 0; i < segmentsU; i++) {
			const a = j * (segmentsU + 1) + i;
			const b = (j + 1) * (segmentsU + 1) + i;
			const c = (j + 1) * (segmentsU + 1) + (i + 1);
			const d = j * (segmentsU + 1) + (i + 1);
			indices.push(a, b, d);
			indices.push(b, c, d);
		}
	}

	const geo = new THREE.BufferGeometry();
	geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	geo.setIndex(indices);
	geo.computeVertexNormals();
	return geo;
}

export function createPlantariumModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'plantarium_lotus_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Ceramic Dish Pedestal (Handcrafted Celadon & Slate)
	const dishGeo = new THREE.CylinderGeometry(1.6, 1.1, 0.44, 36);
	disposables.push(dishGeo);
	const dishMat = new THREE.MeshStandardMaterial({
		color: 0x1e293b,
		roughness: 0.35,
		metalness: 0.12
	});
	disposables.push(dishMat);
	const dishMesh = new THREE.Mesh(dishGeo, dishMat);
	dishMesh.position.y = -1.1;
	group.add(dishMesh);

	// Water / Basin (Offset Y to eliminate z-fighting)
	const basinGeo = new THREE.CircleGeometry(1.52, 36);
	disposables.push(basinGeo);
	const basinMat = new THREE.MeshStandardMaterial({
		color: 0x064e3b,
		roughness: 0.08,
		metalness: 0.25,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(basinMat);
	const basinMesh = new THREE.Mesh(basinGeo, basinMat);
	basinMesh.rotation.x = -Math.PI / 2;
	basinMesh.position.y = -0.87;
	group.add(basinMesh);

	// 2. Broad Floating Sacred Lily Pads with Natural Radial Veins
	const padMat = new THREE.MeshStandardMaterial({
		color: 0x059669,
		roughness: 0.45,
		side: THREE.DoubleSide
	});
	disposables.push(padMat);

	const dewMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		roughness: 0.04,
		transmission: 0.95,
		transparent: true,
		opacity: 0.9
	});
	disposables.push(dewMat);

	const padConfigs = [
		{ x: -0.65, z: 0.45, r: 0.52, rot: 0.4 },
		{ x: 0.72, z: -0.32, r: 0.56, rot: 2.1 },
		{ x: -0.45, z: -0.58, r: 0.46, rot: 4.2 }
	];

	const padMeshes: THREE.Mesh[] = [];
	for (const p of padConfigs) {
		const padGeo = new THREE.CircleGeometry(p.r, 32, 0.3, Math.PI * 1.85);
		disposables.push(padGeo);
		const pad = new THREE.Mesh(padGeo, padMat);
		pad.rotation.x = -Math.PI / 2;
		pad.rotation.z = p.rot;
		pad.position.set(p.x, -0.85, p.z);
		group.add(pad);
		padMeshes.push(pad);

		// Clear hemispherical dew drop on lily pad
		const dewGeo = new THREE.SphereGeometry(0.045, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
		disposables.push(dewGeo);
		const dew = new THREE.Mesh(dewGeo, dewMat);
		dew.position.set(p.x + 0.12, -0.84, p.z + 0.06);
		group.add(dew);
	}

	// 3. Proportional, Naturally Curved Lotus Stem
	const stemCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -0.86, 0),
		new THREE.Vector3(0.05, -0.4, -0.02),
		new THREE.Vector3(-0.03, -0.05, 0.02),
		new THREE.Vector3(0, 0.35, 0)
	]);
	const stemGeo = new THREE.TubeGeometry(stemCurve, 28, 0.065, 12, false);
	disposables.push(stemGeo);
	const stemMat = new THREE.MeshStandardMaterial({
		color: 0x10b981,
		roughness: 0.45
	});
	disposables.push(stemMat);
	const stemMesh = new THREE.Mesh(stemGeo, stemMat);
	group.add(stemMesh);

	// 4. Truly Radial Sacred Lotus Blossom with Cupped Spoon Petals
	const petalTex = createPetalGradientTexture();
	disposables.push(petalTex);
	const petalMat = new THREE.MeshStandardMaterial({
		map: petalTex,
		roughness: 0.3,
		side: THREE.DoubleSide
	});
	disposables.push(petalMat);

	const bloomGroup = new THREE.Group();
	bloomGroup.position.set(0, 0.4, 0);

	// Golden Central Seed Receptacle (Inverted flat-topped torus/pod)
	const stamenGeo = new THREE.CylinderGeometry(0.19, 0.12, 0.22, 24);
	disposables.push(stamenGeo);
	const stamenMat = new THREE.MeshStandardMaterial({
		color: 0xfacc15,
		roughness: 0.25,
		emissive: 0xd97706,
		emissiveIntensity: 0.35
	});
	disposables.push(stamenMat);
	const stamen = new THREE.Mesh(stamenGeo, stamenMat);
	stamen.position.y = 0.02;
	bloomGroup.add(stamen);

	// Ring of 24 delicate golden pollen filament stamens
	const filamentMat = new THREE.MeshStandardMaterial({
		color: 0xfef08a,
		roughness: 0.25
	});
	disposables.push(filamentMat);
	for (let i = 0; i < 24; i++) {
		const fAngle = (i / 24) * Math.PI * 2;
		const fGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.16, 4);
		disposables.push(fGeo);
		const filament = new THREE.Mesh(fGeo, filamentMat);
		filament.position.set(Math.cos(fAngle) * 0.2, 0.06, Math.sin(fAngle) * 0.2);
		filament.rotation.z = -Math.cos(fAngle) * 0.3;
		filament.rotation.x = Math.sin(fAngle) * 0.3;
		bloomGroup.add(filament);
	}

	// 3 Tiers of Radially Interleaved Lotus Spoon Petals
	interface PetalItem {
		mesh: THREE.Mesh;
		initialTilt: number;
		amp: number;
	}
	const petalItems: PetalItem[] = [];

	const tierConfigs = [
		// Outer Tier: 8 broad spoon petals flared open
		{ count: 8, offset: 0, radius: 0.22, length: 0.65, width: 0.34, tilt: 0.82, amp: 0.14 },
		// Middle Tier: 8 petals interleaved by half-interval
		{
			count: 8,
			offset: Math.PI / 8,
			radius: 0.17,
			length: 0.54,
			width: 0.28,
			tilt: 0.52,
			amp: 0.11
		},
		// Inner Tier: 6 cupped bud petals close to receptacle
		{
			count: 6,
			offset: Math.PI / 16,
			radius: 0.12,
			length: 0.42,
			width: 0.22,
			tilt: 0.26,
			amp: 0.07
		}
	];

	for (const config of tierConfigs) {
		for (let i = 0; i < config.count; i++) {
			const angle = (i / config.count) * Math.PI * 2 + config.offset;

			const pivot = new THREE.Group();
			pivot.rotation.y = angle;

			// Smooth concave spoon petal
			const petalGeo = createLotusPetalGeometry(config.width, config.length);
			disposables.push(petalGeo);

			const petal = new THREE.Mesh(petalGeo, petalMat);
			petal.position.set(0, 0, config.radius);
			petal.rotation.x = -config.tilt;

			pivot.add(petal);
			bloomGroup.add(pivot);

			petalItems.push({
				mesh: petal,
				initialTilt: config.tilt,
				amp: config.amp
			});
		}
	}
	group.add(bloomGroup);

	// 5. Soft Atmospheric Lotus Glow Light (Replaced the harsh solid cone)
	const bloomLight = new THREE.PointLight(0xfef08a, 1.2, 4.0);
	bloomLight.position.set(0, 1.2, 0);
	group.add(bloomLight);

	// 6. Floating Golden Spore Particles
	const sporeCount = 65;
	const sporeGeo = new THREE.BufferGeometry();
	disposables.push(sporeGeo);
	const sporePos = new Float32Array(sporeCount * 3);

	for (let i = 0; i < sporeCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 1.1;
		sporePos[i * 3] = Math.cos(angle) * r;
		sporePos[i * 3 + 1] = 0.1 + Math.random() * 2.0;
		sporePos[i * 3 + 2] = Math.sin(angle) * r;
	}
	sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));

	const sporeMat = new THREE.PointsMaterial({
		color: 0xfacc15,
		size: 0.045,
		transparent: true,
		opacity: 0.85
	});
	disposables.push(sporeMat);
	const sporeSystem = new THREE.Points(sporeGeo, sporeMat);
	group.add(sporeSystem);

	return {
		group,
		update: (time: number) => {
			// Lily pad subtle floating water ripple
			for (let i = 0; i < padMeshes.length; i++) {
				padMeshes[i].position.y = -0.85 + Math.sin(time * 1.2 + i) * 0.008;
			}

			// Sacred lotus breathing: cupped petals breathe open and close with perfect radial synchrony
			const breath = Math.sin(time * 0.85);
			for (const item of petalItems) {
				item.mesh.rotation.x = -(item.initialTilt + breath * item.amp);
			}

			// Gentle bloom sway
			bloomGroup.rotation.y = Math.sin(time * 0.35) * 0.07;

			// Spore floating animation
			const pos = sporeGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < sporeCount; i++) {
				pos[i * 3 + 1] += 0.0028;
				pos[i * 3] += Math.sin(time * 1.4 + i) * 0.002;
				pos[i * 3 + 2] += Math.cos(time * 1.4 + i) * 0.002;

				if (pos[i * 3 + 1] > 2.2) {
					pos[i * 3 + 1] = 0.2;
				}
			}
			sporeGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
