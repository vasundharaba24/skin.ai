import React, { createContext } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../../../firebase'; 

export const DoctorContext = createContext();

export class DoctorContextProvider extends React.Component {
  state = {
    doctorDetails: [],
  };

  async componentDidMount() {
    try {
      // Fetch doctor details from Firestore
      const doctorCollection = collection(db, 'Doctor');
      const querySnapshot = await getDocs(doctorCollection);
  
      let doctorDetails = [];
      for (const doc of querySnapshot.docs) {
        const doctor = {
          id: doc.id,
          ...doc.data(),
        };
  
        if (doctor.imagePath) { 
          try {
            const imageRef = ref(storage, `images/${doctor.imagePath}`);
            const imageUrl = await getDownloadURL(imageRef);
            doctor.imageUrl = imageUrl;
          } catch (error) {
            console.error("Error fetching image URL:", error);
          }
        }
  
        doctorDetails.push(doctor);
      }
  
      console.log("Fetched doctor details:", doctorDetails); // Debugging log
      this.setState({ doctorDetails: doctorDetails });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  }
  

  render() {
    return (
      <DoctorContext.Provider
        value={{
          doctorDetails: [...this.state.doctorDetails],
        }}
      >
        {this.props.children}
      </DoctorContext.Provider>
    );
  }
}