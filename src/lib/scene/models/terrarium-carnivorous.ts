import * as THREE from 'three';
import { createMossTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Creates an authentic tropical Nepenthes pitcher urn (ascidium) geometry.
 * Features a swollen bulbous lower chamber, a tapered waist, a flared oblique mouth,
 * and dual longitudinal fringed wings running down the front.
 */
function createPitcherUrnGroup(
	scale: number,
	bodyMat: THREE.Material,
	peristomeMat: THREE.Material,
	lidMat: THREE.Material,
	disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[]
): THREE.Group {
	const urnGroup = new THREE.Group();

	// 1. Lathed Pitcher Body Profile (from bottom apex to flared upper mouth)
	const points: THREE.Vector2[] = [];
	const segments = 20;
	const urnHeight = 0.52 * scale;
	const maxRadius = 0.14 * scale;

	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		const y = (t - 0.5) * urnHeight;
		// Shape: Bulbous bottom chamber (t < 0.45), tapered waist (t ~ 0.65), flared rim (t > 0.85)
		let r: number;
		if (t < 0.45) {
			r = Math.sin((t / 0.45) * Math.PI * 0.5) * maxRadius;
		} else if (t < 0.75) {
			const u = (t - 0.45) / 0.3;
			r = maxRadius * (1.0 - u * 0.28); // Tapered waist
		} else {
			const u = (t - 0.75) / 0.25;
			r = maxRadius * (0.72 + u * 0.38); // Flared mouth
		}
		points.push(new THREE.Vector2(Math.max(0.005, r), y));
	}

	const bodyGeo = new THREE.LatheGeometry(points, 24);
	disposables.push(bodyGeo);
	const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
	urnGroup.add(bodyMesh);

	// 2. Dual Frontal Fringed Wings (alae) along the front
	const wingHeight = urnHeight * 0.65;
	for (let side = -1; side <= 1; side += 2) {
		const wingGeo = new THREE.PlaneGeometry(0.03 * scale, wingHeight, 2, 8);
		disposables.push(wingGeo);
		const wingMesh = new THREE.Mesh(wingGeo, peristomeMat);
		wingMesh.position.set(side * 0.04 * scale, -urnHeight * 0.08, maxRadius * 0.85);
		wingMesh.rotation.y = side * 0.25;
		urnGroup.add(wingMesh);
	}

	// 3. Ribbed Recurved Peristome Lip (Collar ring around mouth)
	const mouthY = urnHeight * 0.5;
	const mouthRadius = maxRadius * 1.05;
	const peristomeGeo = new THREE.TorusGeometry(mouthRadius, 0.026 * scale, 12, 28);
	disposables.push(peristomeGeo);
	const peristomeMesh = new THREE.Mesh(peristomeGeo, peristomeMat);
	peristomeMesh.position.y = mouthY;
	peristomeMesh.rotation.x = Math.PI / 2 + 0.15; // Oblique angled mouth
	urnGroup.add(peristomeMesh);

	// 4. Arched Vaulted Operculum (Rain Lid) with Apical Spur
	const lidGeo = new THREE.SphereGeometry(
		mouthRadius * 1.1,
		16,
		10,
		0,
		Math.PI * 2,
		0,
		Math.PI / 3
	);
	disposables.push(lidGeo);
	const lidMesh = new THREE.Mesh(lidGeo, lidMat);
	lidMesh.position.set(0, mouthY + 0.06 * scale, -mouthRadius * 0.35);
	lidMesh.rotation.x = -Math.PI / 2 - 0.45;
	urnGroup.add(lidMesh);

	// Apical spur at lid hinge
	const spurGeo = new THREE.ConeGeometry(0.012 * scale, 0.06 * scale, 6);
	disposables.push(spurGeo);
	const spurMesh = new THREE.Mesh(spurGeo, peristomeMat);
	spurMesh.position.set(0, mouthY + 0.04 * scale, -mouthRadius * 0.85);
	spurMesh.rotation.x = -0.5;
	urnGroup.add(spurMesh);

	return urnGroup;
}

/**
 * Creates a broad, glossy lanceolate Nepenthes lamina leaf with a distinct central midrib.
 */
function createLaminaLeafGeometry(
	length: number,
	width: number,
	arch: number
): THREE.BufferGeometry {
	const segmentsU = 12;
	const segmentsV = 6;
	const vertices: number[] = [];
	const indices: number[] = [];

	for (let u = 0; u <= segmentsU; u++) {
		const t = u / segmentsU;
		// Width: Narrow sheath at stem, broad elliptic blade, tapering to tendril tip
		const w = Math.sin(Math.pow(t, 0.55) * Math.PI) * width;
		const y = t * length;
		// Natural downward curving arch
		const zOffset = -Math.sin(t * Math.PI * 0.65) * arch;

		for (let v = 0; v <= segmentsV; v++) {
			const progV = (v / segmentsV - 0.5) * 2; // -1 to 1 across width
			const x = progV * (w * 0.5);
			// Sunken central midrib and gentle downward leaf blade camber
			const camber = (1 - progV * progV) * (w * 0.15);
			vertices.push(x, y, zOffset + camber);
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
 * Creates an organic, plush Sphagnum bog moss hummock dome.
 */
function createSphagnumCushionGeometry(
	radius: number,
	heightScale: number,
	seed: number
): THREE.BufferGeometry {
	const geo = new THREE.SphereGeometry(radius, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2);
	const pos = geo.attributes.position;
	const v = new THREE.Vector3();

	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		v.y *= heightScale;
		const angle = Math.atan2(v.z, v.x);
		const dist = Math.sqrt(v.x * v.x + v.z * v.z);
		const bump = Math.sin(angle * 6 + seed) * 0.035 + Math.cos(v.y * 10 + seed) * 0.025;
		v.x += (v.x / (dist || 1)) * bump;
		v.z += (v.z / (dist || 1)) * bump;
		v.y += Math.abs(bump) * 0.45;
		pos.setXYZ(i, v.x, v.y, v.z);
	}
	geo.computeVertexNormals();
	return geo;
}

/**
 * Carnivorous Pitcher & Sundew Bog Terrarium.
 * Features a climbing Nepenthes vine with glossy lanceolate leaves, coiled tendrils,
 * sculpted crimson-and-lime pitcher urns with ribbed peristomes, a glistening Drosera
 * sundew rosette with sticky dew droplets, living Sphagnum cushions, and an apothecary cloche.
 */
export function createTerrariumCarnivorousModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'terrarium_carnivorous_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Turned Walnut Base Tray with Inset Cloche Channel
	const baseGeo = new THREE.CylinderGeometry(1.38, 1.42, 0.22, 40);
	disposables.push(baseGeo);
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x271912,
		roughness: 0.45,
		metalness: 0.1
	});
	disposables.push(baseMat);
	const baseMesh = new THREE.Mesh(baseGeo, baseMat);
	baseMesh.position.y = -1.16;
	group.add(baseMesh);

	// Drainage River Stone Substrate
	const pebbleGeo = new THREE.CylinderGeometry(1.22, 1.18, 0.16, 36);
	disposables.push(pebbleGeo);
	const pebbleMat = new THREE.MeshStandardMaterial({
		color: 0x64748b,
		roughness: 0.8,
		flatShading: true
	});
	disposables.push(pebbleMat);
	const pebbleMesh = new THREE.Mesh(pebbleGeo, pebbleMat);
	pebbleMesh.position.y = -0.98;
	group.add(pebbleMesh);

	// Dark Bog Peat & Charcoal Filtration Layer
	const peatGeo = new THREE.CylinderGeometry(1.24, 1.22, 0.18, 36);
	disposables.push(peatGeo);
	const mossTex = createMossTexture();
	disposables.push(mossTex);
	const peatMat = new THREE.MeshStandardMaterial({
		map: mossTex,
		color: 0x1c1917,
		roughness: 0.95,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(peatMat);
	const peatMesh = new THREE.Mesh(peatGeo, peatMat);
	peatMesh.position.y = -0.72;
	group.add(peatMesh);

	// 2. Living Hummocky Sphagnum Bog Moss Cushions
	const sphagnumGreen = new THREE.MeshStandardMaterial({
		color: 0x4d7c0f,
		roughness: 0.78,
		flatShading: true
	});
	disposables.push(sphagnumGreen);

	const sphagnumChartreuse = new THREE.MeshStandardMaterial({
		color: 0x65a30d,
		roughness: 0.72,
		flatShading: true
	});
	disposables.push(sphagnumChartreuse);

	const sphagnumBurgundy = new THREE.MeshStandardMaterial({
		color: 0x831843,
		roughness: 0.75,
		flatShading: true
	});
	disposables.push(sphagnumBurgundy);

	const mossMounds = [
		{ x: -0.45, z: 0.35, r: 0.42, sy: 0.55, mat: sphagnumGreen, seed: 1.1 },
		{ x: 0.52, z: -0.28, r: 0.46, sy: 0.5, mat: sphagnumChartreuse, seed: 3.2 },
		{ x: -0.38, z: -0.45, r: 0.38, sy: 0.62, mat: sphagnumBurgundy, seed: 5.4 },
		{ x: 0.32, z: 0.48, r: 0.35, sy: 0.58, mat: sphagnumGreen, seed: 2.3 }
	];

	for (const m of mossMounds) {
		const mGeo = createSphagnumCushionGeometry(m.r, m.sy, m.seed);
		disposables.push(mGeo);
		const mMesh = new THREE.Mesh(mGeo, m.mat);
		mMesh.position.set(m.x, -0.63, m.z);
		group.add(mMesh);
	}

	// Weathered Bogwood Root Branch
	const woodCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.55, -0.63, -0.1),
		new THREE.Vector3(-0.25, -0.52, 0.15),
		new THREE.Vector3(0.05, -0.58, 0.05),
		new THREE.Vector3(0.35, -0.63, -0.2)
	]);
	const woodGeo = new THREE.TubeGeometry(woodCurve, 20, 0.045, 8, false);
	disposables.push(woodGeo);
	const woodMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.88 });
	disposables.push(woodMat);
	const woodMesh = new THREE.Mesh(woodGeo, woodMat);
	group.add(woodMesh);

	// 3. Climbing Sinuous Nepenthes Vine & Foliage Architecture
	const vineMat = new THREE.MeshStandardMaterial({
		color: 0x365314, // Deep botanical olive green
		roughness: 0.48
	});
	disposables.push(vineMat);

	const leafMat = new THREE.MeshStandardMaterial({
		color: 0x15803d, // Glossy emerald green
		roughness: 0.32,
		metalness: 0.05,
		side: THREE.DoubleSide
	});
	disposables.push(leafMat);

	const pitcherBodyMat = new THREE.MeshPhysicalMaterial({
		color: 0x991b1b, // Rich crimson scarlet
		emissive: 0x831843,
		emissiveIntensity: 0.18,
		roughness: 0.28,
		metalness: 0.05,
		clearcoat: 0.4,
		clearcoatRoughness: 0.2
	});
	disposables.push(pitcherBodyMat);

	const peristomeMat = new THREE.MeshStandardMaterial({
		color: 0x84cc16, // Fresh chartreuse lime
		roughness: 0.18,
		metalness: 0.1
	});
	disposables.push(peristomeMat);

	const lidMat = new THREE.MeshStandardMaterial({
		color: 0x65a30d,
		roughness: 0.3,
		side: THREE.DoubleSide
	});
	disposables.push(lidMat);

	// Main Climbing Vine Curve (gracefully spiraling upward to cloche ceiling)
	const vineCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0.05, -0.65, 0.0),
		new THREE.Vector3(-0.08, -0.25, 0.08),
		new THREE.Vector3(0.12, 0.15, -0.06),
		new THREE.Vector3(-0.06, 0.55, 0.04),
		new THREE.Vector3(0.04, 0.95, -0.02),
		new THREE.Vector3(0.0, 1.25, 0.0) // Terminal apical bud
	]);
	const vineGeo = new THREE.TubeGeometry(vineCurve, 36, 0.042, 8, false);
	disposables.push(vineGeo);
	const vineMesh = new THREE.Mesh(vineGeo, vineMat);
	group.add(vineMesh);

	// Apical shoot / unfurling young leaf at crown
	const apexLeafGeo = new THREE.ConeGeometry(0.035, 0.18, 6);
	disposables.push(apexLeafGeo);
	const apexLeaf = new THREE.Mesh(apexLeafGeo, leafMat);
	apexLeaf.position.set(0.0, 1.32, 0.0);
	apexLeaf.rotation.z = 0.2;
	group.add(apexLeaf);

	// Alternating Leaf Nodes with Arching Lamina, Coiled Tendrils, and Hanging Pitcher Urns
	const leafConfigs = [
		{
			t: 0.22, // Along vine curve
			angle: 0.3,
			leafLen: 0.48,
			leafWidth: 0.14,
			urnScale: 0.95,
			tendrilLoop: new THREE.Vector3(-0.45, -0.02, 0.35),
			urnPos: new THREE.Vector3(-0.42, -0.28, 0.32)
		},
		{
			t: 0.48,
			angle: 2.3,
			leafLen: 0.52,
			leafWidth: 0.15,
			urnScale: 1.05,
			tendrilLoop: new THREE.Vector3(0.48, 0.22, -0.22),
			urnPos: new THREE.Vector3(0.45, -0.08, -0.25)
		},
		{
			t: 0.72,
			angle: 4.5,
			leafLen: 0.44,
			leafWidth: 0.13,
			urnScale: 0.88,
			tendrilLoop: new THREE.Vector3(-0.35, 0.52, -0.38),
			urnPos: new THREE.Vector3(-0.32, 0.22, -0.36)
		},
		{
			t: 0.88,
			angle: 0.9,
			leafLen: 0.36,
			leafWidth: 0.11,
			urnScale: 0.75,
			tendrilLoop: new THREE.Vector3(0.32, 0.78, 0.3),
			urnPos: new THREE.Vector3(0.3, 0.48, 0.28)
		}
	];

	const animatedPitchers: { group: THREE.Group; phase: number }[] = [];

	for (let i = 0; i < leafConfigs.length; i++) {
		const cfg = leafConfigs[i];
		const nodePos = vineCurve.getPoint(cfg.t);

		// A. Broad Arching Lamina Leaf
		const leafGeo = createLaminaLeafGeometry(cfg.leafLen, cfg.leafWidth, 0.12);
		disposables.push(leafGeo);
		const leaf = new THREE.Mesh(leafGeo, leafMat);
		leaf.position.copy(nodePos);
		leaf.rotation.y = cfg.angle;
		leaf.rotation.x = 0.55;
		leaf.rotation.z = -0.15;
		group.add(leaf);

		// Leaf Tip position where tendril starts
		const leafDir = new THREE.Vector3(Math.cos(cfg.angle), -0.25, Math.sin(cfg.angle))
			.normalize()
			.multiplyScalar(cfg.leafLen * 0.92);
		const leafTip = nodePos.clone().add(leafDir);

		// B. Graceful Coiled Tendril connecting leaf tip to pitcher
		const tendrilCurve = new THREE.CatmullRomCurve3([
			leafTip,
			cfg.tendrilLoop,
			new THREE.Vector3(
				(cfg.tendrilLoop.x + cfg.urnPos.x) * 0.5,
				cfg.urnPos.y + 0.12,
				(cfg.tendrilLoop.z + cfg.urnPos.z) * 0.5
			),
			cfg.urnPos
		]);
		const tendrilGeo = new THREE.TubeGeometry(tendrilCurve, 20, 0.012, 6, false);
		disposables.push(tendrilGeo);
		const tendrilMesh = new THREE.Mesh(tendrilGeo, vineMat);
		group.add(tendrilMesh);

		// C. Sculpted Pitcher Urn
		const urn = createPitcherUrnGroup(
			cfg.urnScale,
			pitcherBodyMat,
			peristomeMat,
			lidMat,
			disposables
		);
		urn.position.copy(cfg.urnPos);
		urn.rotation.y = cfg.angle + Math.PI;
		urn.rotation.z = 0.08;
		group.add(urn);

		animatedPitchers.push({ group: urn, phase: i * 1.5 });
	}

	// 4. Glistening Drosera Sundew Colony (Cape Sundew - Drosera capensis)
	const sundewStemMat = new THREE.MeshStandardMaterial({
		color: 0x991b1b, // Ruby crimson leaf base
		roughness: 0.35
	});
	disposables.push(sundewStemMat);

	const dewMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		roughness: 0.02,
		transmission: 0.96,
		ior: 1.333,
		transparent: true,
		opacity: 0.95
	});
	disposables.push(dewMat);

	const sundewGroup = new THREE.Group();
	sundewGroup.position.set(0.38, -0.62, 0.32);

	const sundewLeafCount = 20;
	for (let i = 0; i < sundewLeafCount; i++) {
		const angle = (i / sundewLeafCount) * Math.PI * 2;
		const leafLength = 0.22 + (i % 3) * 0.04;

		// Strap-like arching tentacle paddle leaf
		const sCurve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(
				Math.cos(angle) * (leafLength * 0.5),
				0.08,
				Math.sin(angle) * (leafLength * 0.5)
			),
			new THREE.Vector3(Math.cos(angle) * leafLength, 0.04, Math.sin(angle) * leafLength)
		]);
		const sGeo = new THREE.TubeGeometry(sCurve, 10, 0.012, 6, false);
		disposables.push(sGeo);
		const sMesh = new THREE.Mesh(sGeo, sundewStemMat);
		sundewGroup.add(sMesh);

		// Glistening mucilage dew droplets along each leaf
		for (let j = 1; j <= 5; j++) {
			const t = j / 5;
			const pt = sCurve.getPoint(t);
			const dropGeo = new THREE.SphereGeometry(0.014 * (0.8 + t * 0.4), 8, 8);
			disposables.push(dropGeo);
			const drop = new THREE.Mesh(dropGeo, dewMat);
			drop.position.set(pt.x, pt.y + 0.016, pt.z);
			sundewGroup.add(drop);
		}
	}
	group.add(sundewGroup);

	// 5. Blown-Glass Apothecary Bell Cloche with Top Finial Loop
	const glassMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.2,
		roughness: 0.03,
		transmission: 0.95,
		ior: 1.48,
		thickness: 0.15
	});
	disposables.push(glassMat);

	// Glass Wall
	const clocheWallGeo = new THREE.CylinderGeometry(1.25, 1.25, 2.1, 40, 1, true);
	disposables.push(clocheWallGeo);
	const clocheWall = new THREE.Mesh(clocheWallGeo, glassMat);
	clocheWall.position.y = 0.15;
	group.add(clocheWall);

	// Hemispherical Cap
	const domeCapGeo = new THREE.SphereGeometry(1.25, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2);
	disposables.push(domeCapGeo);
	const domeCap = new THREE.Mesh(domeCapGeo, glassMat);
	domeCap.position.y = 1.2;
	group.add(domeCap);

	// Crystal Finial Loop Handle on Top
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

	// 6. Rising Humid Bog Mist Particles
	const mistCount = 60;
	const mistGeo = new THREE.BufferGeometry();
	disposables.push(mistGeo);
	const mistPos = new Float32Array(mistCount * 3);

	for (let i = 0; i < mistCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 0.92;
		mistPos[i * 3] = Math.cos(angle) * r;
		mistPos[i * 3 + 1] = -0.55 + Math.random() * 2.2;
		mistPos[i * 3 + 2] = Math.sin(angle) * r;
	}
	mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));

	const mistMat = new THREE.PointsMaterial({
		color: 0xa7f3d0,
		size: 0.042,
		transparent: true,
		opacity: 0.5
	});
	disposables.push(mistMat);
	const mistPoints = new THREE.Points(mistGeo, mistMat);
	group.add(mistPoints);

	return {
		group,
		update: (time: number) => {
			// Gentle swaying of hanging pitcher urns
			for (const p of animatedPitchers) {
				p.group.rotation.z = Math.sin(time * 0.8 + p.phase) * 0.04;
				p.group.rotation.x = Math.cos(time * 0.6 + p.phase) * 0.03;
			}

			// Sundew gentle breathing sparkle
			sundewGroup.rotation.y = time * 0.03;

			// Rising humid mist
			const pos = mistGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < mistCount; i++) {
				pos[i * 3 + 1] += 0.0032;
				pos[i * 3] += Math.sin(time * 1.5 + i) * 0.0012;
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
