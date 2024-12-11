import React, { useEffect, useState } from 'react';
import "./VideosPage.css"

const VideosPage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/face/get_videos');
                const data = await response.json();
                const sortedVideos = data.videos.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
                setVideos(sortedVideos);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const handleVideoClick = (fileId) => {
        const videoElement = document.getElementById('video-player');
        const sourceElement = videoElement.querySelector('source');

        // Update the source to point to the video stream URL
        sourceElement.src = `http://127.0.0.1:5000/face/video/${fileId}`;
        videoElement.load();  // Reload the video element with the new source
        videoElement.play();  // Start playing the video
    };



    if (loading) {
        return <div>Loading videos...</div>;
    }

    return (
        <div className="videos-container">
            <h1>Stored Videos</h1>
            <div className="videos-list">
                {videos.length === 0 ? (
                    <p>No videos found.</p>
                ) : (
                    videos.map((video) => (
                        <div key={video.file_id} className="video-item">
                            <h3
                                onClick={() => handleVideoClick(video.file_id)}
                                style={{ cursor: 'pointer', color: 'blue' }}
                            >
                                {video.filename}
                            </h3>
                            <p>Uploaded on: {new Date(video.upload_date).toLocaleString()}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Video Player */}
            <div>
                <video id="video-player" width="600" controls>
                    <source type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

            </div>
        </div>
    );
};

export default VideosPage;
