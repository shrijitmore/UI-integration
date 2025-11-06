import React from "react";

const AmmoTargetLoader = () => {
  return (
    <div style={styles.fullscreen}>
      <svg
        width="70"
        height="70"
        viewBox="0 0 160 160"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        {/* Outer ring */}
        <g className="ringRotate1" style={{ transformOrigin: "80px 80px" }}>
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#555"
            strokeWidth="6"
            strokeDasharray="440"
            strokeDashoffset="110"
            strokeLinecap="round"
          />
        </g>

        {/* Four lines outside outermost circle */}
        <g>
          {/* Top line */}
          <line
            x1="80"
            y1="0"
            x2="80"
            y2="20"
            stroke="#00ACCD"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Bottom line */}
          <line
            x1="80"
            y1="140"
            x2="80"
            y2="160"
            stroke="#00ACCD"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Left line */}
          <line
            x1="0"
            y1="80"
            x2="20"
            y2="80"
            stroke="#00ACCD"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Right line */}
          <line
            x1="140"
            y1="80"
            x2="160"
            y2="80"
            stroke="#00ACCD"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* Middle rings */}
        <g className="ringRotate2" style={{ transformOrigin: "80px 80px" }}>
          <circle
            cx="80"
            cy="80"
            r="55"
            fill="none"
            stroke="#00ACCD"
            strokeWidth="8"
            strokeDasharray="345"
            strokeDashoffset="60"
            strokeLinecap="round"
          />
        </g>
        <g className="ringRotate3" style={{ transformOrigin: "80px 80px" }}>
          <circle
            cx="80"
            cy="80"
            r="40"
            fill="none"
            stroke="#1f2937"
            strokeWidth="5"
            strokeDasharray="251"
            strokeDashoffset="30"
            strokeLinecap="round"
          />
        </g>

        {/* Gun pointer crosshair at center */}
        <g>
          {/* Center dot */}
          <circle
            cx="80"
            cy="80"
            r="8"
            fill="#555"
            stroke="#555"
            strokeWidth="2"
          />
          {/* Vertical lines */}
          <line
            x1="80"
            y1="40"
            x2="80"
            y2="65"
            stroke="#555"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="95"
            x2="80"
            y2="120"
            stroke="#555"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Horizontal lines */}
          <line
            x1="40"
            y1="80"
            x2="65"
            y2="80"
            stroke="#555"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="95"
            y1="80"
            x2="120"
            y2="80"
            stroke="#555"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <style>{`
        .ringRotate1 {
          animation: rotateClockwise 5s linear infinite;
        }
        .ringRotate2 {
          animation: rotateCounterClockwise 3.5s linear infinite;
        }
        .ringRotate3 {
          animation: rotateClockwise 2.5s linear infinite;
        }
        @keyframes rotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotateCounterClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  fullscreen: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    display: "block",
  },
};

export default AmmoTargetLoader;
