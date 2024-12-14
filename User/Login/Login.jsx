import React, { useState, useEffect } from 'react';
import '../Login/Login.css';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function Login({ setUser }) {  // Accept setUser from props
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!", { autoClose: 3000 });
      setUser(userCredential.user);  // Set the logged-in user
      navigate('/');  
    } catch (error) {
      setError(error.message);
      toast.error("Login failed: " + error.message, { autoClose: 3000 });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google successfully!", { autoClose: 3000 });
      setUser(userCredential.user);  // Set the logged-in user
      navigate('/'); 
    } catch (error) {
      setError(error.message);
      toast.error("Google login failed: " + error.message, { autoClose: 3000 });
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent! Check your inbox.", { autoClose: 3000 });
      setResetRequested(true);
      setResetEmail(''); // Clear the email field
    } catch (error) {
      setError(error.message);
      toast.error("Failed to send password reset email: " + error.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="login">
      <div className="background-image"></div>
      <div className="session">
        <div className="left"></div>
        <form className="login-form" autoComplete="off" onSubmit={handleLogin}> 
          <h4 className='heading-h4'>We are <span>Skin.ai</span></h4>
          <p>Welcome back! Log in to your account to view your skin</p>
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
              <svg enableBackground="new 0 0 100 100" version="1.1" viewBox="0 0 100 100" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.st0{fill:none;}\n" }} />
                <g transform="translate(0 -952.36)">
                  <path d="m17.5 977c-1.3 0-2.4 1.1-2.4 2.4v45.9c0 1.3 1.1 2.4 2.4 2.4h64.9c1.3 0 2.4-1.1 2.4-2.4v-45.9c0-1.3-1.1-2.4-2.4-2.4h-64.9zm2.4 4.8h60.2v1.2l-30.1 22-30.1-22v-1.2zm0 7l28.7 21c0.8 0.6 2 0.6 2.8 0l28.7-21v34.1h-60.2v-34.1z" />
                </g>
                <rect className="st0" width={100} height={100} />
              </svg>
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
              <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                <style type="text/css" dangerouslySetInnerHTML={{__html: "\n\t.st0{fill:none;}\n\t.st1{fill:#010101;}\n" }} />
                <rect className="st0" width={24} height={24} />
                <path className="st1" d="M19,21H5V9h14V21z M6,20h12V10H6V20z" />
                <path className="st1" d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z" />
                <path className="st1" d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z" />
              </svg>
            </div>
          </div>

          <Link to={'/forget-password'}>
            <a className='link'>Forget Password?</a>
          </Link>

          <button type="submit" className='log-btn'>Login</button>
  
          <div onClick={handleGoogleLogin}>
            <p className='mb-2'>Login with:</p>
            <FontAwesomeIcon icon={faGoogle} className="google-icon" />
          </div>

          <Link to={'/signup'}>
            <div className='link mt-2'>Don’t have an account? Signup</div>
          </Link>
          
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
