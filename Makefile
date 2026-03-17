# =============================================================================
# YT-MP3-APK — Makefile
# Uso: make <comando>
# =============================================================================

.PHONY: help install start lint clean

help:
	@echo ""
	@echo "  YT-MP3-APK — Comandos disponibles"
	@echo "  ==================================="
	@echo "  make install    Instala las dependencias del proyecto"
	@echo "  make start      Arranca el servidor de desarrollo Expo"
	@echo "  make lint       Ejecuta ESLint sobre todo el código"
	@echo "  make clean      Elimina node_modules y caché de Expo"
	@echo ""

install:
	@echo "→ Instalando dependencias..."
	npm install
	@echo "✓ Dependencias instaladas"

start:
	@echo "→ Arrancando Expo..."
	npx expo start

lint:
	@echo "→ Ejecutando ESLint..."
	npx eslint src/ App.js
	@echo "✓ Lint completado"

clean:
	@echo "→ Limpiando proyecto..."
	rm -rf node_modules .expo
	@echo "✓ Limpieza completada"
