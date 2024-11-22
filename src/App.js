import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBh9zG67qSZ7rMCpNOg-aoG1Gu0l1HUWyk",
  authDomain: "paper-tracker-da804.firebaseapp.com",
  projectId: "paper-tracker-da804",
  storageBucket: "paper-tracker-da804.firebasestorage.app",
  messagingSenderId: "572254000726",
  appId: "1:572254000726:web:1953f9e8d6f9d37984cdf7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [papers, setPapers] = useState([]);
  const [newPaper, setNewPaper] = useState({
    title: '',
    author: '',
    link: '',
    description: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "papers"), (snapshot) => {
      const papersData = [];
      snapshot.forEach((doc) => {
        papersData.push({ id: doc.id, ...doc.data() });
      });
      setPapers(papersData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "papers"), {
        ...newPaper,
        votes: 0,
        timestamp: new Date().toISOString()
      });

      setNewPaper({
        title: '',
        author: '',
        link: '',
        description: ''
      });
    } catch (error) {
      console.error("Error adding paper: ", error);
    }
  };

  const handleVote = async (paperId) => {
    try {
      const paperRef = doc(db, "papers", paperId);
      const paper = papers.find(p => p.id === paperId);
      await updateDoc(paperRef, {
        votes: (paper.votes || 0) + 1
      });
    } catch (error) {
      console.error("Error updating votes: ", error);
    }
  };

  const handleDelete = async (paperId) => {
    try {
      await deleteDoc(doc(db, "papers", paperId));
    } catch (error) {
      console.error("Error deleting paper: ", error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Paper Tracker</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Submit New Paper</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Paper Title"
              value={newPaper.title}
              onChange={e => setNewPaper({...newPaper, title: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              required
            />
            <input
              type="text"
              placeholder="Author(s)"
              value={newPaper.author}
              onChange={e => setNewPaper({...newPaper, author: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              required
            />
            <input
              type="text"
              placeholder="Link to Paper"
              value={newPaper.link}
              onChange={e => setNewPaper({...newPaper, link: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              required
            />
            <textarea
              placeholder="Brief Description"
              value={newPaper.description}
              onChange={e => setNewPaper({...newPaper, description: e.target.value})}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
              required
            />
          </div>
          <button 
            type="submit"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Submit Paper
          </button>
        </form>
      </div>

      <div>
        <h2>Submitted Papers</h2>
        {papers.sort((a, b) => b.votes - a.votes).map(paper => (
          <div 
            key={paper.id} 
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '5px'
            }}
          >
            <h3>{paper.title}</h3>
            <p>by {paper.author}</p>
            <p>{paper.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a 
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  View Paper
                </a>
                <button
                  onClick={() => handleDelete(paper.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '5px 10px',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => handleVote(paper.id)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                👍 {paper.votes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;