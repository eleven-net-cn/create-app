import { readFileSync } from 'node:fs';
// @ts-expect-error no types
import { isText } from 'istextorbinary';

export default function isEjsProcessable(filePath: string): boolean {
  const buffer = readFileSync(filePath);
  if (!isText(filePath, buffer)) return false;

  const content = buffer.toString('utf8');
  return /<%.+%>/.test(content);
}
