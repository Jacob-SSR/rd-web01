import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getUserChallenges, 
  getUserCreatedChallenges, 
  submitProof,
  deleteChallenge,
  createChallenge,
  getAllCategories
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
  Plus,
  X,
  Eye,
  Camera,
  Video
} from 'lucide-react';

function MyChallenge() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('joined');
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [proofModal, setProofModal] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const [proofNote, setProofNote] = useState('');
  const [proofPreview, setProofPreview] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // เพิ่ม state สำหรับฟอร์ม Create Challenge
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    expReward: 100,
    status: 'PUBLIC',
    requirementType: 'PROOF',
    categories: []
  });
  
  useEffect(() => {
    fetchChallenges();
    fetchCategories();
  }, [activeTab]);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'joined') {
        const response = await getUserChallenges();
        // ตรวจสอบรูปแบบ response
        const data = response?.userChallenges || response || [];
        setJoinedChallenges(Array.isArray(data) ? data : []);
      } else {
        const response = await getUserCreatedChallenges();
        // ตรวจสอบรูปแบบ response
        const data = response?.challenges || response || [];
        setCreatedChallenges(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Failed to load challenges. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const categoriesData = response?.categories || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value);
    
    setNewChallenge(prev => {
      if (checked) {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      } else {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      }
    });
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    
    if (!newChallenge.name || !newChallenge.description) {
      setError('กรุณากรอกชื่อและรายละเอียดความท้าทาย');
      return;
    }
    
    if (newChallenge.categories.length === 0) {
      setError('กรุณาเลือกอย่างน้อยหนึ่งหมวดหมู่');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await createChallenge(newChallenge);
      setShowCreateForm(false);
      setNewChallenge({
        name: '',
        description: '',
        expReward: 100,
        status: 'PUBLIC',
        requirementType: 'PROOF',
        categories: []
      });
      
      // Refetch the created challenges
      fetchChallenges();
    } catch (err) {
      setError(err.message || 'Failed to create challenge. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // เปิด/ปิดฟอร์มสร้างชาเลนจ์
  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setError(null);
  };
  
  // ดูรายละเอียด Challenge
  const viewChallengeDetails = (challengeId) => {
    navigate(`/challenges/${challengeId}`);
  };
  
  // เปิดหน้าต่างยืนยันการลบ Challenge
  const openDeleteConfirm = (challenge) => {
    setChallengeToDelete(challenge);
    setDeleteModal(true);
  };
  
  // ลบ Challenge
  const handleDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteChallenge(challengeToDelete.id);
      // ลบ Challenge ออกจาก state
      setCreatedChallenges(prev => 
        prev.filter(c => c.id !== challengeToDelete.id)
      );
      setDeleteModal(false);
      setChallengeToDelete(null);
    } catch (err) {
      setError('ไม่สามารถลบความท้าทายได้: ' + (err.message || 'กรุณาลองอีกครั้ง'));
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // เปิดหน้าต่างส่งหลักฐาน
  const openSubmitProofModal = (challenge) => {
    setSelectedChallenge(challenge);
    setProofModal(true);
    setProofFiles([]);
    setProofNote('');
    setProofPreview([]);
    setSubmitSuccess(false);
  };
  
  // จัดการการเลือกไฟล์
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setProofFiles(filesArray);
      
      // สร้าง preview สำหรับแต่ละไฟล์
      const previews = filesArray.map(file => {
        return URL.createObjectURL(file);
      });
      setProofPreview(previews);
    }
  };
  
  // ส่งหลักฐาน
  const handleSubmitProof = async (e) => {
    e.preventDefault();
    
    if (!selectedChallenge || proofFiles.length === 0) {
      setError('กรุณาเลือกไฟล์หลักฐานอย่างน้อย 1 ไฟล์');
      return;
    }
    
    setSubmitLoading(true);
    setError(null);
    
    try {
      // สร้าง FormData
      const formData = new FormData();
      proofFiles.forEach(file => {
        formData.append('proofImages', file);
      });
      formData.append('note', proofNote);
      
      // เรียก API ส่งหลักฐาน
      await submitProof(selectedChallenge.id, formData);
      
      // แสดงข้อความสำเร็จ
      setSubmitSuccess(true);
      
      // ยกเลิกการแสดง modal หลังจาก 2 วินาที
      setTimeout(() => {
        setProofModal(false);
        setSelectedChallenge(null);
        // ดึงข้อมูล Challenge ใหม่
        fetchChallenges();
      }, 2000);
    } catch (err) {
      setError('ไม่สามารถส่งหลักฐานได้: ' + (err.message || 'กรุณาลองอีกครั้ง'));
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // ลบไฟล์ที่เลือกออก
  const removeFile = (index) => {
    // ลบไฟล์จาก array
    const newFiles = [...proofFiles];
    newFiles.splice(index, 1);
    setProofFiles(newFiles);
    
    // ลบ preview
    const newPreviews = [...proofPreview];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setProofPreview(newPreviews);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Challenges</h1>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle size={18} className="stroke-current shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn btn-sm btn-circle ml-auto">
            <X size={16} />
          </button>
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

      {/* Create Challenge Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateChallenge} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create a Challenge</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">ชื่อความท้าทาย*</label>
            <input
              type="text"
              value={newChallenge.name}
              onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">รายละเอียด*</label>
            <textarea
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium">รางวัล XP</label>
            <input
              type="number"
              min="1"
              value={newChallenge.expReward}
              onChange={(e) => setNewChallenge({ ...newChallenge, expReward: parseInt(e.target.value) })}
              className="input input-bordered w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">สถานะความท้าทาย</label>
            <select 
              value={newChallenge.status}
              onChange={(e) => setNewChallenge({ ...newChallenge, status: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="PUBLIC">สาธารณะ</option>
              <option value="PRIVATE">ส่วนตัว</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">ประเภทของหลักฐาน</label>
            <select 
              value={newChallenge.requirementType}
              onChange={(e) => setNewChallenge({ ...newChallenge, requirementType: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="PROOF">รูปภาพหรือวิดีโอ</option>
              <option value="GPS">ข้อมูล GPS</option>
              <option value="STEP_COUNT">จำนวนก้าว</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">หมวดหมู่*</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input 
                        type="checkbox" 
                        value={category.id}
                        onChange={handleCategoryChange}
                        checked={newChallenge.categories.includes(category.id)}
                        className="checkbox checkbox-primary" 
                      />
                      <span className="label-text">{category.name}</span>
                    </label>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <p className="text-sm text-gray-500">กำลังโหลดหมวดหมู่...</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setShowCreateForm(false)}
              className="btn btn-outline"
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary">
              สร้างความท้าทาย
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
        // Challenge Cards
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'joined' ? (
            joinedChallenges.length > 0 ? (
              joinedChallenges.map(item => (
                <div key={item.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{item.challenge?.name}</h2>
                    <p className="text-sm line-clamp-2">{item.challenge?.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className={`badge ${
                        item.status === 'COMPLETED' ? 'badge-success' :
                        item.status === 'PENDING' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {item.status === 'COMPLETED' && 'สำเร็จแล้ว'}
                        {item.status === 'PENDING' && 'รอการตรวจสอบ'}
                        {item.status === 'IN_PROGRESS' && 'กำลังดำเนินการ'}
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => viewChallengeDetails(item.challenge.id)}
                      >
                        <Eye size={16} className="mr-1" />
                        รายละเอียด
                      </button>
                      
                      {item.status === 'IN_PROGRESS' && (
                        <button 
                          className="btn btn-accent btn-sm"
                          onClick={() => openSubmitProofModal(item.challenge)}
                        >
                          <Upload size={16} className="mr-1" />
                          ส่งหลักฐาน
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>คุณยังไม่ได้เข้าร่วมความท้าทายใดๆ</p>
              </div>
            )
          ) : (
            createdChallenges.length > 0 ? (
              createdChallenges.map(challenge => (
                <div key={challenge.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{challenge.name}</h2>
                    <p className="text-sm line-clamp-2">{challenge.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className={`badge ${challenge.status === 'PUBLIC' ? 'badge-primary' : 'badge-secondary'}`}>
                        {challenge.status === 'PUBLIC' ? 'สาธารณะ' : 'ส่วนตัว'}
                      </div>
                      
                      {challenge.userChallenges && (
                        <div className="badge badge-outline">
                          <Users size={14} className="mr-1" />
                          {challenge.userChallenges.length} คนเข้าร่วม
                        </div>
                      )}
                    </div>
                    
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => viewChallengeDetails(challenge.id)}
                      >
                        <Eye size={16} className="mr-1" />
                        รายละเอียด
                      </button>
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => openDeleteConfirm(challenge)}
                      >
                        <Trash size={16} className="mr-1" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>คุณยังไม่ได้สร้างความท้าทายใดๆ</p>
              </div>
            )
          )}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ยืนยันการลบความท้าทาย</h3>
            <p className="py-4">คุณแน่ใจหรือไม่ว่าต้องการลบความท้าทาย "{challengeToDelete?.name}"?</p>
            <p className="text-sm text-error">การกระทำนี้ไม่สามารถยกเลิกได้</p>
            <div className="modal-action">
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  setDeleteModal(false);
                  setChallengeToDelete(null);
                }}
              >
                ยกเลิก
              </button>
              <button 
                className={`btn btn-error ${deleteLoading ? 'loading' : ''}`}
                onClick={handleDeleteChallenge}
                disabled={deleteLoading}
              >
                {!deleteLoading && <Trash size={16} className="mr-1" />}
                ลบความท้าทาย
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            if (!deleteLoading) {
              setDeleteModal(false);
              setChallengeToDelete(null);
            }
          }}></div>
        </div>
      )}
      
      {/* Submit Proof Modal */}
      {proofModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">
              {submitSuccess 
                ? 'ส่งหลักฐานสำเร็จ!' 
                : `ส่งหลักฐาน: ${selectedChallenge?.name}`}
            </h3>
            
            {!submitSuccess ? (
              <form onSubmit={handleSubmitProof}>
                <div className="py-4">
                  {/* อัปโหลดไฟล์ */}
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
                      
                      {proofPreview.length > 0 ? (
                        <div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                            {proofPreview.map((preview, index) => (
                              <div key={index} className="relative">
                                <img 
                                  src={preview} 
                                  alt={`Preview ${index + 1}`} 
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                                  onClick={() => removeFile(index)}
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
                            <Plus size={16} className="mr-2" />
                            เพิ่มไฟล์
                          </label>
                        </div>
                      ) : (
                        <label 
                          htmlFor="proof-upload"
                          className="flex flex-col items-center justify-center h-40 cursor-pointer"
                        >
                          <div className="flex gap-2">
                            <Camera size={36} className="text-gray-400" />
                            <Video size={36} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 mt-4">คลิกเพื่ออัปโหลดรูปภาพหรือวิดีโอ</p>
                          <p className="text-gray-400 text-sm mt-1">สูงสุด 5 ไฟล์</p>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  {/* หมายเหตุ */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">หมายเหตุ (ไม่บังคับ)</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="เพิ่มคำอธิบายเกี่ยวกับหลักฐานของคุณ..."
                      value={proofNote}
                      onChange={(e) => setProofNote(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                
                {/* ปุ่มดำเนินการ */}
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setProofModal(false);
                      setSelectedChallenge(null);
                      setProofFiles([]);
                      setProofPreview([]);
                      setProofNote('');
                    }}
                    disabled={submitLoading}
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
            ) : (
              <div className="py-8 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-success mb-4" />
                <p className="text-lg font-medium">ส่งหลักฐานสำเร็จแล้ว!</p>
                <p className="mt-2">ผู้ดูแลระบบจะตรวจสอบหลักฐานของคุณเร็วๆ นี้</p>
              </div>
            )}
          </div>
          <div 
            className="modal-backdrop" 
            onClick={() => {
              if (!submitLoading && !submitSuccess) {
                setProofModal(false);
                setSelectedChallenge(null);
                setProofFiles([]);
                setProofPreview([]);
                setProofNote('');
              }
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default MyChallenge;