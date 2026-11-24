import * as THREE from 'three';
import type { BiosphereModel } from '#lib/scene/models/bonsai';

/**
 * Desert Succulent & Sandstone Terrarium.
 * Features layered colored sands, a ribbed saguaro cactus with golden bloom,
 * echeveria succulent, desert sandstone, and faceted glass enclosure.
 */
export function createTerrariumDesertModel(): BiosphereModel {
	const group = new THREE.Group();
	group.name = 'terrarium_desert_biosphere';

	const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

	// 1. Layered Colored Desert Sand Substrate
	const sandMatTerracotta = new THREE.MeshStandardMaterial({
		color: 0xc2410c,
		roughness: 0.95
	});
	disposables.push(sandMatTerracotta);
	const sand1Geo = new THREE.CylinderGeometry(1.2, 1.15, 0.22, 36);
	disposables.push(sand1Geo);
	const sand1Mesh = new THREE.Mesh(sand1Geo, sandMatTerracotta);
	sand1Mesh.position.y = -1.11;
	group.add(sand1Mesh);

	const sandMatOchre = new THREE.MeshStandardMaterial({
		color: 0xd97706,
		roughness: 0.92
	});
	disposables.push(sandMatOchre);
	const sand2Geo = new THREE.CylinderGeometry(1.22, 1.2, 0.18, 36);
	disposables.push(sand2Geo);
	const sand2Mesh = new THREE.Mesh(sand2Geo, sandMatOchre);
	sand2Mesh.position.y = -0.91;
	group.add(sand2Mesh);

	const sandMatQuartz = new THREE.MeshStandardMaterial({
		color: 0xfde68a,
		roughness: 0.88,
		polygonOffset: true,
		polygonOffsetFactor: -1,
		polygonOffsetUnits: -1
	});
	disposables.push(sandMatQuartz);
	const sand3Geo = new THREE.CylinderGeometry(1.24, 1.22, 0.18, 36);
	disposables.push(sand3Geo);
	const sand3Mesh = new THREE.Mesh(sand3Geo, sandMatQuartz);
	sand3Mesh.position.y = -0.73;
	group.add(sand3Mesh);

	// 2. Weathered Red Sandstone Rocks
	const rockMat = new THREE.MeshStandardMaterial({
		color: 0xb45309,
		roughness: 0.85,
		flatShading: true
	});
	disposables.push(rockMat);
	const rockCoords = [
		{ x: -0.55, z: 0.35, s: 0.26, sy: 1.4 },
		{ x: -0.38, z: 0.48, s: 0.18, sy: 1.1 },
		{ x: 0.65, z: -0.3, s: 0.22, sy: 0.8 }
	];
	for (const r of rockCoords) {
		const rGeo = new THREE.DodecahedronGeometry(r.s, 1);
		disposables.push(rGeo);
		const rMesh = new THREE.Mesh(rGeo, rockMat);
		rMesh.position.set(r.x, -0.68, r.z);
		rMesh.scale.set(1, r.sy, 1);
		rMesh.rotation.set(Math.random(), Math.random(), Math.random());
		group.add(rMesh);
	}

	// 3. Ribbed Saguaro Cactus
	const cactusMat = new THREE.MeshStandardMaterial({
		color: 0x15803d,
		roughness: 0.6,
		metalness: 0.05
	});
	disposables.push(cactusMat);

	const cactusGroup = new THREE.Group();
	cactusGroup.position.set(0.12, -0.65, 0.05);

	// Central cactus column
	const cactusMainGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.1, 10);
	disposables.push(cactusMainGeo);
	const cactusMain = new THREE.Mesh(cactusMainGeo, cactusMat);
	cactusMain.position.y = 0.55;
	cactusGroup.add(cactusMain);

	// Rounded top dome
	const cactusTopGeo = new THREE.SphereGeometry(0.16, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2);
	disposables.push(cactusTopGeo);
	const cactusTop = new THREE.Mesh(cactusTopGeo, cactusMat);
	cactusTop.position.y = 1.1;
	cactusGroup.add(cactusTop);

	// Left Arm
	const leftArmCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(-0.12, 0.38, 0),
		new THREE.Vector3(-0.35, 0.38, 0),
		new THREE.Vector3(-0.35, 0.75, 0)
	]);
	const leftArmGeo = new THREE.TubeGeometry(leftArmCurve, 12, 0.08, 8, false);
	disposables.push(leftArmGeo);
	const leftArm = new THREE.Mesh(leftArmGeo, cactusMat);
	cactusGroup.add(leftArm);

	// Right Arm
	const rightArmCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0.12, 0.55, 0),
		new THREE.Vector3(0.32, 0.55, 0),
		new THREE.Vector3(0.32, 0.9, 0)
	]);
	const rightArmGeo = new THREE.TubeGeometry(rightArmCurve, 12, 0.075, 8, false);
	disposables.push(rightArmGeo);
	const rightArm = new THREE.Mesh(rightArmGeo, cactusMat);
	cactusGroup.add(rightArm);

	// Golden Cactus Flower Bloom on top
	const flowerGeo = new THREE.ConeGeometry(0.12, 0.18, 6);
	disposables.push(flowerGeo);
	const flowerMat = new THREE.MeshStandardMaterial({
		color: 0xfbbf24,
		roughness: 0.35,
		emissive: 0xf59e0b,
		emissiveIntensity: 0.2
	});
	disposables.push(flowerMat);
	const flower = new THREE.Mesh(flowerGeo, flowerMat);
	flower.position.y = 1.22;
	cactusGroup.add(flower);

	group.add(cactusGroup);

	// 4. Compact Succulent Echeveria
	const echeveriaMat = new THREE.MeshStandardMaterial({
		color: 0x0d9488,
		roughness: 0.4
	});
	disposables.push(echeveriaMat);
	const echGroup = new THREE.Group();
	echGroup.position.set(-0.45, -0.64, -0.25);
	for (let i = 0; i < 14; i++) {
		const angle = i * 2.4;
		const r = 0.08 + (i / 14) * 0.18;
		const lGeo = new THREE.ConeGeometry(0.06, 0.16, 5);
		disposables.push(lGeo);
		const lMesh = new THREE.Mesh(lGeo, echeveriaMat);
		lMesh.position.set(Math.cos(angle) * r, (14 - i) * 0.012, Math.sin(angle) * r);
		lMesh.rotation.set(0.35, angle, 0.1);
		echGroup.add(lMesh);
	}
	group.add(echGroup);

	// 5. Faceted Geometric Glass Terrarium & Brass Edges
	const glassGeo = new THREE.IcosahedronGeometry(1.35, 1);
	disposables.push(glassGeo);
	const glassMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.25,
		roughness: 0.05,
		metalness: 0.05,
		transmission: 0.88,
		ior: 1.48
	});
	disposables.push(glassMat);
	const glassMesh = new THREE.Mesh(glassGeo, glassMat);
	glassMesh.position.y = 0.25;
	group.add(glassMesh);

	// Brass framework wireframe lines
	const wireGeo = new THREE.WireframeGeometry(glassGeo);
	disposables.push(wireGeo);
	const wireMat = new THREE.LineBasicMaterial({
		color: 0xd97706,
		linewidth: 1,
		transparent: true,
		opacity: 0.6
	});
	disposables.push(wireMat);
	const wireLines = new THREE.LineSegments(wireGeo, wireMat);
	wireLines.position.y = 0.25;
	group.add(wireLines);

	// 6. Warm Shimmering Desert Dust Motes
	const dustCount = 55;
	const dustGeo = new THREE.BufferGeometry();
	disposables.push(dustGeo);
	const dustPos = new Float32Array(dustCount * 3);

	for (let i = 0; i < dustCount; i++) {
		const angle = Math.random() * Math.PI * 2;
		const r = Math.random() * 0.9;
		dustPos[i * 3] = Math.cos(angle) * r;
		dustPos[i * 3 + 1] = -0.4 + Math.random() * 1.8;
		dustPos[i * 3 + 2] = Math.sin(angle) * r;
	}
	dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

	const dustMat = new THREE.PointsMaterial({
		color: 0xfef08a,
		size: 0.045,
		transparent: true,
		opacity: 0.7
	});
	disposables.push(dustMat);
	const dustPoints = new THREE.Points(dustGeo, dustMat);
	group.add(dustPoints);

	return {
		group,
		update: (time: number) => {
			// Subtle breathing of the cactus flower and echeveria
			flower.scale.setScalar(1 + Math.sin(time * 1.2) * 0.08);
			echGroup.rotation.y = time * 0.04;

			// Floating dust motes
			const pos = dustGeo.attributes.position.array as Float32Array;
			for (let i = 0; i < dustCount; i++) {
				pos[i * 3 + 1] += 0.0025;
				pos[i * 3] += Math.sin(time * 1.2 + i) * 0.0018;
				pos[i * 3 + 2] += Math.cos(time * 1.2 + i) * 0.0018;

				if (pos[i * 3 + 1] > 1.4) {
					pos[i * 3 + 1] = -0.4;
				}
			}
			dustGeo.attributes.position.needsUpdate = true;
		},
		dispose: () => {
			for (const item of disposables) {
				item.dispose();
			}
		}
	};
}
