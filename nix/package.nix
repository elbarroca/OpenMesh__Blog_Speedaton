{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "openmesh-blog-sc24";
  version = "1.0.0";
  src = ../nextjs-app;

  npmDepsHash = "sha256-uuZjFl5ou2LaYpX9mJmmJu5W0/AXXgwglH+zvbCiILs=";

  # Environment variables
  NODE_OPTIONS = "--openssl-legacy-provider --max-old-space-size=4096";
  
  # Build configuration
  npmFlags = [ "--legacy-peer-deps" "--no-audit" "--no-fund" "--verbose" ];
  makeCacheWritable = true;

  buildInputs = with pkgs; [
    nodePackages.node-gyp
    python3
  ];

  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];

  # Skip the default npm install that buildNpmPackage does
  npmInstallFlags = [ "--ignore-scripts" ];

  postPatch = ''
    echo "Setting up environment..."
    export HOME=$(mktemp -d)
    export npm_config_cache=$(mktemp -d)
    export npm_config_offline=false
    export npm_config_progress=false
    export npm_config_audit=false
    export npm_config_fund=false
    export npm_config_update_notifier=false
    export NEXT_TELEMETRY_DISABLED=1
  '';

  buildPhase = ''
    echo "Starting build phase..."
    runHook preBuild
    
    echo "Setting up build environment..."
    export HOME=$(mktemp -d)
    export INIT_CWD=$PWD
    
    echo "Cleaning any existing node_modules..."
    rm -rf node_modules
    
    echo "Installing production dependencies..."
    npm ci --omit=dev --no-optional --no-package-lock --no-audit --no-fund --prefer-offline
    
    echo "Installing all dependencies including dev..."
    npm ci --include=dev --no-optional --no-package-lock --no-audit --no-fund --prefer-offline
    
    echo "Running Next.js build..."
    NODE_ENV=production ./node_modules/.bin/next build
    
    echo "Build phase completed."
    runHook postBuild
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
    # cp -r .env $out/share/homepage/
    cp -r public $out/share/homepage/public

    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static

    # https://github.com/vercel/next.js/discussions/58864
    ln -s /var/cache/nextjs-app $out/share/homepage/.next/cache

    chmod +x $out/share/homepage/server.js

    # we set a default port to support "nix run ..."
    makeWrapper $out/share/homepage/server.js $out/bin/xnode-nextjs-template \
      --set-default PORT 3000 \
      --set-default HOSTNAME 0.0.0.0

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "xnode-nextjs-template";
  };
}
