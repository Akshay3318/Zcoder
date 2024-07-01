// import React, { useState, useEffect } from 'react';
// import { useAuthContext } from '../../hooks/useAuthContext';
// import './Bookmarks.css';

// const Bookmarks = () => {
//   const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//   const {userLogin} = useAuthContext();
//   console.log(userLogin);

//   useEffect(() => {
//     if (userLogin) {
//       fetchBookmarkedQuestions(userLogin.result._id);
//     }
//   }, [userLogin]); // Run the effect when the user object changes

//   const fetchBookmarkedQuestions = async (userId) => {
//     try {
//       const response = await fetch(`/user/bookmarks/${userId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setBookmarkedQuestions(data);
//       } else {
//         console.error('Failed to fetch bookmarked questions');
//       }
//     } catch (error) {
//       console.error('Error fetching bookmarked questions', error);
//     }
//   };

//   return (
//     <div className='bookmarks'>
//       <h1>Bookmarked Questions</h1>
//       <ul>
//         {bookmarkedQuestions.map((bookmark) => (
//           <li key={bookmark._id}>
//             <div>
//               <h3>{bookmark.title}</h3>
//               <p>Title Slug: {bookmark.titleSlug}</p>
//               <p>solutions: {bookmark.solutions}</p>
              
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Bookmarks;









import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Bookmarks.css';

const Bookmarks = () => {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { userLogin } = useAuthContext();
  console.log(userLogin);

  useEffect(() => {
    if (userLogin) {
      fetchBookmarkedQuestions(userLogin.result._id);
    }
  }, [userLogin]); // Run the effect when the user object changes

  const fetchBookmarkedQuestions = async (userId) => {
    try {
      const response = await fetch(`/user/bookmarks/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBookmarkedQuestions(data);
      } else {
        console.error('Failed to fetch bookmarked questions');
      }
    } catch (error) {
      console.error('Error fetching bookmarked questions', error);
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  return (
    <div className='bookmarks'>
      <h1>Bookmarked Questions</h1>
      <ul>
        {bookmarkedQuestions.map((bookmark) => (
          <li key={bookmark._id}>
            <div>
              <h3 onClick={() => handleQuestionClick(bookmark)}>{bookmark.title}</h3>
            </div>
          </li>
        ))}
      </ul>
      {selectedQuestion && (
        <div>
          <h2>{selectedQuestion.title}</h2>
          <ul>
            {selectedQuestion.solutions.map((solution) => (
              <li key={solution._id}>
                <code>{solution.language}</code>
                <p>{solution.solution}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;