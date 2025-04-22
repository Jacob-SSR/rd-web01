// src/pages/ChallengeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  Upload, 
  Tag, 
  Award, 
  AlertTriangle, 
  ArrowLeft,
  CheckCircle,
  X,
  Camera,
  Image,
  Info,
  User
} from 'lucide-react';
import { useStore } from '../stores/userStore';
import { 
  getChallengeById, 
  joinChallenge, 
  submitProof, 
  getUserChallengeStatus
} from '../api/exportAllApi';

function ChallengeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useStore();
  
  const [challenge, setChallenge] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Proof submission state
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const [proofNote, setProofNote] = useState('');
  const [filePreview, setFilePreview] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Join challenge loading state
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    fetchChallengeDetails();
  }, [id]);

  const fetchChallengeDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const challengeData = await getChallengeById(id);
      setChallenge(challengeData);
      
      // Check if user has joined this challenge
      const statusData = await getUserChallengeStatus(id);
      setUserStatus(statusData);
    } catch (err) {
      console.error('Error fetching challenge details:', err);
      setError('ไม่สามารถโหลดข้อมูลความท้าทายได้ โปรดลองอีกครั้งในภายหลัง');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async () => {
    try {
      setJoinLoading(true);
      setMessage({ type: '', text: '' });
      
      await joinChallenge(id);
      
      setMessage({
        type: 'success',
        text: 'คุณได้เข้าร่วมความท้าทายนี้เรียบร้อยแล้ว'
      });
      
      // Update user status
      setUserStatus({
        ...userStatus,
        joined: true,
        status: 'IN_PROGRESS'
      });
    } catch (err) {
      console.error('Error joining challenge:', err);
      setMessage({
        type: 'error',
        text: err.message || 'ไม่สามารถเข้าร่วมความท้าทายได้ โปรดลองอีกครั้ง'
      });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setProofFiles(filesArray);
      
      // Generate previews
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setFilePreview(newPreviews);
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    
    if (proofFiles.length === 0) {
      setMessage({
        type: 'error',
        text: 'กรุณาอัปโหลดรูปภาพหรือหลักฐานอย่างน้อยหนึ่งรายการ'
      });
      return;
    }
    
    try {
      setSubmitLoading(true);
      setMessage({ type: '', text: '' });
      
      // Create form data
      const formData = new FormData();
      proofFiles.forEach(file => {
        formData.append('proofImages', file);
      });
      formData.append('note', proofNote);
      
      await submitProof(id, formData);
      
      setMessage({
        type: 'success',
        text: 'ส่งหลักฐานสำเร็จแล้ว ผู้ดูแลจะตรวจสอบหลักฐานของคุณเร็วๆ นี้'
      });
      
      // Update user status
      setUserStatus({
        ...userStatus,
        proofSubmitted: true,
        status: 'PENDING'
      });
      
      // Close modal and reset form
      setShowProofModal(false);
      setProofFiles([]);
      setFilePreview([]);
      setProofNote('');
    } catch (err) {
      console.error('Error submitting proof:', err);
      setMessage({
        type: 'error',
        text: err.message || 'ไม่สามารถส่งหลักฐานได้ โปรดลองอีกครั้ง'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
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
            onClick={() => navigate('/challenge')}
            className="btn btn-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปหน้ารวมความท้าทาย
          </button>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning shadow-lg">
          <Info size={20} />
          <span>ไม่พบข้อมูลความท้าทาย</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/challenge')}
            className="btn btn-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปหน้ารวมความท้าทาย
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <div className="flex items-center mb-6">
        <Link to="/challenge" className="btn btn-ghost btn-sm mr-2">
          <ArrowLeft size={16} />
        </Link>
        <h1 className="text-2xl font-bold">รายละเอียดความท้าทาย</h1>
      </div>
      
      {/* Alert Messages */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.type === 'success' ? (
            <CheckCircle size={18} className="stroke-current shrink-0" />
          ) : (
            <AlertTriangle size={18} className="stroke-current shrink-0" />
          )}
          <span>{message.text}</span>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setMessage({ type: '', text: '' })}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge Details */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl flex items-center">
                <Trophy className="text-primary mr-2" />
                {challenge.name}
              </h2>
              
              {challenge.creator && (
                <div className="flex items-center text-sm opacity-70 mb-4">
                  <User size={16} className="mr-1" />
                  <span>สร้างโดย: {challenge.creator.username}</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {challenge.categories && challenge.categories.map((category, index) => (
                  <span key={index} className="badge badge-outline">
                    {category.name}
                  </span>
                ))}
                
                <span className={`badge ${challenge.status === 'PUBLIC' ? 'badge-primary' : 'badge-secondary'}`}>
                  {challenge.status === 'PUBLIC' ? 'สาธารณะ' : 'ส่วนตัว'}
                </span>
              </div>
              
              <div className="divider my-2"></div>
              
              <p className="text-base-content my-4">
                {challenge.description}
              </p>
              
              <div className="bg-base-200 p-4 rounded-lg my-4">
                <h3 className="font-medium mb-3">ข้อมูลความท้าทาย</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-primary" />
                    <div>
                      <div className="text-sm opacity-70">รางวัล XP</div>
                      <div>{challenge.expReward || 100} คะแนน</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-primary" />
                    <div>
                      <div className="text-sm opacity-70">เริ่มต้น</div>
                      <div>{formatDate(challenge.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    <div>
                      <div className="text-sm opacity-70">ระยะเวลา</div>
                      <div>{challenge.duration || 7} วัน</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-primary" />
                    <div>
                      <div className="text-sm opacity-70">ผู้เข้าร่วม</div>
                      <div>{challenge.participantCount || 0} คน</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {challenge.requirementType && (
                <div className="bg-primary/10 p-4 rounded-lg my-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info size={18} className="mr-2 text-primary" />
                    รูปแบบการส่งหลักฐาน
                  </h3>
                  <p>
                    {challenge.requirementType === 'PROOF' && 'ส่งรูปภาพหรือวิดีโอเป็นหลักฐานการทำความท้าทาย'}
                    {challenge.requirementType === 'GPS' && 'ใช้ข้อมูล GPS แสดงตำแหน่งและเส้นทาง'}
                    {challenge.requirementType === 'STEP_COUNT' && 'นับจำนวนก้าวจากอุปกรณ์สวมใส่หรือสมาร์ทโฟน'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Challenge Actions */}
        <div>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h3 className="card-title">สถานะของคุณ</h3>
              
              {userStatus?.joined ? (
                <div>
                  <div className="flex items-center mb-4">
                    <div className={`badge ${
                      userStatus.status === 'COMPLETED' ? 'badge-success' :
                      userStatus.status === 'PENDING' ? 'badge-warning' :
                      'badge-info'
                    } p-3 mb-2`}>
                      {userStatus.status === 'COMPLETED' && 'สำเร็จแล้ว'}
                      {userStatus.status === 'PENDING' && 'รอการตรวจสอบ'}
                      {userStatus.status === 'IN_PROGRESS' && 'อยู่ระหว่างดำเนินการ'}
                    </div>
                  </div>
                  
                  {userStatus.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => setShowProofModal(true)}
                      className="btn btn-primary btn-block mb-2"
                    >
                      <Upload size={16} className="mr-2" />
                      ส่งหลักฐาน
                    </button>
                  )}
                  
                  {userStatus.status === 'PENDING' && (
                    <div className="alert alert-warning mb-4">
                      <Info size={16} className="stroke-current shrink-0" />
                      <span>หลักฐานของคุณอยู่ระหว่างการตรวจสอบโดยผู้ดูแล</span>
                    </div>
                  )}
                  
                  {userStatus.status === 'COMPLETED' && (
                    <div className="alert alert-success mb-4">
                      <CheckCircle size={16} className="stroke-current shrink-0" />
                      <span>ยินดีด้วย! คุณทำภารกิจนี้สำเร็จแล้ว</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="mb-4">คุณยังไม่ได้เข้าร่วมความท้าทายนี้</p>
                  <button 
                    onClick={handleJoinChallenge}
                    className={`btn btn-primary btn-block ${joinLoading ? 'loading' : ''}`}
                    disabled={joinLoading}
                  >
                    {!joinLoading && <Trophy size={16} className="mr-2" />}
                    เข้าร่วมความท้าทาย
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Participants */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title flex items-center mb-4">
                <Users size={20} className="mr-2" />
                ผู้เข้าร่วมล่าสุด
              </h3>
              
              {challenge.participants && challenge.participants.length > 0 ? (
                <div className="space-y-4">
                  {challenge.participants.slice(0, 5).map((participant, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          {participant.profileImage ? (
                            <img src={participant.profileImage} alt={participant.username} />
                          ) : (
                            <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                              {participant.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{participant.username}</div>
                        <div className="text-sm opacity-50">เข้าร่วมเมื่อ {formatDate(participant.joinedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">ยังไม่มีผู้เข้าร่วมความท้าทายนี้</p>
              )}
              
              {challenge.participants && challenge.participants.length > 5 && (
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-sm btn-ghost">
                    ดูทั้งหมด ({challenge.participants.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Proof Modal */}
      {showProofModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">ส่งหลักฐาน</h3>
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => {
                setShowProofModal(false);
                setProofFiles([]);
                setFilePreview([]);
                setProofNote('');
              }}
            >
              <X size={16} />
            </button>
            
            <form onSubmit={handleSubmitProof}>
              <div className="py-4">
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">อัปโหลดรูปภาพหรือวิดีโอ*</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="proof-upload"
                    />
                    
                    {filePreview.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {filePreview.map((preview, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={preview} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                                onClick={() => {
                                  const newFiles = [...proofFiles];
                                  newFiles.splice(index, 1);
                                  setProofFiles(newFiles);
                                  
                                  const newPreviews = [...filePreview];
                                  URL.revokeObjectURL(newPreviews[index]);
                                  newPreviews.splice(index, 1);
                                  setFilePreview(newPreviews);
                                }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <label 
                          htmlFor="proof-upload"
                          className="btn btn-outline btn-sm"
                        >
                          <Image size={16} className="mr-2" />
                          เพิ่มรูปภาพ
                        </label>
                      </div>
                    ) : (
                      <label 
                        htmlFor="proof-upload"
                        className="flex flex-col items-center justify-center h-40 cursor-pointer"
                      >
                        <Camera size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-500">คลิกเพื่ออัปโหลดรูปภาพหรือวิดีโอ</p>
                        <p className="text-gray-400 text-sm mt-1">สูงสุด 5 ไฟล์</p>
                      </label>
                    )}
                  </div>
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">รายละเอียดเพิ่มเติม (ไม่บังคับ)</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="อธิบายเพิ่มเติมเกี่ยวกับหลักฐานของคุณ..."
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowProofModal(false);
                    setProofFiles([]);
                    setFilePreview([]);
                    setProofNote('');
                  }}
                  className="btn"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${submitLoading ? 'loading' : ''}`}
                  disabled={submitLoading || proofFiles.length === 0}
                >
                  {!submitLoading && <Upload size={16} className="mr-2" />}
                  ส่งหลักฐาน
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setShowProofModal(false)}></div>
        </div>
      )}
    </div>
  );
}

export default ChallengeDetails;