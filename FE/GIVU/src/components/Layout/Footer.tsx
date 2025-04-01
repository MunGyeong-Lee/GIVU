const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 mt-16">
      <div className="max-w-7xl mx-auto flex justify-between px-5">
        <div className="company-info">
          <h3 className="text-lg font-bold mb-2">GIVU</h3>
          <p className="text-gray-500">© 2023 GIVU. 모든 권리 보유.</p>
        </div>
        <div className="flex gap-16">
          <div>
            <h4 className="font-bold mb-4">회사 소개</h4>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">소개</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">팀</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">채용</a>
          </div>
          <div>
            <h4 className="font-bold mb-4">고객 지원</h4>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">FAQ</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">문의하기</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">이용약관</a>
          </div>
          <div>
            <h4 className="font-bold mb-4">소셜 미디어</h4>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">인스타그램</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">페이스북</a>
            <a href="#" className="block mb-2 text-gray-500 hover:text-gray-700">트위터</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;