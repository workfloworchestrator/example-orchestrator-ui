#!/usr/bin/env bash
#
# Use a local checkout of the orchestrator-ui-library instead of the
# @orchestrator-ui/orchestrator-ui-components release from npm.
#
#  1. Makes sure ./orchestrator-ui-components contains a checkout of the library
#     (clones it on the branch below when the folder is missing or empty).
#  2. Installs and builds the library.
#  3. Points the dependency in package.json to file:./orchestrator-ui-components
#     and reinstalls.
#  4. Runs 'pnpm run dev' in the library so changes are rebuilt automatically
#     (keeps running until you stop it with Ctrl+C).
#
# To go back to the npm release:
#   git checkout package.json pnpm-lock.yaml pnpm-workspace.yaml && pnpm install
#
set -euo pipefail

REPO_URL="https://github.com/workfloworchestrator/orchestrator-ui-library.git"
BRANCH="new-app-setup"
PACKAGE="@orchestrator-ui/orchestrator-ui-components"
DIR="orchestrator-ui-components"

cd "$(dirname "$0")"

# Reduce git@github.com:org/repo.git and https://github.com/org/repo(.git) to github.com/org/repo
normalize_url() {
    echo "$1" | sed -E 's#^(https://|ssh://git@|git@)##; s#^github.com:#github.com/#; s#\.git$##; s#/$##'
}

if [ -d "$DIR/.git" ]; then
    origin=$(git -C "$DIR" remote get-url origin 2>/dev/null || true)
    if [ "$(normalize_url "$origin")" != "$(normalize_url "$REPO_URL")" ]; then
        echo "Error: $DIR is a git repository, but its origin is '$origin' instead of $REPO_URL." >&2
        exit 1
    fi
    current_branch=$(git -C "$DIR" branch --show-current)
    echo "Using existing checkout in $DIR (branch: ${current_branch:-detached HEAD})."
    if [ "$current_branch" != "$BRANCH" ]; then
        echo "Note: the checkout is not on '$BRANCH'; leaving it as it is."
    fi
elif [ -e "$DIR" ] && [ -n "$(ls -A "$DIR")" ]; then
    echo "Error: $DIR exists and is not empty, but it is not a git checkout. Remove or move it first." >&2
    exit 1
else
    echo "Cloning $REPO_URL ($BRANCH) into $DIR..."
    git clone --branch "$BRANCH" "$REPO_URL" "$DIR"
fi

# Build before installing in the app: pnpm links the files that exist at install time.
echo "Installing and building $PACKAGE..."
(cd "$DIR" && pnpm install --frozen-lockfile && pnpm run build)

echo "Pointing $PACKAGE to file:./$DIR..."
node -e '
const fs = require("fs");
const [pkgName, spec] = process.argv.slice(1);
const raw = fs.readFileSync("package.json", "utf8");
const indent = raw.match(/^[ \t]+/m)?.[0] ?? 2;
const pkg = JSON.parse(raw);
if (!pkg.dependencies?.[pkgName]) {
    console.error(`Error: ${pkgName} is not listed in dependencies of package.json.`);
    process.exit(1);
}
pkg.dependencies[pkgName] = spec;
fs.writeFileSync("package.json", JSON.stringify(pkg, null, indent) + "\n");
' "$PACKAGE" "file:./$DIR"

pnpm install

echo
echo "Done: the app now uses the local $PACKAGE from ./$DIR."
echo "Do not commit the changes to package.json, pnpm-lock.yaml and pnpm-workspace.yaml. To go back to npm:"
echo "  git checkout package.json pnpm-lock.yaml pnpm-workspace.yaml && pnpm install"
echo
echo "Starting 'pnpm run dev' in ./$DIR to rebuild $PACKAGE on changes (Ctrl+C to stop)..."
cd "$DIR"
exec pnpm run dev
