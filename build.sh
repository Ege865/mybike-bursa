#!/bin/sh
# Cloudflare Pages derleme adımı: yalnızca sitenin dosyalarını dist/ klasörüne kopyalar.
# (supabase/*.sql, README vb. yayına çıkmaz)
set -e
rm -rf dist
mkdir -p dist
cp ./*.html dist/
cp -R assets dist/
cp _headers dist/
rm -f dist/assets/img/logo-original.jpg dist/assets/img/favicon.svg
echo "dist hazır: $(find dist -type f | wc -l) dosya"
