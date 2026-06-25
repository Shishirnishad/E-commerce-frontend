import React from "react";
import "./AdBackground.css";

export default function AdBackground({ variant = "dark" }) {
  return (
    <div className={`ad-background ad-background--${variant}`}>
      <div className="ad-slide ad-active">
        <video
          className="ad-video"
          src="/videos/bg-ad.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={`ad-overlay ad-overlay--${variant}`} />
      </div>
    </div>
  );
}
