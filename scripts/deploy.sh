#!/usr/bin/env bash
# builds the site and publishes it to the wofyu vps (caddy serves /srv/design as design.wofyu.space)
set -euo pipefail
cd "$(dirname "$0")/.."
npx astro build
rsync -az --delete dist/ vps:/srv/design/
echo "deployed to https://design.wofyu.space/"
