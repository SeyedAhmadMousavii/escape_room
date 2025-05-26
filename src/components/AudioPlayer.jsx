import React, { useRef, useState } from "react";

const playbackRates = [1, 1.5, 2, -1];

export default function AudioPlayer({ src }) {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const bufferRef = useRef(null);
  const [currentRateIndex, setCurrentRateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const loadAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    bufferRef.current =
      await audioContextRef.current.decodeAudioData(arrayBuffer);
  };

  const play = async () => {
    if (!bufferRef.current) await loadAudio();
    if (!bufferRef.current || !audioContextRef.current) return;

    const newSource = audioContextRef.current.createBufferSource();
    const rate = playbackRates[currentRateIndex];

    if (rate === -1) {
      const reversedBuffer = audioContextRef.current.createBuffer(
        bufferRef.current.numberOfChannels,
        bufferRef.current.length,
        bufferRef.current.sampleRate,
      );

      for (let i = 0; i < bufferRef.current.numberOfChannels; i++) {
        const original = bufferRef.current.getChannelData(i);
        const reversed = reversedBuffer.getChannelData(i);
        for (let j = 0; j < original.length; j++) {
          reversed[j] = original[original.length - j - 1];
        }
      }

      newSource.buffer = reversedBuffer;
    } else {
      newSource.buffer = bufferRef.current;
      newSource.playbackRate.value = rate;
    }

    newSource.connect(audioContextRef.current.destination);
    newSource.start();
    sourceRef.current = newSource;
    setIsPlaying(true);

    newSource.onended = () => {
      setIsPlaying(false);
    };
  };

  const stop = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const cyclePlaybackRate = () => {
    const nextIndex = (currentRateIndex + 1) % playbackRates.length;
    setCurrentRateIndex(nextIndex);
  };

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
        maxWidth: "300px",
      }}
    >
      <button
        onClick={play}
        disabled={isPlaying}
        style={{ marginRight: "0.5rem" }}
      >
        Play
      </button>
      <button
        onClick={stop}
        disabled={!isPlaying}
        style={{ marginRight: "0.5rem" }}
      >
        Stop
      </button>
      <button onClick={cyclePlaybackRate} disabled={isPlaying}>
        Rate: {playbackRates[currentRateIndex]}
      </button>
    </div>
  );
}
