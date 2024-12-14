import React from 'react';  
import './aboutus.css';  

const Aboutus = () => {  
  return (  
    <div className="container">  
      <div className="card">  
      <img src="https://static.tildacdn.net/tild6666-6539-4565-b035-643138613732/Rectangle_58_1.jpg" alt="Customer with Camera" className="card-image" />   
        <div className="card-content">  
          <h3>Step 1</h3>  
          <p>Check your skin quality</p>  
        </div>  
      </div>  
      <div className="card">  
        <img src="https://static.tildacdn.net/tild3639-3538-4033-b039-326364336436/Frame_102_1.jpg" alt="Customer with Camera" className="card-image" />  
        <div className="card-content">  
          <h3>Step 2</h3>  
          <p>Our advanced AI engine quickly and efficiently evaluates the face, identifying more than 15 essential skin health and beauty metrics</p>  
        </div>  
      </div>  
    </div>  
  );  
};  
export default Aboutus;
