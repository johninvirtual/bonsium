<script lang="ts">
	import { worldState } from '#lib/state/world-state.svelte';
	import type { BiosphereType } from '#lib/audio/bus/event-bus';
	import { SCALES } from '#lib/audio/scales/scales';

	const biospheres: { id: BiosphereType; label: string; icon: string }[] = [
		{ id: 'bonsai', label: 'Bonsai', icon: '🎋' },
		{ id: 'terrarium', label: 'Terrarium', icon: '🪴' },
		{ id: 'aquarium', label: 'Aquarium', icon: '🫧' },
		{ id: 'plantarium', label: 'Plantarium', icon: '🌸' }
	];

	let isInfoOpen = $state(false);

	function toggleInfo() {
		isInfoOpen = !isInfoOpen;
	}

	function playActiveItemSound() {
		worldState.triggerCategorySound();
	}
</script>

<!-- Screen Reader Polite Announcement Live Region -->
<div aria-live="polite" class="sr-only">
	{worldState.announcement}
</div>

<aside
	class="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-opacity duration-700 ease-in-out sm:p-5 {worldState.hudVisible
		? 'opacity-100'
		: 'opacity-0'}"
	aria-label="Zen HUD Controls"
>
	<!-- TOP BAR: Single Sleek Floating Island with Brand, Prominent Variants, and Controls -->
	<header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
		<!-- Top Row: Brand & Quick Controls on Mobile -->
		<div class="pointer-events-auto flex items-center justify-between gap-2">
			<!-- Brand Pill -->
			<div
				class="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md transition-colors duration-700 dark:bg-black/75"
			>
				<span class="text-sm" aria-hidden="true">
					{#if worldState.activeBiosphere === 'bonsai'}
						🎋
					{:else if worldState.activeBiosphere === 'terrarium'}
						🪴
					{:else if worldState.activeBiosphere === 'aquarium'}
						🫧
					{:else}
						🌸
					{/if}
				</span>
				<span
					class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 dark:bg-[#00ff88]"
					aria-hidden="true"
				></span>
				<h1
					class="text-xs font-medium tracking-widest text-emerald-950 uppercase dark:text-emerald-100"
				>
					Bonsium
				</h1>
			</div>

			<!-- Mobile Quick Controls (Segmented Theme Selector, Mute, Info Toggle) -->
			<div class="flex items-center gap-1.5 sm:hidden">
				<!-- Mobile Explicit 3-Mode Theme Selector -->
				<div
					class="flex items-center rounded-full border border-emerald-500/20 bg-white/80 p-0.5 shadow-sm backdrop-blur-md transition-colors duration-700 dark:bg-black/75"
					role="group"
					aria-label="Theme mode"
				>
					<button
						type="button"
						onclick={() => worldState.setTheme('light')}
						class="flex h-7 w-7 items-center justify-center rounded-full text-xs transition {worldState.theme ===
						'light'
							? 'bg-emerald-500/25 font-bold text-emerald-950 shadow-xs'
							: 'text-neutral-500 hover:text-black dark:text-neutral-400'}"
						title="Light Mode (Fresh & Green)"
						aria-label="Light mode"
						aria-pressed={worldState.theme === 'light'}
					>
						☀️
					</button>
					<button
						type="button"
						onclick={() => worldState.setTheme('dark')}
						class="flex h-7 w-7 items-center justify-center rounded-full text-xs transition {worldState.theme ===
						'dark'
							? 'bg-[#00ff88]/25 font-bold text-[#00ff88] shadow-xs'
							: 'text-neutral-500 hover:text-black dark:text-neutral-400'}"
						title="Dark Mode (True Black & Neon Green)"
						aria-label="Dark mode"
						aria-pressed={worldState.theme === 'dark'}
					>
						🌙
					</button>
					<button
						type="button"
						onclick={() => worldState.setTheme('auto')}
						class="flex h-7 w-7 items-center justify-center rounded-full text-xs transition {worldState.theme ===
						'auto'
							? 'bg-emerald-500/20 font-bold text-emerald-800 shadow-xs dark:text-[#00ff88]'
							: 'text-neutral-500 hover:text-black dark:text-neutral-400'}"
						title="Auto Mode (Follows System OS Theme)"
						aria-label="Auto mode"
						aria-pressed={worldState.theme === 'auto'}
					>
						⚙️
					</button>
				</div>

				<button
					type="button"
					onclick={() => worldState.toggleMute()}
					class="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/20 bg-white/80 text-xs shadow-sm backdrop-blur-md transition hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:bg-black/75"
					title={worldState.isMuted ? 'Unmute' : 'Mute'}
					aria-label={worldState.isMuted ? 'Unmute audio' : 'Mute audio'}
				>
					{worldState.isMuted ? '🔇' : '🔊'}
				</button>

				<!-- Mobile Top-Right Info Button -->
				<button
					type="button"
					onclick={toggleInfo}
					class="flex h-8 w-8 items-center justify-center rounded-full border text-xs shadow-sm backdrop-blur-md transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden {isInfoOpen
						? 'border-emerald-500 bg-emerald-500/20 text-emerald-950 dark:border-[#00ff88] dark:bg-[#00ff88]/20 dark:text-[#00ff88]'
						: 'border-emerald-500/20 bg-white/80 text-neutral-700 hover:bg-emerald-500/10 dark:bg-black/75 dark:text-neutral-300'}"
					title="Toggle item information"
					aria-label="Toggle item information"
					aria-expanded={isInfoOpen}
				>
					ℹ️
				</button>
			</div>
		</div>

		<!-- PROMINENT VARIANT SELECTOR PILLS -->
		<div
			class="pointer-events-auto flex items-center justify-between gap-1.5 rounded-2xl border border-emerald-500/20 bg-white/85 p-1.5 shadow-sm backdrop-blur-md transition-colors duration-700 sm:rounded-full sm:px-3 sm:py-1.5 dark:bg-black/75"
			role="group"
			aria-label="Biosphere variants"
		>
			<span
				class="hidden px-1 text-[10px] font-medium tracking-wider text-neutral-400 uppercase sm:inline dark:text-neutral-500"
			>
				Variant:
			</span>

			<div class="flex flex-1 items-center gap-1">
				{#each worldState.activeItemsList as item, idx (item.id)}
					<button
						type="button"
						onclick={() => worldState.selectItem(idx)}
						class="flex flex-1 items-center justify-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden sm:flex-initial sm:rounded-full {worldState.activeItemIndex ===
						idx
							? 'border border-emerald-500/50 bg-emerald-500/20 text-emerald-950 shadow-xs dark:border-[#00ff88]/50 dark:bg-[#00ff88]/20 dark:text-[#00ff88]'
							: 'border border-transparent bg-neutral-100/80 text-neutral-600 hover:border-emerald-500/20 hover:bg-neutral-200/80 dark:bg-white/10 dark:text-neutral-300 dark:hover:bg-white/20'}"
						title={item.title}
						aria-pressed={worldState.activeItemIndex === idx}
					>
						<span class="font-mono text-[10px] opacity-60">{idx + 1}.</span>
						<span class="truncate">{item.title.split(' ')[0]}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Desktop Top-Right Controls: Explicit 3-Mode Theme Selector, Breathe, Hide, and Prominent Info Toggle -->
		<div class="pointer-events-auto hidden items-center gap-2 sm:flex">
			<!-- Segmented Theme Switcher -->
			<div
				class="flex items-center rounded-full border border-emerald-500/20 bg-white/80 p-0.5 shadow-sm backdrop-blur-md transition-colors duration-700 dark:bg-black/75"
				role="group"
				aria-label="Theme mode selection"
			>
				<button
					type="button"
					onclick={() => worldState.setTheme('light')}
					class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all {worldState.theme ===
					'light'
						? 'border border-emerald-500/40 bg-emerald-500/25 text-emerald-950 shadow-xs'
						: 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					title="Light Mode (Fresh, white with subtle green accents)"
					aria-pressed={worldState.theme === 'light'}
				>
					<span>☀️</span>
					<span>Light</span>
				</button>

				<button
					type="button"
					onclick={() => worldState.setTheme('dark')}
					class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all {worldState.theme ===
					'dark'
						? 'border border-[#00ff88]/40 bg-[#00ff88]/25 text-[#00ff88] shadow-xs'
						: 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					title="Dark Mode (True black with neon green)"
					aria-pressed={worldState.theme === 'dark'}
				>
					<span>🌙</span>
					<span>Dark</span>
				</button>

				<button
					type="button"
					onclick={() => worldState.setTheme('auto')}
					class="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all {worldState.theme ===
					'auto'
						? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-950 shadow-xs dark:text-[#00ff88]'
						: 'text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white'}"
					title="Auto Mode (Follows your OS system theme preference)"
					aria-pressed={worldState.theme === 'auto'}
				>
					<span>⚙️</span>
					<span>Auto</span>
				</button>
			</div>

			<button
				type="button"
				onclick={() => worldState.toggleBreatheMode()}
				class="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-white/80 px-3 py-1.5 text-xs text-neutral-700 shadow-sm backdrop-blur-md transition hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:bg-black/75 dark:text-neutral-300"
				title="Enter distraction-free meditation"
			>
				🧘 Breathe
			</button>

			<button
				type="button"
				onclick={() => worldState.toggleHud()}
				class="rounded-full border border-emerald-500/20 bg-white/80 px-2.5 py-1.5 text-xs text-neutral-600 shadow-sm backdrop-blur-md transition hover:text-black focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:bg-black/75 dark:text-neutral-400 dark:hover:text-white"
				title="Hide interface"
			>
				Hide
			</button>

			<!-- Desktop Info Button in Top-Right Corner -->
			<button
				type="button"
				onclick={toggleInfo}
				class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden {isInfoOpen
					? 'border-emerald-500 bg-emerald-500/25 text-emerald-950 dark:border-[#00ff88] dark:bg-[#00ff88]/25 dark:text-[#00ff88]'
					: 'border-emerald-500/20 bg-white/80 text-neutral-700 hover:bg-emerald-500/10 dark:bg-black/75 dark:text-neutral-300'}"
				title="Toggle item details and story"
				aria-expanded={isInfoOpen}
			>
				<span>ℹ️</span>
				<span>{isInfoOpen ? 'Close Info' : 'Info'}</span>
			</button>
		</div>
	</header>

	<!-- BOTTOM DOCK: Single Slim Unified Floating Island for Categories & Audio -->
	<footer class="flex justify-center">
		<nav
			class="pointer-events-auto flex items-center gap-1 rounded-full border border-emerald-500/20 bg-white/85 p-1 shadow-md backdrop-blur-lg transition-colors duration-700 sm:gap-2 sm:p-1.5 dark:bg-black/80"
			aria-label="Biosphere category switcher"
		>
			{#each biospheres as bio (bio.id)}
				<button
					type="button"
					onclick={() => worldState.switchBiosphere(bio.id)}
					class="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden sm:px-4 sm:py-2 {worldState.activeBiosphere ===
					bio.id
						? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-950 shadow-xs dark:border-[#00ff88]/40 dark:bg-[#00ff88]/20 dark:text-[#00ff88]'
						: 'text-neutral-600 hover:bg-black/5 hover:text-black dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-white'}"
					aria-pressed={worldState.activeBiosphere === bio.id}
				>
					<span class="text-sm">{bio.icon}</span>
					<span class="capitalize">{bio.label}</span>
				</button>
			{/each}

			<!-- Desktop Audio Wave Pill -->
			<div class="hidden items-center gap-2 border-l border-emerald-500/15 pl-2 sm:flex">
				<button
					type="button"
					onclick={() => worldState.toggleMute()}
					class="text-xs text-neutral-700 transition hover:text-black focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:text-neutral-300 dark:hover:text-white"
					title={worldState.isMuted ? 'Unmute audio' : 'Mute audio'}
				>
					{worldState.isMuted ? '🔇' : '🔊'}
				</button>

				<input
					type="range"
					min="0"
					max="1"
					step="0.05"
					value={worldState.masterVolume}
					oninput={(e) => worldState.setVolume(parseFloat((e.target as HTMLInputElement).value))}
					class="h-1 w-14 cursor-pointer accent-emerald-500 opacity-80 hover:opacity-100 dark:accent-[#00ff88]"
					aria-label="Master audio volume"
				/>
			</div>
		</nav>
	</footer>
</aside>

<!-- TOP-RIGHT COLLAPSIBLE INFO CARD (Clear vertical margin below header, zero text-button collision) -->
{#if isInfoOpen}
	<!-- Subtle click-outside backdrop detector -->
	<button
		type="button"
		class="fixed inset-0 z-35 cursor-default bg-transparent focus:outline-hidden"
		onclick={() => (isInfoOpen = false)}
		aria-label="Close info overlay"
		tabindex="-1"
	></button>

	<section
		class="fixed top-28 right-3 z-40 flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:top-20 sm:right-5 sm:max-w-md sm:p-5 dark:border-[#00ff88]/30 dark:bg-zinc-950/95"
		aria-label="Item Story & Details"
	>
		<div class="flex items-start justify-between gap-2 border-b border-emerald-500/15 pb-2.5">
			<div>
				<h2 class="text-sm font-semibold text-neutral-900 sm:text-base dark:text-white">
					{worldState.activeItem.title}
				</h2>
				<p class="text-xs font-medium text-emerald-700 dark:text-[#00ff88]">
					{worldState.activeItem.subtitle}
				</p>
			</div>
			<button
				type="button"
				onclick={() => (isInfoOpen = false)}
				class="rounded-full p-1 text-xs text-neutral-400 transition hover:bg-neutral-100 hover:text-black dark:hover:bg-white/10 dark:hover:text-white"
				title="Close Info"
				aria-label="Close info panel"
			>
				✕
			</button>
		</div>

		<p class="text-xs leading-relaxed font-light text-neutral-600 dark:text-neutral-300">
			{worldState.activeItem.lore}
		</p>

		<!-- Generative sound preview with separated header row & description (eliminates text collision) -->
		<div
			class="flex flex-col gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3 dark:border-white/10 dark:bg-white/5"
		>
			<div class="flex items-center justify-between gap-2">
				<span
					class="text-[10px] font-semibold tracking-wider text-emerald-800 uppercase dark:text-[#00ff88]"
				>
					Scale: {SCALES[worldState.currentScale].name}
				</span>
				<button
					type="button"
					onclick={playActiveItemSound}
					class="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-950 transition hover:bg-emerald-500/30 dark:border-[#00ff88]/50 dark:bg-[#00ff88]/20 dark:text-[#00ff88]"
				>
					<span class="text-[10px]">▶</span>
					<span>Play Chime</span>
				</button>
			</div>
			<p class="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
				{worldState.activeItem.instrumentLore}
			</p>
		</div>

		<!-- Compact Audio Controls inside Info Drawer -->
		<div
			class="flex items-center justify-between gap-2 border-t border-emerald-500/10 pt-2 text-xs"
		>
			<div class="flex items-center gap-2">
				<span class="text-neutral-400 dark:text-neutral-500">Volume:</span>
				<input
					type="range"
					min="0"
					max="1"
					step="0.05"
					value={worldState.masterVolume}
					oninput={(e) => worldState.setVolume(parseFloat((e.target as HTMLInputElement).value))}
					class="h-1.5 w-24 cursor-pointer accent-emerald-500 dark:accent-[#00ff88]"
					aria-label="Volume slider"
				/>
			</div>
			<button
				type="button"
				onclick={() => worldState.toggleMute()}
				class="rounded-lg px-2 py-0.5 text-xs text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10"
			>
				{worldState.isMuted ? 'Unmute' : 'Mute'}
			</button>
		</div>
	</section>
{/if}

<!-- Button to exit Breathe mode -->
{#if !worldState.hudVisible}
	<button
		type="button"
		onclick={() => worldState.toggleBreatheMode()}
		class="fixed top-4 right-4 z-40 rounded-full border border-emerald-500/20 bg-white/80 px-4 py-2 text-xs text-neutral-700 shadow-md backdrop-blur-md transition hover:bg-emerald-500/10 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden dark:bg-black/70 dark:text-neutral-200 dark:hover:bg-white/10"
	>
		✕ Exit Breathe Mode
	</button>
{/if}
