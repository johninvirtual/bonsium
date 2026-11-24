import * as THREE from 'three';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Fern Canopy & Wild Orchid Plantarium.
 * Features cascading maidenhair fern fronds, an arching wild orchid with blooming blossoms,
 * volcanic basalt rock pedestal, and golden floating spore dust.
 */
export function createPlantariumFernModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'plantarium_fern_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Volcanic Basalt Rock Pedestal
	const baseGeo = new THREE.CylinderGeometry(1.4, 1.1, 0.45, 32);
	disposables.push(baseGeo);
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x1e293b,
		roughness: 0.85,
		flatShading: true
	});
	disposables.push(baseMat);
	const baseMesh = new THREE.Mesh(baseGeo, baseMat);
	baseMesh.position.y = -1.1;
	group.add(baseMesh);

	// Wet Moss & Gravel Basin (Offset Y)
	const basinGeo = new THREE.CircleGeometry(1.35, 32);
	disposables.push(basinGeo);
	const basinMat = new THREE.MeshStandardMaterial({
		color: 0x064e3b,
		roughness: 0.35,
		metalness: 0.15,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(basinMat);
	const basinMesh = new THREE.Mesh(basinGeo, basinMat);
	basinMesh.rotation.x = -Math.PI / 2;
	basinMesh.position.y = -0.87;
	group.add(basinMesh);

	// Central Basalt Rock Mound
	const rockGeo = new THREE.DodecahedronGeometry(0.55, 1);
	disposables.push(rockGeo);
	const rockMat = new THREE.MeshStandardMaterial({
		color: 0x334155,
		roughness: 0.78,
		flatShading: true
	});
	disposables.push(rockMat);
	const rockMesh = new THREE.Mesh(rockGeo, rockMat);
	rockMesh.position.set(0, -0.65, 0);
	rockMesh.scale.set(1.2, 0.7, 1.1);
	group.add(rockMesh);

	// 2. Cascading Maidenhair Fern Fronds
	const fernMat = new THREE.MeshStandardMaterial({
		color: 0x10b981,
		roughness: 0.5,
		side: THREE.DoubleSide
	});
	disposables.push(fernMat);

	const fernGroup = new THREE.Group();
	const fernFronds: { mesh: THREE.Group; phase: number; speed: number }[] = [];
	const frondCount = 14;

	for (let i = 0; i < frondCount; i++) {
		const angle = (i / frondCount) * Math.PI * 2;
		const fMesh = new THREE.Group();

		// Arching spine
		const curvePts = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0.35, 0.25, 0),
			new THREE.Vector3(0.8, 0.15, 0),
			new THREE.Vector3(1.15, -0.2, 0)
		];
		const spineCurve = new THREE.CatmullRomCurve3(curvePts);
		const spineGeo = new THREE.TubeGeometry(spineCurve, 16, 0.02, 6, false);
		disposables.push(spineGeo);
		const spine = new THREE.Mesh(spineGeo, fernMat);
		fMesh.add(spine);

		// Little pinnae leaf leaflets along spine
		for (let j = 1; j <= 6; j++) {
			const t = j / 7;
			const pt = spineCurve.getPoint(t);
			const leafGeo = new THREE.CircleGeometry(0.08 * (1 - t * 0.4), 8);
			disposables.push(leafGeo);
			const lMesh = new THREE.Mesh(leafGeo, fernMat);
			lMesh.position.copy(pt);
			lMesh.rotation.x = Math.PI / 2;
			fMesh.add(lMesh);
		}

		fMesh.position.set(Math.cos(angle) * 0.2, -0.55, Math.sin(angle) * 0.2);
		fMesh.rotation.y = angle;
		fernGroup.add(fMesh);
		fernFronds.push({
			mesh: fMesh,
			phase: Math.random() * Math.PI * 2,
			speed: 0.8 + Math.random() * 0.4
		});
	}
	group.add(fernGroup);

	// 3. Arching Wild White & Violet Orchid
	const stemCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -0.65, 0),
		new THREE.Vector3(0.15, -0.1, 0.05),
		new THREE.Vector3(-0.1, 0.5, -0.05),
		new THREE.Vector3(0.2, 1.1, 0.08),
		new THREE.Vector3(0.45, 1.45, 0.15)
	]);
	const stemGeo = new THREE.TubeGeometry(stemCurve, 28, 0.055, 8, false);
	disposables.push(stemGeo);
	const stemMat = new THREE.MeshStandardMaterial({
		color: 0x059669,
		roughness: 0.55
	});
	disposables.push(stemMat);
	const orchidStem = new THREE.Mesh(stemGeo, stemMat);
	group.add(orchidStem);

	// Orchid Flower Blooms (3 flowers along upper stem)
	const petalWhiteMat = new THREE.MeshStandardMaterial({
		color: 0xfdf4ff,
		roughness: 0.35,
		side: THREE.DoubleSide
	});
	disposables.push(petalWhiteMat);

	const petalVioletMat = new THREE.MeshStandardMaterial({
		color: 0xc084fc,
		roughness: 0.3,
		side: THREE.DoubleSide
	});
	disposables.push(petalVioletMat);

	const flowerPositions = [
		new THREE.Vector3(0.05, 0.85, 0.02),
		new THREE.Vector3(0.25, 1.2, 0.1),
		new THREE.Vector3(0.48, 1.48, 0.16)
	];

	for (const fPos of flowerPositions) {
		const flGroup = new THREE.Group();
		flGroup.position.copy(fPos);

		// 3 outer white petals
		for (let i = 0; i < 3; i++) {
			const a = (i / 3) * Math.PI * 2;
			const pGeo = new THREE.ConeGeometry(0.12, 0.35, 6);
			disposables.push(pGeo);
			pGeo.translate(0, 0.18, 0);
			const pMesh = new THREE.Mesh(pGeo, petalWhiteMat);
			pMesh.rotation.z = -0.7;
			pMesh.rotation.y = a;
			flGroup.add(pMesh);
		}

		// Violet center lip (Labellum)
		const lipGeo = new THREE.ConeGeometry(0.14, 0.28, 6);
		disposables.push(lipGeo);
		lipGeo.translate(0, 0.14, 0);
		const lipMesh = new THREE.Mesh(lipGeo, petalVioletMat);
		lipMesh.position.set(0.05, -0.05, 0.08);
		lipMesh.rotation.x = 0.5;
		flGroup.add(lipMesh);

		group.add(flGroup);
	}

	// 4. Shimmering Golden Spore Particles
	const sporeCount = 60;
	const sporeGeo = new THREE.BufferGeometry();
	disposables.push(sporeGeo);
	const sporePos = new Float32Array(sporeCount * 3);

	for (let i = 0; i < sporeCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 1.1;
		sporePos[i * 3] = Math.cos(angle) * r;
		sporePos[i * 3 + 1] = 0.1 + Math.random() * 2.1;
		sporePos[i * 3 + 2] = Math.sin(angle) * r;
	}
	sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3));

	const sporeMat = new THREE.PointsMaterial({
		color: 0x86efac,
		size: 0.045,
		transparent: true,
		opacity: 0.8
	});
	disposables.push(sporeMat);
	const sporeSystem = new THREE.Points(sporeGeo, sporeMat);
	group.add(sporeSystem);

	return {
		group,
		update: (time: number) => {
			// Fern fronds gentle breathing wave
			for (const f of fernFronds) {
				f.mesh.rotation.z = Math.sin(time * f.speed + f.phase) * 0.08;
			}

			// Spore drift
			const pos = sporeGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < sporeCount; i++) {
				pos[i * 3 + 1] += 0.003;
				pos[i * 3] += Math.sin(time * 1.2 + i) * 0.0018;
				pos[i * 3 + 2] += Math.cos(time * 1.2 + i) * 0.0018;

				if (pos[i * 3 + 1] > 2.3) {
					pos[i * 3 + 1] = 0.1;
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
