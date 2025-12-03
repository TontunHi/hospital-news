import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, Plus, Trash2, LogIn, LogOut, Home, Archive } from 'lucide-react';

const HospitalNewsWebsite = () => {
  const [news, setNews] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');

  const [newsForm, setNewsForm] = useState({
    title: '',
    pdfFile: null,
    expiryDate: '',
    expiryTime: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    try {
      const stored = localStorage.getItem('hospital-news');
      if (stored) {
        setNews(JSON.parse(stored));
      }
    } catch (error) {
      console.log('ยังไม่มีข่าวในระบบ');
    }
  };

  const saveNews = (updatedNews) => {
    try {
      localStorage.setItem('hospital-news', JSON.stringify(updatedNews));
      setNews(updatedNews);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข่าว:', error);
      alert('ไม่สามารถบันทึกข่าวได้');
    }
  };

  const isExpired = (expiryDate, expiryTime) => {
    const expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
    return new Date() > expiryDateTime;
  };

  const activeNews = news.filter(n => !isExpired(n.expiryDate, n.expiryTime));
  const expiredNews = news.filter(n => isExpired(n.expiryDate, n.expiryTime));

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewsForm({ ...newsForm, pdfFile: e.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
    }
  };

  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.pdfFile || !newsForm.expiryDate || !newsForm.expiryTime) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newNews = {
      id: Date.now(),
      title: newsForm.title,
      pdfFile: newsForm.pdfFile,
      expiryDate: newsForm.expiryDate,
      expiryTime: newsForm.expiryTime,
      createdAt: new Date().toISOString()
    };

    saveNews([...news, newNews]);
    setNewsForm({ title: '', pdfFile: null, expiryDate: '', expiryTime: '' });
  };

  const handleDeleteNews = (id) => {
    if (window.confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
      saveNews(news.filter(n => n.id !== id));
    }
  };

  const NewsDetail = ({ newsItem }) => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <button
        onClick={() => setSelectedNews(null)}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← กลับ
      </button>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{newsItem.title}</h2>
      <div className="flex items-center gap-4 text-gray-600 mb-6">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>หมดอายุ: {new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}</span>
        </div>
      </div>
      <iframe
        src={newsItem.pdfFile}
        className="w-full h-screen border-2 border-gray-300 rounded"
        title={newsItem.title}
      />
    </div>
  );

  const NewsCard = ({ newsItem }) => (
    <div
      onClick={() => setSelectedNews(newsItem)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{newsItem.title}</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>เผยแพร่: {new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>หมดอายุ: {new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}</span>
            </div>
          </div>
        </div>
        <FileText className="w-8 h-8 text-blue-500" />
      </div>
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNews(newsItem.id);
          }}
          className="mt-4 text-red-600 hover:text-red-800 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          ลบข่าว
        </button>
      )}
    </div>
  );

  const AdminPanel = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">จัดการข่าวสาร</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">หัวข้อข่าว</label>
          <input
            type="text"
            value={newsForm.title}
            onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="กรอกหัวข้อข่าว"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">ไฟล์ PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">วันหมดอายุ</label>
            <input
              type="date"
              value={newsForm.expiryDate}
              onChange={(e) => setNewsForm({ ...newsForm, expiryDate: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">เวลาหมดอายุ</label>
            <input
              type="time"
              value={newsForm.expiryTime}
              onChange={(e) => setNewsForm({ ...newsForm, expiryTime: e.target.value })}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>
        <button
          onClick={handleAddNews}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          เพิ่มข่าวใหม่
        </button>
      </div>
    </div>
  );

  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">เข้าสู่ระบบเจ้าหน้าที่</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="รหัสผ่าน"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdminLogin}
            className="flex-1 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => {
              setShowAdminLogin(false);
              setPassword('');
            }}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
          >
            ยกเลิก
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">รหัสผ่านทดสอบ: admin123</p>
      </div>
    </div>
  );

  if (selectedNews) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <NewsDetail newsItem={selectedNews} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">H</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">ประชาสัมพันธ์โรงพยาบาล</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  currentPage === 'home' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                หน้าแรก
              </button>
              <button
                onClick={() => setCurrentPage('archive')}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  currentPage === 'archive' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Archive className="w-4 h-4" />
                ข่าวเก่า
              </button>
              {!isAdmin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  <LogIn className="w-4 h-4" />
                  เจ้าหน้าที่
                </button>
              ) : (
                <button
                  onClick={() => setIsAdmin(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin && <AdminPanel />}

        {currentPage === 'home' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">ข่าวประชาสัมพันธ์ล่าสุด</h2>
            {activeNews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">ยังไม่มีข่าวประชาสัมพันธ์</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {activeNews.map(newsItem => (
                  <NewsCard key={newsItem.id} newsItem={newsItem} />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'archive' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">ข่าวเก่า</h2>
            {expiredNews.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">ยังไม่มีข่าวเก่า</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {expiredNews.map(newsItem => (
                  <NewsCard key={newsItem.id} newsItem={newsItem} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAdminLogin && <LoginModal />}
    </div>
  );
};

export default HospitalNewsWebsite;