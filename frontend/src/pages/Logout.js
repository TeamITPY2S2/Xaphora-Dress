import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2>Logging out...</h2>
          <p>You will be redirected to the home page shortly.</p>
        </div>
      </div>
    </div>
  );
};

export default Logout; 