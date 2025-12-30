/**
 * Synthetic Data Generator for NoSQL Demo
 * Generates massive datasets for client-side demo
 */

const faker = {
    // Simple custom faker to avoid heavy dependency
    sample: (arr) => arr[Math.floor(Math.random() * arr.length)],
    int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    float: (min, max) => (Math.random() * (max - min) + min).toFixed(2),
    uuid: () => Math.random().toString(36).substring(2, 10),
    date: () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0]
};

export const generateProducts = (n = 2000) => {
    const adjectives = ["Pro", "Max", "Ultra", "Lite", "Air", "S", "X", "Fold", "Flip", "Smart", "Eco"];
    const nouns = ["Phone", "Book", "Pad", "Watch", "Buds", "Cam", "Drone", "Console", "Glass", "Bot"];
    const categories = ["Mobile", "Laptop", "Tablet", "Wearable", "Audio", "Camera", "Gaming", "Home"];

    const data = [];
    for (let i = 0; i < n; i++) {
        const name = `${faker.sample(adjectives)} ${faker.sample(nouns)} ${faker.int(1, 20)}`;
        const doc = {
            product_id: `P${1000 + i}`,
            name: name,
            category: faker.sample(categories),
            price: faker.int(1000, 200000),
            ratings: Array.from({ length: faker.int(1, 10) }, () => faker.int(1, 5)),
            stock: faker.int(0, 500)
        };

        // Schema flexibility
        if (Math.random() > 0.7) doc.features = Array.from({ length: faker.int(1, 3) }, (_, j) => `Feature ${j}`);
        if (Math.random() > 0.8) doc.discount = `${faker.int(5, 50)}%`;

        data.push(doc);
    }
    return data;
};

export const generateUsers = (n = 2000) => {
    const plans = ["Basic", "Standard", "Premium", "Family"];
    const statuses = ["Active", "Inactive", "Banned", "Pending"];
    const names = ["Riya", "Arjun", "Sam", "Pooja", "Kunal", "Aisha", "Rohan", "Mira", "Vikram", "Sneha"];

    const data = {};
    for (let i = 0; i < n; i++) {
        const key = `user:${1000 + i}`;
        data[key] = {
            name: `${faker.sample(names)} ${i}`,
            plan: faker.sample(plans),
            status: faker.sample(statuses),
            last_login: `${faker.int(1, 24)}h ago`
        };
    }
    return data;
};

export const generateTelecomData = (n = 10000) => {
    const cities = ["Mumbai", "Delhi", "Pune", "Chennai", "Bangalore", "Hyderabad", "Kolkata"];
    const data = [];

    for (let i = 0; i < n; i++) {
        data.push({
            user_id: faker.int(1000, 9999),
            duration_sec: faker.int(10, 3600),
            data_usage_mb: parseFloat(faker.float(0.5, 500)),
            city: faker.sample(cities),
            plan_type: faker.sample(["Prepaid", "Postpaid"]),
            timestamp: faker.date()
        });
    }
    return data;
};

export const generateGraphData = (numUsers = 50, numAccounts = 20) => {
    const users = Array.from({ length: numUsers }, (_, i) => `User${i}`);
    const accounts = Array.from({ length: numAccounts }, (_, i) => `Acc${i}`);
    const allNodes = [...users, ...accounts];
    const graph = {};

    allNodes.forEach(n => graph[n] = []);

    users.forEach(u => {
        if (Math.random() > 0.3) {
            const acc = faker.sample(accounts);
            if (!graph[u].includes(acc)) graph[u].push(acc);
        }
        if (Math.random() > 0.7) {
            const friend = faker.sample(users);
            if (friend !== u && !graph[u].includes(friend)) graph[u].push(friend);
        }
    });

    accounts.forEach(acc => {
        if (Math.random() > 0.5) {
            const u = faker.sample(users);
            if (!graph[acc].includes(u)) graph[acc].push(u);
        }
        if (Math.random() > 0.8) {
            const acc2 = faker.sample(accounts);
            if (acc2 !== acc && !graph[acc].includes(acc2)) graph[acc].push(acc2);
        }
    });

    return graph;
};

export const generateReviews = (n = 2000) => {
    const customers = ["Riya", "Arjun", "Sam", "Pooja", "Kunal", "Aisha", "Rohan", "Mira"];
    const items = ["iPhone", "Laptop", "Headphones", "Shoes", "Smartwatch", "Camera"];
    const good = ["good", "excellent", "amazing", "satisfying", "awesome", "great"];
    const bad = ["bad", "worst", "poor", "terrible", "disappointing"];

    const data = [];
    for (let i = 0; i < n; i++) {
        const item = faker.sample(items);
        const sentiment = Math.random() > 0.3 ? "positive" : "negative";
        let reviewText = "";
        let rating = 0;

        if (sentiment === "positive") {
            reviewText = `${item} is ${faker.sample(good)} and I feel ${faker.sample(good)} using it!`;
            rating = faker.int(4, 5);
        } else {
            reviewText = `${item} is ${faker.sample(bad)} and I feel ${faker.sample(bad)} using it!`;
            rating = faker.int(1, 3);
        }

        data.push({
            user: faker.sample(customers),
            review: reviewText,
            rating: rating,
            date: faker.date()
        });
    }
    return data;
};

export const generateTweets = (n = 2000) => {
    const topics = ["#BigData", "#UPI", "#India", "#Budget2025", "#Tech", "#Startups", "#AI"];
    const moods = ["love", "hate", "confused about", "excited for", "worried about", "happy with"];
    const entities = ["economy", "government", "banks", "technology", "students", "jobs"];

    const data = [];
    for (let i = 0; i < n; i++) {
        data.push({
            user: `user${faker.int(100, 9999)}`,
            tweet: `I ${faker.sample(moods)} ${faker.sample(entities)} ${faker.sample(topics)}`,
            likes: faker.int(0, 10000),
            retweets: faker.int(0, 5000)
        });
    }
    return data;
};

export const generateEconomics = (n = 2000) => {
    const cities = ["Mumbai", "Delhi", "Pune", "Chennai", "Bangalore"];
    const actions = ["spending increased", "inflation rising", "prices stable", "strong demand", "GDP growth improving", "unemployment rate dropping"];
    const sectors = ["food", "fuel", "housing", "education", "health", "tech"];

    const data = [];
    for (let i = 0; i < n; i++) {
        data.push({
            city: faker.sample(cities),
            report: `In ${faker.sample(cities)}, ${faker.sample(actions)} especially in ${faker.sample(sectors)} sector.`,
            impact_score: faker.int(1, 10),
            confidence: parseFloat(faker.float(0.5, 0.99))
        });
    }
    return data;
};
