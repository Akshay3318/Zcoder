import React,{useContext,useState,useEffect} from 'react'
import styles from './Profile.module.css'
import axios from 'axios'
import { AuthContext } from '../../AuthContext'
import { useAuthContext } from '../../hooks/useAuthContext'


// import { useAuthContext } from '../../hooks/useAuthContext'
// import { useNavigate } from 'react-router-dom'
const Profile = () => {
 
  const [user, setUser] = useState(null);
  const [techStacks, setTechStacks] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState('');
  const [newTechStack, setNewTechStack] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newFriend, setNewFriend] = useState('');
  const {isAuthenticated,userLogin,isEdit,userr} = useAuthContext()
  
  
  const userId = userLogin.result._id; // Replace with actual user ID

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8008/user/${userId}`);
      setUser(response.data);
      setTechStacks(response.data.techStacks);
      setLanguages(response.data.languages);
      setFriends(response.data.friends);
      setMessage('');
    } catch (error) {
      setMessage('Error fetching user data');
    }
  };

  const handleDeleteTechStack = async (index) => {
    try {
      const updatedStacks = [...techStacks];
      updatedStacks.splice(index, 1);
      await axios.put(`http://localhost:8008/user/${userId}/techstacks`, { techStacks: updatedStacks });
      setTechStacks(updatedStacks);
      setMessage('Tech stack deleted successfully');
    } catch (error) {
      setMessage('Error deleting tech stack');
    }
  };

  const handleEditTechStack = async (index, updatedStack) => {
    try {
      const updatedStacks = [...techStacks];
      updatedStacks[index] = updatedStack;
      await axios.put(`http://localhost:8008/user/${userId}/techstacks`, { techStacks: updatedStacks });
      setTechStacks(updatedStacks);
      setMessage('Tech stack updated successfully');
    } catch (error) {
      setMessage('Error updating tech stack');
    }
  };

  const handleAddTechStack = async () => {
    if (newTechStack === '') return;
    try {
      const updatedStacks = [...techStacks, newTechStack];
      await axios.put(`http://localhost:8008/user/${userId}/techstacks`, { techStacks: updatedStacks });
      setTechStacks(updatedStacks);
      setNewTechStack('');
      setMessage('Tech stack added successfully');
    } catch (error) {
      setMessage('Error adding tech stack');
    }
  };

  const handleDeleteLanguage = async (index) => {
    try {
      const updatedLanguages = [...languages];
      updatedLanguages.splice(index, 1);
      await axios.put(`http://localhost:8008/user/${userId}/languages`, { languages: updatedLanguages });
      setLanguages(updatedLanguages);
      setMessage('Language deleted successfully');
    } catch (error) {
      setMessage('Error deleting language');
    }
  };

  const handleEditLanguage = async (index, updatedLanguage) => {
    try {
      const updatedLanguages = [...languages];
      updatedLanguages[index] = updatedLanguage;
      await axios.put(`http://localhost:8008/user/${userId}/languages`, { languages: updatedLanguages });
      setLanguages(updatedLanguages);
      setMessage('Language updated successfully');
    } catch (error) {
      setMessage('Error updating language');
    }
  };

  const handleAddLanguage = async () => {
    if (newLanguage === '') return;
    try {
      const updatedLanguages = [...languages, newLanguage];
      await axios.put(`http://localhost:8008/user/${userId}/languages`, { languages: updatedLanguages });
      setLanguages(updatedLanguages);
      setNewLanguage('');
      setMessage('Language added successfully');
    } catch (error) {
      setMessage('Error adding language');
    }
  };

  const handleDeleteFriend = async (friendUsername) => {
    try {
      const updatedFriends = friends.filter(friend => friend !== friendUsername);
      await axios.put(`http://localhost:8008/user/${userId}/friends`, { friends: updatedFriends });
      setFriends(updatedFriends);
      setMessage('Friend deleted successfully');
    } catch (error) {
      setMessage('Error deleting friend');
    }
  };

  const handleSearchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8008/search`, { params: { username: searchUsername } });
      setSearchResult(response.data);
      setMessage('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('User not found');
      } else {
        setMessage('Error searching user');
      }
    }
  };

  const handleAddFriend = async () => {
    if (!searchResult) return;
    try {
      const friendUsername = searchResult.username;
      await axios.put(`http://localhost:8008/user/${userId}/add-friend`, { friendUsername });
      setFriends([...friends, friendUsername]);
      setMessage('Friend added successfully');
    } catch (error) {
      setMessage('Error adding friend');
    }
  };

  return (
    <div className={styles.Appp}>
      <h1 className={styles.ph1}>User Profile</h1>
      {/* <div className={styles.loadbutton}>
      <button className={styles.loadbutton} onClick={fetchUserData}>Load User Data</button>
      </div> */}
      {user && (
        <>
          <div className={styles['user-info']}>
            <p className={styles.pp} >Username: {user.username}</p>
            <p className={styles.pp} >Email: {user.email}</p>
          </div>
          <h2 className={styles.ph2} >Tech Stacks</h2>
          <ul className={styles.pul} >
            {techStacks.map((stack, index) => (
              <li className={styles.pli} key={index}>
                {stack}
                <div>
                  <button className={styles.pbutton} onClick={() => handleDeleteTechStack(index)}>Delete</button>
                  <button className={styles.pbutton} onClick={() => {
                    const updatedStack = prompt('Edit Tech Stack:', stack);
                    if (updatedStack) handleEditTechStack(index, updatedStack);
                  }}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
          <input className={styles.pinput}  
            type="text"
            value={newTechStack}
            onChange={(e) => setNewTechStack(e.target.value)}
            placeholder="New Tech Stack"
          />
          <button className={styles.pbutton} onClick={handleAddTechStack}>Add Tech Stack</button>
          
          <h2 className={styles.ph2} >Languages</h2>
          <ul className={styles.pul} >
            {languages.map((language, index) => (
              <li className={styles.pli} key={index}>
                {language}
                <div>
                  <button className={styles.pbutton} onClick={() => handleDeleteLanguage(index)}>Delete</button>
                  <button className={styles.pbutton} onClick={() => {
                    const updatedLanguage = prompt('Edit Language:', language);
                    if (updatedLanguage) handleEditLanguage(index, updatedLanguage);
                  }}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
          <input className={styles.pinput} 
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="New Language"
          />
          <button className={styles.pbutton} onClick={handleAddLanguage}>Add Language</button>
  
          <h2 className={styles.ph2} >Friends</h2>
          <ul className={styles.pul} >
            {friends.map((friend, index) => (
              <li className={styles.pli} key={index}>
                {friend}
                <button className={styles.pbutton} onClick={() => handleDeleteFriend(friend)}>Delete</button>
              </li>
            ))}
          </ul>
  
          <h2 className={styles.ph2} >Search User</h2>
          <input className={styles.pinput}  
            type="text"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Search Username"
          />
          <button className={styles.pbutton} onClick={handleSearchUser}>Search</button>
          {message && <p className={styles.message}>{message}</p>}
          {searchResult && (
            <>
              <p className={styles.pp} >User found: {searchResult.username}</p>
              <button className={styles.pbutton} onClick={handleAddFriend}>Add Friend</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Profile
