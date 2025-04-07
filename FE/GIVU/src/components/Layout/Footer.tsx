import { FaInstagram, FaFacebook, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-5">
        {/* 상단 섹션 */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
          {/* 왼쪽 - 회사 정보 */}
          <div className="w-full md:w-1/3">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">GIVU</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                마음을 나누는 가장 특별한 방법<br />
                선물이 필요한 순간, GIVU와 함께하세요.
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <span className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                <FaInstagram />
              </span>
              <span className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                <FaFacebook />
              </span>
              <span className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                <FaTwitter />
              </span>
              <span className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
                <FaEnvelope />
              </span>
            </div>
          </div>

          {/* 가운데 공간 */}
          <div className="hidden md:block md:w-1/12"></div>

          {/* 오른쪽 - 링크들 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-7/12">
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">회사 소개</h4>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">소개</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">팀</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">채용</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">블로그</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">고객 지원</h4>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">FAQ</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">문의하기</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">이용약관</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">개인정보처리방침</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">서비스</h4>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">펀딩 만들기</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">펀딩 참여하기</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">성공 사례</p>
              <p className="block mb-3 text-gray-500 hover:text-primary text-sm transition-colors cursor-pointer">앱 다운로드</p>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 GIVU. 모든 권리 보유.</p>
          <p className="text-gray-400 text-sm flex items-center">
            <span>Made with</span>
            <FaHeart className="text-primary mx-1 animate-pulse" />
            <span>by GIVU Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;