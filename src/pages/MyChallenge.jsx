import React, { useState, useEffect } from 'react';
import { 
  getUserChallenges, 
  getUserCreatedChallenges, 
  submitProof,
  deleteChallenge
} from '../api/exportAllApi';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  Users, 
  Upload, 
  Trash,
  AlertTriangle,
  AlertCircle,
  FileCheck
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

  useEffect(() => {
    fetchChallenges();
  }, [activeTab]);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'joined') {
        const data = await getUserChallenges();
        setJoinedChallenges(data);
      } else {
        const data = await getUserCreatedChallenges();
        setCreatedChallenges(data);
      }
    } catch (err) {
      setError('Failed to load challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    
    if (!proofFile || !selectedChallenge) return;
    
    setSubmitLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('proofFile', proofFile);
      formData.append('note', proofNote);
      
      await submitProof(selectedChallenge.id, formData);
      
      // Update the challenge status in the local state
      setJoinedChallenges(prev => 
        prev.map(challenge => 
          challenge.id === selectedChallenge.id 
            ? { ...challenge, status: 'submitted' } 
            : challenge
        )
      );
      
      // Close the modal and reset form
      setProofModal(false);
      setProofFile(null);
      setProofNote('');
      setSelectedChallenge(null);
      
    } catch (err) {
      setError('Failed to submit proof');
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      await deleteChallenge(challengeToDelete.id);
      
      // Remove the challenge from the local state
      setCreatedChallenges(prev => 
        prev.filter(challenge => challenge.id !== challengeToDelete.id)
      );
      
      // Close the modal and reset
      setDeleteModal(false);
      setChallengeToDelete(null);
      
    } catch (err) {
      setError('Failed to delete challenge');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const openProofModal = (challenge) => {
    setSelectedChallenge(challenge);
    setProofModal(true);
  };

  const openDeleteModal = (challenge) => {
    setChallengeToDelete(challenge);
    setDeleteModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'badge-warning';
      case 'submitted':
        return 'badge-info';
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'completed':
        return 'badge-secondary';
      default:
        return 'badge-neutral';
    }
  };

  // Helper function to format status text
  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get challenges based on active tab
  const challenges = activeTab === 'joined' ? joinedChallenges : createdChallenges;

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
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : challenges.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">No Challenges Found</h2>
            <p className="text-neutral-content">
              {activeTab === 'joined' 
                ? "You haven't joined any challenges yet." 
                : "You haven't created any challenges yet."}
            </p>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary">
                {activeTab === 'joined' 
                  ? "Find Challenges to Join" 
                  : "Create a Challenge"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map(challenge => (
            <div key={challenge.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{challenge.title}</h2>
                  <div className={`badge ${getStatusBadgeClass(challenge.status)}`}>
                    {formatStatus(challenge.status)}
                  </div>
                </div>
                
                <p className="text-base-content opacity-80 my-2">{challenge.description}</p>
                
                <div className="bg-base-200 p-4 rounded-lg my-2">
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span>Start: {formatDate(challenge.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span>End: {formatDate(challenge.endDate)}</span>
                    </div>
                    {challenge.category && (
                      <div className="flex items-center gap-2">
                        <span className="badge badge-outline">{challenge.category.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary" />
                      <span>{challenge.participantsCount || 0} participants</span>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'joined' && (
                  <div className="card-actions justify-end mt-2">
                    {challenge.status === 'pending' && (
                      <button
                        onClick={() => openProofModal(challenge)}
                        className="btn btn-primary"
                      >
                        <Upload size={16} className="mr-2" />
                        Submit Proof
                      </button>
                    )}
                    {challenge.status === 'submitted' && (
                      <div className="badge badge-info gap-2">
                        <Clock size={14} />
                        Awaiting review
                      </div>
                    )}
                    {challenge.status === 'approved' && (
                      <div className="badge badge-success gap-2">
                        <CheckCircle size={14} />
                        Completed
                      </div>
                    )}
                    {challenge.status === 'rejected' && (
                      <button
                        onClick={() => openProofModal(challenge)}
                        className="btn btn-error"
                      >
                        <XCircle size={16} className="mr-2" />
                        Submit New Proof
                      </button>
                    )}
                  </div>
                )}
                
                {activeTab === 'created' && (
                  <div className="card-actions justify-end mt-2">
                    <button
                      onClick={() => openDeleteModal(challenge)}
                      className="btn btn-error"
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </button>
                    {challenge.status === 'active' && (
                      <button
                        className="btn btn-primary"
                      >
                        <FileCheck size={16} className="mr-2" />
                        View Submissions
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Submit Proof Modal */}
      {proofModal && selectedChallenge && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Submit Proof for Challenge</h3>
            <p className="py-4">{selectedChallenge.title}</p>
            
            <form onSubmit={handleProofSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload Proof *</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Accepted files: JPG, PNG, PDF, MP4 (max 10MB)</span>
                </label>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notes (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Add any additional information about your submission"
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                ></textarea>
              </div>
              
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setProofModal(false);
                    setSelectedChallenge(null);
                    setProofFile(null);
                    setProofNote('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${submitLoading ? 'loading' : ''}`}
                  disabled={submitLoading || !proofFile}
                >
                  {submitLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Upload size={16} className="mr-2" />
                  )}
                  Submit Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal && challengeToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Challenge</h3>
            <div className="alert alert-warning my-4">
              <AlertTriangle size={16} className="stroke-current shrink-0" />
              <span>
                Are you sure you want to delete the challenge "{challengeToDelete.title}"? This action cannot be undone.
              </span>
            </div>
            
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setDeleteModal(false);
                  setChallengeToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChallenge}
                className={`btn btn-error ${deleteLoading ? 'loading' : ''}`}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Trash size={16} className="mr-2" />
                )}
                Delete Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyChallenge;