"use strict";
import fs from 'fs';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

interface Translation {
    attribute?: string;
    content?: string;
}

export function parseFiles(files: string[]): Record<string, Translation[]> {
    const translations: Record<string, Translation[]> = {};
    files.forEach((file) => {
        const code = fs.readFileSync(file, 'utf-8');
        const ast = parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
        const fileTranslations: Translation[] = [];
        
        traverse(ast, {
            JSXOpeningElement(path) {
                // Vérifier si l'attribut 'linguee-tr' est présent
                const lingueeAttr = path.node.attributes.find(attr => attr.name && attr.name.name === 'linguee-tr');
                
                if (lingueeAttr) {
                    let translationObj: Translation = {};
                    
                    // Récupérer la valeur de l'attribut linguee-tr
                    const valueNode = lingueeAttr.value;
                    if (valueNode && valueNode.type === 'StringLiteral') {
                        translationObj['attribute'] = valueNode.value;
                    }
                    
                    // Récupérer le texte à l'intérieur de la balise (les enfants)
                    if (path.parent && path.parent.children) {
                        const childText = path.parent.children
                            .filter(child => child.type === 'JSXText')
                            .map(child => child.value.trim())
                            .join(' '); // Concatenation des enfants s'il y en a plusieurs
                        
                        if (childText) {
                            translationObj['content'] = childText;
                        }
                    }
                    
                    // Ajouter l'association dans la liste des traductions
                    if (translationObj.attribute || translationObj.content) {
                        fileTranslations.push(translationObj);
                    }
                }
            }
        });

        translations[file] = fileTranslations;
    });
    
    return translations;
}