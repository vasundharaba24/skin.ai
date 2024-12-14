import React, { useContext, useState } from 'react';
import { DoctorContext } from './DoctorContext'; // Ensure this path is correct
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase'; // Ensure this path is correct
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDocDetails = () => {
  const { doctorDetails } = useContext(DoctorContext);

  if (doctorDetails.length === 0) {
    return <div>No doctor details available.</div>;
  }

  const doctor = doctorDetails[0]; 

  const [name, setName] = useState(doctor.name || '');
  const [email, setEmail] = useState(doctor.email || '');
  const [age, setAge] = useState(doctor.age || '');
  const [qualification, setQualification] = useState(doctor.qualification || '');
  const [specialist, setSpecialist] = useState(doctor.specialist || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const doctorRef = doc(db, 'Doctor', doctor.id);
      await updateDoc(doctorRef, {
        name,
        email,
        age,
        qualification,
        specialist,
      });
      toast.success('Details updated successfully!');
    } catch (error) {
      console.error('Error updating details:', error);
      toast.error('Failed to update details.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="p-4 rounded">
            {/* Profile section */}
            <div className="d-flex align-items-center mb-4">
              <img
                src={doctor.imageUrl || 'https://via.placeholder.com/100'} // Fallback to placeholder if no image
                alt="Profile"
                className="rounded-circle me-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="mb-1">{name}</h5>
                <p className="mb-0 text-muted">{email}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="inputName">Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputName"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputEmail">Email address</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="inputEmail"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="inputAge">Age</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  id="inputAge"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputQualification">Qualification</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputQualification"
                  placeholder="Enter qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="inputSpecialist">Specialist</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputSpecialist"
                  placeholder="Enter specialist"
                  value={specialist}
                  onChange={(e) => setSpecialist(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditDocDetails;
