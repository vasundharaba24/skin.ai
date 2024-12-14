import React, { useState } from 'react';
import '../Login/AdminLogin.css';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify'; 

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
    
      if (email === 'vasundharaba247@gmail.com' && password === '123456') {
       
        toast.success("Logged in as admin!", { autoClose: 1000 });
        navigate('/admin2');
      } else {
        
        setError("Invalid email or password");
      }
    } catch (error) {
     
      setError(error.message);
    }
  };

  return (
    <div className="admin-login">
      <div className="adbackground-image"></div>
      <div className="session">
        <div className="admin-left"></div>
        <form className="admin-form" onSubmit={handleLogin}>
          <h4 className='heading-h4'>Admin <span>Login</span></h4>
          <p>Welcome back! Log in to your account to view updates</p>
          <div className="floating-label">
            <input
              placeholder="Email"
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Email:</label>
            <div className="icon">
              <svg enableBackground="new 0 0 100 100" version="1.1" viewBox="0 0 100 100" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                <style type="text/css" dangerouslySetInnerHTML={{ __html: "\n\t.st0{fill:none;}\n" }} />
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
              value={password}
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <div className="icon">
              <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                <style type="text/css" dangerouslySetInnerHTML={{ __html: "\n\t.st0{fill:none;}\n\t.st1{fill:#010101;}\n" }} />
                <rect className="st0" width={24} height={24} />
                <path className="st1" d="M19,21H5V9h14V21z M6,20h12V10H6V20z" />
                <path className="st1" d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z" />
                <path className="st1" d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z" />
              </svg>
            </div>
          </div>
          <button type="submit" className='log-btn'>Login</button>
          {error && <p className="error-message">{error}</p>}
                    
          <Link to={'/forget-password'}>
            <a className='link mt-2'>Forget Password?</a>
          </Link>
         
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
