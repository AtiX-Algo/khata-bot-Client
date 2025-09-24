// src/components/LedgerUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LedgerUpload = () => {
  const { user, loading } = useAuth();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [rawAiResponse, setRawAiResponse] = useState('');

  // Camera states
  const [stream, setStream] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage('');
      setAiResult(null);
      setRawAiResponse('');
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch { /* ignore */ }
    }
  };

  const openCamera = async () => {
    setMessage('');
    setAiResult(null);
    setRawAiResponse('');

    try {
      // Open the modal first (so video element is in DOM)
      setCameraOpen(true);

      // Constraints: prefer front camera for faces / selfies
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      // getUserMedia may reject if no permission or insecure origin (must be https or localhost)
      const s = await navigator.mediaDevices.getUserMedia(constraints);

      // Save and attach
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;      // helps autoplay on many browsers
        videoRef.current.playsInline = true;
        // Attempt to play. Some browsers require user gesture; muted helps.
        try {
          await videoRef.current.play();
        } catch {
          // fallback: wait for loadedmetadata then play
          await new Promise((resolve) => {
            const onLoaded = () => {
              videoRef.current.removeEventListener('loadedmetadata', onLoaded);
              resolve();
            };
            videoRef.current.addEventListener('loadedmetadata', onLoaded);
          });
          try { videoRef.current.play(); } catch { /* ignore */ }
        }
      }
    } catch (err) {
      console.error('Camera error', err);
      setMessage('❌ Camera access denied or not available. Make sure your browser has permission and you are on HTTPS or localhost.');
      // ensure modal closed and stream stopped
      stopStream();
      setCameraOpen(false);
    }
  };

  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      setMessage('❌ Camera not initialized.');
      return;
    }

    // Wait until video metadata available (dimensions)
    if (!video.videoWidth || !video.videoHeight) {
      await new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          reject(new Error('camera timeout'));
        }, 3000);
        const onMeta = () => {
          clearTimeout(timeout);
          video.removeEventListener('loadedmetadata', onMeta);
          resolve();
        };
        video.addEventListener('loadedmetadata', onMeta);
      }).catch((err) => {
        console.warn('Video metadata not ready', err);
      });
    }

    // final check
    if (!video.videoWidth || !video.videoHeight) {
      setMessage('❌ Camera still not ready. Try again or check permissions/lighting.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // If front camera is mirrored and you want correct orientation in captured image,
    // you can uncomment next two lines to flip during draw:
    // ctx.save();
    // ctx.scale(-1, 1); ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height); ctx.restore();

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        setMessage('❌ Failed to capture image.');
        return;
      }
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage('✅ Photo captured. You can now upload.');
      // stop and close camera
      closeCamera();
    }, 'image/jpeg', 0.92);
  };

  const closeCamera = () => {
    stopStream();
    setCameraOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return setMessage('❌ Please log in to upload a ledger.');
    if (!selectedFile) return setMessage('❌ Please select an image first!');

    setIsLoading(true);
    setMessage('');
    setAiResult(null);
    setRawAiResponse('');

    const formData = new FormData();
    formData.append('ledgerImage', selectedFile);
    formData.append('uid', user?.uid || '');

    try {
      // If your server expects no JWT (Option B earlier), remove Authorization header.
      // But if your server still accepts Firebase token, you can use it as before.
      // We'll try without Authorization by default:
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });

      setMessage(`✅ ${response.data.message}`);
      setAiResult(response.data.history?.aiResult || null);
    } catch (error) {
      console.error('Upload error', error);
      const errData = error.response?.data;
      const errorMsg = errData?.message || error.message || 'Error uploading file.';
      setMessage(`❌ ${errorMsg}`);
      if (errData?.rawResponse) {
        setRawAiResponse(errData.rawResponse);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-48"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (!user) {
    return (
      <div className="card w-full max-w-lg bg-base-100 shadow-xl mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl">Upload Your Daily Ledger</h2>
          <p className="my-4">You must be logged in to upload a ledger.</p>
          <div className="card-actions">
            <Link to="/login" className="btn btn-primary">Login to Continue</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card w-full max-w-lg bg-base-100 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-2xl">Upload Your Daily Ledger</h2>
          <p>Choose a photo or use your device's camera.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="join w-full">
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary join-item w-full"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <button type="button" className="btn btn-secondary join-item" onClick={openCamera}>
                Use Camera
              </button>
            </div>

            {previewUrl && (
              <div className="mt-4 border-2 border-dashed rounded-lg p-4">
                <p className="font-semibold text-center mb-2">Image Preview:</p>
                <img src={previewUrl} alt="Ledger preview" className="rounded-lg w-full" />
              </div>
            )}

            <div className="card-actions justify-end items-center">
              {message && <p className={`font-semibold text-sm ${message.startsWith('✅') ? 'text-success' : 'text-error'}`}>{message}</p>}
              <button type="submit" className="btn btn-primary" disabled={!selectedFile || isLoading}>
                {isLoading ? <><span className="loading loading-spinner"></span> Processing...</> : 'Digitize Ledger'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {aiResult && Array.isArray(aiResult) && (
        <div className="card w-full max-w-lg bg-base-100 shadow-xl mx-auto mt-6">
          <div className="card-body">
            <h2 className="card-title">Digitized Ledger Results</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>Item Name</th><th>Quantity</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {aiResult.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.itemName ?? 'N/A'}</td>
                      <td>{row.quantity ?? 'N/A'}</td>
                      <td>{row.price ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {rawAiResponse && (
        <div className="card w-full max-w-lg bg-error text-error-content shadow-xl mx-auto mt-6">
          <div className="card-body">
            <h2 className="card-title">AI Response Error</h2>
            <p>The AI returned data that could not be parsed. Raw response shown below:</p>
            <pre className="bg-base-100 text-base-content p-4 rounded-md mt-2 whitespace-pre-wrap">
              <code>{rawAiResponse}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {cameraOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Camera</h3>
            <div className="w-full h-64 bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            <div className="modal-action">
              <button className="btn btn-primary" onClick={capturePhoto}>Take Picture</button>
              <button className="btn" onClick={closeCamera}>Close</button>
            </div>
          </div>
          {/* hidden canvas for capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </dialog>
      )}
    </>
  );
};

export default LedgerUpload;
