FROM emscripten/emsdk:latest

WORKDIR /package

RUN apt-get update \
  && apt-get install -y meson ninja-build git bash \
  && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["/bin/bash", "./build_wasm.sh", "/emsdk/"]
