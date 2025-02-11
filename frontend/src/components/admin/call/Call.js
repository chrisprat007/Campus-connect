import React, { useEffect, useRef, useState } from "react";
import socket from "../../../services/socket";
const Call = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callerId, setCallerId] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    socket.on("offer", (data) => {
      const { offer, senderId } = data;
      setCallerId(senderId);
      handleOffer(offer);
    });

    socket.on("answer", (data) => {
      const { answer } = data;
      handleAnswer(answer);
    });

    socket.on("candidate", (data) => {
      const { candidate } = data;
      handleCandidate(candidate);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
    };
  }, []);

  const handleLogin = (userId) => {
    socket.emit("login", userId);
  };

  const startCall = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStreamRef.current = localStream;

    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", {
          candidate: event.candidate,
          receiverId,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { offer, receiverId });

    setIsCallActive(true);
  };

  const handleOffer = async (offer) => {
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", {
          candidate: event.candidate,
          receiverId: callerId,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", { answer, senderId: callerId });

    setIsCallActive(true);
  };

  const handleAnswer = async (answer) => {
    const pc = peerConnectionRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleCandidate = async (candidate) => {
    const pc = peerConnectionRef.current;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <div>
      <h1>WebRTC Video Call</h1>
      {!isCallActive ? (
        <button onClick={startCall}>Start Call</button>
      ) : (
        <video ref={localStreamRef} autoPlay muted />
      )}
      <video ref={remoteStreamRef} autoPlay />
    </div>
  );
};

export default Call;
