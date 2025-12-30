import React from 'react';

const MultimediaView = () => {
    return (
        <div className="view-container">
            <header style={{ marginBottom: '2rem' }}>
                <h1>🖼 Multimedia Storage</h1>
                <p style={{ color: '#94a3b8' }}>NoSQL stores Metadata + CDN Links</p>
            </header>

            <div className="card-grid">
                <div className="card">
                    <img src="https://picsum.photos/400/200" alt="Demo" style={{ width: '100%', borderRadius: '0.5rem' }} />
                    <div style={{ marginTop: '1rem' }}>
                        <h3>Image Metadata</h3>
                        <pre className="code-block" style={{ fontSize: '0.8rem' }}>
                            {`{
  "id": "IMG_992",
  "url": "cdn.bucket.com/img992.jpg",
  "tags": ["AI", "Nature"],
  "size": "2.4MB"
}`}
                        </pre>
                    </div>
                </div>

                <div className="card">
                    <h3>Audio / Video</h3>
                    <div style={{ padding: '2rem', background: '#000', borderRadius: '0.5rem', color: 'white', textAlign: 'center' }}>
                        ▶ PLaying Stream
                    </div>
                    <pre className="code-block" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                        {`{
  "id": "VID_202",
  "stream_url": "mux.com/stream/xyz",
  "duration_sec": 120,
  "resolutions": ["1080p", "4k"]
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default MultimediaView;
