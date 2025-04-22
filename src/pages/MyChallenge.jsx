import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Fixed import
import { 
  getUserChallenges, 
  getUserCreatedChallenges, 
  submitProof,
  deleteChallenge,
  createChallenge // เพิ่มฟังก์ชันสำหรับการสร้างชาเลนจ์
} from '../api/exportAllApi';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  Users, 
  Upload, 
  Trash,
  AlertCircle,
  FileCheck,
  Plus
} from 'lucide-react';

function MyChallenge() {
  const [activeTab, setActiveTab] = useState('joined');
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [proofModal, setProofModal] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [proofNote, setProofNote] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // เพิ่ม state สำหรับฟอร์ม Create Challenge
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
  });
  
  useEffect(() => {
    fetchChallenges();
  }, [activeTab]);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'joined') {
        const data = await getUserChallenges();
        setJoinedChallenges(Array.isArray(data) ? data : []);
      } else {
        const data = await getUserCreatedChallenges();
        setCreatedChallenges(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    
    // Validate the form inputs
    if (!newChallenge.title || !newChallenge.description || !newChallenge.startDate || !newChallenge.endDate) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await createChallenge(newChallenge);
      setShowCreateForm(false);
      setNewChallenge({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        category: '',
      });
      
      // Refetch the created challenges
      fetchChallenges();
    } catch (err) {
      setError('Failed to create challenge. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // เปิด/ปิดฟอร์มสร้างชาเลนจ์
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Challenges</h1>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} className="stroke-current shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'joined' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('joined')}
        >
          Challenges I've Joined
        </a>
        
        <a 
          className={`tab ${activeTab === 'created' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Challenges I've Created
        </a>
      </div>

      {/* Create Challenge button */}
      <div className="mb-4">
        <button 
          onClick={toggleCreateForm} 
          className="btn btn-primary"
        >
          <Plus size={16} className="mr-2" />
          Create a Challenge
        </button>
      </div>

      {/* Create Challenge Form (Modal or inline) */}
      {showCreateForm && (
        <form onSubmit={handleCreateChallenge} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a Challenge</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={newChallenge.startDate}
                onChange={(e) => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={newChallenge.endDate}
                onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              value={newChallenge.category}
              onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-success">
              Create Challenge
            </button>
          </div>
        </form>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        // Continue to render challenges as normal
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {createdChallenges.map(challenge => (
            <div key={challenge.id} className="card bg-base-100 shadow-xl">
              {/* Challenge card content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyChallenge;
