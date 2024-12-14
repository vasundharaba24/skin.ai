import React, { useRef, useState } from 'react';
import axios from 'axios';
import Navbar from './Component/Navbar/Navbar';
import Webcam from 'react-webcam';

const Page1 = () => {
  const [image, setImage] = useState(null); 
  const [result, setResult] = useState(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false); 
  const webcamRef = useRef(null);

  // Function to start the webcam
  const startWebcam = () => {
    setIsWebcamActive(true);
  };

  // Function to capture the image from the webcam
  const captureImage = () => {
    const capturedImage = webcamRef.current.getScreenshot();
    setImage(capturedImage); 
    setIsWebcamActive(false); 
  };

 
  const uploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => resizeImage(reader.result, 224, 224, setImage); 
    reader.readAsDataURL(file);
  };

  // Function to submit the image for prediction
  const handleSubmit = async () => {
    if (!image) return;

    const file = dataURLtoFile(image, 'image.png');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/predict-type', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('There was an error uploading the image!', error);
    }
  };

  // Utility function to convert dataURL to file object
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Function to resize the uploaded image
  const resizeImage = (dataUrl, width, height, callback) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg'));
    };
    img.src = dataUrl;
  };

  return (
    <div>
    <Navbar />
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 , marginTop: '50px'}}>
      <h1 style={{ textAlign: 'center', marginBottom: 60 }}>
        AI Skin Analysis by Skin.AI
      </h1>
      <div style={{ display: 'flex', backgroundColor: '#f5f5f5', borderRadius: 8, overflow: 'hidden' }}>

        <div style={{ width: '50%', padding: 20, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
          <p style={{
            textAlign: 'lest', 
            color: '#666', 
            padding: '20px',
            fontSize:'22px'
            
          }}>
            <strong>Skin.AI</strong> is an AI company that develops science-backed technologies for the beauty & skincare industry. Our AI solutions help brands provide engaging and hyper-personalized digital shopping experiences that drive growth and customer satisfaction.
          </p>
          <p style={{
            textAlign: 'left',
            color: '#666',
            padding: '20px',
            fontSize:'22px'
          }}>
            Below, you’ll find a demonstration of how our AI skin analysis and personalized product recommendation technology works.
          </p>
        </div>
        <div style={{ width: '50%', position: 'relative' }}>
          <img
            src="https://skinanalysis.pro/cdn/shop/files/AI_Skin_Analysis_1.png?v=1724868998&width=1070"
            alt="Demonstration of AI Skin Analysis"
            style={{ width: '100%', borderRadius: '0 8px 8px 0' }}
          />
        </div>
      </div>

      <h2 className='mt-4 text-center'>SKIN-TYPE DETECTIOIN</h2>
        
        <div style={styles.mainContentContainer}>
          {/* First Main Content Box with Webcam Feature */}

          
          
          <div style={styles.mainContent}>
            
            {/* Display Webcam or Static Image based on State */}
            {isWebcamActive ? (
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={styles.webcam}
                />
                <button onClick={captureImage} style={styles.captureButton}>
                  Capture Image
                </button>
              </div>
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2Fb4cb74cb-a241-40a6-9b8f-0540905e41a5.jpg?alt=media&token=aafcb588-5046-4700-a18b-53f07c444aa1"
                alt="Check your skin quality"
                style={styles.image}
              />
            )}

            {/* Button to Start Webcam */}
            {!isWebcamActive && (
              <button onClick={startWebcam} style={styles.startButton}>
                Start Webcam
              </button>
            )}
          </div>

          {/* Second Main Content Box for Displaying Captured Image & Detection */}
          <div style={styles.mainContent}>
            {/* Display Captured Image or Placeholder */}
            {image ? (
              <img src={image} alt="Captured for Skin Analysis" style={styles.image} />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2Fb4cb74cb-a241-40a6-9b8f-0540905e41a5.jpg?alt=media&token=aafcb588-5046-4700-a18b-53f07c444aa1"
                alt="Check your skin quality"
                style={styles.image}
              />
            )}

            {/* Upload from file if not using webcam */}
            <input type="file" onChange={uploadImage} className="mb-4" />

            {/* Submit button for analysis */}
            <button onClick={handleSubmit} style={styles.startButton}>
              Submit for Analysis
            </button>

            {/* Display prediction result */}
            {result && (
              <div style={{ marginTop: 20 }}>
                <h2>Prediction Result</h2>
                <p>Class: {result.class}</p>
                <p>Confidence: {result.confidence}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mainContentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  mainContent: {
    position: 'relative',
    textAlign: 'center',
    margin: '20px',
    padding: '10px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
    width: 'calc(50% - 40px)', // Adjust for margin
  },
  image: {
    width: '100%',
    borderRadius: '8px',
  },
  webcam: {
    width: '100%',
    borderRadius: '8px',
  },
  startButton: {
    backgroundColor: '#0056FF',
    color: '#fff',
    padding: '15px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  captureButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default Page1;
