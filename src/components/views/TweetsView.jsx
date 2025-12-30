import React, { useState, useMemo } from 'react';
import { getMostCommon } from '../../utils/analytics';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TweetsView = ({ data }) => {
    const [trending, setTrending] = useState(null);
    const [influencers, setInfluencers] = useState(null);

    const findTrending = () => {
        const allText = data.map(d => d.tweet).join(" ");
        const hashtags = allText.split(/\s+/).filter(w => w.startsWith("#"));
        setTrending(getMostCommon(hashtags, 5));
    };

    const findInfluencers = () => {
        const sorted = [...data].sort((a, b) => b.likes - a.likes).slice(0, 5);
        setInfluencers(sorted);
    };

    // Simulate Time Series for Likes Activity
    const chartData = useMemo(() => {
        // Generate fake hourly data based on total 24h
        return Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            activity: Math.floor(Math.random() * 5000) + 1000
        }));
    }, []);

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>🐦 Social Media Analytics</h1>
                <p style={{ color: '#94a3b8' }}>Real-time Trend Detection on {data.length.toLocaleString()} Tweets</p>
            </header>

            <div className="card-grid">
                <div className="card">
                    <h3>📈 Trend Detection</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>Identifies high volume hashtags.</p>
                    <button className="btn" onClick={findTrending} style={{ marginBottom: '1rem' }}>Identify Trends</button>

                    {trending && (
                        <div>
                            {trending.map(([tag, count], i) => (
                                <div key={i} style={{ padding: '0.5rem', background: '#1e293b', marginBottom: '0.5rem', borderRadius: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#38bdf8' }}>{tag}</span>
                                    <span style={{ color: '#64748b' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h3>⭐ Top Influencers</h3>
                    <button className="btn btn-outline" onClick={findInfluencers} style={{ marginBottom: '1rem' }}>Find Top Accounts</button>

                    {influencers && (
                        <div>
                            {influencers.map((inf, i) => (
                                <div key={i} style={{ fontSize: '0.9rem', marginBottom: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.25rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{inf.user}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#f43f5e' }}>♥ {inf.likes.toLocaleString()} Likes</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>Live Activity Stream (24h)</h3>
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="hour" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Line type="monotone" dataKey="activity" stroke="#38bdf8" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetsView;
