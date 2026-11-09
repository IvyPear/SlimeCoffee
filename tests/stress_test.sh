#!/bin/bash
# Script ép tải hệ thống Slime Coffee qua Nginx Reverse Proxy
TARGET_URL="http://localhost:80"
TOTAL_REQUESTS=1200
CONCURRENCY=60

echo "=================================================="
echo "   BAT DAU STRESS TEST SLIME COFFEE (WEEK 4)"
echo "   Target: $TARGET_URL"
echo "   Total requests: $TOTAL_REQUESTS | Concurrency: $CONCURRENCY"
echo "=================================================="

for i in $(seq 1 $TOTAL_REQUESTS); do
    curl -s "$TARGET_URL" > /dev/null &
    if (( i % CONCURRENCY == 0 )); then
        wait
    fi
done

wait
echo "=================================================="
echo "   HOAN THANH TEST TAI!"
echo "   Kiem tra bieu do Grafana va kenh Discord bot."
echo "=================================================="
