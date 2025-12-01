#!/bin/bash

echo "🔍 Verificando progresso da geocodificação..."
echo ""

if [ -f "lojas_geocodificadas_temp.json" ]; then
    COUNT=$(cat lojas_geocodificadas_temp.json | grep -c '"nome"')
    echo "✅ Checkpoint: $COUNT lojas já processadas"
    PERCENT=$(echo "scale=1; $COUNT / 443 * 100" | bc)
    echo "📊 Progresso: $PERCENT%"
    echo ""
fi

if [ -f "lojas_geocodificadas.json" ]; then
    TOTAL=$(cat lojas_geocodificadas.json | grep -c '"nome"')
    SUCCESS=$(cat lojas_geocodificadas.json | grep -c '"geocoded": true')
    FAIL=$(cat lojas_geocodificadas.json | grep -c '"geocoded": false')

    echo "✅ Geocodificação completa!"
    echo "📍 Total processado: $TOTAL lojas"
    echo "✓ Sucesso: $SUCCESS lojas"
    echo "✗ Falhas: $FAIL lojas"

    if [ -f "lojas_mapa.json" ]; then
        MAPA=$(cat lojas_mapa.json | grep -c '"nome"')
        echo "🗺️  Lojas no mapa: $MAPA"
    fi
else
    echo "⏳ Geocodificação ainda em andamento..."
    echo "⏱️  Tempo estimado: ~7-8 minutos total"
    echo ""
    echo "💡 Execute este script novamente para ver o progresso"
fi
