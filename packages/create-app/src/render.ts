import { render2Memory } from '@e.fe/create-app-renderer';
import type { RenderFn } from '@e.fe/create-app-helper';

export function renderFactory({ rootDir, options = {} }): RenderFn {
  const render: RenderFn = (...args) => {
    const [args1] = args;

    if (Array.isArray(args1)) {
      args1.filter(Boolean).forEach(item => {
        if (typeof item === 'string') {
          render2Memory({
            rootDir,
            src: item,
            dest: rootDir,
            data: { ...options },
          });
        } else {
          const { src, dest, data = {}, ...restRenderOptions } = item || {};
          render2Memory({
            ...restRenderOptions,
            rootDir,
            src,
            dest: dest ?? rootDir,
            data: { ...options, ...data },
          });
        }
      });
    } else if (typeof args1 === 'object') {
      const { src, dest, data = {}, ...restRenderOptions } = args1 ?? {};
      render2Memory({
        ...restRenderOptions,
        rootDir,
        src,
        dest: dest ?? rootDir,
        data: { ...options, ...data },
      });
    } else {
      const [src, data = {}, renderOptions = {}] = args;
      const { dest, ...restRenderOptions } = renderOptions;
      render2Memory({
        ...restRenderOptions,
        rootDir,
        src,
        dest: dest ?? rootDir,
        data: { ...options, ...data },
      });
    }
  };

  return render;
}
