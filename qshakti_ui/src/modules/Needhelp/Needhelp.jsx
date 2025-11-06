import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Fade-in animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
`;

// Color slide animation for underline
const slide = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

// Styled components

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  max-width: 700px;
  text-align: center;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: #1f2937;
  font-weight: 700;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    height: 4px;
    width: 100%;
    border-radius: 2px;
    background: linear-gradient(
      270deg,
      #4f46e5,
      #3b82f6,
      #06b6d4,
      #4f46e5,
      #3b82f6
    );
    background-size: 400% 100%;
    animation: ${slide} 4s linear infinite;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-top: 6px; /* reduced margin */
  color: #4b5563;
`;

const VideoCard = styled.div`
  max-width: 900px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  position: relative;
  animation: ${fadeIn} 1.2s ease forwards;
`;

const VideoStyled = styled.video`
  width: 100%;
  height: auto;
  border-radius: 6px;
  outline: none;
  display: block;
`;

// Play button overlay styles
const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(31, 41, 55, 0.7);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(31, 41, 55, 0.85);
  }

  &::before {
    content: "";
    display: inline-block;
    margin-left: 6px;
    border-style: solid;
    border-width: 16px 0 16px 26px;
    border-color: transparent transparent transparent white;
  }
`;

const NeedHelp = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Hide play button if video is playing or ended
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);
  const handleVideoEnded = () => setIsPlaying(false);

  useEffect(() => {
    const vid = videoRef.current;
    vid.addEventListener("play", handleVideoPlay);
    vid.addEventListener("pause", handleVideoPause);
    vid.addEventListener("ended", handleVideoEnded);

    return () => {
      vid.removeEventListener("play", handleVideoPlay);
      vid.removeEventListener("pause", handleVideoPause);
      vid.removeEventListener("ended", handleVideoEnded);
    };
  }, []);

  return (
    <Wrapper>
      <Header>
        <Title>Need Help?</Title>
        <Subtitle>
          Watch the tutorial below to learn how to use the application
          effectively.
        </Subtitle>
      </Header>

      <VideoCard>
        <VideoStyled
          ref={videoRef}
          controls
          preload="metadata"
          crossOrigin="anonymous"
        >
          <source src="/needHelp.mp4" type="video/mp4" />
          <track
            default
            kind="subtitles"
            srcLang="en"
            src="/captions_en.vtt"
            label="English"
          />
          Your browser does not support the video tag.
        </VideoStyled>

        {!isPlaying && (
          <PlayButton onClick={handlePlayClick} aria-label="Play video" />
        )}
      </VideoCard>
    </Wrapper>
  );
};

export default NeedHelp;
