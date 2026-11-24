<script lang="ts">
	import Canvas3D from '#lib/scene/Canvas3D.svelte';
	import ZenHud from '#lib/components/ZenHud.svelte';
	import { worldState } from '#lib/state/world-state.svelte';
	import { proceduralAudio } from '#lib/audio/engine/procedural-audio';
	import { avEventBus } from '#lib/audio/bus/event-bus';

	async function handleEnterExperience() {
		await proceduralAudio.init();
		worldState.isAudioInitialized = true;

		avEventBus.emit({
			type: 'BIOSPHERE_CHANGED',
			biosphere: worldState.activeBiosphere,
			previousBiosphere: worldState.activeBiosphere,
			nextBiosphere: worldState.activeBiosphere,
			timestamp: Date.now()
		});
	}
</script>

<svelte:head>
	<title>Bonsium — {worldState.activeItem.title}</title>
</svelte:head>

<main
	class="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-[#fbfdfb] via-[#f0f6f2] to-[#e8f2eb] transition-colors duration-700 ease-in-out select-none dark:from-[#000000] dark:via-[#040d07] dark:to-[#000000]"
>
	<!-- Real-time 3D Viewport -->
	<div class="absolute inset-0">
		<Canvas3D />
	</div>

	<!-- Zen HUD Overlay -->
	<ZenHud />

	<!-- Initial Audio Autoplay Unlock Barrier Modal -->
	{#if !worldState.isAudioInitialized}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-500 dark:bg-black/85"
			role="dialog"
			aria-modal="true"
			aria-label="Welcome to Bonsium. Enter experience to enable audio."
		>
			<div
				class="flex max-w-sm flex-col items-center gap-6 rounded-3xl border border-emerald-500/25 bg-white/95 p-8 text-center shadow-2xl transition-colors duration-700 sm:p-10 dark:bg-zinc-950/95"
			>
				<div class="animate-breathe text-6xl" aria-hidden="true">🌱</div>

				<div class="space-y-2">
					<h2
						class="text-xl font-light tracking-widest text-emerald-950 uppercase dark:text-emerald-100"
					>
						Bonsium
					</h2>
					<p class="text-xs leading-relaxed font-light text-neutral-600 dark:text-neutral-400">
						Interactive 3D biospheres with living generative ASMR soundscapes.
					</p>
				</div>

				<button
					type="button"
					onclick={handleEnterExperience}
					class="w-full cursor-pointer rounded-full border border-emerald-600/30 bg-emerald-600 px-6 py-3 text-xs font-semibold tracking-wider text-white uppercase shadow-md transition hover:bg-emerald-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:border-[#00ff88]/50 dark:bg-[#00ff88]/20 dark:text-[#00ff88] dark:hover:bg-[#00ff88]/30"
				>
					Begin Contemplation
				</button>

				<p class="text-[10px] font-light text-neutral-400 dark:text-neutral-500">
					Sound is 100% procedurally synthesized in real-time.
				</p>
			</div>
		</div>
	{/if}
</main>
