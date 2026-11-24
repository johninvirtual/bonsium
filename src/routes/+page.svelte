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
	class="relative h-screen w-screen overflow-hidden transition-colors duration-700 ease-in-out select-none {worldState.activeThemeActual ===
	'dark'
		? 'bg-gradient-to-b from-[#000000] via-[#040d07] to-[#000000]'
		: 'bg-gradient-to-b from-[#fbfdfb] via-[#f0f7f2] to-[#e4f0e7]'}"
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
					<h2 class="text-xl font-medium tracking-wide text-emerald-950 dark:text-emerald-100">
						Enter Bonsium
					</h2>
					<p class="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
						A meditative 3D audiovisual sanctuary. Tap below to awaken procedural ambient music and
						interactive acoustic vibrations.
					</p>
				</div>

				<button
					type="button"
					onclick={handleEnterExperience}
					class="w-full rounded-full border border-emerald-500/40 bg-emerald-500/20 px-6 py-3 text-sm font-medium tracking-wider text-emerald-950 uppercase transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:border-[#00ff88]/50 dark:bg-[#00ff88]/20 dark:text-[#00ff88] dark:hover:border-[#00ff88] dark:hover:bg-[#00ff88]/30 dark:hover:shadow-[#00ff88]/20"
				>
					Enter Sanctuary
				</button>
			</div>
		</div>
	{/if}
</main>
