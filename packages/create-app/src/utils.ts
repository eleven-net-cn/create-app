import colors from 'picocolors';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Check if the current Node.js version meets the minimum requirement
 * @param minVersion - Minimum required Node.js version (e.g., "16.0.0")
 * @returns true if the current version meets the requirement, false otherwise
 */
export function checkNodeVersion(minVersion: string): boolean {
  const currentVersion = process.versions.node;

  // Simple version comparison without external dependencies
  const parseVersion = (version: string): number[] => {
    return version.split('.').map(Number);
  };

  const current = parseVersion(currentVersion);
  const minimum = parseVersion(minVersion);

  for (let i = 0; i < Math.max(current.length, minimum.length); i++) {
    const currentPart = current[i] || 0;
    const minimumPart = minimum[i] || 0;

    if (currentPart > minimumPart) return true;
    if (currentPart < minimumPart) return false;
  }

  return true; // Versions are equal
}

/**
 * Get the minimum required Node.js version from create-app package.json engines field
 * @returns The minimum required Node.js version or "16.0.0" as default
 */
export function getRequiredNodeVersion(): string {
  try {
    // Read the engines field from the create-app package.json
    const packageJsonPath = resolve(dirname(require.resolve('@e.fe/create-app/package.json')), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const engines = packageJson.engines;

    if (engines?.node) {
      // Extract the minimum version from semver range (e.g., ">=16.0.0" -> "16.0.0")
      const match = engines.node.match(/^>=?(\d+\.\d+\.\d+)/);
      if (match) {
        return match[1];
      }
    }
  } catch {
    // Ignore errors and use default
  }

  return '16.0.0'; // Default minimum version
}

/**
 * Check Node.js version requirement and exit if not met
 * @param requiredVersion - Minimum required Node.js version (default: "16.0.0")
 */
export function checkNodeVersionRequirement(requiredVersion = '16.0.0'): void {
  if (!checkNodeVersion(requiredVersion)) {
    const currentVersion = process.versions.node;
    console.error(colors.red(`\n❌ Node.js version requirement not met!`));
    console.error(colors.red(`   Current version: ${colors.yellow(currentVersion)}`));
    console.error(colors.red(`   Required version: ${colors.yellow(requiredVersion)} or higher`));
    console.error(colors.red(`\n   Please upgrade your Node.js version and try again.\n`));
    process.exit(1);
  }
}
