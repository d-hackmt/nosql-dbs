import React, { useState, useMemo } from 'react';
import { computeAverage } from '../../utils/analytics';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const EconomicsView = ({ data }) => {
    const [cityFocus, setCityFocus] = useState(null);
    const [impactScore, setImpactScore] = useState(null);

    const handleAnalyst = () => {
        // Find most mentioned city
        const counts = {};
        data.forEach(d => counts[d.city] = (counts[d.city] || 0) + 1);
        const topCity = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        setCityFocus(`${topCity[0]} (${topCity[1]} Reports)`);

        // Avg Impact
        const scores = data.map(d => d.impact_score);
        setImpactScore(computeAverage(scores).toFixed(2));
    };

    // Aggregate Impact Score by City
    const chartData = useMemo(() => {
        const cityScores = {};
        data.forEach(d => {
            if (!cityScores[d.city]) cityScores[d.city] = { total: 0, count: 0 };
            cityScores[d.city].total += d.impact_score;
            cityScores[d.city].count += 1;
        });

        return Object.keys(cityScores).map(city => ({
            city: city,
            avgImpact: parseFloat((cityScores[city].total / cityScores[city].count).toFixed(2))
        }));
    }, [data]);

    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>💰 Economic Policy Analytics</h1>
                <p style={{ color: '#94a3b8' }}>Analyzing {data.length.toLocaleString()} Field Reports</p>
            </header>

            <div className="card-grid">
                <div className="card">
                    <h3>📊 Policy Impact Engine</h3>
                    <button className="btn" onClick={handleAnalyst} style={{ marginBottom: '1rem' }}>Run Market Analysis</button>

                    {cityFocus && (
                        <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>High Activity Zone</div>
                            <div style={{ fontSize: '1.2rem', color: '#38bdf8', fontWeight: 'bold' }}>{cityFocus}</div>
                        </div>
                    )}

                    {impactScore && (
                        <div style={{ padding: '1rem', background: '#0f172a', borderRadius: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Global Market Sentiment</div>
                            <div style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold' }}>{impactScore} / 10.0</div>
                        </div>
                    )}
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>Regional Impact Scores</h3>
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="city" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Area type="monotone" dataKey="avgImpact" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ gridColumn: 'span 3' }}>
                    <h3>Raw Report Stream</h3>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.9rem', color: '#cbd5e1', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155' }}>
                                    <th style={{ padding: '0.5rem' }}>City</th>
                                    <th>Report Content</th>
                                    <th>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 10).map((d, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={{ padding: '0.5rem', color: '#f59e0b' }}>{d.city}</td>
                                        <td>{d.report}</td>
                                        <td style={{ color: d.confidence > 0.9 ? '#10b981' : '#94a3b8' }}>{(d.confidence * 100).toFixed(0)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EconomicsView;
