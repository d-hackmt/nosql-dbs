/**
 * NoSQL DB Simulation Logic
 * Ported from Python modules/db_simulation.py
 */

export class DocumentDB {
    constructor(data) {
        // Simulates a Document Store (like MongoDB). Data is an array of objects.
        this.collection = data;
    }

    getAll() {
        return this.collection;
    }

    findOne(key, value) {
        return this.collection.find(doc => doc[key] === value) || null;
    }

    findMany(key, matchValue, operator = "eq") {
        return this.collection.filter(doc => {
            const val = doc[key];
            if (operator === "eq") return val === matchValue;
            if (operator === "gt") return val > matchValue;
            if (operator === "lt") return val < matchValue;
            if (operator === "contains") return val && val.includes && val.includes(matchValue);
            return false;
        });
    }

    insertOne(doc) {
        this.collection.push(doc);
    }
}

export class KeyValueStore {
    constructor(data) {
        // Simulates a Key-Value Store (like Redis). Data is an object.
        this.store = data;
    }

    get(key) {
        return this.store[key];
    }

    set(key, value) {
        this.store[key] = value;
    }

    exists(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key);
    }

    getRandomKey() {
        const keys = Object.keys(this.store);
        if (keys.length === 0) return null;
        return keys[Math.floor(Math.random() * keys.length)];
    }
}

export class ColumnStore {
    constructor(data) {
        // Simulates a Column Store. Data is an array of objects (Row-oriented in JS memory, but simulated usage)
        this.data = data;
    }

    selectColumn(colName) {
        return this.data.map(row => row[colName]);
    }

    filterByValue(colName, value) {
        return this.data.filter(row => row[colName] === value);
    }
}

export class GraphDB {
    constructor(graphData) {
        // Simulates a Graph DB. Data is an adjacency list (object).
        this.graph = graphData;
    }

    getNeighbors(node) {
        return this.graph[node] || [];
    }

    getNodes() {
        return Object.keys(this.graph);
    }
}
