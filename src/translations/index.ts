const en = require('./en.json');
const pl = require('./pl.json');


export const getTranslate = (type: string, key: string, lang: string, range?: { min?: number, max?: number}) => {
    const message = lang === 'pl' ? pl[type][key] : en[type][key];
    if (range) {
        return message.replace('{min}', range.min).replace('{max}', range.max);
    }
    
    return message
}