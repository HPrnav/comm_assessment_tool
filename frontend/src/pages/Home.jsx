/* eslint-disable react/no-unescaped-entities */
import 'regenerator-runtime/runtime'
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import "./Home.css"

export const Home = () => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    const gotoDashboard = () => {
        window.location.href = "/dashboard";
    };

    const [dialogText, setDialogText] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [show_face, set_show_face] = useState(false);
    const [loading, setloading] = useState(false);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const startContinuousListening = () => {
        SpeechRecognition.startListening({ continuous: true });
        setloading(true);
        set_show_face(true);
        setTimeout(() => {
            setloading(false);
        }, 6000);
    };

    const stopContinuousListening = async () => {
        SpeechRecognition.stopListening({ continuous: true });
        const videoElement = document.getElementById("video");
        if (videoElement) {
            videoElement.src = ""; // Clear the src to stop the video stream
        }
        const resp = await fetch("http://127.0.0.1:5000/face/stop_camera", {
            method: "POST"
        }).catch((err) => { console.log("error in stoping camera", err) })
        set_show_face(false);
        console.log("response of camera stop function", resp)
    };

    const grammarChecker = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/grammer/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: transcript }),
            });
            const resultText = await response.text();
            setDialogText(resultText);
            setShowDialog(true);
        } catch (err) {
            console.log(err);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    return (
        <div className="container">
            <h1>Real-Time Eye Contact Analysis</h1>

            {show_face && (
                <div className="video-container">
                    <img id="video" src="http://127.0.0.1:5000/face/video_feed" alt="Video Stream" />
                </div>
            )}

            {loading && <p className="text-gray-700">LOADING...</p>}

            <p className="text-lg">Microphone: {listening ? "on" : "off"}</p>

            <div className="flex gap-2 mb-4">
                <button onClick={startContinuousListening} className="bg-blue-500">
                    Start (Continuous)
                </button>
                <button onClick={stopContinuousListening} className="bg-blue-500">
                    Stop
                </button>
                <button onClick={resetTranscript} className="bg-gray-500">
                    Reset
                </button>
            </div>

            <p className="text-gray-700">{transcript}</p>

            <button onClick={grammarChecker} className="bg-green-500">
                Check Grammar
            </button>

            <button onClick={gotoDashboard} className="bg-blue-500">
                Go to Dashboard
            </button>

            {/* Add a link to videos page */}
            <button onClick={() => window.location.href = "/videos"} className="bg-green-500">
                View Stored Videos
            </button>

            {showDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <p>{dialogText}</p>
                        <button onClick={closeDialog} className="bg-red-500">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

