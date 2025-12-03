import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Calendar, Clock, Plus, Trash2, LogIn, LogOut, Home, Archive, Eye } from 'lucide-react';

// ==========================================
// 1. Component ย่อย (LoginModal, AdminPanel, NewsDetail, NewsCard)
// ==========================================

const LoginModal = ({ password, setPassword, handleAdminLogin, setShowAdminLogin }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-t-4 border-green-600">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">เข้าสู่ระบบเจ้าหน้าที่</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        placeholder="กรอกรหัสผ่าน"
        autoFocus
      />
      <div className="flex gap-3">
        <button
          onClick={handleAdminLogin}
          className="flex-1 bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
        >
          เข้าสู่ระบบ
        </button>
        <button
          onClick={() => {
            setShowAdminLogin(false);
            setPassword('');
          }}
          className="flex-1 bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-150"
        >
          ยกเลิก
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-6 text-center bg-gray-50 py-2 rounded-lg">รหัสผ่านทดสอบ: <span className="font-mono font-bold text-green-700">admin123</span></p>
    </div>
  </div>
);

const AdminPanel = React.memo(({ newsForm, setNewsForm, handleFileChange, handleAddNews, fileInputRef }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-10 border border-green-100">
    <h2 className="text-3xl font-extrabold mb-8 text-green-800 border-b pb-4 flex items-center gap-3">
        <span className="bg-green-100 p-2 rounded-lg"><FileText className="w-8 h-8 text-green-600" /></span>
        จัดการข่าวสารประชาสัมพันธ์
    </h2>
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          หัวข้อข่าว
        </label>
        <input
          type="text"
          value={newsForm.title}
          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition shadow-sm"
          placeholder="เช่น ประกาศปิดปรับปรุงระบบ..."
        />
      </div>
      
      <div>
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          ไฟล์ PDF
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
            ref={fileInputRef}
          />
          <label 
              htmlFor="pdf-upload" 
              className="cursor-pointer bg-white text-green-700 border-2 border-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition duration-150 ease-in-out flex items-center gap-2 font-bold shadow-sm"
          >
              <Plus className="w-5 h-5" />
              เลือกไฟล์ PDF
          </label>
          <span className={`text-sm break-all ${newsForm.pdfFileName ? 'text-green-700 font-semibold bg-green-100 px-3 py-1 rounded-full' : 'text-gray-500 italic'}`}>
            {newsForm.pdfFileName || 'ยังไม่ได้เลือกไฟล์ (จำเป็น)'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            <Calendar className="w-5 h-5 inline mr-2 text-red-500" />
            วันหมดอายุ
          </label>
          <input
            type="date"
            value={newsForm.expiryDate}
            onChange={(e) => setNewsForm({ ...newsForm, expiryDate: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition shadow-sm"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            <Clock className="w-5 h-5 inline mr-2 text-red-500" />
            เวลาหมดอายุ
          </label>
          <input
            type="time"
            value={newsForm.expiryTime}
            onChange={(e) => setNewsForm({ ...newsForm, expiryTime: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition shadow-sm"
          />
        </div>
      </div>
      
      <button
        onClick={handleAddNews}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition duration-200 ease-in-out flex items-center justify-center gap-3 mt-8 shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
      >
        <Plus className="w-6 h-6" />
        บันทึกและเผยแพร่ข่าว
      </button>
    </div>
  </div>
));

const NewsDetail = ({ newsItem, setSelectedNews }) => (
  <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
    <div className="bg-green-50 p-4 border-b border-green-100">
        <button
        onClick={() => setSelectedNews(null)}
        className="text-green-700 hover:text-green-900 flex items-center gap-2 font-bold transition bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow"
        >
        ← กลับไปหน้าหลัก
        </button>
    </div>
    <div className="p-8">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 leading-tight">{newsItem.title}</h2>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 mb-8 bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="font-medium">เผยแพร่: {new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                <span className="font-medium">หมดอายุ: {new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Eye className="w-5 h-5" />
                <span className="font-bold">{newsItem.views || 0} ครั้ง</span>
            </div>
        </div>

        <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl overflow-hidden shadow-inner border-4 border-gray-100">
            <iframe
                src={newsItem.pdfFile}
                className="w-full h-full"
                title={newsItem.title}
            />
        </div>
    </div>
  </div>
);

const NewsCard = ({ newsItem, isAdmin, handleDeleteNews, handleViewNews, isExpired }) => {
  const isExpiredItem = isExpired(newsItem.expiryDate, newsItem.expiryTime);
  const dateColor = isExpiredItem ? 'text-gray-500' : 'text-red-600';
  
  const cardStyle = isExpiredItem 
    ? 'bg-gray-50 border-gray-200 opacity-75' 
    : 'bg-white border-green-200 hover:border-green-400 hover:shadow-lg shadow-md';

  return (
    <div
      onClick={() => handleViewNews(newsItem)}
      className={`${cardStyle} rounded-2xl p-6 transition-all duration-300 cursor-pointer border-2 flex flex-col md:flex-row justify-between gap-6 group relative overflow-hidden`}
    >
      {/* Decorative Accent */}
      {!isExpiredItem && <div className="absolute top-0 left-0 w-2 h-full bg-green-500 group-hover:bg-green-400 transition-colors"></div>}

      <div className="flex-1 pl-4">
        <div className="flex items-start justify-between mb-3">
             {/* หัวข้อข่าวขนาดใหญ่ขึ้น */}
            <h3 className="text-2xl font-bold text-gray-900 leading-snug group-hover:text-green-800 transition-colors line-clamp-2">
                {newsItem.title}
            </h3>
             {/* ไอคอน PDF */}
            <FileText className={`w-10 h-10 ${isExpiredItem ? 'text-gray-300' : 'text-green-100 group-hover:text-green-200'} flex-shrink-0 transition-colors ml-4 hidden md:block`} />
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4 text-green-600" />
            <span>{new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
          </div>
          
          {/* ส่วนแสดงยอดวิวในการ์ด */}
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
            <Eye className="w-4 h-4" />
            <span>อ่าน {newsItem.views || 0} ครั้ง</span>
          </div>

          <div className={`flex items-center gap-2 font-medium ${isExpiredItem ? 'bg-gray-100 px-3 py-1 rounded-full' : ''}`}>
            <Clock className={`w-4 h-4 ${dateColor}`} />
            <span className={dateColor}>
              {/* FIX: แก้ไขบั๊กการแสดงผลเวลาหมดอายุ */}
              {isExpiredItem 
                ? 'หมดอายุแล้ว' 
                : `หมดอายุ: ${new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}`
              }
            </span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center md:self-center pl-4">
            <button
            onClick={(e) => {
                e.stopPropagation();
                handleDeleteNews(newsItem.id);
            }}
            className="text-red-500 hover:text-white hover:bg-red-500 border-2 border-red-200 px-4 py-2 rounded-xl text-sm transition duration-150 ease-in-out flex items-center gap-2 font-bold z-10"
            >
            <Trash2 className="w-4 h-4" />
            <span className="hidden md:inline">ลบ</span>
            </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. Main Component
// ==========================================

const HospitalNewsWebsite = () => {
  const [news, setNews] = useState([]);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');

  const fileInputRef = useRef(null);

  const [newsForm, setNewsForm] = useState({
    title: '',
    pdfFile: null,
    pdfFileName: '',
    expiryDate: '',
    expiryTime: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const saveNews = useCallback((updatedNews) => {
    try {
      localStorage.setItem('hospital-news', JSON.stringify(updatedNews));
      setNews(updatedNews);
    } catch (error) {
      console.error('Error saving news:', error);
      alert('ไม่สามารถบันทึกข่าวได้');
    }
  }, []);

  const loadNews = () => {
    try {
      const stored = localStorage.getItem('hospital-news');
      if (stored) {
        setNews(JSON.parse(stored));
      }
    } catch (error) {
      console.log('No news found');
    }
  };

  const isExpired = useCallback((expiryDate, expiryTime) => {
    const expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
    return new Date() > expiryDateTime;
  }, []);

  const handleViewNews = useCallback((newsItem) => {
    const updatedNewsList = news.map(item => 
      item.id === newsItem.id 
        ? { ...item, views: (item.views || 0) + 1 }
        : item
    );

    saveNews(updatedNewsList);

    const updatedNewsItem = updatedNewsList.find(item => item.id === newsItem.id);
    setSelectedNews(updatedNewsItem);

  }, [news, saveNews]);

  const activeNews = news.filter(n => !isExpired(n.expiryDate, n.expiryTime));
  const expiredNews = news.filter(n => isExpired(n.expiryDate, n.expiryTime));

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewsForm(prev => ({ ...prev, pdfFile: e.target.result, pdfFileName: file.name }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('กรุณาเลือกไฟล์ PDF เท่านั้น');
      setNewsForm(prev => ({ ...prev, pdfFile: null, pdfFileName: '' }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleAddNews = useCallback(() => {
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
      views: 0,
      createdAt: new Date().toISOString()
    };

    saveNews([...news, newNews]);
    
    setNewsForm({ title: '', pdfFile: null, pdfFileName: '', expiryDate: '', expiryTime: '' });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    alert('เพิ่มข่าวเรียบร้อยแล้ว');
  }, [news, newsForm, saveNews]);

  const handleDeleteNews = useCallback((id) => {
    if (window.confirm('คุณต้องการลบข่าวนี้หรือไม่?')) {
      const updatedNews = news.filter(n => n.id !== id);
      saveNews(updatedNews);
    }
  }, [news, saveNews]);

  if (selectedNews) {
    return (
      <div className="min-h-screen bg-green-50/50 p-4 md:p-8 animate-fade-in">
        <NewsDetail newsItem={selectedNews} setSelectedNews={setSelectedNews} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
                <span className="text-white text-xl font-black">H</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-green-800 tracking-tight">ประชาสัมพันธ์<span className="text-green-600">โรงพยาบาล</span></h1>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100/50 p-1 rounded-full self-end md:self-auto">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 ${
                  currentPage === 'home' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>หน้าแรก</span>
              </button>
              <button
                onClick={() => setCurrentPage('archive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-200 ${
                  currentPage === 'archive' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>ข่าวเก่า</span>
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              {!isAdmin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-green-700 font-medium transition rounded-full hover:bg-green-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">จนท.</span>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">ออกระบบ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
          <AdminPanel 
            newsForm={newsForm}
            setNewsForm={setNewsForm}
            handleFileChange={handleFileChange}
            handleAddNews={handleAddNews}
            fileInputRef={fileInputRef}
          />
        )}

        {currentPage === 'home' && (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-800 inline-block relative z-10">
                    ข่าวประชาสัมพันธ์ล่าสุด
                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-green-200/50 -z-10 rounded-full"></div>
                </h2>
                <p className="text-gray-500 mt-3 text-lg">ติดตามข่าวสารและประกาศสำคัญจากทางโรงพยาบาล</p>
            </div>
            
            {activeNews.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-16 text-center border-2 border-dashed border-gray-200 max-w-3xl mx-auto">
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-xl font-bold mb-2">ยังไม่มีข่าวประชาสัมพันธ์</p>
                <p className="text-gray-400">ข่าวสารใหม่ๆ จะถูกอัปเดตที่นี่</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {activeNews
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(newsItem => (
                  <NewsCard 
                    key={newsItem.id} 
                    newsItem={newsItem} 
                    isAdmin={isAdmin}
                    handleDeleteNews={handleDeleteNews}
                    handleViewNews={handleViewNews}
                    isExpired={isExpired}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'archive' && (
          <div className="animate-slide-up pt-4">
             <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-700 inline-block relative z-10">
                    คลังข่าวเก่า
                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-gray-200/50 -z-10 rounded-full"></div>
                </h2>
            </div>
            {expiredNews.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-16 text-center border-2 border-dashed border-gray-200 max-w-3xl mx-auto">
                <Archive className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <p className="text-gray-500 text-xl font-bold">ยังไม่มีข่าวเก่าในระบบ</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                {expiredNews
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(newsItem => (
                  <NewsCard 
                    key={newsItem.id} 
                    newsItem={newsItem} 
                    isAdmin={isAdmin}
                    handleDeleteNews={handleDeleteNews}
                    handleViewNews={handleViewNews}
                    isExpired={isExpired}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAdminLogin && (
        <LoginModal 
          password={password}
          setPassword={setPassword}
          handleAdminLogin={handleAdminLogin}
          setShowAdminLogin={setShowAdminLogin}
        />
      )}
    </div>
  );
};

export default HospitalNewsWebsite;