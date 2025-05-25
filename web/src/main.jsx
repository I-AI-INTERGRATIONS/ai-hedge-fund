import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import createGlobe from 'cobe';

function Globe() {
  const canvasRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/timeline.json')
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let phi = 0;
    const n = events.length || 1;
    const markers = events.map((_, i) => ({
      location: [0, (360 / n) * i],
      size: 0.02,
    }));

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 0.1],
      glowColor: [1, 1, 1],
      markers,
    });

    const info = document.getElementById('info');

    let frame = 0;
    const loop = () => {
      frame += 1;
      phi += 0.01;
      globe.set({ phi });
      if (events.length > 0) {
        const i = Math.floor((frame / 50) % events.length);
        info.textContent = `${events[i].year}: ${events[i].event}`;
      }
      requestAnimationFrame(loop);
    };
    loop();

    return () => globe.destroy();
  }, [events]);

  return <canvas ref={canvasRef}></canvas>;
}

createRoot(document.getElementById('root')).render(<Globe />);
