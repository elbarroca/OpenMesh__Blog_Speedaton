{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "openmesh-blog-sc24";
  version = "1.0.0";
  src = ../nextjs-app;
  npmDepsHash = "sha256-r7dh5RWttQYQVmFzKbQfow2rCLsZ42q6xlz+o2gXqrE=";
  preferLocal = true;
  
  NODE_OPTIONS = "--openssl-legacy-provider --max-old-space-size=8096";
  
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
    cacert
  ];
  nativeBuildInputs = with pkgs; [
    nodejs_20
  ];
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
    
    cat > .npmrc << EOF
    legacy-peer-deps=true
    strict-peer-dependencies=false
    auto-install-peers=true
    EOF
  '';

  buildPhase = ''
    echo "Starting build phase..."
    runHook preBuild
    
    echo "Setting up build environment..."
    export HOME=$(mktemp -d)
    export INIT_CWD=$PWD
    export SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt
    
    echo "Running Next.js build..."
    npm run build
    
    echo "Build phase completed."
    runHook postBuild
  '';

  postBuild = ''
    if [ -f .next/standalone/server.js ]; then
      # Add proper shebang and make executable
      echo '#!/usr/bin/env node' > server.js.tmp
      cat .next/standalone/server.js >> server.js.tmp
      mv server.js.tmp .next/standalone/server.js
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