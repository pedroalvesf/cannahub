#!/bin/bash
# Converte todas as imagens PNG/JPG de tratamentos para WebP otimizado.
#
# Uso:
#   1. Coloque os PNGs em public/treatments/ (ex: epilepsia-hero.png)
#   2. Rode: bash apps/web/scripts/convert-images.sh
#   3. O script gera os .webp e atualiza treatments.ts automaticamente
#
# Requisitos:
#   brew install webp   (instala cwebp)

set -e

TREATMENTS_DIR="$(dirname "$0")/../public/treatments"
DATA_FILE="$(dirname "$0")/../src/data/treatments.ts"

# Verificar cwebp
if ! command -v cwebp &>/dev/null; then
  echo "❌ cwebp não encontrado. Instale com: brew install webp"
  exit 1
fi

echo "🔄 Convertendo imagens para WebP..."

count=0
for img in "$TREATMENTS_DIR"/*-hero.png "$TREATMENTS_DIR"/*-hero.jpg "$TREATMENTS_DIR"/*-hero.jpeg; do
  [ -f "$img" ] || continue

  filename=$(basename "$img")
  name="${filename%.*}"
  webp="$TREATMENTS_DIR/${name}.webp"

  if [ -f "$webp" ] && [ "$webp" -nt "$img" ]; then
    echo "  ⏭  ${name}.webp (já existe, mais recente)"
    continue
  fi

  cwebp -q 82 -resize 960 0 "$img" -o "$webp" 2>/dev/null

  original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
  webp_size=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp" 2>/dev/null)
  savings=$(( (original_size - webp_size) * 100 / original_size ))

  echo "  ✅ ${filename} → ${name}.webp (${savings}% menor)"
  count=$((count + 1))
done

if [ $count -eq 0 ]; then
  echo "  Nenhuma imagem nova para converter."
else
  echo ""
  echo "✅ ${count} imagem(ns) convertida(s)."
  echo ""
  echo "📝 Próximo passo: atualize heroImage em src/data/treatments.ts"
  echo "   De: heroImage: '/treatments/xxx-hero.png'"
  echo "   Para: heroImage: '/treatments/xxx-hero.webp'"
fi
