import React, { useState, useRef, useEffect } from 'react';
import Navbar from'../src/Component/Navbar/Navbar.jsx'
import axios from 'axios';
import Webcam from 'react-webcam';
import logo from '../src/assets/logo3.png';

const Page = () => {
  const [useWebcam, setUseWebcam] = useState(false);
  const [chosenImageBox1, setChosenImageBox1] = useState(null);
  const [chosenImageBox2, setChosenImageBox2] = useState(null);
  const [imageForDetection, setImageForDetection] = useState(null);
  const [detections, setDetections] = useState([]);
  const [finalPercentage, setFinalPercentage] = useState(null);
  const [resultImage, setResultImage] = useState(null); 
  const webcamRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [acneLevel, setAcneLevel] = useState(''); 
  const [capturedImage, setCapturedImage] = useState(null);


  const toggleWebcam = () => {
    setUseWebcam(!useWebcam);
  };

  const handleImageChangeBox2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setChosenImageBox2(imageUrl);
      setImageForDetection(imageUrl);
    }
  };

  const captureFromWebcam = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageForDetection(imageSrc);
    setChosenImageBox2(imageSrc);
  };

  const handleUpload = async () => {
    if (!imageForDetection) return;

    try {
      const formData = new FormData();
      const response = await fetch(imageForDetection);
      const blob = await response.blob();
      formData.append('file', blob, 'image.jpg');

      const apiResponse = await axios.post(
        'https://detect.roboflow.com/skin-detection-uvj1f/3',
        formData,
        {
          params: {
            api_key: 'bqLh7lE6t5T2ofvDKbWQ',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (apiResponse.data && apiResponse.data.predictions) {
        calculateAcneMetrics(apiResponse.data.predictions);
        setDetections(apiResponse.data.predictions);

        // Set the result image to be the chosen image for box 2
        setResultImage(imageForDetection); 
      }
    } catch (error) {
      console.error('Error in acne detection:', error.response ? error.response.data : error.message);
    }
  };

  const calculateAcneMetrics = (predictions) => {
    const acneCount = predictions.length;
    const averageConfidence = predictions.reduce((sum, det) => sum + det.confidence, 0) / acneCount;
  
    const countPercentage = (acneCount / 20) * 100;
    const finalCountPercentage = countPercentage > 100 ? 100 : countPercentage.toFixed(2);
  
    const confidencePercentage = averageConfidence * 100;
    const finalConfidencePercentage = confidencePercentage.toFixed(2);
  
    const finalSeverityPercentage = (
      0.7 * parseFloat(finalCountPercentage) +
      0.3 * parseFloat(finalConfidencePercentage)
    ).toFixed(2);
    setFinalPercentage(finalSeverityPercentage);
  
    let acneLevel; 
    if (finalSeverityPercentage < 30) {
      acneLevel = 'Mild';
    } else if (finalSeverityPercentage >= 30 && finalSeverityPercentage < 70) {
      acneLevel = 'Moderate';
    } else {
      acneLevel = 'Severe';
    }
    setAcneLevel(acneLevel); 
  };
  

  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      detections.forEach(det => {
        const scaleX = canvas.width / img.naturalWidth;
        const scaleY = canvas.height / img.naturalHeight;

        const x = det.x * scaleX - det.width * scaleX / 2;
        const y = det.y * scaleY - det.height * scaleY / 2;
        const width = det.width * scaleX;
        const height = det.height * scaleY;

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
      });
    }
  }, [detections]);

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
              <b>Skin.AI</b> is an AI company that develops science-backed technologies for the beauty & skincare industry. Our AI solutions help brands provide engaging and hyper-personalized digital shopping experiences that drive growth and customer satisfaction.
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
      </div>
<br></br>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={logo} style={styles.logo} />
        </div>

        <div style={styles.mainContentContainer}>
          {/* Box 1 */}
      
          <div style={styles.mainContent}>
              {useWebcam ? (
                  <>
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={styles.image} />
                      <button style={styles.startButton} onClick={captureFromWebcam}>
                          <span>Capture Image</span>
                      </button>
                  </>
              ) : capturedImage ? ( // Display captured image if available
                  <img src={capturedImage} alt="Captured skin quality" style={styles.image} />
              ) : chosenImageBox1 ? (
                  <img src={chosenImageBox1} alt="Chosen skin quality for box 1" style={styles.image} />
              ) : (
                  <img
                      src="https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2Fb4cb74cb-a241-40a6-9b8f-0540905e41a5.jpg?alt=media&token=aafcb588-5046-4700-a18b-53f07c444aa1"
                      alt="Check your skin quality"
                      style={styles.image}
                  />
              )}
              <button style={styles.startButton} onClick={toggleWebcam}>
                  <span>{useWebcam ? 'Stop webcam' : 'Start webcam'}</span>
              </button>
          </div>


          {/* Box 2 with Image and Upload Button */}
          <div style={styles.mainContent}>
            {resultImage ? ( 
              <>
                <img src={resultImage} ref={imageRef} alt="Result after analysis" style={styles.image} />
                <canvas ref={canvasRef} style={styles.canvas} />
              </>
            ) : chosenImageBox2 ? (
              <>
                <img src={chosenImageBox2} ref={imageRef} alt="Chosen skin quality for box 2" style={styles.image} />
                <canvas ref={canvasRef} style={styles.canvas} />
              </>
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/core-prd-frontend-images/o/skin-consultant%2F3302%2Fbranding%2Fb4cb74cb-a241-40a6-9b8f-0540905e41a5.jpg?alt=media&token=aafcb588-5046-4700-a18b-53f07c444aa1"
                alt="Check your skin quality"
                style={styles.image}
              />
            )}
            <input type="file" accept="image/*" onChange={handleImageChangeBox2} style={styles.fileInput} />
            <button style={styles.startButton} onClick={handleUpload}>
              <span>Analyze Acne</span>
            </button>
          </div>

          {/* Result Box */}
          <div style={styles.resultBox}>
            <h3>Acne Detection Result</h3>
            {finalPercentage ? (
              <>
              <p>Acne Severity: {finalPercentage}%</p>
              <p>Acne Level: {acneLevel}</p> 
            </>
              
            ) : (
              <p>No acne detected or analysis not done.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 1200,
    margin: '20px auto',
    padding: '20px',
    border: '2px solid black',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #ddd',
  },
  logo: {
    maxWidth: '200px',
  },
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
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    borderRadius: '8px',
  },
  fileInput: {
    display: 'block',
    margin: '10px 0',
  },
  startButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
  },
  resultBox: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    borderRadius: '8px',
  },
};

export default Page;