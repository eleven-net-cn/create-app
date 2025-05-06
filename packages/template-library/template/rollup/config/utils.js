import path from 'node:path';
import colors from 'picocolors';

export function printError(err) {
  let description = err.message || err;

  if (err.name) {
    description = `${err.name}: ${description}`;
  }
  const message = err.plugin ? `(plugin ${err.plugin}) ${description}` : description;

  console.error(colors.bold(colors.red(`[!] ${colors.bold(message.toString())}`)));

  if (err.url) {
    console.error(colors.cyan(err.url));
  }

  if (err.loc) {
    console.error(`${err.loc.file || err.id} (${err.loc.line}:${err.loc.column})`);
  } else if (err.id) {
    console.error(err.id);
  }

  if (err.frame) {
    console.error(colors.dim(err.frame));
  }

  if (err.stack) {
    console.error(colors.dim(err.stack));
  }
}

export function registerShutdown(fn) {
  let run = false;

  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };

  process.on('SIGINT', wrapper);
  process.on('SIGTERM', wrapper);
  process.on('exit', wrapper);
}

export function relativePath(id) {
  if (!path.isAbsolute(id)) {
    return id;
  }
  return path.relative(process.cwd(), id);
}

export function ensureArray(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }
  if (items) {
    return [items];
  }
  return [];
}
