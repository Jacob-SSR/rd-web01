// src/pages/admin/ProofVerification.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar, 
  Image, 
  AlertTriangle,
  FileText,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../stores/userStore';
import { 
  getProofById, 
  getAllPendingProofs, 
  checkChallengeProof 
} from '../../api/exportAllApi';

function ProofVerification() {
  const { proofId } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  
  const [currentProof, setCurrentProof] = useState(null);
  const [pendingProofs, setPendingProofs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  
  useEffect(() => {
    // Verify user is admin
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    fetchProofs();
  }, [user]);
  
  useEffect(() => {
    if (pendingProofs.length > 0) {
      // If proofId is provided, find its index
      if (proofId) {
        const index = pendingProofs.findIndex(proof => proof.id === parseInt(proofId));
        if (index !== -1) {
          setCurrentIndex(index);
          setCurrentProof(pendingProofs[index]);
        } else {
          setCurrentProof(pendingProofs[0]);
        }
      } else {
        setCurrentProof(pendingProofs[0]);
      }
    }
  }, [pendingProofs, proofId]);

  const fetchProofs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllPendingProofs();
      
      if (response && response.proofs) {
        setPendingProofs(response.proofs);
      } else {
        setPendingProofs([]);
      }
    } catch (err) {
      console.error('Error fetching proofs:', err);
      setError('ไม่สามารถโหลดข้อมูลหลักฐานได้ โปรดลองอีกครั้งในภายหลัง');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (status) => {
    if (!currentProof) return;
    
    if (status === 'REJECTED' && !rejectionReason.trim() && showRejectionModal) {
      return; // Don't proceed if rejection reason is empty
    }
    
    try {
      setVerifyLoading(true);
      
      const data = {
        status
      };
      
      if (status === 'REJECTED' && rejectionReason.trim()) {
        data.rejectionReason = rejectionReason.trim();
      }
      
      await checkChallengeProof(
        currentProof.challengeId, 
        currentProof.id, 
        data
      );
      
      // Remove from pending proofs
      const updatedProofs = pendingProofs.filter(proof => proof.id !== currentProof.id);
      setPendingProofs(updatedProofs);
      
      // Set next proof or navigate if none left
      if (updatedProofs.length > 0) {
        const nextIndex = Math.min(currentIndex, updatedProofs.length - 1);
        setCurrentIndex(nextIndex);
        setCurrentProof(updatedProofs[nextIndex]);
      } else {
        setCurrentProof(null);
      }
      
      // Reset rejection reason and modal
      setRejectionReason('');
      setShowRejectionModal(false);
    } catch (err) {
      console.error('Error verifying proof:', err);
      setError('ไม่สามารถตรวจสอบหลักฐานได้ โปรดลองอีกครั้ง');
    } finally {
      setVerifyLoading(false);
    }
  };

  const navigateProof = (direction) => {
    if (pendingProofs.length <= 1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + pendingProofs.length) % pendingProofs.length;
    } else {
      newIndex = (currentIndex + 1) % pendingProofs.length;
    }
    
    setCurrentIndex(newIndex);
    setCurrentProof(pendingProofs[newIndex]);
    setSelectedImageIndex(0); // Reset image index when changing proofs
  };
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Parse image URLs from JSON string
  const getProofImages = (proof) => {
    if (!proof || !proof.proofImages) return [];
    
    try {
      if (typeof proof.proofImages === 'string') {
        return JSON.parse(proof.proofImages);
      }
      return Array.isArray(proof.proofImages) ? proof.proofImages : [];
    } catch (e) {
      console.error('Error parsing proof images:', e);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error shadow-lg">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="btn btn-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปหน้า Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (pendingProofs.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link to="/admin/dashboard" className="btn btn-ghost btn-sm mr-2">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-bold">ตรวจสอบหลักฐาน</h1>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <CheckCircle size={64} className="text-success mb-4" />
            <h2 className="card-title text-2xl mb-2">ไม่มีหลักฐานที่รอการตรวจสอบ</h2>
            <p className="text-base-content opacity-70 mb-6">
              คุณได้ตรวจสอบหลักฐานทั้งหมดเรียบร้อยแล้ว
            </p>
            <Link to="/admin/dashboard" className="btn btn-primary">
              กลับไปหน้า Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/admin/dashboard" className="btn btn-ghost btn-sm mr-2">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-bold">ตรวจสอบหลักฐาน</h1>
        </div>
        
        <div className="badge badge-primary">
          รอตรวจสอบ: {pendingProofs.length}
        </div>
      </div>
      
      {/* Proof Card */}
      {currentProof && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button 
                className="btn btn-circle btn-sm"
                onClick={() => navigateProof('prev')}
                disabled={pendingProofs.length <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="badge badge-lg">
                {currentIndex + 1} / {pendingProofs.length}
              </div>
              
              <button 
                className="btn btn-circle btn-sm"
                onClick={() => navigateProof('next')}
                disabled={pendingProofs.length <= 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Proof Images */}
              <div>
                <h2 className="card-title flex items-center mb-4">
                  <Image size={20} className="mr-2" />
                  หลักฐาน
                </h2>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {getProofImages(currentProof).map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={imageUrl} 
                        alt={`หลักฐาน ${index + 1}`} 
                        className="w-full h-40 object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setShowImageModal(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {getProofImages(currentProof).length === 0 && (
                  <div className="alert alert-warning">
                    <AlertTriangle size={16} />
                    <span>ไม่พบรูปภาพหลักฐาน</span>
                  </div>
                )}
                
                {/* Note if available */}
                {currentProof.note && (
                  <div className="bg-base-200 p-4 rounded-lg mb-4">
                    <h3 className="font-medium flex items-center mb-2">
                      <FileText size={16} className="mr-2" />
                      บันทึกเพิ่มเติม
                    </h3>
                    <p>{currentProof.note}</p>
                  </div>
                )}
              </div>
              
              {/* User and Challenge Info */}
              <div>
                <h2 className="card-title flex items-center mb-4">
                  <Info size={20} className="mr-2" />
                  ข้อมูล
                </h2>
                
                {/* User Info */}
                <div className="bg-base-200 p-4 rounded-lg mb-4">
                  <h3 className="font-medium flex items-center mb-2">
                    <User size={16} className="mr-2" />
                    ข้อมูลผู้ใช้
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="avatar mr-3">
                      <div className="w-12 rounded-full">
                        {currentProof.user?.profileImage ? (
                          <img src={currentProof.user.profileImage} alt={currentProof.user.username} />
                        ) : (
                          <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                            {currentProof.user?.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">{currentProof.user?.username || 'ผู้ใช้'}</h4>
                      <p className="text-sm opacity-70">{currentProof.user?.email || ''}</p>
                    </div>
                  </div>
                </div>
                
                {/* Challenge Info */}
                <div className="bg-base-200 p-4 rounded-lg mb-4">
                  <h3 className="font-medium flex items-center mb-2">
                    <Calendar size={16} className="mr-2" />
                    ข้อมูลความท้าทาย
                  </h3>
                  
                  <div className="mb-2">
                    <h4 className="font-medium">{currentProof.challenge?.name || 'ความท้าทาย'}</h4>
                    <p className="text-sm mb-2">{currentProof.challenge?.description || ''}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {currentProof.challenge?.categories?.map((cat, i) => (
                        <span key={i} className="badge badge-outline badge-sm">{cat.name}</span>
                      ))}
                    </div>
                    
                    <div className="text-sm opacity-70">
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        ส่งเมื่อ: {formatDate(currentProof.submittedAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Verification Actions */}
                <div className="card-actions justify-end mt-6">
                  <button 
                    className="btn btn-error"
                    onClick={() => setShowRejectionModal(true)}
                    disabled={verifyLoading}
                  >
                    <XCircle size={18} className="mr-2" />
                    ไม่อนุมัติ
                  </button>
                  
                  <button 
                    className={`btn btn-success ${verifyLoading ? 'loading' : ''}`}
                    onClick={() => handleVerify('APPROVED')}
                    disabled={verifyLoading}
                  >
                    {!verifyLoading && <CheckCircle size={18} className="mr-2" />}
                    อนุมัติ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              ระบุเหตุผลในการไม่อนุมัติ
            </h3>
            <p className="py-4">
              ระบุเหตุผลที่ไม่อนุมัติหลักฐานนี้เพื่อแจ้งให้ผู้ใช้ทราบและสามารถส่งหลักฐานใหม่ได้
            </p>
            <div className="form-control">
              <textarea 
                className="textarea textarea-bordered h-24"
                placeholder="เหตุผลในการไม่อนุมัติ..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
              >
                ยกเลิก
              </button>
              <button 
                className={`btn btn-error ${verifyLoading ? 'loading' : ''}`}
                onClick={() => handleVerify('REJECTED')}
                disabled={verifyLoading || !rejectionReason.trim()}
              >
                {!verifyLoading && <XCircle size={18} className="mr-2" />}
                ไม่อนุมัติ
              </button>
            </div>
          </div>
          <div 
            className="modal-backdrop" 
            onClick={() => {
              setShowRejectionModal(false);
              setRejectionReason('');
            }}
          ></div>
        </div>
      )}
      
      {/* Image Preview Modal */}
      {showImageModal && currentProof && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowImageModal(false)}
            >
              <XCircle size={16} />
            </button>
            <h3 className="font-bold text-lg mb-4">
              หลักฐาน {selectedImageIndex + 1} / {getProofImages(currentProof).length}
            </h3>
            <div className="flex justify-center">
              <img 
                src={getProofImages(currentProof)[selectedImageIndex]} 
                alt={`หลักฐาน ${selectedImageIndex + 1}`}
                className="max-h-[70vh] object-contain"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button 
                className="btn btn-circle"
                onClick={() => {
                  const newIndex = (selectedImageIndex - 1 + getProofImages(currentProof).length) % getProofImages(currentProof).length;
                  setSelectedImageIndex(newIndex);
                }}
                disabled={getProofImages(currentProof).length <= 1}
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="btn btn-circle"
                onClick={() => {
                  const newIndex = (selectedImageIndex + 1) % getProofImages(currentProof).length;
                  setSelectedImageIndex(newIndex);
                }}
                disabled={getProofImages(currentProof).length <= 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div 
            className="modal-backdrop" 
            onClick={() => setShowImageModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

export default ProofVerification;