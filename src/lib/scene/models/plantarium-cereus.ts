import * as THREE from 'three';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Night-Blooming Cereus (Queen of the Night) Plantarium.
 * Features an exotic nocturnal starburst bloom with spidery white-gold petals,
 * glowing central stamen filaments, deep jade succulent stems,
 * and floating phosphorescent spore particles.
 */
export function createPlantariumCereusModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'plantarium_cereus_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Midnight Blue Glazed Ceramic Pedestal
	const dishGeo = new THREE.CylinderGeometry(1.5, 0.95, 0.42, 36);
	disposables.push(dishGeo);
	const dishMat = new THREE.MeshStandardMaterial({
		color: 0x0f172a,
		roughness: 0.25,
		metalness: 0.2
	});
	disposables.push(dishMat);
	const dishMesh = new THREE.Mesh(dishGeo, dishMat);
	dishMesh.position.y = -1.1;
	group.add(dishMesh);

	// Dark Basalt Gravel Bed
	const gravelGeo = new THREE.CircleGeometry(1.44, 36);
	disposables.push(gravelGeo);
	const gravelMat = new THREE.MeshStandardMaterial({
		color: 0x1e293b,
		roughness: 0.85,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(gravelMat);
	const gravelMesh = new THREE.Mesh(gravelGeo, gravelMat);
	gravelMesh.rotation.x = -Math.PI / 2;
	gravelMesh.position.y = -0.87;
	group.add(gravelMesh);

	// 2. Arching Flattened Cereus Cactus Stems
	const stemMat = new THREE.MeshStandardMaterial({
		color: 0x166534,
		roughness: 0.55
	});
	disposables.push(stemMat);

	const stemCurves = [
		[
			new THREE.Vector3(0, -0.85, 0),
			new THREE.Vector3(-0.25, -0.4, 0.1),
			new THREE.Vector3(-0.4, 0.1, 0.15)
		],
		[
			new THREE.Vector3(0, -0.85, 0),
			new THREE.Vector3(0.2, -0.35, -0.1),
			new THREE.Vector3(0.35, 0.2, -0.12)
		],
		[
			new THREE.Vector3(0, -0.85, 0),
			new THREE.Vector3(0.05, -0.2, 0.0),
			new THREE.Vector3(0, 0.75, 0)
		]
	];

	for (const pts of stemCurves) {
		const curve = new THREE.CatmullRomCurve3(pts);
		const sGeo = new THREE.TubeGeometry(curve, 20, 0.08, 6, false);
		disposables.push(sGeo);
		const sMesh = new THREE.Mesh(sGeo, stemMat);
		sMesh.scale.set(1.4, 1, 0.4); // Flattened leaf-like stem
		group.add(sMesh);
	}

	// 3. Starburst Queen of the Night Nocturnal Bloom
	const petalWhiteMat = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		roughness: 0.25,
		side: THREE.DoubleSide
	});
	disposables.push(petalWhiteMat);

	const petalGoldMat = new THREE.MeshStandardMaterial({
		color: 0xfde047,
		roughness: 0.3,
		side: THREE.DoubleSide
	});
	disposables.push(petalGoldMat);

	const bloomGroup = new THREE.Group();
	bloomGroup.position.set(0, 0.85, 0);

	// Radiant Center Core with Bioluminescent Gold Light
	const coreGeo = new THREE.SphereGeometry(0.16, 16, 16);
	disposables.push(coreGeo);
	const coreMat = new THREE.MeshStandardMaterial({
		color: 0xfef08a,
		emissive: 0xeab308,
		emissiveIntensity: 0.5,
		roughness: 0.2
	});
	disposables.push(coreMat);
	const core = new THREE.Mesh(coreGeo, coreMat);
	bloomGroup.add(core);

	const coreLight = new THREE.PointLight(0xfef08a, 0.8, 2.5);
	bloomGroup.add(coreLight);

	// Fine radiating filament stamens (24 stamens)
	const stamenMat = new THREE.MeshStandardMaterial({
		color: 0xfacc15,
		roughness: 0.3
	});
	disposables.push(stamenMat);
	for (let i = 0; i < 24; i++) {
		const angle = (i / 24) * Math.PI * 2;
		const fGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.28, 4);
		disposables.push(fGeo);
		const fMesh = new THREE.Mesh(fGeo, stamenMat);
		fMesh.position.set(Math.cos(angle) * 0.16, 0.1, Math.sin(angle) * 0.16);
		fMesh.rotation.z = -Math.cos(angle) * 0.35;
		fMesh.rotation.x = Math.sin(angle) * 0.35;
		bloomGroup.add(fMesh);
	}

	// 3 Tiers of Spidery Radial Starburst Petals
	interface CereusPetal {
		mesh: THREE.Mesh;
		initialTilt: number;
		amp: number;
	}
	const cereusPetals: CereusPetal[] = [];

	const petalTierConfigs = [
		// Outer sepals: 12 long narrow spidery golden-amber petals
		{
			count: 12,
			offset: 0,
			radius: 0.22,
			length: 0.85,
			width: 0.1,
			tilt: 0.9,
			amp: 0.12,
			mat: petalGoldMat
		},
		// Middle petals: 12 pristine white lanceolate petals
		{
			count: 12,
			offset: Math.PI / 12,
			radius: 0.16,
			length: 0.72,
			width: 0.14,
			tilt: 0.6,
			amp: 0.1,
			mat: petalWhiteMat
		},
		// Inner petals: 10 pure white starburst petals
		{
			count: 10,
			offset: Math.PI / 24,
			radius: 0.12,
			length: 0.5,
			width: 0.12,
			tilt: 0.35,
			amp: 0.08,
			mat: petalWhiteMat
		}
	];

	for (const cfg of petalTierConfigs) {
		for (let i = 0; i < cfg.count; i++) {
			const angle = (i / cfg.count) * Math.PI * 2 + cfg.offset;

			const pivot = new THREE.Group();
			pivot.rotation.y = angle;

			// Tapering slender lanceolate petal
			const pGeo = new THREE.ConeGeometry(cfg.width, cfg.length, 6);
			disposables.push(pGeo);
			pGeo.translate(0, cfg.length / 2, 0);

			const petal = new THREE.Mesh(pGeo, cfg.mat);
			petal.position.set(0, 0, cfg.radius);
			petal.rotation.x = -cfg.tilt;

			pivot.add(petal);
			bloomGroup.add(pivot);

			cereusPetals.push({
				mesh: petal,
				initialTilt: cfg.tilt,
				amp: cfg.amp
			});
		}
	}
	group.add(bloomGroup);

	// 4. Phosphorescent Nocturnal Spores
	const sporeCount = 65;
	const sporeGeo = new THREE.BufferGeometry();
	disposables.push(sporeGeo);
	const sporePos = new Float32Array(sporeCount * 3);

	for (let i = 0; i < sporeCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 1.1;
		sporePos[i * 3] = Math.cos(angle) * r;
		sporePos[i * 3 + 1] = 0.2 + Math.random() * 2.1;
		sporePos[i * 3 + 2] = Math.sin(angle) * r;
	}
	sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));

	const sporeMat = new THREE.PointsMaterial({
		color: 0x93c5fd, // Soft night luminescence
		size: 0.045,
		transparent: true,
		opacity: 0.8
	});
	disposables.push(sporeMat);
	const spores = new THREE.Points(sporeGeo, sporeMat);
	group.add(spores);

	return {
		group,
		update: (time: number) => {
			// Starburst petal opening and breathing
			const breath = Math.sin(time * 0.75);
			for (const p of cereusPetals) {
				p.mesh.rotation.x = -(p.initialTilt + breath * p.amp);
			}

			// Core bioluminescence soft pulsation
			coreLight.intensity = 0.8 + Math.sin(time * 2.0) * 0.25;

			// Bloom gentle sway
			bloomGroup.rotation.y = Math.sin(time * 0.3) * 0.06;

			// Phosphorescent spore drift
			const pos = sporeGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < sporeCount; i++) {
				pos[i * 3 + 1] += 0.0028;
				pos[i * 3] += Math.sin(time * 1.2 + i) * 0.0018;
				pos[i * 3 + 2] += Math.cos(time * 1.2 + i) * 0.0018;

				if (pos[i * 3 + 1] > 2.4) {
					pos[i * 3 + 1] = 0.25;
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
