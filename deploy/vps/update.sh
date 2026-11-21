#!/usr/bin/env bash
# Deploy the latest fork main: back up Postgres, pull, rebuild, wait for health.
set -euo pipefail
cd "$(dirname "$0")"
cd "$(git rev-parse --show-toplevel)"
mkdir -p backups
docker exec doop-db-1 pg_dump -U doop -d doop | gzip > "backups/doop-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
git pull --ff-only origin main
docker compose up -d --build
for _ in $(seq 1 40); do
  [ "$(docker inspect -f '{{.State.Health.Status}}' doop-doop-1)" = healthy ] && break
  sleep 3
done
echo "doop $(git log --oneline -1) — $(docker inspect -f '{{.State.Health.Status}}' doop-doop-1)"
