{ pkgs, lib ? pkgs.lib }:
pkgs.buildNpmPackage {
  pname = "Ricardo_Openmesh";
  version = "1.0.0";
  src = ../nextjs-app;

  npmDepsHash = lib.fakeHash;

  npmFlags = [ "--legacy-peer-deps" ];
  makeCacheWritable = true;
  NODE_OPTIONS = "--openssl-legacy-provider";

  postBuild = ''
    # Add a shebang to the server js file, then patch the shebang to use a
    # nixpkgs nodes binary
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}

    cp -r .next/standalone $out/share/homepage/
    cp -r public $out/share/homepage/public

    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static

    ln -s /var/cache/nextjs-app $out/share/homepage/.next/cache

    chmod +x $out/share/homepage/server.js

    makeWrapper $out/share/homepage/server.js $out/bin/ricardo_openmesh \
      --set-default PORT 3000 \
      --set-default HOSTNAME 0.0.0.0

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "Ricardo_Openmesh";
  };
}
