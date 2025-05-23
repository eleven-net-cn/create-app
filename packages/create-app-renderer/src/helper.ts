import { readFileSync } from 'node:fs';
// @ts-expect-error no types
import { isText } from 'istextorbinary';

const isObject = (val: unknown): val is Record<string, any> => typeof val === 'object' && val !== null;
const mergeArrayWithDedupe = (a: any[], b: any[]): any[] => Array.from(new Set([...a, ...b]));

/**
 * Recursively merge the content of the new object to the existing one
 * @param {object} target the existing object
 * @param {object} obj the new object
 */
export function deepMerge(target: Record<string, any>, obj: Record<string, any>): Record<string, any> {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key];
    const newVal = obj[key];

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal);
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal);
    } else {
      target[key] = newVal;
    }
  }

  return target;
}

export function sortDependencies(packageJson: Record<string, any>) {
  const sorted: Record<string, any> = {};

  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {};

      Object.keys(packageJson[depType])
        .sort()
        .forEach(name => {
          sorted[depType][name] = packageJson[depType][name];
        });
    }
  }

  return {
    ...packageJson,
    ...sorted,
  };
}

export function isEjsProcessable(filePath: string): boolean {
  const buffer = readFileSync(filePath);
  if (!isText(filePath, buffer)) return false;

  const content = buffer.toString('utf8');
  return /<%.+%>/.test(content);
}
