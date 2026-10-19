# The a12s slim image plus Chromium. Building FROM slim keeps computerd, which a12s requires of every agent computer image.
ARG SLIM=ghcr.io/coltonkirsten/a12s/slim:0.8.1
FROM ${SLIM}

RUN apt-get update \
 && apt-get install -y --no-install-recommends chromium fonts-liberation fonts-noto-color-emoji \
 && rm -rf /var/lib/apt/lists/*

COPY browse /usr/local/bin/browse
