## Xnode Nextjs Template

Template to make your Nextjs app Xnode/Nix compatible.

## Steps

1. Replace all instances of "xnode-nextjs-template" with the name of your project. This should be unique, as no apps with the same name can be run on a single Xnode.
2. Build your Nextjs app
3. In case your npm dependencies change, run `nix run` in the root folder and replace the npmDepsHash in [package.nix](./nix/package.nix) with the got hash in the error.
4. Once your app is ready for deployment and runs using `nix run`, push to GitHub and copy your GitHub url (e.g. https://github.com/Openmesh-Network/xnode-nextjs-template).
5. Go the the App Store in [Xnode Studio](https://www.openmesh.network/xnode/app-store) and go to the advanced tab.
6. Paste your GitHub url and enter the name of the project you choose during step 1.
7. Hit deploy and wait for your app to be ready.

## Commands (in root folder)

```
nix run
```

## Commands (in nextjs-app)

```
npm i
npm run dev
npm run build
npm run start
```
