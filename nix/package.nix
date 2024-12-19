{ pkgs, lib ? pkgs.lib }:
pkgs.buildNpmPackage {
  pname = "Ricardo_Openmesh";
  version = "1.0.0";
  src = ../nextjs-app;

  npmDepsHash = "sha256-w+SvcqE3QlwcF4y1v5I9LZbIqNhl4+1PMnIr+kxVEB8=";

  # Environment variables
  NODE_OPTIONS = "--openssl-legacy-provider";
  
  # Build configuration
  npmFlags = [ "--legacy-peer-deps" ];
  makeCacheWritable = true;

  buildInputs = with pkgs; [
    nodePackages.node-gyp
    python3
  ];

  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];

  postPatch = ''
    export HOME=$(mktemp -d)
    export npm_config_cache=$(mktemp -d)
    export npm_config_offline=false
    export npm_config_only=false
  '';

  buildPhase = ''
    runHook preBuild
    export HOME=$(mktemp -d)
    export INIT_CWD=$PWD
    export PATH="$PWD/node_modules/.bin:$PATH"
    npm install
    ./node_modules/.bin/next build
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}
    cp -r .next/standalone $out/share/homepage/
    cp -r public $out/share/homepage/public
    cp -r .next/static $out/share/homepage/.next/static

    chmod +x $out/share/homepage/server.js

    makeWrapper ${pkgs.nodejs_20}/bin/node $out/bin/ricardo_openmesh \
      --add-flags "$out/share/homepage/server.js" \
      --set PORT 3000 \
      --set HOSTNAME "0.0.0.0"

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "Ricardo_Openmesh";
  };
}
