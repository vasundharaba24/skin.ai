import React from 'react';
import Navbar from '../../Component/Navbar/Navbar';
import './Home.css';
import img from '../../assets/face.png'

function Home() {
  return (
    <div>
      <Navbar />
      <div className='container'></div>
      <div className="text-center mt-5">
        <h1>
          The Science-Based Solution <br />
          for <span className="gradient-text">AI Skin Analysis</span>
          <span className="star sparkle sparkle1">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12.5523 2 13 2.44772 13 3V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V3C11 2.44772 11.4477 2 12 2Z" fill="url(#paint0_linear)" />
              <path d="M21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12Z" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#4A90E2" />
                  <stop offset="1" stop-color="#3A67E3" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="star sparkle sparkle2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12.5523 2 13 2.44772 13 3V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V3C11 2.44772 11.4477 2 12 2Z" fill="url(#paint0_linear)" />
              <path d="M21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12Z" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#4A90E2" />
                  <stop offset="1" stop-color="#3A67E3" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>
        <p className="description">
          Start your customers' journey to healthier skin with personalized product
          <br />
          recommendations, available at the tap of a button.
        </p>
        <button type="button" className="btn mt-2 btn-demo mb-10">Book Appointment</button>
      </div>

      <img src={img} className='img-center '></img>
    </div>
  );
}

export default Home;
