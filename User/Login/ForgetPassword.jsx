import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import the CSS file
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.", { autoClose: 3000 });
      setResetRequested(true);
      setEmail('');
    } catch (error) {
      toast.error("Failed to send password reset email: " + error.message, { autoClose: 3000 });
    }
  };

  return (
    <div className="forgot-password d-flex align-items-center justify-content-center min-vh-100 bg-image">
      <div className="session p-4 bg-light shadow rounded">
   
        <form className="login-form" autoComplete="off" onSubmit={handlePasswordReset}>
        <h3 className="text-center mb-4">Enter details</h3>
          {!resetRequested ? (
            <>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
              </div>
              <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            </>
          ) : (
            <p className="text-center">A password reset email has been sent. Please check your inbox.</p>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ForgotPassword;
