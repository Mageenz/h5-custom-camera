import { useState, useEffect, useRef } from "react";

export function useCameraLight(interval = 1000, stream, video) {
  const [light, setLight] = useState({ value: 0, level: "unknown" });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const timerRef = useRef(null);


  async function initCamera() {
    try {
      // stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      videoRef.current = video;

      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext("2d");

      timerRef.current = setInterval(() => {
        if (!video.videoWidth) return;

        // 降低分辨率来减少计算量
        canvas.width = video.videoWidth / 4;
        canvas.height = video.videoHeight / 4;
        ctxRef.current.drawImage(video, 0, 0, canvas.width, canvas.height);

        const pixels = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height).data;

        let sum = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          // 亮度公式 (人眼加权)
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += luminance;
        }

        const avg = sum / (pixels.length / 4);

        let level = "bright";
        if (avg < 50) level = "dark";
        else if (avg < 120) level = "dim";
        else if (avg < 200) level = "normal";

        setLight({ value: avg, level });
      }, interval);
    } catch (err) {
      console.error("Camera access error:", err);
    }
  }

  initCamera();

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return light; // { value: 平均亮度(0-255), level: 'dark'|'dim'|'normal'|'bright' }
}
