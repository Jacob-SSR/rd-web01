// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Shield, Users, Activity, ArrowRight } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary-focus">
      {/* Hero Section */}
      <section className="hero min-h-screen text-primary-content">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-4 py-16">
          <motion.img 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            src="/images/hero-challenge.svg" 
            className="max-w-sm rounded-lg shadow-2xl lg:max-w-md"
            alt="Challenge yourself"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pr-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold">ท้าทายตัวเองให้เติบโตทุกวัน</h1>
            <p className="py-6 text-lg">เข้าร่วมท้าทายตัวเองกับกิจกรรมที่จะทำให้คุณก้าวไปอีกขั้น ทั้งด้านสุขภาพ การเรียนรู้ และการพัฒนาตนเอง</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn btn-accent btn-lg">
                เริ่มต้นใช้งาน
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg text-primary-content border-primary-content">
                เข้าสู่ระบบ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-base-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">วิธีที่แอพนี้จะช่วยพัฒนาคุณ</h2>
            <p className="text-lg max-w-2xl mx-auto text-base-content opacity-80">
              ท้าทายตนเอง รับรางวัล และติดตามความก้าวหน้าของคุณในทุกๆ ด้าน
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <Activity className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title text-xl">ท้าทายประจำวัน</h3>
                <p>เข้าร่วมกิจกรรมที่ท้าทายใหม่ๆ ทุกวันเพื่อสร้างนิสัยที่ดี</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <Award className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title text-xl">รับตราสัญลักษณ์</h3>
                <p>รับเหรียญรางวัลและตราสัญลักษณ์เมื่อคุณทำภารกิจสำเร็จ</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <Users className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title text-xl">ชุมชนคนรักสุขภาพ</h3>
                <p>พบเพื่อนใหม่ที่มีเป้าหมายเดียวกันและช่วยกันสร้างแรงบันดาลใจ</p>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="card bg-base-200 shadow-xl"
            >
              <div className="card-body items-center text-center">
                <Shield className="w-16 h-16 text-primary mb-4" />
                <h3 className="card-title text-xl">ติดตามความก้าวหน้า</h3>
                <p>ดูความก้าวหน้าของคุณและรักษาแรงจูงใจให้คงอยู่ตลอดเส้นทาง</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge Categories */}
      <section className="bg-base-200 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">ท้าทายตัวเองในด้านที่คุณสนใจ</h2>
            <p className="text-lg max-w-2xl mx-auto text-base-content opacity-80">
              เลือกจากหมวดหมู่ต่างๆ หรือสร้างความท้าทายของคุณเอง
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl">สุขภาพ & ฟิตเนส</h3>
                <p>ออกกำลังกาย ทานอาหารที่ดีต่อสุขภาพ และสร้างร่างกายที่แข็งแรง</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/register" className="btn btn-sm btn-outline border-primary-content text-primary-content">
                    สำรวจเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-green-500 to-green-700 text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl">การเรียนรู้</h3>
                <p>พัฒนาทักษะใหม่ อ่านหนังสือ และขยายขอบเขตความรู้ของคุณ</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/register" className="btn btn-sm btn-outline border-primary-content text-primary-content">
                    สำรวจเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-primary-content shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl">สุขภาพจิต</h3>
                <p>ฝึกสมาธิ ลดความเครียด และดูแลสุขภาพจิตของคุณ</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/register" className="btn btn-sm btn-outline border-primary-content text-primary-content">
                    สำรวจเพิ่มเติม
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-content py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">พร้อมที่จะเริ่มความท้าทายของคุณ?</h2>
          <p className="text-lg mb-8">
            เข้าร่วมกับชุมชนของเราและเริ่มต้นการเดินทางสู่ตัวเองที่ดีกว่าวันนี้
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn btn-accent btn-lg">
              สมัครสมาชิกฟรี
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg text-primary-content border-primary-content">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
        <div>
          <div className="font-bold text-xl mb-2">Challenge App</div>
          <p className="font-bold">
            พัฒนาตัวเองทุกวัน ก้าวไปอีกขั้นในทุกๆ ด้าน
          </p> 
          <p>Copyright © 2025 - All rights reserved</p>
        </div> 
        <div>
          <div className="grid grid-flow-col gap-4">
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a> 
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a> 
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;