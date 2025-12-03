import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Calendar, Clock, Plus, Trash2, LogIn, LogOut, Home, Archive } from 'lucide-react';

// ==========================================
// 1. แยก Component ย่อยออกมาไว้นอกสุด
// ==========================================

const LoginModal = ({ password, setPassword, handleAdminLogin, setShowAdminLogin }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">เข้าสู่ระบบเจ้าหน้าที่</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-blue-500 focus:border-blue-500"
        placeholder="กรอกรหัสผ่าน"
        autoFocus
      />
      <div className="flex gap-3">
        <button
          onClick={handleAdminLogin}
          className="flex-1 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-150"
        >
          เข้าสู่ระบบ
        </button>
        <button
          onClick={() => {
            setShowAdminLogin(false);
            setPassword('');
          }}
          className="flex-1 bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-150"
        >
          ยกเลิก
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">รหัสผ่านทดสอบ: admin123</p>
    </div>
  </div>
);

// รับ fileInputRef เข้ามาเพื่อผูกกับ input
const AdminPanel = React.memo(({ newsForm, setNewsForm, handleFileChange, handleAddNews, fileInputRef }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 mb-10 border border-gray-100">
    <h2 className="text-3xl font-extrabold mb-6 text-blue-800 border-b pb-3">จัดการข่าวสารประชาสัมพันธ์</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          <FileText className="w-5 h-5 inline mr-2 text-blue-500" />
          หัวข้อข่าว
        </label>
        <input
          type="text"
          value={newsForm.title}
          onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
          placeholder="กรอกหัวข้อข่าว"
        />
      </div>
      
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          <FileText className="w-5 h-5 inline mr-2 text-blue-500" />
          ไฟล์ PDF
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
            ref={fileInputRef} // ผูก Ref ตรงนี้เพื่อให้สั่งเคลียร์ค่าได้
          />
          <label 
              htmlFor="pdf-upload" 
              className="cursor-pointer bg-blue-100 text-blue-700 border border-blue-300 px-6 py-3 rounded-lg hover:bg-blue-200 transition duration-150 ease-in-out flex items-center gap-2 font-medium w-full sm:w-auto justify-center"
          >
              <Plus className="w-5 h-5" />
              เลือกไฟล์ PDF
          </label>
          <span className={`text-sm ${newsForm.pdfFileName ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
            {newsForm.pdfFileName || 'ยังไม่ได้เลือกไฟล์ (ต้องเป็น PDF เท่านั้น)'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            <Calendar className="w-5 h-5 inline mr-2 text-red-500" />
            วันหมดอายุ
          </label>
          <input
            type="date"
            value={newsForm.expiryDate}
            onChange={(e) => setNewsForm({ ...newsForm, expiryDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out shadow-sm"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            <Clock className="w-5 h-5 inline mr-2 text-red-500" />
            เวลาหมดอายุ
          </label>
          <input
            type="time"
            value={newsForm.expiryTime}
            onChange={(e) => setNewsForm({ ...newsForm, expiryTime: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out shadow-sm"
          />
        </div>
      </div>
      
      <button
        onClick={handleAddNews}
        className="w-full bg-green-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out flex items-center justify-center gap-3 mt-6 shadow-lg transform hover:scale-[1.01]"
      >
        <Plus className="w-6 h-6" />
        บันทึกและเผยแพร่ข่าวใหม่
      </button>
    </div>
  </div>
));

const NewsDetail = ({ newsItem, setSelectedNews }) => (
  <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
    <button
      onClick={() => setSelectedNews(null)}
      className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium"
    >
      ← กลับไปหน้าหลัก
    </button>
    <h2 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">{newsItem.title}</h2>
    <div className="flex items-center gap-6 text-gray-600 mb-6">
      <div className="flex items-center gap-1">
        <Calendar className="w-5 h-5 text-blue-500" />
        <span>เผยแพร่: {new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-5 h-5 text-red-500" />
        <span>หมดอายุ: {new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}</span>
      </div>
    </div>
    <iframe
      src={newsItem.pdfFile}
      className="w-full h-[80vh] border-4 border-gray-200 rounded-lg shadow-inner"
      title={newsItem.title}
    />
  </div>
);

const NewsCard = ({ newsItem, isAdmin, handleDeleteNews, setSelectedNews, isExpired }) => {
  const isExpiredItem = isExpired(newsItem.expiryDate, newsItem.expiryTime);
  const dateColor = isExpiredItem ? 'text-gray-500' : 'text-red-600';
  const borderColor = isExpiredItem ? 'border-gray-400' : 'border-blue-600';
  const shadowClass = isExpiredItem ? 'shadow-lg' : 'shadow-xl hover:shadow-2xl';

  return (
    <div
      onClick={() => setSelectedNews(newsItem)}
      className={`bg-white rounded-xl ${shadowClass} p-6 transition-all duration-300 cursor-pointer border-l-8 ${borderColor} flex flex-col justify-between h-full transform hover:scale-[1.01]`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900 leading-tight">{newsItem.title}</h3>
          <div className={`flex flex-col gap-2 text-sm ${isExpiredItem ? 'text-gray-500' : 'text-gray-700'}`}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>เผยแพร่: {new Date(newsItem.createdAt).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Clock className={`w-4 h-4 ${dateColor}`} />
              <span className={dateColor}>
                {isExpiredItem ? 'หมดอายุแล้ว' : `หมดอายุ: ${new Date(`${newsItem.expiryDate}T${newsItem.expiryTime}`).toLocaleString('th-TH')}`}
              </span>
            </div>
          </div>
        </div>
        <FileText className={`w-10 h-10 ${isExpiredItem ? 'text-gray-400' : 'text-blue-600'} flex-shrink-0`} />
      </div>
      {isAdmin && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteNews(newsItem.id);
          }}
          className="mt-4 text-red-600 hover:bg-red-50 border border-red-600 px-3 py-1 rounded-lg text-sm transition duration-150 ease-in-out flex items-center gap-2 self-start"
        >
          <Trash2 className="w-4 h-4" />
          ลบข่าว
        </button>
      )}
    </div>
  );
};

// ==========================================
// 2. Main Component
// ==========================================

const HospitalNewsWebsite = () => {
  const [news, setNews] = useState([]);
  
  // แก้ไข 1: อ่านค่าจาก localStorage ตอนเริ่มต้น เพื่อจำสถานะล็อกอิน
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');

  // สร้าง Ref สำหรับเข้าถึง input file
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

  const activeNews = news.filter(n => !isExpired(n.expiryDate, n.expiryTime));
  const expiredNews = news.filter(n => isExpired(n.expiryDate, n.expiryTime));

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      // แก้ไข 2: บันทึกสถานะล็อกอินลง localStorage
      localStorage.setItem('isAdmin', 'true');
      setShowAdminLogin(false);
      setPassword('');
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    // แก้ไข 3: ลบสถานะล็อกอินออกจาก localStorage
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
      // ถ้าเลือกไฟล์ผิดประเภท ก็ควรเคลียร์ค่า input ด้วย
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
      createdAt: new Date().toISOString()
    };

    saveNews([...news, newNews]);
    
    // รีเซ็ตค่าในฟอร์ม
    setNewsForm({ title: '', pdfFile: null, pdfFileName: '', expiryDate: '', expiryTime: '' });
    
    // แก้ไข 4: สั่งเคลียร์ค่าในปุ่มเลือกไฟล์จริงๆ (DOM Element)
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
      <div className="min-h-screen bg-gray-50 p-8">
        <NewsDetail newsItem={selectedNews} setSelectedNews={setSelectedNews} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <nav className="bg-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-black">H</span>
              </div>
              <h1 className="text-2xl font-extrabold text-blue-700 tracking-wider hidden sm:block">ประชาสัมพันธ์โรงพยาบาล</h1>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition duration-150 ${
                  currentPage === 'home' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">หน้าแรก</span>
              </button>
              <button
                onClick={() => setCurrentPage('archive')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition duration-150 ${
                  currentPage === 'archive' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Archive className="w-5 h-5" />
                <span className="hidden sm:inline">ข่าวเก่า</span>
              </button>
              {!isAdmin ? (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 px-5 py-2 ml-4 bg-gray-100 text-blue-600 rounded-full hover:bg-gray-200 transition duration-150 border border-gray-300 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">เจ้าหน้าที่</span>
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 ml-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-150 shadow-md font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">ออกจากระบบ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isAdmin && (
          <AdminPanel 
            newsForm={newsForm}
            setNewsForm={setNewsForm}
            handleFileChange={handleFileChange}
            handleAddNews={handleAddNews}
            fileInputRef={fileInputRef} // ส่ง Ref เข้าไปใน AdminPanel
          />
        )}

        {currentPage === 'home' && (
          <div className="pt-4">
            <h2 className="text-4xl font-extrabold mb-8 text-blue-800 border-b-4 border-blue-400 inline-block pb-1">ข่าวประชาสัมพันธ์ล่าสุด</h2>
            {activeNews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center mt-6 border border-gray-100">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">ยังไม่มีข่าวประชาสัมพันธ์ในขณะนี้</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {activeNews.map(newsItem => (
                  <NewsCard 
                    key={newsItem.id} 
                    newsItem={newsItem} 
                    isAdmin={isAdmin}
                    handleDeleteNews={handleDeleteNews}
                    setSelectedNews={setSelectedNews}
                    isExpired={isExpired}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'archive' && (
          <div className="pt-4">
            <h2 className="text-4xl font-extrabold mb-8 text-gray-700 border-b-4 border-gray-400 inline-block pb-1">ข่าวเก่า</h2>
            {expiredNews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center mt-6 border border-gray-100">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">ยังไม่มีข่าวเก่าในระบบ</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {expiredNews.map(newsItem => (
                  <NewsCard 
                    key={newsItem.id} 
                    newsItem={newsItem} 
                    isAdmin={isAdmin}
                    handleDeleteNews={handleDeleteNews}
                    setSelectedNews={setSelectedNews}
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