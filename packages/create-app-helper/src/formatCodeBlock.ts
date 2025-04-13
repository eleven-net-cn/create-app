interface Options {
  /** The number of spaces for the overall indentation of the code block */
  indent?: number;
  /** The first line specifies `indent` number of spaces, default: false, applicable to some scenarios where the first line needs special processing */
  indentFirstLine?: boolean | number;
  /** Whether to add a newline before the code block, default: false */
  startNewLine?: boolean;
  /** Whether to add a newline after the code block, default: false */
  endNewLine?: boolean;
}

/**
 * Format code block
 * @param code Code block string
 * @param options Options
 * @returns Formatted code block (preserves relative indentation within code block, indents entire block according to specified `indent`)
 */
export function formatCodeBlock(code: string, options: Options = {}) {
  const {
    indent = 0,
    indentFirstLine = false,
    startNewLine = false,
    endNewLine = false,
  } = options;

  // Remove leading and trailing whitespace, and split into lines
  const lines = code.trimStart().replace(/^\n/, '').split('\n');

  // Find the minimum indentation from the second line
  const minIndent = lines
    .slice(1)
    .filter(line => line.trim())
    .reduce((min, line) => {
      const spaces = line.match(/^\s*/)[0].length;
      return Math.min(min, spaces);
    }, Infinity);

  // Process each line
  const formatted = lines
    .map((line, index) => {
      if (!line.trim()) {
        return ' '.repeat(indent);
      };

      if (index === 0) {
        // First line special specified number of spaces
        const firstLineIndent = (typeof indentFirstLine === 'number' && indentFirstLine > 0) ? indentFirstLine : indent;
        // First line according to indentFirstLine parameter whether to indent
        return (indentFirstLine ? ' '.repeat(firstLineIndent) : '') + line.trim();
      }

      // Subsequent lines keep relative indentation
      const currentIndent = line.match(/^\s*/)[0].length;
      const relativeIndent = currentIndent - minIndent;
      return ' '.repeat(indent + relativeIndent) + line.trim();
    })
    .join('\n')
    .trimEnd();

  // Add optional leading and trailing newlines
  if (startNewLine) return `\n${formatted}`;
  if (endNewLine) return `${formatted}\n`;

  return formatted;
}
