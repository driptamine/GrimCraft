#!/usr/bin/env bash
# Bulk-upload UI assets to Cloudflare R2 via its S3-compatible API.
# HUD portraits, command icons and resource glyphs are referenced as relative
# `assets/...` paths and are NOT bundled by vite, so production loads them
# from R2 (see src/assets.js assetUrl). The dashboard caps manual uploads at
# 100 files.
#
# Required env (see .env.example):
#   R2_BUCKET_NAME, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
#
# Extra args are forwarded to `aws s3 sync` (e.g. --dryrun).
set -euo pipefail

: "${R2_BUCKET_NAME:?Set R2_BUCKET_NAME (see .env.example)}"
: "${R2_ACCOUNT_ID:?Set R2_ACCOUNT_ID (see .env.example)}"
: "${R2_ACCESS_KEY_ID:?Set R2_ACCESS_KEY_ID (see .env.example)}"
: "${R2_SECRET_ACCESS_KEY:?Set R2_SECRET_ACCESS_KEY (see .env.example)}"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_EC2_METADATA_DISABLED=true

S3_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

aws s3 sync assets/ "s3://${R2_BUCKET_NAME}/assets/" \
  --endpoint-url "$S3_ENDPOINT" \
  --exclude '.DS_Store' \
  --exclude '*/.DS_Store' \
  "$@"
