/* eslint-disable jsx-a11y/alt-text */
import React, { useRef, useState } from "react";
import TesseractLib from 'tesseract.js';
const Tessaract = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [imageStr , setImageStr] = useState("")

  // Function to open the camera
  const openCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };


 

  // Function to capture the photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    // Set canvas width and height same as video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data as base64
    const imageData = canvas.toDataURL("image/png");
    setImageStr(imageData);
    // Log the image data
    console.log("Captured Image: ", imageData);
    setIsCameraOpen(false);


    TesseractLib.recognize(
        imageData,
        'eng',
        { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
        console.log("abhi" + text);
      })
  };

  const reopenCam =() =>{
    setImageStr("");
  }
  return (
    <div>
      <button onClick={openCamera}>Open Camera</button>

      {isCameraOpen && (
        <div>
          <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }}></video>
          <button onClick={capturePhoto}>Capture Photo</button>
        </div>
      )} 
    {!isCameraOpen && imageStr != "" && (
        <div>
            <img  src={imageStr} />
            <button onClick={reopenCam}>X</button>
        </div>
    )}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default Tessaract;
