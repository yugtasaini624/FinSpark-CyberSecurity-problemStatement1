import axios from "axios";

let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];

const API = "http://127.0.0.1:5000/api";

// =====================================
// START SCREEN RECORDING
// =====================================

export const startRecording = async()=>{

    try{

        mediaStream = await navigator.mediaDevices.getDisplayMedia({

            video:true,

            audio:false

        });

        recordedChunks = [];

        mediaRecorder = new MediaRecorder(

            mediaStream,

            {
                mimeType:"video/webm"
            }

        );

        mediaRecorder.ondataavailable = (event)=>{

            if(event.data.size > 0){

                recordedChunks.push(event.data);

            }

        };

        mediaRecorder.start();

        return true;

    }

    catch(error){

        console.log(
            "Recording error:",
            error
        );

        return false;

    }

};



// =====================================
// CAPTURE SCREENSHOT
// =====================================

export const captureScreenshot = async(token)=>{

    try{

        if(!mediaStream){

            console.log(
                "No active screen stream"
            );

            return false;

        }

        const videoTrack = mediaStream.getVideoTracks()[0];

        const imageCapture = new ImageCapture(
            videoTrack
        );

        const bitmap = await imageCapture.grabFrame();

        const canvas = document.createElement(
            "canvas"
        );

        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            bitmap,
            0,
            0
        );

        const blob = await new Promise(resolve=>{

            canvas.toBlob(resolve,"image/png");

        });

        const formData = new FormData();

        formData.append(
            "image",
            blob,
            "screenshot.png"
        );

        const response = await axios.post(

            `${API}/upload/screenshot`,

            formData,

            {

                headers:{

                    Authorization:`Bearer ${token}`,

                    "Content-Type":"multipart/form-data"

                }

            }

        );

        console.log(
            "Screenshot uploaded",
            response.data
        );

        return true;

    }

    catch(error){

        console.log(

            "Screenshot error",

            error.response?.data || error

        );

        return false;

    }

};



// =====================================
// STOP RECORDING + UPLOAD VIDEO
// =====================================

export const stopRecording = async()=>{

    return new Promise((resolve,reject)=>{

        try{

            if(!mediaRecorder){

                resolve(false);

                return;

            }

            mediaRecorder.onstop = async()=>{

                try{

                    const blob = new Blob(

                        recordedChunks,

                        {

                            type:"video/webm"

                        }

                    );

                    const formData = new FormData();

                    formData.append(

                        "video",

                        blob,

                        "session.webm"

                    );

                    const response = await axios.post(

                        `${API}/upload/recording`,

                        formData

                    );

                    console.log(

                        "Recording uploaded",

                        response.data

                    );

                    if(mediaStream){

                        mediaStream
                        .getTracks()
                        .forEach(track=>{

                            track.stop();

                        });

                    }

                    mediaRecorder = null;
                    mediaStream = null;
                    recordedChunks = [];

                    resolve(true);

                }

                catch(error){

                    console.log(

                        "Upload error",

                        error.response?.data || error

                    );

                    reject(error);

                }

            };

            mediaRecorder.stop();

        }

        catch(error){

            reject(error);

        }

    });

};