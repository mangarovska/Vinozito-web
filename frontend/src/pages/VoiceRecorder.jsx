import React, { useState, useRef } from "react";

export default function VoiceRecorder({ onRecordingComplete, cardTitle }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const generateUniqueFilename = () => {
    const timestamp = Date.now();
    
    const cleanTitle = cardTitle 
      ? cardTitle
          .toLowerCase()
          .replace(/[^a-z0-9\u0400-\u04FF]/g, '_') // allow Cyrillic characters, replace others with underscore
          .replace(/_+/g, '_') // replace multiple underscores with single
          .replace(/^_|_$/g, '') // remove leading/trailing underscores
      : 'recording';
    
    return `${cleanTitle}_${timestamp}.webm`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        
        // Create a File object with unique filename based on card title
        const filename = generateUniqueFilename();
        const file = new File([blob], filename, { type: "audio/webm" });
        
        chunks.current = [];
        onRecordingComplete(file); // Pass the File object instead of blob
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setRecording(false);
    }
  };

  return (
    <div className="voice-recorder">
      {!recording ? (
        <button onClick={startRecording}>🎙️ Сними ново аудио</button>
      ) : (
        <button onClick={stopRecording}>🛑 Стоп снимање</button>
      )}
      {/* {cardTitle && (
        <div className="recording-info">
          <small>Recording for: {cardTitle}</small>
        </div>
      )} */}
    </div>
  );
}