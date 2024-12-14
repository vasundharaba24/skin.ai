import React from 'react';
import './Signup.css';
import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../../../firebase'; // Import Firestore (db is the firestore instance)
import { toast, ToastContainer } from 'react-toastify';
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Store user details in Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(), // Store timestamp
      });

      toast.success("Registration successful! Please check your email for verification.", { autoClose: 3000 });
    } catch (error) {
      setError(error.message);
      toast.error("Registration failed: " + error.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="signup">
      <div className="background"></div>
      <div className="session">
        <div className="signup-left"></div>
        <form className="signup-form" autoComplete="off" onSubmit={handleRegister}>
          <h4 className='heading-h4'>We are <span>Skin</span></h4>
          <p>Welcome! Create your account here!</p>

          <div className="floating-label">
            <input 
              placeholder="Email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <label htmlFor="email">Email:</label>
            <div className="icon">
              {/* Email icon */}
            </div>
          </div>

          <div className="floating-label">
            <input 
              placeholder="Password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password:</label>
            <div className="icon">
              {/* Password icon */}
            </div>
          </div>

          <button type="submit" className='signup-btn'>Signup</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
