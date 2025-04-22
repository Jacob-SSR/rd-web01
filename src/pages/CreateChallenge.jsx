// src/pages/CreateChallenge.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Tag, Clock, Users, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { createChallenge, getAllCategories } from '../api/exportAllApi';

function CreateChallenge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expReward: 100,
    status: 'PRIVATE',
    requirementType: 'PROOF',
    categoryIds: [],
    duration: 7 // days
  });

  // Load categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response.categories) {
          setCategories(response.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setMessage({
          type: 'error',
          text: 'ไม่สามารถโหลดหมวดหมู่ได้ โปรดลองอีกครั้งในภายหลัง'
        });
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value);
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categoryIds: prev.categoryIds.filter(id => id !== categoryId)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'กรุณากรอกชื่อความท้าทาย' });
      return false;
    }
    
    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'กรุณากรอกรายละเอียดความท้าทาย' });
      return false;
    }
    
    if (formData.categoryIds.length === 0) {
      setMessage({ type: 'error', text: 'กรุณาเลือกอย่างน้อยหนึ่งหมวดหมู่' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      // Prepare data for API
      const challengeData = {
        name: formData.name,
        description: formData.description,
        expReward: parseInt(formData.expReward),
        status: formData.status,
        requirementType: formData.requirementType,
        categories: formData.categoryIds
      };
      
      const response = await createChallenge(challengeData);
      
      setMessage({
        type: 'success',
        text: 'สร้างความท้าทายสำเร็จแล้ว'
      });
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        expReward: 100,
        status: 'PRIVATE',
        requirementType: 'PROOF',
        categoryIds: [],
        duration: 7
      });
      
      // Navigate after a delay to show success message
      setTimeout(() => {
        navigate('/my-challenges');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create challenge:', error);
      setMessage({
        type: 'error',
        text: error.message || 'ไม่สามารถสร้างความท้าทายได้ โปรดลองอีกครั้ง'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Trophy className="text-primary mr-2" size={28} />
        <h1 className="text-2xl font-bold">สร้างความท้าทายใหม่</h1>
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
        </div>
      )}
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Challenge Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Info size={20} className="mr-2" />
                ข้อมูลพื้นฐาน
              </h3>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">ชื่อความท้าทาย*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="เช่น: วิ่ง 5 กิโลเมตรทุกวัน เป็นเวลา 30 วัน" 
                  className="input input-bordered w-full" 
                  required
                />
              </div>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">รายละเอียด*</span>
                </label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="อธิบายรายละเอียดของความท้าทาย เงื่อนไข และเป้าหมาย" 
                  className="textarea textarea-bordered h-32"
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Challenge Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Tag size={20} className="mr-2" />
                หมวดหมู่*
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input 
                          type="checkbox" 
                          value={category.id}
                          onChange={handleCategoryChange}
                          checked={formData.categoryIds.includes(category.id)}
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
            
            {/* Challenge Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                การตั้งค่า
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">รางวัล XP</span>
                  </label>
                  <input 
                    type="number" 
                    name="expReward"
                    value={formData.expReward}
                    onChange={handleChange}
                    min="1" 
                    max="1000" 
                    className="input input-bordered" 
                  />
                  <label className="label">
                    <span className="label-text-alt">คะแนนประสบการณ์ที่ผู้เข้าร่วมจะได้รับเมื่อทำสำเร็จ</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ระยะเวลา (วัน)</span>
                  </label>
                  <input 
                    type="number" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1" 
                    max="90" 
                    className="input input-bordered" 
                  />
                  <label className="label">
                    <span className="label-text-alt">จำนวนวันที่ให้ทำความท้าทายนี้ให้สำเร็จ</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">สถานะความท้าทาย</span>
                  </label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="PUBLIC">สาธารณะ (ทุกคนสามารถเห็นและเข้าร่วมได้)</option>
                    <option value="PRIVATE">ส่วนตัว (เฉพาะคนที่คุณเชิญเท่านั้น)</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ประเภทของหลักฐาน</span>
                  </label>
                  <select 
                    name="requirementType"
                    value={formData.requirementType}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="PROOF">รูปภาพหรือวิดีโอ</option>
                    <option value="GPS">ข้อมูล GPS</option>
                    <option value="STEP_COUNT">จำนวนก้าว</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="divider"></div>
            
            <div className="card-actions justify-end">
              <button 
                type="button" 
                onClick={() => navigate('/challenge')}
                className="btn btn-ghost"
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'กำลังสร้าง...' : 'สร้างความท้าทาย'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper component for Settings icon since it's not imported above
function Settings(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

export default CreateChallenge;