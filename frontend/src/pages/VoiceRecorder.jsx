import React, { useState, useRef } from "react";
import { FaMicrophone, FaUndo } from "react-icons/fa";

export default function VoiceRecorder({ 
  onRecordingComplete, 
  cardTitle, 
  existingAudio,
  newAudioFile,
  onRevertAudio 
}) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const generateUniqueFilename = () => {
    const timestamp = Date.now();
    const cleanTitle = cardTitle
      ? cardTitle
          .toLowerCase()
          .replace(/[^a-z0-9\u0400-\u04FF]/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "")
      : "recording";

    return `${cleanTitle}_${timestamp}.webm`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const filename = generateUniqueFilename();
        const file = new File([blob], filename, { type: "audio/webm" });

        onRecordingComplete(file);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      alert("Неуспешен пристап до микрофонот. Ве молиме проверете ги дозволите.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const handleReRecord = () => {
    onRevertAudio();
    startRecording();
  };

  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        {!recording && !newAudioFile && (
          <button className="record-btn" onClick={startRecording}>
            <FaMicrophone /> Започни снимање
          </button>
        )}
        {recording && (
          <button className="stop-record-btn" onClick={stopRecording}>
            <div className="recording-indicator"></div> Заврши снимање
          </button>
        )}
      </div>
      
      {newAudioFile && !recording && (
        <div className="audio-preview">
          <audio controls className="audio-player">
            <source src={URL.createObjectURL(newAudioFile)} type="audio/webm" />
            Вашиот прелистувач не поддржува аудио елемент.
          </audio>
          
          <div className="audio-actions">
            <button className="rerecord-btn-styled" onClick={handleReRecord}>
              <FaMicrophone /> Пресними
            </button>
            {existingAudio && (
              <button className="revert-audio-btn-styled" onClick={onRevertAudio}>
                <FaUndo />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}