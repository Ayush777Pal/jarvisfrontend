import { useEffect, useRef, useState } from "react";

const Camera = ({onClose, autocapture=false}) => {

    const videoRef = useRef(null);

    const canvasRef = useRef(null);

    const [stream, setStream] = useState(null);
    const [countdown, setcountdown] = useState(null)

    useEffect(() => {

        startCamera();

        return () => {
            stopCamera();
        };

    }, []);
    useEffect(()=>{
        if (!autocapture) {
            return;
        }
        let count=3;
        setcountdown(count);
        const interval = setInterval(()=>{
            count--;
            if (count>0) {
                setcountdown(count);
            }else{
                clearInterval(interval);
                setcountdown("📸");
                setTimeout(()=>{
                    captureSelfie();
                },500)
            }
        },1000);
        return () => clearInterval(interval);
    },[autocapture]);

    const startCamera = async () => {

        try {

            const mediaStream =
                await navigator.mediaDevices.getUserMedia({
                    video: true
                });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

        } catch (error) {

            console.error("Camera Error:", error);
        }
    };

    const stopCamera = () => {

        if (stream) {

            stream.getTracks().forEach(
                (track) => track.stop()
            );
        }
    };

    const captureSelfie = () => {

        const video = videoRef.current;

        const canvas = canvasRef.current;

        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image =
            canvas.toDataURL("image/png");

        const link =
            document.createElement("a");

        link.href = image;

        link.download =
            `jarvis-selfie-${Date.now()}.png`;

        link.click();
        if (onClose) {
            setTimeout(() => {
                onClose();
            }, 1000);
        }
    };

    return (

        <div className="flex flex-col items-center gap-4">
            {
                countdown && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "6rem",
                            color: "#00c8ff",
                            fontWeight: "bold",
                            textShadow: "0 0 20px #00c8ff",
                            zIndex: 1000
                        }}
                    >
                        {countdown}
                    </div>
                )
            } 
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[500px] rounded-xl border border-cyan-500"
            />

            <canvas
                ref={canvasRef}
                className="hidden"
            />

            <button
                onClick={captureSelfie}
                className="bg-cyan-500 text-black px-6 py-2 rounded font-bold"
            >
                Capture Selfie
            </button>

        </div>
    );
};

export default Camera;