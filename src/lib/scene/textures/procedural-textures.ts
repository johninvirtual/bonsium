import * as THREE from 'three';

/**
 * Generates procedural canvas textures purely via code.
 * No external image assets required.
 */

export function createWoodTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 512;
	const ctx = canvas.getContext('2d')!;

	ctx.fillStyle = '#4a3324';
	ctx.fillRect(0, 0, 512, 512);

	// Wood grain noise rings
	ctx.strokeStyle = '#322115';
	ctx.lineWidth = 2;
	for (let i = 0; i < 40; i++) {
		ctx.beginPath();
		const y = i * 14 + (Math.random() * 8 - 4);
		ctx.moveTo(0, y);
		ctx.bezierCurveTo(170, y + 10, 340, y - 10, 512, y);
		ctx.stroke();
	}

	// Fine noise grain
	const imgData = ctx.getImageData(0, 0, 512, 512);
	const data = imgData.data;
	for (let i = 0; i < data.length; i += 4) {
		const noise = (Math.random() - 0.5) * 22;
		data[i] = Math.max(0, Math.min(255, data[i] + noise));
		data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.8));
		data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.6));
	}
	ctx.putImageData(imgData, 0, 0);

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
}

export function createMossTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext('2d')!;

	ctx.fillStyle = '#1e3822';
	ctx.fillRect(0, 0, 256, 256);

	// Velvet speckles
	for (let i = 0; i < 4000; i++) {
		const x = Math.random() * 256;
		const y = Math.random() * 256;
		const r = Math.random() * 2;
		const greenTone = Math.random() > 0.4 ? '#34713e' : '#52a35f';
		ctx.fillStyle = greenTone;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2);
		ctx.fill();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
}

export function createCausticsTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext('2d')!;

	ctx.fillStyle = '#061a1b';
	ctx.fillRect(0, 0, 256, 256);

	ctx.strokeStyle = '#22d3ee';
	ctx.lineWidth = 3;
	ctx.filter = 'blur(4px)';

	for (let i = 0; i < 16; i++) {
		ctx.beginPath();
		const x1 = Math.random() * 256;
		const y1 = Math.random() * 256;
		const x2 = Math.random() * 256;
		const y2 = Math.random() * 256;
		ctx.moveTo(x1, y1);
		ctx.bezierCurveTo(x1 + 40, y1 + 50, x2 - 40, y2 - 50, x2, y2);
		ctx.stroke();
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	return texture;
}

export function createPetalGradientTexture(): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 256;
	const ctx = canvas.getContext('2d')!;

	const gradient = ctx.createLinearGradient(0, 0, 0, 256);
	gradient.addColorStop(0, '#fef08a'); // Warm golden tip
	gradient.addColorStop(0.35, '#f472b6'); // Sakura pink
	gradient.addColorStop(1, '#10b981'); // Fresh green base

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 128, 256);

	const texture = new THREE.CanvasTexture(canvas);
	return texture;
}
