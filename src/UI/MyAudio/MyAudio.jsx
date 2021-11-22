import React, { useRef, useState } from "react";

export default function MyAudio({ audioURL }) {
  const [isPlay, setIsPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef();
  const progressBar = useRef();


  function onDwnLoad() {
    setIsPlay(false);
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }

  function togglePlayPause() {
    if (!isPlay) {
      audioPlayer.current.play();
      setIsPlay(true);
    } else {
      audioPlayer.current.pause();
      setIsPlay(false);
    }
  }

  function calcTime(secs) {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds >= 10 ? `${seconds}` : `0${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  function changeRange() {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  }


  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const downloadAudioFile = () => {
    // audioPlayer.current
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const blob = xhr.response;
    }
    xhr.open('GET', audioURL);
    xhr.send();
  }

  return (
    <>
      <audio
        src={audioURL}
        ref={audioPlayer}
        onLoadedData={onDwnLoad}
        onTimeUpdate={whilePlaying}
        onEnded={() => setIsPlay(false)}
      ></audio>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="audio-track">
          <div className="time"></div>
        </div>
        <button
          className="btn-floating btn-small  pink darken-1"
          onClick={togglePlayPause}
          style={{ marginRight: "10px", overflow: "visible" }}
        >
          {!isPlay ? (
            <i className="material-icons prefix">play_arrow</i>
          ) : (
            <i className="material-icons prefix">pause</i>
          )}
        </button>
        <span>{!isNaN(currentTime) ? calcTime(currentTime) : "00:00"}</span>
        <input
          type="range"
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
        <span onClick={()=>console.log('m')}>{!isNaN(duration) ? calcTime(duration) : "00:00"}</span>
        {/* <button className='btn' onClick={downloadAudioFile}>скачать</button> */}
      </div>
    </>
  );
}
