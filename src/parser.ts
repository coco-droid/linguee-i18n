import fs from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { StringLiteral } from '@babel/types';

export function parseFiles(files: string[]): Record<string, string[]> {
  const translations: Record<string, string[]> = {};

  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf-8');
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });

    const fileTranslations: string[] = [];

    traverse(ast, {
      JSXAttribute(path) {
        if (path.node.name.name === 'linguee-tr') {
          const valueNode = path.node.value;
          if (valueNode && valueNode.type === 'StringLiteral') {
            const value = (valueNode as StringLiteral).value;
            fileTranslations.push(value);
          }
        }
      }
    });

    translations[file] = fileTranslations;
  });

  return translations;
}