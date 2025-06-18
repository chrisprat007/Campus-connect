import React, { useEffect, useRef } from "react";

export default function CollegeMeeting({ meetingId, onClose }) {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    // Load Jitsi script if not already loaded
    console.log(meetingId);
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          return resolve();
        }
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Jitsi script load error"));
        document.body.appendChild(script);
      });
    };

    loadJitsiScript()
      .then(() => {
        const domain = "meet.jit.si";
        const options = {
          roomName: meetingId,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: "100%",
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              "microphone", "camera", "chat", "raisehand", "tileview", "hangup"
            ],
          },
          configOverwrite: {},
        };
        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Example: handle hangup button via API event
        apiRef.current.addEventListener("readyToClose", () => {
          onClose && onClose();
        });
      })
      .catch(console.error);

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [meetingId, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col p-4">
      <div className="flex-1 bg-black rounded-lg overflow-hidden" ref={jitsiContainerRef} />
    </div>
  );
}
