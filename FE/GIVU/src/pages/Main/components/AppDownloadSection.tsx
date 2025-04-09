import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AppDownloadSection = () => {
  const [showToast, setShowToast] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // QR 코드 다운로드 처리 함수
  const handleDownloadQR = () => {
    try {
      const link = document.createElement('a');
      link.href = '/QR_example.png';
      link.download = 'GIVU_앱_QR코드.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowToast(true);
    } catch (err) {
      console.error('QR 코드 다운로드 실패:', err);
    }
  };

  // 토스트 메시지 타이머
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <section className="mb-20 mt-16">
      {/* 토스트 메시지 */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          QR 코드가 다운로드되었습니다.
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto bg-gradient-to-r from-cusPink-light to-cusLightBlue-light rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between">
          {/* 좌측: 텍스트 영역 */}
          <div className="text-center md:text-left md:mr-10 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              GIVU 앱으로 <br className="hidden md:block" />
              <span className="text-primary">더 쉽게 참여하세요</span>
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              언제 어디서나 GIVU 앱으로 펀딩에 참여하고,<br />
              쉽게 기부하며, 기부의 가치를 경험해보세요.
            </p>
            <a
              href="#"
              ref={downloadLinkRef}
              className="inline-block bg-primary hover:bg-cusRed text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              onClick={(e) => {
                e.preventDefault();
                handleDownloadQR();
              }}
            >
              QR 코드 다운로드
            </a>
          </div>

          {/* 우측: QR 코드 영역 */}
          <div className="relative">
            <div className="bg-white p-4 rounded-2xl shadow-md relative z-10">
              <div className="relative">
                <img
                  src="/QR_example.png"
                  alt="GIVU 앱 다운로드 QR 코드"
                  className="w-48 h-48 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  안드로이드 전용
                </div>
              </div>
              <p className="text-center mt-3 text-sm font-medium text-gray-700">QR 코드를 스캔하여<br />GIVU 앱을 다운로드하세요</p>
            </div>

            {/* 장식 요소 */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-cusYellow rounded-full opacity-30"></div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cusRed-light rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection; 