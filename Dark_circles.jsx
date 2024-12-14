import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function Dark_circles() {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [detections, setDetections] = useState([]);
  const [noDetectionMessage, setNoDetectionMessage] = useState('');
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const resizedCanvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const resizedCanvas = resizedCanvasRef.current;
          const ctx = resizedCanvas.getContext('2d');
          resizedCanvas.width = img.naturalWidth;
          resizedCanvas.height = img.naturalHeight;
          ctx.clearRect(0, 0, resizedCanvas.width, resizedCanvas.height);
          ctx.drawImage(img, 0, 0, resizedCanvas.width, resizedCanvas.height);

          const resizedImageURL = resizedCanvas.toDataURL('image/jpeg');
          setImageURL(resizedImageURL);
          setImage(resizedImageURL.split(',')[1]);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    try {
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/dark_circle/1",
        params: {
          api_key: "bqLh7lE6t5T2ofvDKbWQ"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (response.data && response.data.predictions) {
        if (response.data.predictions.length === 0) {
          setNoDetectionMessage('No dark circles detected.');
        } else {
          setNoDetectionMessage('');
        }
        setDetections(response.data.predictions);
      } else {
        console.error('Unexpected API response:', response.data);
        setNoDetectionMessage('Error in detecting dark circles. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setNoDetectionMessage('Error in finding dark circles');
    }
  };

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      detections.forEach(det => {
        // Check if dimensions and coordinates need adjustment
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        const scaleX = canvas.width / imgWidth;
        const scaleY = canvas.height / imgHeight;

        // Adjust coordinates based on scaling
        const x = (det.x * scaleX) - 65
        const y =  (det.y * scaleY )- 12;
        const width = det.width * scaleX;
        const height = det.height * scaleY;

        // Debugging: Print scaled coordinates
        console.log(`Drawing box at (${x}, ${y}) with size ${width}x${height}`);

        // Draw bounding box
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 5;
        ctx.strokeRect(x, y, width, height);

        // Draw label
        ctx.fillStyle = 'green';;
        ctx.font = '28px Arial';
        ctx.fillText(
          `${det.class} (${(det.confidence * 100).toFixed(1)}%)`,
          x,
          y > 15 ? y - 10 : 15
        );
      });
    }
  }, [detections]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Dark Circle Detection</h1>
      <div className="mb-4">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="border p-2"
        />
      </div>
      {imageURL && (
        <div className="relative" style={{ width: '400px', height: '600px' }}>
          <img
            src={imageURL}
            alt="Uploaded"
            style={{ width: '400px', height: '600px' }}
            ref={imageRef}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '400px',
              height: '600px',
            }}
          />
        </div>
      )}
      <canvas
        ref={resizedCanvasRef}
        style={{ display: 'none' }}
        width={400}
        height={600}
      />
      {noDetectionMessage && <div className="mt-4 text-green-500">{noDetectionMessage}</div>}
      <button 
        onClick={handleUpload} 
        className="mt-4 bg-blue-500 text-white p-2 rounded"
        disabled={!imageURL} 
      >
        Detect Dark Circles
      </button>
    </div>
  );
}

export default Dark_circles;
