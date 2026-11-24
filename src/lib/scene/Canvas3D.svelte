<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { worldState } from '#lib/state/world-state.svelte';
	import { proceduralAudio } from '#lib/audio/engine/procedural-audio';
	import { avEventBus, type BiosphereType } from '#lib/audio/bus/event-bus';
	import { createBonsaiModel, type BiosphereModel } from '#lib/scene/models/bonsai';
	import { createBonsaiSakuraModel } from '#lib/scene/models/bonsai-sakura';
	import { createBonsaiJuniperModel } from '#lib/scene/models/bonsai-juniper';
	import { createTerrariumModel } from '#lib/scene/models/terrarium';
	import { createTerrariumDesertModel } from '#lib/scene/models/terrarium-desert';
	import { createTerrariumCarnivorousModel } from '#lib/scene/models/terrarium-carnivorous';
	import { createAquariumModel } from '#lib/scene/models/aquarium';
	import { createAquariumCoralModel } from '#lib/scene/models/aquarium-coral';
	import { createAquariumJellyfishModel } from '#lib/scene/models/aquarium-jellyfish';
	import { createPlantariumModel } from '#lib/scene/models/plantarium';
	import { createPlantariumFernModel } from '#lib/scene/models/plantarium-fern';
	import { createPlantariumCereusModel } from '#lib/scene/models/plantarium-cereus';

	let container = $state<HTMLDivElement | null>(null);
	let canvasElement = $state<HTMLCanvasElement | null>(null);

	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let activeModel: BiosphereModel | null = null;

	let animationFrameId: number | null = null;
	let resizeObserver: ResizeObserver | null = null;

	// Orbit & Parallax interaction
	let targetRotationX = 0;
	let targetRotationY = 0;
	let currentRotationX = 0;
	let currentRotationY = 0;
	let isDragging = false;
	let previousPointerX = 0;
	let previousPointerY = 0;

	// Zoom (Camera distance z)
	let targetCameraZ = 5.2;
	let currentCameraZ = 5.2;
	const minCameraZ = 3.2;
	const maxCameraZ = 8.5;

	// Touch pinch-to-zoom tracking
	let initialPinchDistance = 0;
	let initialCameraZOnPinch = 5.2;

	// Pulse reaction on click / tap
	let pulseScale = 1.0;
	let pulseVelocity = 0;

	// Raycasting for interaction
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	function loadModel(bio: BiosphereType, itemIndex: number): BiosphereModel {
		switch (bio) {
			case 'bonsai':
				if (itemIndex === 1) return createBonsaiSakuraModel();
				if (itemIndex === 2) return createBonsaiJuniperModel();
				return createBonsaiModel();
			case 'terrarium':
				if (itemIndex === 1) return createTerrariumDesertModel();
				if (itemIndex === 2) return createTerrariumCarnivorousModel();
				return createTerrariumModel();
			case 'aquarium':
				if (itemIndex === 1) return createAquariumCoralModel();
				if (itemIndex === 2) return createAquariumJellyfishModel();
				return createAquariumModel();
			case 'plantarium':
				if (itemIndex === 1) return createPlantariumFernModel();
				if (itemIndex === 2) return createPlantariumCereusModel();
				return createPlantariumModel();
		}
	}

	function switchActiveModel(bio: BiosphereType, itemIndex: number) {
		if (!scene) return;

		if (activeModel) {
			scene.remove(activeModel.group);
			activeModel.dispose();
			activeModel = null;
		}

		activeModel = loadModel(bio, itemIndex);
		activeModel.group.scale.set(0.01, 0.01, 0.01);
		scene.add(activeModel.group);

		// Animate scale in
		pulseScale = 0.15;
		pulseVelocity = 0.12;
	}

	// React to biosphere or item index change from Svelte 5 state
	$effect(() => {
		const bio = worldState.activeBiosphere;
		const idx = worldState.activeItemIndex;
		if (scene) {
			switchActiveModel(bio, idx);
		}
	});

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		previousPointerX = e.clientX;
		previousPointerY = e.clientY;
	}

	function handlePointerMove(e: PointerEvent) {
		if (!container) return;

		if (isDragging) {
			const deltaX = e.clientX - previousPointerX;
			const deltaY = e.clientY - previousPointerY;
			targetRotationY += deltaX * 0.008;
			targetRotationX = Math.max(-0.45, Math.min(0.45, targetRotationX + deltaY * 0.008));
			previousPointerX = e.clientX;
			previousPointerY = e.clientY;
		} else {
			// Subtle parallax on hover
			const rect = container.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
			targetRotationY = x * 0.3;
			targetRotationX = -y * 0.15;
		}
	}

	function handlePointerUp() {
		isDragging = false;
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const zoomDelta = e.deltaY * 0.003;
		targetCameraZ = Math.max(minCameraZ, Math.min(maxCameraZ, targetCameraZ + zoomDelta));
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			initialPinchDistance = Math.hypot(dx, dy);
			initialCameraZOnPinch = targetCameraZ;
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length === 2 && initialPinchDistance > 0) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			const currentDist = Math.hypot(dx, dy);
			const scale = initialPinchDistance / currentDist;
			targetCameraZ = Math.max(minCameraZ, Math.min(maxCameraZ, initialCameraZOnPinch * scale));
		}
	}

	function handleClick(e: MouseEvent) {
		if (!container || !camera || !scene || !activeModel) return;

		const rect = container.getBoundingClientRect();
		mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(activeModel.group.children, true);

		if (intersects.length > 0) {
			// Physical pulse reaction
			pulseVelocity = 0.12;

			// Trigger sound and event bus
			switch (worldState.activeBiosphere) {
				case 'bonsai':
					proceduralAudio.triggerBonsaiPluck(true);
					avEventBus.emit({
						type: 'BRANCH_PRUNED',
						biosphere: 'bonsai',
						branchLength: 0.5,
						cutHeight: 0.7,
						force: 1.0,
						timestamp: Date.now()
					});
					break;
				case 'terrarium':
					proceduralAudio.triggerGlassChime(true);
					avEventBus.emit({
						type: 'GLASS_TAPPED',
						biosphere: 'terrarium',
						hitPoint: [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z],
						velocity: 1.0,
						timestamp: Date.now()
					});
					break;
				case 'aquarium':
					proceduralAudio.triggerBubble(true);
					avEventBus.emit({
						type: 'WATER_RIPPLED',
						biosphere: 'aquarium',
						position: [intersects[0].point.x, intersects[0].point.y, intersects[0].point.z],
						intensity: 1.0,
						radius: 0.5,
						timestamp: Date.now()
					});
					break;
				case 'plantarium':
					proceduralAudio.triggerBloomHarmonic(true);
					avEventBus.emit({
						type: 'SUNLIGHT_CHANGED',
						biosphere: 'plantarium',
						elevation: 45,
						azimuth: 180,
						intensity: 1.0,
						timestamp: Date.now()
					});
					break;
			}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			pulseVelocity = 0.12;
			worldState.triggerCategorySound();
		} else if (e.key === '+' || e.key === '=') {
			targetCameraZ = Math.max(minCameraZ, targetCameraZ - 0.4);
		} else if (e.key === '-' || e.key === '_') {
			targetCameraZ = Math.min(maxCameraZ, targetCameraZ + 0.4);
		}
	}

	onMount(() => {
		if (!container || !canvasElement) return;

		// 1. Scene
		scene = new THREE.Scene();

		// 2. Camera with initial distance
		const width = container.clientWidth;
		const height = container.clientHeight;
		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
		camera.position.set(0, 0.5, targetCameraZ);

		// 3. Renderer with DPR clamped to 2
		renderer = new THREE.WebGLRenderer({
			canvas: canvasElement,
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// 4. Stable Natural Studio Lighting (Theme-independent for authentic model fidelity)
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
		scene.add(ambientLight);

		const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
		sunLight.position.set(4, 7, 5);
		sunLight.castShadow = true;
		sunLight.shadow.mapSize.width = 1024;
		sunLight.shadow.mapSize.height = 1024;
		scene.add(sunLight);

		const fillLight = new THREE.PointLight(0xe0f2fe, 0.85, 12);
		fillLight.position.set(-4, 3, -2);
		scene.add(fillLight);

		// Initial model
		switchActiveModel(worldState.activeBiosphere, worldState.activeItemIndex);

		// 5. Animation Loop
		const clock = new THREE.Clock();
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			const time = clock.getElapsedTime();

			// Smooth rotation damping
			currentRotationX += (targetRotationX - currentRotationX) * 0.05;
			currentRotationY += (targetRotationY - currentRotationY) * 0.05;

			// Smooth zoom damping
			currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;
			if (camera) {
				camera.position.z = currentCameraZ;
			}

			// Pulse spring physics
			pulseScale += pulseVelocity;
			pulseVelocity += (1.0 - pulseScale) * 0.16;
			pulseVelocity *= 0.82; // Damping

			if (activeModel) {
				activeModel.update(time);
				activeModel.group.rotation.x = currentRotationX;

				// Turntable spin: pause when reduced motion is preferred
				const spin = worldState.prefersReducedMotion ? 0 : time * 0.12;
				activeModel.group.rotation.y = spin + currentRotationY;
				activeModel.group.scale.set(pulseScale, pulseScale, pulseScale);
			}

			if (renderer && scene && camera) {
				renderer.render(scene, camera);
			}
		};
		animate();

		// 6. Resize Observer
		resizeObserver = new ResizeObserver(() => {
			if (!container || !renderer || !camera) return;
			const newW = container.clientWidth;
			const newH = container.clientHeight;
			camera.aspect = newW / newH;
			camera.updateProjectionMatrix();
			renderer.setSize(newW, newH);
		});
		resizeObserver.observe(container);
	});

	onDestroy(() => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
		}
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
		if (activeModel) {
			activeModel.dispose();
		}
		if (renderer) {
			renderer.dispose();
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={container}
	class="relative h-full w-full cursor-grab select-none focus:outline-hidden active:cursor-grabbing"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	onwheel={handleWheel}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	tabindex="-1"
	role="region"
	aria-label="3D Interactive Biosphere Viewport. Use mouse or touch to orbit, scroll to zoom, tap to resonate."
>
	<canvas bind:this={canvasElement} class="block h-full w-full"></canvas>
</div>
