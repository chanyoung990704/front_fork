import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import tmdbApi from '../../api/tmdbApi';

const MAX_VIDEOS = 2;

const VideoList = props => {
    const { category } = useParams();
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const res = await tmdbApi.getVideos(category, props.id);
            setVideos(res.results.slice(0, MAX_VIDEOS));
        };
        getVideos();
    }, [category, props.id]);

    return (
        <>
            {videos.map(item => (
                <Video key={item.id} item={item} />
            ))}
        </>
    );
};

const Video = ({ item }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const updateIframeHeight = () => {
            const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
            iframeRef.current.style.height = height;
        };

        updateIframeHeight();
        window.addEventListener('resize', updateIframeHeight);
        return () => window.removeEventListener('resize', updateIframeHeight);
    }, []);

    return (
        <div className="video">
            <div className="video__title">
                <h2>{item.name}</h2>
            </div>
            <iframe
                src={`https://www.youtube.com/embed/${item.key}`}
                ref={iframeRef}
                width="40%"
                title="video"
            ></iframe>
        </div>
    );
};

export default VideoList;
