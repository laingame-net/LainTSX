# sudo docker build -t localhost:5000/laintsx_builder:new .
# sudo docker run -v .:/src -w /src -it --rm localhost:5000/laintsx_builder:new bash
# sudo docker push localhost:5000/laintsx_builder:new
FROM node:24-trixie-slim

RUN apt -y update && apt install -y openjdk-21-jre-headless ffmpeg imagemagick git tar zip curl && \
    rm -rf /var/cache/apt/archives /var/lib/apt/lists/*

RUN --mount=type=bind,source=.,target=/src,rw \
    set -x && \
    mkdir -p /opt/extract && \
    cd /src/scripts && \
    NODE_PATH=/tmp/node_modules npm install && \
    NODE_PATH=/tmp/node_modules node extract.mjs 2>&1 | tee /opt/extract/build.log && \
    cd /src && \
    tar czf /opt/extract/0_static_files_from_extractor.tar.gz \
                                         public/emote-wheel/ \
                                         public/media-background-images/ \
                                         public/images/icon.png \
                                         public/media/ \
                                         public/voice/ \
                                         src/static/json/sprite_atlas.json \
                                         src/static/sprites/ \
                                         src/textures.ts && \
    cp -f /src/scripts/discs/*.tar.gz /opt/extract/ && \
    cp -f /src/scripts/*.log /opt/extract/ && \
    rm -rf /tmp/*

