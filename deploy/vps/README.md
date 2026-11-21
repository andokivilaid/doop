# VPS deploy

How this fork runs on a Docker + Traefik host (Traefik with a `websecure`
entrypoint and a `letsencrypt` cert resolver). The repo is cloned on the
server and built from source with the root `docker-compose.yml`, plus the
override in this folder.

## First install

```bash
git clone https://github.com/andokivilaid/doop.git /docker/doop && cd /docker/doop
ln -s deploy/vps/docker-compose.override.yml docker-compose.override.yml
ln -s deploy/vps/update.sh update.sh
umask 077 && cat > .env <<ENV
DOOP_HOST=doop.example.com
BETTER_AUTH_URL=https://doop.example.com
BETTER_AUTH_SECRET=$(openssl rand -hex 32)
POSTGRES_PASSWORD=$(openssl rand -hex 24)
SECRETS_ENCRYPTION_KEYS=k1:$(openssl rand -base64 32)
ENV
docker compose up -d --build
```

Point an A record for `DOOP_HOST` at the server first, or Let's Encrypt
cannot issue the certificate.

## Update

```bash
./update.sh   # pg_dump to backups/, git pull, rebuild, wait until healthy
```

`.env`, `backups/` and the two symlinks stay out of git (add them to
`.git/info/exclude`). Never delete the `doop_doop-pg` volume: it holds every
canvas and account.
