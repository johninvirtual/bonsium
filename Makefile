SHELL := /bin/zsh
.SHELLFLAGS := -e -c

NVM_DIR ?= $(HOME)/.nvm
NVM_SH := $(NVM_DIR)/nvm.sh
NODE_VERSION := $(shell [ -f .nvmrc ] && tr -d ' \n\r' < .nvmrc || echo "26")

# Macro to source NVM if available, and execute commands within nvm environment
NVM_EXEC = if [ -s "$(NVM_SH)" ]; then . "$(NVM_SH)" && nvm use $(NODE_VERSION) >/dev/null 2>&1; fi;

.PHONY: help nvm-install nvm-use nvm-env nvm-which install dev build preview check format lint clean

# Default target
all: help

## ── Help ─────────────────────────────────────────────────────────────
help:
	@echo "========================================================================"
	@echo "  Bonsium - Interactive 3D & Generative Audio Ecosystem"
	@echo "========================================================================"
	@echo "NVM Commands:"
	@echo "  make nvm-env       - Show active Node, NPM, and NVM versions"
	@echo "  make nvm-use       - Load and switch to the Node version in .nvmrc"
	@echo "  make nvm-install   - Install the Node version specified in .nvmrc"
	@echo "  make nvm-which     - Display full path to the resolved node executable"
	@echo ""
	@echo "Development Commands:"
	@echo "  make install       - Install dependencies with npm using .nvmrc Node"
	@echo "  make dev           - Start SvelteKit development server (with hot reload)"
	@echo "  make build         - Build production bundle with Vite"
	@echo "  make preview       - Preview production build locally"
	@echo "  make check         - Run svelte-check diagnostics and TypeScript checks"
	@echo "  make format        - Format source code with Prettier"
	@echo "  make lint          - Run ESLint checks"
	@echo "  make clean         - Remove build artifacts, cache, and node_modules"
	@echo "========================================================================"

## ── NVM Targets ──────────────────────────────────────────────────────
nvm-install:
	@if [ -s "$(NVM_SH)" ]; then \
		. "$(NVM_SH)" && nvm install $(NODE_VERSION); \
	else \
		echo "Error: nvm script not found at $(NVM_SH)"; exit 1; \
	fi

nvm-use:
	@if [ -s "$(NVM_SH)" ]; then \
		. "$(NVM_SH)" && nvm use $(NODE_VERSION); \
	else \
		echo "Error: nvm script not found at $(NVM_SH)"; exit 1; \
	fi

nvm-env:
	@$(NVM_EXEC) \
	echo "Target .nvmrc: $(NODE_VERSION)"; \
	echo "Active Node:   $$(node -v 2>/dev/null || echo 'not found')"; \
	echo "Active NPM:    $$(npm -v 2>/dev/null || echo 'not found')"; \
	if [ -s "$(NVM_SH)" ]; then \
		. "$(NVM_SH)" && echo "NVM Version:   $$(nvm --version 2>/dev/null || echo 'unknown')"; \
	else \
		echo "NVM Script:    Not found at $(NVM_SH)"; \
	fi

nvm-which:
	@$(NVM_EXEC) which node || echo "Node binary not found"

## ── Dependency & Build Targets ─────────────────────────────────────────
install:
	@$(NVM_EXEC) npm install

dev:
	@$(NVM_EXEC) npm run dev

build:
	@$(NVM_EXEC) npm run build

preview:
	@$(NVM_EXEC) npm run preview

check:
	@$(NVM_EXEC) npm run check

format:
	@$(NVM_EXEC) npx prettier --write .

lint:
	@$(NVM_EXEC) npm run lint

clean:
	@echo "Cleaning build artifacts and temporary files..."
	@rm -rf .svelte-kit build dist node_modules/.vite
	@echo "Clean complete."
