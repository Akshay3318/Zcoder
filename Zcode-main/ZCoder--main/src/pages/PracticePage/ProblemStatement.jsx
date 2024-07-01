import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ProblemStatement.module.css'
import { IoIosArrowDown,IoIosArrowUp, IoMdBookmark } from "react-icons/io";
import {useAuthContext} from '../../hooks/useAuthContext';


const ProblemStatement = () => {
  const { titleSlug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState('javascript'); // State to track selected language
  const [solutions, setSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [activeSolution, setActiveSolution] = useState(null);
  const [comments, setComments] = useState({}); // State to store comments for a solution

  // const [comments, setComments] = useState({});
  // const [commentInput, setCommentInput] = useState('');
  const {userLogin} = useAuthContext();


  const [bookmarks, setBookmarks] = useState(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    return storedBookmarks? JSON.parse(storedBookmarks) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);


  useEffect(() => {
    const fetchProblemStatement = async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${titleSlug}`);
        const data = await response.json();
        setProblem(data);
      } catch (error) {
        setError('Failed to fetch problem statement');
      } finally {
        setLoading(false);
      }
    };
    fetchProblemStatement();
  }, [titleSlug]);

  const handleSolutionChange = (e) => {
    setSolution(e.target.value);
    // console.log(solution);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };


  const handlePostSolution = async () => {
     try{
      const response = await fetch('/user/solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId:userLogin.result._id, titleSlug, title:problem.questionTitle, solution, language, username:userLogin.result.username, topicTags: problem.topicTags}),
      });
      console.log(response);
      if (response.ok) {
        alert('Solution posted successfully');
        setSolution('');
      } 
      else {
        alert('Nothing is posted');
      }
    } 
    catch (error) {
      alert('Error posting solution');
    }
  };




  


  const handleBookmark = async (sol) => {
    // setIsBookmarked((prevIsBookmarked)=>!prevIsBookmarked);
    // setBookmark(bookmark === sol._id ? null : sol._id);
    const isBookmarked = bookmarks.includes(sol._id);
    if(!isBookmarked){
      
      try {
        const response = await fetch('/user/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            solutionId:sol._id,
            userId:userLogin.result._id, 
            title:problem.questionTitle,
            titleSlug,
            language: sol.language,
            solution: sol.solution,
            topicTags: problem.topicTags
          }),
        });
        if (response.ok) {
          setBookmarks((prevBookmarks) => [...prevBookmarks, sol._id]);
          // setBookmark(sol._id)
          alert('Solution bookmarked successfully');
        } else {
          alert('Failed to bookmark solution');
        }
      }catch (error) {
          console.error('Error bookmarking solution', error);
        }
    }else{
      try {
        
        const response = await fetch(`/user/bookmarks/${userLogin.result._id}/${titleSlug}/${sol._id}`, {
          method: 'DELETE',
        });
      
        if (response.ok) {
          const responseBody = await response.json();
          console.log('Response from server:', responseBody);
          setBookmarks((prevBookmarks) => prevBookmarks.filter((id) => id!== sol._id));
          alert('Solution unbookmarked successfully');
        } else {
          const errorResponse = await response.json();
          console.error('Error unbookmarking solution:', errorResponse.error);
          alert('Failed to unbookmark solution');
        }
      } catch (error) {
        console.error('Error unbookmarking solution:', error);
        alert('Failed to unbookmark solution');
      }
    } 
  };

  const handlePostComment = async (solutionId, comment) => {
    try {
      const response = await fetch(`/user/comments/${solutionId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment, userId:userLogin.result._id, solutionId:solutionId, username : userLogin.result.username  }),
      });
      console.log(response);
      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => ({ ...prevComments, [solutionId]: [...(prevComments[solutionId] || []), newComment] }));
        // Update comments state for the specific solution
      } else {
        alert('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  const fetchComments = async (solutionId) => {
    try {
      const response = await fetch(`/user/comments/${solutionId}`);
      const data = await response.json();
      setComments((prevComments) => ({ ...prevComments, [solutionId]: data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('Failed to fetch comments');
    }
  };
    



  const fetchSolutions = async () => {
    if (showSolutions) {
      setShowSolutions(false);
      return;
    }
    try {
      const response = await fetch(`/user/solutions/${titleSlug}`);
      const data = await response.json();
      console.log(data);
      setSolutions(data);
      setShowSolutions(true);
    } catch (error) {
      alert('Failed to fetch solutions');
    }
  };
  const toggleSolution = (id) => {
    setActiveSolution(activeSolution === id ? null : id);
  };
  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.problemStatementContainer}>
      <div className={styles.problemStatement}>
        <p className={styles.title}>{problem.questionTitle}</p>
        <div className={styles.questionStatement} dangerouslySetInnerHTML={{ __html: problem.question }} />
        <p>Hints</p>
        <div className={styles.questionHint} dangerouslySetInnerHTML={{ __html: problem.hints }} />
      </div>
      <div className={styles.solutionEditor}>
        <div className={styles.headers}>
          {/* select languages */}
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button className={styles.button} onClick={handlePostSolution}>Post your solution</button>
          <button className={`${styles.button} ${showSolutions ? styles.show : ''}`} onClick={fetchSolutions}>Solutions </button>
        </div>
        {showSolutions ? (
          <div className={styles.solutionsList}>
            {solutions.map((sol) => (
              <div key={sol._id} className={styles.solutionItem}>
                <div className={styles.solutionHeader} onClick={() => toggleSolution(sol._id)}>
                  <p><strong>Language used:</strong> {sol.language}</p>
                  <p>Posted by: {sol.username || 'Anonymous'}</p>  {/* Display 'Anonymous' if username is missing */}
                  <p><strong>Posted at:</strong> {new Date(sol.createdAt).toLocaleString()}</p>
                  <IoMdBookmark className={`${styles.icon} ${bookmarks.includes(sol._id) ? styles.bookmarkIcon : ''}`} onClick={() => handleBookmark(sol)} />
                  {activeSolution === sol._id ? <IoIosArrowDown className={styles.icon} /> : <IoIosArrowUp className={styles.icon} />}
                  <button onClick={() => fetchComments(sol._id)}>View Comments</button>
                </div>
                <div className={`${styles.solutionContent} ${activeSolution === sol._id ? styles.show : ''}`}>
                  <SyntaxHighlighter language={sol.language} style={okaidia}>
                    {sol.solution}
                  </SyntaxHighlighter>
                  {/* Conditionally render comments based on availability */}
                  {comments[sol._id] && (
                    <div className={styles.comments}>
                      <h4>Comments</h4>
                      {/* Map through comments for this solution and display them */}
                      {comments[sol._id].map((comment) => (
                        <div key={comment._id} className={styles.comment}>
                          <p>{comment.content}</p>
                          {/* Optionally display username who posted the comment (if available) */}
                          {comment.username && <p>Posted by: {comment.username}</p>}
                        </div>
                      ))}
                      {/* Add a form to post a new comment */}
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const comment = e.target.elements.commentInput.value;
                        handlePostComment(sol._id, comment);
                        e.target.elements.commentInput.value = '';
                      }}>
                        <textarea name="commentInput" placeholder="Write your comment here..." />
                        <button type="submit">Post Comment</button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <textarea 
            className={styles.solutionInput} 
            value={solution} 
            onChange={handleSolutionChange} 
            placeholder="Write your solution here..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );

}

export default ProblemStatement;