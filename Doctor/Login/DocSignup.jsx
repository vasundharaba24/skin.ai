import React, { useState } from 'react';
import '../../Doctor/Login/DocSignup.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { db, storage } from '../../../firebase'; // Adjust the import path if necessary
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function DocSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload a profile picture');
      return;
    }

    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        toast.error(error.message);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, 'Doctor'), {
            name,
            email,
            password,
            age,
            qualification,
            specialist,
            imageUrl: downloadURL
          });

          toast.success('Signup successful');
          // Clear form fields after successful signup
          setName('');
          setEmail('');
          setPassword('');
          setAge('');
          setQualification('');
          setSpecialist('');
          setImage(null);
        } catch (error) {
          toast.error('Signup failed');
        }
      }
    );
  };

  return (
    <div className="doc-login">
      <div className="docbackground-image"></div>
      <div className="session">
        <div className="doc-left"></div>
        <form className="doc-form" onSubmit={handleRegister}>
          <h4 className='heading-h4'>Doctor <span>Signup</span></h4>
          <p>Welcome! Create your account</p>
          <div className="floating-label">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              name="name"
              required
            />
            <label htmlFor="name">Name:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              name="email"
              required
            />
            <label htmlFor="email">Email:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              name="password"
              required
            />
            <label htmlFor="password">Password:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              type="number"
              name="age"
              required
            />
            <label htmlFor="age">Age:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="Qualification"
              type="text"
              name="qualification"
              required
            />
            <label htmlFor="qualification">Qualification:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              placeholder="Specialist"
              type="text"
              name="specialist"
              required
            />
            <label htmlFor="specialist">Specialist:</label>
            <div className="icon"> {/* SVG Icon Here */} </div>
          </div>
          <div className="floating-label">
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              required
            />
            <label htmlFor="image">Profile Picture:</label>
          </div>
          <button type="submit" className='log-btn'>Signup</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default DocSignup;
