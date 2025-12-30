import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import { generateProducts, generateUsers, generateTelecomData, generateGraphData, generateReviews, generateTweets, generateEconomics } from './utils/dataGenerator';
import './App.css';

// Lazy load views to simulate real app structure
import DocumentView from './components/views/DocumentView';
import KeyValueView from './components/views/KeyValueView';
import ColumnView from './components/views/ColumnView';
import GraphView from './components/views/GraphView';
import SqlVsColumnView from './components/views/SqlVsColumnView';
import ReviewsView from './components/views/ReviewsView';
import TweetsView from './components/views/TweetsView';
import EconomicsView from './components/views/EconomicsView';
import MultimediaView from './components/views/MultimediaView';

function App() {
    const [mode, setMode] = useState("general");
    const [view, setView] = useState("doc");
    const [loading, setLoading] = useState(true);

    // Generate Data Once
    const data = useMemo(() => {
        return {
            products: generateProducts(2000), // Adjusted for browser performance
            users: generateUsers(2000),
            telecom: generateTelecomData(10000),
            graph: generateGraphData(100, 50),
            sqlData: generateTelecomData(50000), // Comparison
            reviews: generateReviews(2000),
            tweets: generateTweets(2000),
            economics: generateEconomics(2000)
        };
    }, []);

    useEffect(() => {
        // Fake loading for effect
        setTimeout(() => setLoading(false), 800);
    }, []);

    const renderView = () => {
        if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}><div className="brand" style={{ fontSize: '2rem' }}>🚀 NoSQL Demo</div><div>Generating Big Data...</div></div>;

        switch (view) {
            case "doc": return <DocumentView data={data.products} />;
            case "kv": return <KeyValueView data={data.users} />;
            case "col": return <ColumnView data={data.telecom} />;
            case "graph": return <GraphView data={data.graph} />;
            case "sql": return <SqlVsColumnView data={data.sqlData} />;
            case "multimedia": return <MultimediaView />;

            case "reviews": return <ReviewsView data={data.reviews} />;
            case "tweets": return <TweetsView data={data.tweets} />;
            case "economics": return <EconomicsView data={data.economics} />;
            default: return <div>Select a module</div>;
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                currentMode={mode}
                setMode={setMode}
                currentView={view}
                setView={setView}
            />
            <div className="main-content">
                {renderView()}
            </div>
        </div>
    );
}

export default App;
