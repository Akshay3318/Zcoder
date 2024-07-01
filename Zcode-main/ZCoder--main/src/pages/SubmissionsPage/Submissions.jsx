import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Submissions.css'

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const {userLogin} = useAuthContext()


  useEffect(() => {
    if (userLogin) {
      fetchSubmissions(userLogin.result._id);
    }
  }, [userLogin]); // Run the effect when the user object changes

  const fetchSubmissions = async (userId) => {
    try {
      const response = await fetch(`/user/solutions/byUser/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setSubmissions(data);
      } else {
        console.error('Failed to fetch  questions');
      }
    } catch (error) {
      console.error('Error fetching  questions', error);
    }
  };
  
   
  
  
  return (
    <div className='submissions'>
      <h2>Submissions</h2>
      <ul>
       
        {submissions.map((submission, index) => (
          <li key={index}>{submission.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Submissions;