import React, { useState, useMemo } from 'react';
import { computeAverage, getMostCommon } from '../../utils/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ReviewsView = ({ data }) => {
    const [avgRating, setAvgRating] = useState(null);
    const [commonWords, setCommonWords] = useState(null);

    const handleComputeAvg = () => {
        const ratings = data.map(r => r.rating);
        setAvgRating(computeAverage(ratings).toFixed(2));
    };

    const handleSentiment = () => {
        const allText = data.map(r => r.review).join(" ").toLowerCase();
        const words = allText.split(/\s+/).filter(w => w.length > 4);
        setCommonWords(getMostCommon(words, 5));
    };

    const chartData = useMemo(() => {
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        data.forEach(r => counts[r.rating]++);
        return Object.entries(counts).map(([k, v]) => ({ rating: `${k} Star`, count: v }));
    }, [data]);

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>⭐ Customer Reviews</h1>
                <p style={{ color: '#94a3b8' }}>NLP Analytics on {data.length.toLocaleString()} Reviews</p>
            </header>

            <div className="card-grid">
                {/* Live Data Feed */}
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>📝 Live Review Feed</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.9rem', color: '#cbd5e1' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155' }}>
                                    <th style={{ padding: '0.5rem' }}>User</th>
                                    <th>Review</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 8).map((r, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{r.user}</td>
                                        <td>{r.review}</td>
                                        <td>{"⭐".repeat(r.rating)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Analytics */}
                <div className="card">
                    <h3>📊 Sentiment & Stats</h3>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button className="btn" onClick={handleComputeAvg}>Avg Rating</button>
                        {avgRating && <div style={{ fontSize: '1.5rem', color: '#fbbf24', fontWeight: 'bold' }}>{avgRating} / 5.0</div>}
                    </div>

                    <div>
                        <button className="btn btn-outline" onClick={handleSentiment} style={{ marginBottom: '1rem' }}>Analyze Words</button>
                        {commonWords && (
                            <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#94a3b8' }}>
                                {commonWords.map(([w, c]) => (
                                    <li key={w} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #1e293b' }}>
                                        <span>{w}</span> <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{c}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Rating Distribution Chart */}
                <div className="card" style={{ gridColumn: 'span 3' }}>
                    <h3>Ratings Distribution</h3>
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="rating" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsView;
