#!/bin/bash

echo "🗺️  Monitorando progresso da geocodificação..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=443
COMPLETE=false

while [ "$COMPLETE" = false ]; do
    clear
    echo "🗺️  GEOCODIFICAÇÃO DE LOJAS LECARD - RIO DE JANEIRO"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    date "+%H:%M:%S"
    echo ""

    # Verificar arquivo temporário (checkpoint)
    if [ -f "lojas_geocodificadas_temp.json" ]; then
        COUNT=$(cat lojas_geocodificadas_temp.json | grep -c '"nome"' 2>/dev/null || echo 0)
        if [ "$COUNT" -gt 0 ]; then
            PERCENT=$(awk "BEGIN {printf \"%.1f\", $COUNT / $TOTAL * 100}")

            # Criar barra de progresso
            FILLED=$(awk "BEGIN {printf \"%.0f\", $PERCENT / 2}")
            BAR=$(printf '%*s' "$FILLED" | tr ' ' '█')
            EMPTY=$(printf '%*s' $((50 - FILLED)) | tr ' ' '░')

            echo "📊 Progresso: $COUNT/$TOTAL lojas"
            echo "[$BAR$EMPTY] $PERCENT%"
            echo ""

            # Estimar tempo restante
            REMAINING=$((TOTAL - COUNT))
            MINUTES=$((REMAINING / 60))
            SECONDS=$((REMAINING % 60))
            echo "⏱️  Tempo estimado restante: ${MINUTES}min ${SECONDS}s"
        fi
    fi

    # Verificar se terminou
    if [ -f "lojas_geocodificadas.json" ]; then
        FINAL=$(cat lojas_geocodificadas.json | grep -c '"nome"' 2>/dev/null || echo 0)

        if [ "$FINAL" -ge "$TOTAL" ]; then
            SUCCESS=$(cat lojas_geocodificadas.json | grep -c '"geocoded": true' 2>/dev/null || echo 0)
            FAIL=$(cat lojas_geocodificadas.json | grep -c '"geocoded": false' 2>/dev/null || echo 0)

            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "✅ GEOCODIFICAÇÃO COMPLETA!"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "📍 Total processado: $FINAL lojas"
            echo "✓ Sucesso: $SUCCESS lojas ($(awk "BEGIN {printf \"%.1f\", $SUCCESS / $FINAL * 100}")%)"
            echo "✗ Falhas: $FAIL lojas ($(awk "BEGIN {printf \"%.1f\", $FAIL / $FINAL * 100}")%)"
            echo ""

            if [ -f "lojas_mapa.json" ]; then
                MAPA=$(cat lojas_mapa.json | grep -c '"nome"' 2>/dev/null || echo 0)
                echo "🗺️  Lojas disponíveis no mapa: $MAPA"
                echo ""
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo ""
                echo "🌐 Próximos passos:"
                echo "   1. Abra index.html no navegador"
                echo "   2. Ou execute: npx http-server -p 8000"
                echo "   3. Acesse: http://localhost:8000"
                echo ""
                echo "📤 Para publicar online:"
                echo "   • https://app.netlify.com/drop (mais fácil)"
                echo "   • GitHub Pages"
                echo "   • Vercel"
            fi

            COMPLETE=true
            break
        fi
    fi

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏳ Aguardando próxima atualização em 10s..."
    echo "   (Pressione Ctrl+C para sair)"

    sleep 10
done

echo ""
