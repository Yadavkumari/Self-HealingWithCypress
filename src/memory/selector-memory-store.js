/**
 * SelectorMemoryStore
 * Persists successful heals to avoid redundant AI calls.
 */

const fs = require('fs');
const path = require('path');

class SelectorMemoryStore {
    constructor() {
        this.memoryPath = path.resolve(__dirname, '../../memory/selector-cache.json');
        this.cache = {};
        this.load();
    }

    load() {
        if (fs.existsSync(this.memoryPath)) {
            try {
                this.cache = JSON.parse(fs.readFileSync(this.memoryPath, 'utf8'));
            } catch (err) {
                this.cache = {};
            }
        }
    }

    save() {
        if (!fs.existsSync(path.dirname(this.memoryPath))) {
            fs.mkdirSync(path.dirname(this.memoryPath), { recursive: true });
        }
        fs.writeFileSync(this.memoryPath, JSON.stringify(this.cache, null, 2));
    }

    get(url, targetDescription) {
        const key = `${url}|${targetDescription}`;
        return this.cache[key];
    }

    set(url, targetDescription, healedSelector) {
        const key = `${url}|${targetDescription}`;
        this.cache[key] = {
            selector: healedSelector,
            lastHealed: new Date().toISOString(),
            hits: (this.cache[key]?.hits || 0) + 1
        };
        this.save();
    }
}

module.exports = new SelectorMemoryStore();
