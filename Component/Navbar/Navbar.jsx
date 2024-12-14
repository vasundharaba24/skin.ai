import React, { useState, useEffect } from 'react';
import '../Navbar/Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo3.png';
import { FaSignOutAlt } from 'react-icons/fa'; 
import { auth } from '../../../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
function Navbar() {
  const [user, setUser] = useState(null); 
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { name: currentUser.email } : null); 
    });

    return () => unsubscribe();
  }, []);
  
  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null); 
      toast.success('Logged out successfully!'); 
    }).catch((error) => {
      toast.error('Logout failed!'); 
    });
  };

  const handleLogin = (role) => {
    setUser({ name: role === 'admin' ? 'Admin User' : 'Doctor User' });
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to={"/"}>
              <img 
                src={logo} 
                className="img-fluid" 
                alt="Logo" 
                style={{ width: '100px', height: 'auto' }} 
              />
            </Link>
          
            <div className="mx-auto">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center">
                <li className="nav-item ms-4">
                  <Link to={'/product'}>
                    <a className="nav-link active" aria-current="page" href="#">Product</a>
                  </Link>
                </li>
                <li className="nav-item ms-4">
                  <a className="nav-link active" aria-current="page" href="#">Contacts</a>
                </li>
                <li className="nav-item ms-4">
                  <a className="nav-link active" aria-current="page" href="#">About Us</a>
                </li>
                <li className="nav-item dropdown ms-4">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Detect
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/page" className="dropdown-item">Acne </Link>
                    </li>
                    <li>
                      <Link to="/skin-type" className="dropdown-item">SkinType </Link>
                    </li>
                    <li>
                      <Link to="/skin-tone" className="dropdown-item">SkinTone </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <form className="d-flex">
              {user ? (
                <div className="d-flex align-items-center">
                 <Link to={'/user'}><span className="me-2">{user.name}</span> </Link> 
                  <button 
                    className="btn btn-outline-danger" 
                    type="button" 
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    <FaSignOutAlt /> 
                  </button>
                </div>
              ) : (
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-primary dropdown-toggle" 
                    type="button" 
                    id="loginDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Login
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                    <li>
                      <Link to={'/admin-login'}>
                        <button 
                          className="dropdown-item" 
                          type="button" 
                          onClick={() => handleLogin('admin')}
                        >
                          Login as Admin
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/doc-login'}>
                        <button 
                          className="dropdown-item" 
                          type="button" 
                          onClick={() => handleLogin('doctor')}
                        >
                          Login as Doctor
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to={'/login'}>
                        <button 
                          className="dropdown-item" 
                          type="button" 
                          onClick={() => handleLogin('doctor')}
                        >
                          Login as User
                        </button>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </form>
          </div>
        </div>
      </nav>
      <ToastContainer /> 
    </div>
  );
}

export default Navbar;
