import * as THREE from 'three';
import { createCausticsTexture } from '#lib/scene/textures/procedural-textures';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Creates a smooth, natural umbrella bell geometry for Aurelia aurita (Moon Jellyfish).
 * Generates an undulating, translucent mushroom/saucer bell with a down-curved scalloped rim.
 */
function createJellyBellGeometry(radius: number): THREE.BufferGeometry {
	const points: THREE.Vector2[] = [];
	const segments = 24;

	// Lathe curve profile from apex (0, height) to outer scalloped rim
	for (let i = 0; i <= segments; i++) {
		const t = i / segments;
		// Apex is gently rounded, then bell slopes out and curls downwards at the margin
		const r = Math.sin(t * Math.PI * 0.5) * radius;
		// Profile curve: dome top to down-turned rim lip
		const y = Math.cos(t * Math.PI * 0.5) * (radius * 0.62) - radius * 0.15;
		points.push(new THREE.Vector2(Math.max(0.001, r), y));
	}

	const geo = new THREE.LatheGeometry(points, 32);

	// Add subtle 8-lobed natural scalloped rim modulation
	const pos = geo.attributes.position;
	const v = new THREE.Vector3();
	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		const distFromCenter = Math.sqrt(v.x * v.x + v.z * v.z);
		if (distFromCenter > radius * 0.7) {
			const angle = Math.atan2(v.z, v.x);
			// 8 rhopalia marginal indentations
			const marginWave = Math.sin(angle * 8) * 0.025 * (distFromCenter / radius);
			v.y += marginWave;
			pos.setXYZ(i, v.x, v.y, v.z);
		}
	}
	geo.computeVertexNormals();
	return geo;
}

/**
 * Creates a ruffled, undulating oral arm ribbon geometry.
 * Moon jellyfish have 4 delicate frilly curtain-like oral arms that flow underneath the bell.
 */
function createOralArmGeometry(length: number, width: number): THREE.BufferGeometry {
	const segmentsY = 18;
	const segmentsX = 4;
	const geo = new THREE.PlaneGeometry(width, length, segmentsX, segmentsY);

	// Add ruffled frills to the outer edges
	const pos = geo.attributes.position;
	for (let i = 0; i < pos.count; i++) {
		const y = pos.getY(i);
		const x = pos.getX(i);
		const progress = Math.abs(y) / length;
		// Frilly sine ruffles on the edges
		const ruffles = Math.sin(y * 12) * 0.025 * Math.abs(x / width);
		pos.setZ(i, ruffles);
		// Taper towards the bottom tip
		pos.setX(i, x * (1 - progress * 0.6));
	}
	geo.computeVertexNormals();
	return geo;
}

/**
 * Creates the iconic 4 horseshoe / clover gonads visible through the translucent bell.
 */
function createCloverGonadGeometry(radius: number): THREE.BufferGeometry {
	// Horseshoe / crescent curve
	const curve = new THREE.EllipseCurve(
		0,
		0,
		radius,
		radius * 0.85,
		0.45 * Math.PI,
		2.55 * Math.PI,
		false,
		0
	);
	const points = curve.getPoints(24);
	const points3D = points.map((p) => new THREE.Vector3(p.x, 0, p.y));
	const spline = new THREE.CatmullRomCurve3(points3D);
	return new THREE.TubeGeometry(spline, 24, radius * 0.22, 8, false);
}

/**
 * Bioluminescent Moon Jellyfish Abyss Aquarium.
 * Features ultra-translucent undulating moon jellyfish with glowing violet horseshoe gonads,
 * flowing ruffled oral arms, abyssal sapphire lighting, and drifting marine snow.
 */
export function createAquariumJellyfishModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'aquarium_jellyfish_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Sleek Cylindrical Abyss Tank with Polished Beveled Rings
	const tankGeo = new THREE.CylinderGeometry(1.35, 1.35, 2.3, 40, 1, true);
	disposables.push(tankGeo);
	const tankMat = new THREE.MeshPhysicalMaterial({
		color: 0x38bdf8,
		transparent: true,
		opacity: 0.18,
		roughness: 0.02,
		transmission: 0.95,
		ior: 1.333,
		thickness: 0.15
	});
	disposables.push(tankMat);
	const tankMesh = new THREE.Mesh(tankGeo, tankMat);
	tankMesh.position.y = 0.05;
	group.add(tankMesh);

	// Tank Base (Deep Midnight Obsidian)
	const baseGeo = new THREE.CylinderGeometry(1.42, 1.45, 0.22, 40);
	disposables.push(baseGeo);
	const baseMat = new THREE.MeshStandardMaterial({
		color: 0x020617,
		roughness: 0.45,
		metalness: 0.6
	});
	disposables.push(baseMat);
	const baseMesh = new THREE.Mesh(baseGeo, baseMat);
	baseMesh.position.y = -1.15;
	group.add(baseMesh);

	// Upper Tank Trim Rim
	const rimGeo = new THREE.CylinderGeometry(1.38, 1.38, 0.08, 40);
	disposables.push(rimGeo);
	const rimMesh = new THREE.Mesh(rimGeo, baseMat);
	rimMesh.position.y = 1.22;
	group.add(rimMesh);

	// Deep Abyssal Seabed Floor with Caustics
	const floorGeo = new THREE.CircleGeometry(1.32, 36);
	disposables.push(floorGeo);
	const causticsTex = createCausticsTexture();
	disposables.push(causticsTex);
	const floorMat = new THREE.MeshStandardMaterial({
		map: causticsTex,
		color: 0x075985,
		roughness: 0.8,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(floorMat);
	const floorMesh = new THREE.Mesh(floorGeo, floorMat);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -1.02;
	group.add(floorMesh);

	// Water Surface
	const waterGeo = new THREE.CircleGeometry(1.33, 36);
	disposables.push(waterGeo);
	const waterMat = new THREE.MeshStandardMaterial({
		color: 0x0284c7,
		transparent: true,
		opacity: 0.35,
		roughness: 0.1
	});
	disposables.push(waterMat);
	const waterSurface = new THREE.Mesh(waterGeo, waterMat);
	waterSurface.rotation.x = -Math.PI / 2;
	waterSurface.position.y = 1.15;
	group.add(waterSurface);

	// Internal Abyssal Lighting (Upward soft glow that illuminates the jellies)
	const tankGlow = new THREE.PointLight(0x0ea5e9, 1.8, 3.2);
	tankGlow.position.set(0, -0.8, 0);
	group.add(tankGlow);

	const topRimLight = new THREE.PointLight(0xa855f7, 1.2, 2.5);
	topRimLight.position.set(0, 1.0, 0);
	group.add(topRimLight);

	// 2. High-Fidelity Translucent Moon Jellyfish Materials
	const jellyBellMat = new THREE.MeshPhysicalMaterial({
		color: 0xe0f2fe,
		emissive: 0x38bdf8,
		emissiveIntensity: 0.22,
		transparent: true,
		opacity: 0.58,
		roughness: 0.08,
		transmission: 0.92,
		ior: 1.18,
		thickness: 0.12,
		side: THREE.DoubleSide
	});
	disposables.push(jellyBellMat);

	// Bioluminescent Violet/Magenta Horseshoe Gonad Material
	const gonadMat = new THREE.MeshStandardMaterial({
		color: 0xf472b6,
		emissive: 0xd946ef,
		emissiveIntensity: 0.95,
		roughness: 0.25
	});
	disposables.push(gonadMat);

	// Frilly Oral Arm Material (Delicate, diaphanous translucent lace)
	const oralArmMat = new THREE.MeshStandardMaterial({
		color: 0xbae6fd,
		emissive: 0x818cf8,
		emissiveIntensity: 0.35,
		transparent: true,
		opacity: 0.65,
		roughness: 0.35,
		side: THREE.DoubleSide
	});
	disposables.push(oralArmMat);

	// Fine Marginal Tentacles Material
	const tentacleMat = new THREE.MeshBasicMaterial({
		color: 0xa5f3fc,
		transparent: true,
		opacity: 0.45
	});
	disposables.push(tentacleMat);

	interface JellyData {
		group: THREE.Group;
		bellMesh: THREE.Mesh;
		oralArms: THREE.Mesh[];
		marginalFringe: THREE.LineSegments;
		gonadsGroup: THREE.Group;
		baseY: number;
		orbitRadius: number;
		speed: number;
		phase: number;
	}

	const jellies: JellyData[] = [];
	const jellyConfigs = [
		{ r: 0.52, baseY: 0.15, orbitR: 0.42, speed: 0.75, phase: 0.0 },
		{ r: 0.38, baseY: -0.4, orbitR: 0.62, speed: 0.92, phase: 2.2 },
		{ r: 0.32, baseY: 0.58, orbitR: 0.38, speed: 0.85, phase: 4.4 }
	];

	for (const config of jellyConfigs) {
		const jGroup = new THREE.Group();

		// A. Translucent Umbrella Bell
		const bellGeo = createJellyBellGeometry(config.r);
		disposables.push(bellGeo);
		const bellMesh = new THREE.Mesh(bellGeo, jellyBellMat);
		jGroup.add(bellMesh);

		// B. 4 Bioluminescent Horseshoe Gonads (Clover pattern visible through bell)
		const gonadsGroup = new THREE.Group();
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2;
			const gGeo = createCloverGonadGeometry(config.r * 0.16);
			disposables.push(gGeo);
			const gMesh = new THREE.Mesh(gGeo, gonadMat);
			const gDist = config.r * 0.28;
			gMesh.position.set(Math.cos(a) * gDist, config.r * 0.12, Math.sin(a) * gDist);
			gMesh.rotation.x = Math.PI / 2;
			gMesh.rotation.z = a + Math.PI; // Opening faces inward like real moon jellies
			gonadsGroup.add(gMesh);
		}
		jGroup.add(gonadsGroup);

		// C. 4 Flowing Ruffled Oral Arms hanging from center
		const jOralArms: THREE.Mesh[] = [];
		const armLength = config.r * 1.55;
		const armWidth = config.r * 0.32;
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2 + Math.PI / 4; // Offset between gonads
			const armGeo = createOralArmGeometry(armLength, armWidth);
			disposables.push(armGeo);
			const armMesh = new THREE.Mesh(armGeo, oralArmMat);
			armMesh.position.set(
				Math.cos(a) * config.r * 0.12,
				-armLength * 0.45,
				Math.sin(a) * config.r * 0.12
			);
			armMesh.rotation.y = a;
			armMesh.rotation.x = 0.15;
			jGroup.add(armMesh);
			jOralArms.push(armMesh);
		}

		// D. Fine Marginal Fringe Tentacles along bell rim
		const fringePoints: THREE.Vector3[] = [];
		const tentacleCount = 48;
		for (let i = 0; i < tentacleCount; i++) {
			const a = (i / tentacleCount) * Math.PI * 2;
			const rimX = Math.cos(a) * config.r * 0.96;
			const rimY = -config.r * 0.15;
			const rimZ = Math.sin(a) * config.r * 0.96;
			const tipX = rimX * 0.98;
			const tipY = rimY - config.r * 0.42;
			const tipZ = rimZ * 0.98;
			fringePoints.push(new THREE.Vector3(rimX, rimY, rimZ));
			fringePoints.push(new THREE.Vector3(tipX, tipY, tipZ));
		}
		const fringeGeo = new THREE.BufferGeometry().setFromPoints(fringePoints);
		disposables.push(fringeGeo);
		const fringeLines = new THREE.LineSegments(fringeGeo, tentacleMat);
		jGroup.add(fringeLines);

		group.add(jGroup);
		jellies.push({
			group: jGroup,
			bellMesh,
			oralArms: jOralArms,
			marginalFringe: fringeLines,
			gonadsGroup,
			baseY: config.baseY,
			orbitRadius: config.orbitR,
			speed: config.speed,
			phase: config.phase
		});
	}

	// 3. Drifting Bioluminescent Marine Snow & Microplankton
	const snowCount = 85;
	const snowGeo = new THREE.BufferGeometry();
	disposables.push(snowGeo);
	const snowPos = new Float32Array(snowCount * 3);

	for (let i = 0; i < snowCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 0.95;
		snowPos[i * 3] = Math.cos(angle) * r;
		snowPos[i * 3 + 1] = -0.95 + Math.random() * 2.0;
		snowPos[i * 3 + 2] = Math.sin(angle) * r;
	}
	snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

	const snowMat = new THREE.PointsMaterial({
		color: 0x67e8f9,
		size: 0.038,
		transparent: true,
		opacity: 0.75
	});
	disposables.push(snowMat);
	const snowSystem = new THREE.Points(snowGeo, snowMat);
	group.add(snowSystem);

	return {
		group,
		update: (time: number) => {
			// Subtle water surface motion
			waterSurface.position.y = 1.15 + Math.sin(time * 1.6) * 0.01;

			// Jellyfish natural hydro-propulsion swimming cycles
			for (const jelly of jellies) {
				// Asymmetric swim stroke: fast contraction (power stroke) -> slow gliding expansion (recovery)
				const cycle = (time * jelly.speed + jelly.phase) % (Math.PI * 2);
				const isContracting = cycle < Math.PI * 0.8;
				const pulse = isContracting
					? Math.sin(cycle * (Math.PI / (Math.PI * 0.8)))
					: -Math.sin((cycle - Math.PI * 0.8) * (Math.PI / (Math.PI * 1.2))) * 0.35;

				// Umbrella bell squash and stretch
				const scaleY = 1.0 + pulse * 0.3;
				const scaleXZ = 1.0 - pulse * 0.18;
				jelly.bellMesh.scale.set(scaleXZ, scaleY, scaleXZ);
				jelly.marginalFringe.scale.set(scaleXZ, 1.0, scaleXZ);

				// Vertical bobbing synchronized with hydro-propulsion
				const yDisplacement = Math.sin(time * jelly.speed + jelly.phase) * 0.22;
				const angle = time * 0.18 + jelly.phase;
				const x = Math.cos(angle) * jelly.orbitRadius;
				const z = Math.sin(angle) * jelly.orbitRadius;

				jelly.group.position.set(x, jelly.baseY + yDisplacement, z);
				jelly.group.rotation.y = angle + Math.PI / 2;
				// Slight forward tilt in direction of travel
				jelly.group.rotation.x = Math.sin(time * jelly.speed + jelly.phase) * 0.06;

				// Oral arms ripple with fluid wave lag behind the propulsion stroke
				for (let i = 0; i < jelly.oralArms.length; i++) {
					const arm = jelly.oralArms[i];
					arm.rotation.z = Math.sin(time * 2.2 + i * 1.2 + jelly.phase) * 0.14 - pulse * 0.12;
				}
			}

			// Marine snow gentle abyssal drift
			const pos = snowGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < snowCount; i++) {
				pos[i * 3 + 1] -= 0.0028; // Downward oceanic drift
				pos[i * 3] += Math.sin(time * 0.9 + i) * 0.001;
				pos[i * 3 + 2] += Math.cos(time * 0.9 + i) * 0.001;

				if (pos[i * 3 + 1] < -0.98) {
					pos[i * 3 + 1] = 1.1;
				}
			}
			snowGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
