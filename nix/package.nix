{ pkgs, lib ? pkgs.lib }:
pkgs.buildNpmPackage {
  pname = "Ricardo_Openmesh";
  version = "1.0.0";
  src = ../nextjs-app;

  npmDepsHash = "sha256-w+SvcqE3QlwcF4y1v5I9LZbIqNhl4+1PMnIr+kxVEB8=";

  # Environment variables
  NODE_OPTIONS = "--openssl-legacy-provider";
  NODE_TLS_REJECT_UNAUTHORIZED = "0";  # Only for development
  
  # Build configuration
  npmFlags = [ "--legacy-peer-deps" "--prefer-offline" "--no-audit" ];
  makeCacheWritable = true;

  buildInputs = with pkgs; [
    nodePackages.node-gyp
    nodePackages.cross-env
    python3
  ];

  postPatch = ''
    export HOME=$(mktemp -d)
    export npm_config_cache=$(mktemp -d)
    export npm_config_offline=false
    export npm_config_only=false
    export PATH="${pkgs.nodePackages.cross-env}/bin:$PATH"
    export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
  '';

  preBuild = ''
    export npm_config_cache=$(mktemp -d)
    npm config set cache $npm_config_cache
  '';

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
      --set-default HOSTNAME 0.0.0.0 \
      --set NODE_TLS_REJECT_UNAUTHORIZED 0 \
      --set SSL_CERT_FILE ${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "Ricardo_Openmesh";
  };
}
