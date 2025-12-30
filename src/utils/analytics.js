/**
 * Analytics Logic
 * Ported from Python modules/analytics.py
 */

export const computeAverage = (dataList) => {
    if (!dataList || dataList.length === 0) return 0;
    const sum = dataList.reduce((a, b) => a + b, 0);
    return sum / dataList.length;
};

export const getMostCommon = (items, n = 5) => {
    const counts = {};
    for (const item of items) {
        counts[item] = (counts[item] || 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // Sort by count desc
        .slice(0, n);
};

export const graphBfsPath = (graph, start, goal) => {
    // Breadth-first search for finding path between nodes
    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if (node === goal) return path;

        if (!visited.has(node)) {
            visited.add(node);
            const neighbors = graph[node] || [];
            for (const neighbor of neighbors) {
                const newPath = [...path, neighbor];
                queue.push(newPath);
            }
        }
    }
    return null;
};

export const detectSuspiciousGraphPatterns = (graph) => {
    const suspiciousReasons = [];

    // Rule 1: Fan-in Pattern
    const inDegree = {};
    for (const node in graph) {
        const neighbors = graph[node];
        for (const neighbor of neighbors) {
            inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
        }
    }

    for (const [node, count] of Object.entries(inDegree)) {
        if (count >= 3) {
            suspiciousReasons.push(`Node '${node}' is receiving transfers from ${count} sources (Fan-in Pattern).`);
        }
    }

    // Rule 2: Cycle Detection (DFS)
    const visited = new Set();
    const recursionStack = new Set();
    let cycleFound = false;

    const hasCycle = (v) => {
        visited.add(v);
        recursionStack.add(v);

        const neighbors = graph[v] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (hasCycle(neighbor)) return true;
            } else if (recursionStack.has(neighbor)) {
                return true;
            }
        }
        recursionStack.delete(v);
        return false;
    };

    for (const node in graph) {
        if (!visited.has(node)) {
            if (hasCycle(node)) {
                suspiciousReasons.push("Circular transaction loop detected (Cycle).");
                cycleFound = true;
                break; // Report once
            }
        }
    }

    return suspiciousReasons;
};

export const detectFraudTransactions = (transactions) => {
    if (!transactions || transactions.length === 0) return { isFraud: false, messages: [] };

    const messages = [];
    let suspicious = false;

    // Rule 1: High Velocity (Same payer)
    const payerCounts = {};
    transactions.forEach(t => {
        payerCounts[t.payer] = (payerCounts[t.payer] || 0) + 1;
    });

    const maxPayerCount = Math.max(...Object.values(payerCounts));
    if (maxPayerCount >= 5) {
        suspicious = true;
        messages.push("High Velocity: Single user making frequent payments.");
    }

    // Rule 2: High Value
    const highValueCount = transactions.filter(t => t.amount > 8000).length;
    if (highValueCount >= 3) {
        suspicious = true;
        messages.push(`High Value: ${highValueCount} large transactions detected.`);
    }

    return { isFraud: suspicious, message: messages.join("\n") };
};
