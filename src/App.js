import React, { useState } from 'react';
import { Plus, ThumbsUp, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

const PaperTracker = () => {
  const [papers, setPapers] = useState([]);
  const [newPaper, setNewPaper] = useState({
    title: '',
    author: '',
    link: '',
    description: '',
    category: '',
    submitter: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPapers([...papers, { ...newPaper, id: Date.now(), votes: 0, voters: [] }]);
    setNewPaper({
      title: '',
      author: '',
      link: '',
      description: '',
      category: '',
      submitter: ''
    });
  };

  const handleVote = (paperId, voterId = 'user1') => {
    setPapers(papers.map(paper => {
      if (paper.id === paperId) {
        if (!paper.voters.includes(voterId)) {
          return {
            ...paper,
            votes: paper.votes + 1,
            voters: [...paper.voters, voterId]
          };
        }
      }
      return paper;
    }));
  };

  const handleDelete = (paperId) => {
    setPapers(papers.filter(paper => paper.id !== paperId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-2 border rounded"
                placeholder="Paper Title"
                value={newPaper.title}
                onChange={e => setNewPaper({...newPaper, title: e.target.value})}
                required
              />
              <input
                className="p-2 border rounded"
                placeholder="Author(s)"
                value={newPaper.author}
                onChange={e => setNewPaper({...newPaper, author: e.target.value})}
                required
              />
              <input
                className="p-2 border rounded"
                placeholder="Link to Paper"
                value={newPaper.link}
                onChange={e => setNewPaper({...newPaper, link: e.target.value})}
                required
              />
              <input
                className="p-2 border rounded"
                placeholder="Your Name"
                value={newPaper.submitter}
                onChange={e => setNewPaper({...newPaper, submitter: e.target.value})}
                required
              />
              <select
                className="p-2 border rounded"
                value={newPaper.category}
                onChange={e => setNewPaper({...newPaper, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="astronomy">Astronomy</option>
                <option value="physics">Physics</option>
                <option value="computer-science">Computer Science</option>
                <option value="interdisciplinary">Interdisciplinary</option>
              </select>
              <textarea
                className="p-2 border rounded md:col-span-2"
                placeholder="Brief Description"
                value={newPaper.description}
                onChange={e => setNewPaper({...newPaper, description: e.target.value})}
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={16} />
              Submit Paper
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {papers.map(paper => (
          <Card key={paper.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{paper.title}</h3>
                  <p className="text-sm text-gray-600">by {paper.author}</p>
                  <p className="text-sm">Submitted by: {paper.submitter}</p>
                  <p>{paper.description}</p>
                  <div className="space-x-2">
                    <span className="inline-block px-2 py-1 text-sm bg-gray-100 rounded">
                      {paper.category}
                    </span>
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Paper
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleVote(paper.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <ThumbsUp size={16} />
                    {paper.votes}
                  </button>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaperTracker;