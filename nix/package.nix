{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "openmesh-blog-sc24";
  version = "1.0.0";
  src = ../nextjs-app;

  npmDepsHash = "sha256-r7dh5RWttQYQVmFzKbQfow2rCLsZ42q6xlz+o2gXqrE=";

  # Environment variables with updated settings
  NODE_OPTIONS = "--openssl-legacy-provider --max-old-space-size=8096";
  
  # Updated npm flags for better dependency resolution
  npmFlags = [ 
    "--legacy-peer-deps" 
    "--no-audit" 
    "--no-fund"
    "--force"
    "--prefer-offline"
    "--no-package-lock"
  ];
  
  makeCacheWritable = true;

  buildInputs = with pkgs; [
    nodePackages.node-gyp
    python3
  ];

  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];

  # Enhanced npm configuration
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
    export NODE_ENV=production
    export npm_config_legacy_peer_deps=true
    export npm_config_unsafe_perm=true
    export npm_config_ignore_scripts=false
    
    # Create .npmrc file with additional settings
    cat > .npmrc << EOF
    legacy-peer-deps=true
    strict-peer-dependencies=false
    auto-install-peers=true
    EOF
  '';

  # Updated buildPhase with enhanced dependency installation
  buildPhase = ''
    echo "Starting build phase..."
    runHook preBuild
    
    echo "Setting up build environment..."
    export HOME=$(mktemp -d)
    export INIT_CWD=$PWD
    
    echo "Cleaning existing node_modules..."
    rm -rf node_modules
    rm -f package-lock.json
    
    echo "Installing dependencies..."
    # First try to install dependencies
    npm install --legacy-peer-deps --force --no-audit --no-fund || {
      echo "First install attempt failed, retrying with clean slate..."
      rm -rf node_modules
      rm -f package-lock.json
      npm install --legacy-peer-deps --force --no-audit --no-fund --no-package-lock
    }
    
    echo "Running Next.js build..."
    NODE_ENV=production npm run build
    
    echo "Build phase completed."
    runHook postBuild
  '';

  postBuild = ''
    # Ensure the server.js file has proper permissions and shebang
    if [ -f .next/standalone/server.js ]; then
      sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
      chmod +x .next/standalone/server.js
    fi
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}

    cp -r .next/standalone $out/share/homepage/
    cp -r public $out/share/homepage/public

    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static

    # Create cache directory if it doesn't exist
    mkdir -p /var/cache/nextjs-app
    ln -s /var/cache/nextjs-app $out/share/homepage/.next/cache

    chmod +x $out/share/homepage/server.js

    makeWrapper $out/share/homepage/server.js $out/bin/openmesh-blog-sc24 \
      --set-default PORT 3000 \
      --set-default HOSTNAME 0.0.0.0

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "openmesh-blog-sc24";
  };
}
