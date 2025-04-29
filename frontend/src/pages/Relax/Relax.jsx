import React, { useState } from 'react';
import './Relax.css';

const Bubble = ({ id, x, y, size }) => {
  const [popped, setPopped] = useState(false);

  const handlePop = () => {
    setPopped(true);
    setTimeout(() => setPopped(false), 500); // Reset after animation
  };

  return (
    <div
      className={`bubble ${popped ? 'popped' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={handlePop}
    />
  );
};

const Relax = () => {
  const [musicOn, setMusicOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState('');

  const toggleMusic = () => setMusicOn(!musicOn);

  const handleSongChange = (e) => {
    setSelectedSong(e.target.value);
    // trigger audio playback logic
  };

  return (
    <div className="bubble-screen">
      <div className="top-controls">
        <button onClick={toggleMusic}>
          {musicOn ? '🔊 Музика' : '🔇 Без музика'}
        </button>
        <select value={selectedSong} onChange={handleSongChange}>
          <option value="">Избери песна</option>
          <option value="song1">Песна 1</option>
          <option value="song2">Песна 2</option>
        </select>
      </div>

      {/* Sample bubbles */}
      <Bubble id={1} x={20} y={30} size={100} />
      <Bubble id={2} x={60} y={40} size={80} />
      <Bubble id={3} x={30} y={60} size={60} />
      <Bubble id={4} x={50} y={70} size={90} />
    </div>
  );
};

export default Relax;


// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { FaMusic, FaTimes } from "react-icons/fa";

// const musicTracks = [
//   { name: "\u041c\u0443\u0437\u0438\u043a\u0430 1", src: "/music1.mp3" },
//   { name: "\u041c\u0443\u0437\u0438\u043a\u0430 2", src: "/music2.mp3" },
//   { name: "\u041c\u0443\u0437\u0438\u043a\u0430 3", src: "/music3.mp3" },
// ];

// const generateBubble = () => ({
//   id: Math.random(),
//   x: Math.random() * 90 + 5, // 5% - 95%
//   size: Math.random() * 40 + 60, // 60px - 100px
//   duration: Math.random() * 8 + 8, // 8s - 16s
// });

// export default function Relax() {
//   const [bubbles, setBubbles] = useState([]);
//   const [currentTrack, setCurrentTrack] = useState(null);
//   const [showMusicPanel, setShowMusicPanel] = useState(false);
//   const audioRef = useRef(null);
//   const popSoundRef = useRef(null);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBubbles((b) => [...b, generateBubble()]);
//     }, 1200);
//     return () => clearInterval(interval);
//   }, []);

//   const popBubble = (id) => {
//     setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
//     popSoundRef.current?.play();
//   };

//   const handleMusicChange = (track) => {
//     setCurrentTrack(track);
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.src = track.src;
//       audioRef.current.play();
//     }
//   };

//   return (
//     <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-blue-300 to-blue-600">
//       {/* Background fish & waves */}
//       <div className="absolute inset-0 bg-[url('/underwater-bg.svg')] bg-cover bg-center opacity-20 pointer-events-none" />

//       {/* Toggle Music Panel */}
//       <button
//         className="fixed top-66 left-6 bg-white p-3 rounded-full shadow-lg hover:bg-blue-100 z-30"
//         onClick={() => setShowMusicPanel(!showMusicPanel)}
//       >
//         {showMusicPanel ? <FaTimes /> : <FaMusic />}
//       </button>

//       {/* Music Selection Panel */}
//       {showMusicPanel && (
//         <div className="fixed top-20 left-6 bg-white bg-opacity-90 p-4 rounded-xl shadow-lg z-20 w-52">
//           {musicTracks.map((track, index) => (
//             <button
//               key={index}
//               className="block w-full mb-2 text-left hover:bg-blue-100 p-2 rounded"
//               onClick={() => handleMusicChange(track)}
//             >
//               🎵 {track.name}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Bubbles */}
//       {bubbles.map((bubble) => (
//         <motion.div
//           key={bubble.id}
//           initial={{ bottom: -100, left: `${bubble.x}%`, opacity: 0.7 }}
//           animate={{ bottom: "110%", opacity: 0.2 }}
//           transition={{ duration: bubble.duration, ease: "easeInOut" }}
//           onClick={() => popBubble(bubble.id)}
//           className="absolute rounded-full border-2 border-white bg-white bg-opacity-10 shadow-inner backdrop-blur-md cursor-pointer"
//           style={{ width: bubble.size, height: bubble.size }}
//         />
//       ))}

//       {/* Audio Players */}
//       <audio ref={audioRef} loop />
//       <audio ref={popSoundRef} src="/pop.mp3" />
//     </div>
//   );
// }
