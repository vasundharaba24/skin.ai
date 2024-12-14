import React, { useState, useEffect } from 'react';
import './edituserdetails.css'; 
import { auth } from '../../../firebase';
import { updateEmail, updatePassword, sendPasswordResetEmail } from 'firebase/auth';

const EditUserDetails = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fetch current user details
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
    }
  }, []);

  // Update email in Firebase
  const handleUpdateEmail = async () => {
    const user = auth.currentUser;
    try {
      if (email !== user.email) {
        await updateEmail(user, email);
        setMessage('Email updated successfully!');
      }
    } catch (error) {
      setMessage(`Error updating email: ${error.message}`);
    }
  };

  // Update password in Firebase
  const handleUpdatePassword = async () => {
    const user = auth.currentUser;
    try {
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully!');
    } catch (error) {
      setMessage(`Error updating password: ${error.message}`);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (error) {
      setMessage(`Error sending password reset email: ${error.message}`);
    }
  };

  return (
    <div className='container form-floating'>
      <h3>Edit User Details</h3>
      <div className="input-group mb-3">
        <span className="input-group-text">Email</span>
        <input 
          type="email" 
          className="form-control" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter new email" 
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">New Password</span>
        <input 
          type="password" 
          className="form-control" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password" 
        />
      </div>
      <div className="input-group mb-3">
        <button onClick={handleUpdateEmail} className="btn btn-primary">Update Email</button>
      </div>
      <div className="input-group mb-3">
        <button onClick={handleUpdatePassword} className="btn btn-primary">Update Password</button>
      </div>
      <div className="input-group mb-3">
        <button onClick={handleResetPassword} className="btn btn-danger">Reset Password</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditUserDetails;
