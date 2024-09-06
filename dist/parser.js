"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFiles = parseFiles;
const fs_1 = __importDefault(require("fs"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));

function parseFiles(files) {
    const translations = {};
    files.forEach((file) => {
        const code = fs_1.default.readFileSync(file, 'utf-8');
        const ast = (0, parser_1.parse)(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
        const fileTranslations = [];
        
        (0, traverse_1.default)(ast, {
            JSXOpeningElement(path) {
                // Vérifier si l'attribut 'linguee-tr' est présent
                const lingueeAttr = path.node.attributes.find(attr => attr.name && attr.name.name === 'linguee-tr');
                
                if (lingueeAttr) {
                    let translationObj = {};
                    
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
