import { execSync } from 'node:child_process';

export function execSilent(command: string): string {
  try {
    const stdout = execSync(command, { stdio: 'pipe' }).toString();
    return stdout.trim();
  } catch {
    return '';
  }
}

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
