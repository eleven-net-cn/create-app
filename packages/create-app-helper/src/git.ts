import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

import { simpleGit } from 'simple-git';

const git = simpleGit();

/**
 * Detect whether it's in git repository
 */
export function isInGitRepository({ cwd = process.cwd() } = {}): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore', cwd });
    return true;
  } catch {
    return false;
  }
}

/**
 * Auto git init
 */
export function tryGitInit(branch = 'main', { cwd = process.cwd() } = {}): boolean {
  try {
    execSync('git --version', { stdio: 'ignore', cwd });

    if (isInGitRepository()) {
      return false;
    }

    try {
      execSync(`git init --initial-branch=${branch}`, { stdio: 'ignore', cwd });
    } catch {
      execSync('git init', { stdio: 'ignore', cwd });
    }

    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
}

/**
 * Auto git commit
 * @param appPath root dir path
 * @param msg commit message
 */
export function tryGitCommit(appPath: string, msg: string, { cwd = process.cwd() } = {}): boolean {
  try {
    execSync('git add -A', { stdio: 'ignore', cwd });
    execSync(`git commit -m "${msg}"`, {
      stdio: 'ignore',
      cwd,
    });
    return true;
  } catch (e) {
    console.warn('Git commit not created', e);
    console.warn('Removing .git directory...');
    try {
      rmSync(join(appPath, '.git'), { recursive: true, force: true });
    } catch {}
    return false;
  }
}

/**
 * Rename current git branch to a new branch
 * @param branch new branch name
 */
export function renameBranch(branch = 'main', { cwd = process.cwd() } = {}) {
  try {
    execSync(`git branch -M ${branch}`, { stdio: 'ignore', cwd });
  } catch {}
}

/**
 * Execute the given function with a stash of the current working directory
 * @param fn - The function to execute
 * @returns A promise that resolves when the function has been executed
 */
export async function execWithStash(fn: () => void) {
  try {
    const status = await git.status();
    const isClean = status.isClean();

    const stashList = await git.stashList();

    if (!isClean) {
      // should stash
      await git.stash(['save', 'temp stash']);
    }

    // run your logic
    await fn?.();

    if (!isClean) {
      const newStashList = await git.stashList();

      // should pop the latest stash
      if (newStashList.total > stashList.total) {
        await git.stash(['pop']);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function pushBranch(branch?: string, { cwd = process.cwd() } = {}) {
  try {
    // https://segmentfault.com/a/1190000020840822
    const currentBranch = execSync('git symbolic-ref --short HEAD', { cwd }).toString().trim();

    execSync(`git push -u origin ${branch ?? currentBranch}`, {
      stdio: 'ignore',
      cwd,
    });
  } catch (error) {
    console.error(error);
  }
}
