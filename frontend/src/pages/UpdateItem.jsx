import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/updateitem.css';
import { app } from '../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

export default function  UpdateItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);

  const [image1, setImage1] = useState(undefined);
  const [image2, setImage2] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    reviewId: "",
    productid: "",
    customerid: "",
    reviewText: "",
    reviewDate: "",
    averageRating: "",
    commentReview: "",
    
  });

  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  useEffect(() => {
    if (image2) {
      handleFileUpload(image2, 'alternateProfilePicture');
    }
  }, [image2]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    if (fileRef1.current) {
      fileRef1.current.click();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/getitem/${id}`);
        const data = await response.json();
        console.log(data);

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/user/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Updated successfully");
        navigate('/itemprofile');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  // Add a field to store the star rating value
  return (
    <div className="service-update">
      
      <input
        type="text"
        id="productid"
        name="productid"
        onChange={handleInputChange}
        value={updatediscount?.productid}
      />


      <input
        type="text"
        id="customerid"
        name="customerid"
        onChange={handleInputChange}
        value={updatediscount?.customerid}
      />
      <input
        type="text"
        id="reviewText"
        name="reviewText"
        onChange={handleInputChange}
        value={updatediscount?.reviewText}
      />
      <input
        type="text"
        id="reviewDate"
        name="reviewDate"
        onChange={handleInputChange}
        value={updatediscount?.reviewDate}
      />
      <input
        type="text"
        id="averageRating"
        name="averageRating"
        onChange={handleInputChange}
        value={updatediscount?.averageRating}
      />
       
       <input
        type="text"
        id="commentReview"
        name="commentReview"
        onChange={handleInputChange}
        value={updatediscount?.commentReview}
      />
       

     

     

      <button className="update-btn" onClick={handleUpdate}>
        Update 
      </button>
      <br />
      <br />
    </div>
  );
}

