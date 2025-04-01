import React from 'react';
import { Link } from 'react-router-dom';

interface CompleteProps {
  fundingId?: string;
}

const Complete: React.FC<CompleteProps> = ({ fundingId = '123456' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
      {/* 성공 아이콘 */}
      <div className="w-24 h-24 rounded-full bg-primary-color/10 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary-color"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* 타이틀 및 메시지 */}
      <h2 className="text-2xl font-bold mb-2">펀딩이 성공적으로 생성되었습니다!</h2>
      <p className="text-gray-600 mb-8">
        펀딩이 정상적으로 등록되었습니다. 이제 친구들과 공유하고 선물을 모아보세요.
      </p>

      {/* 펀딩 ID 정보 */}
      <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
        <div className="text-sm text-gray-500 mb-1">펀딩 ID</div>
        <div className="flex items-center justify-between">
          <div className="font-mono text-lg">{fundingId}</div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fundingId);
            }}
            className="text-primary-color hover:text-primary-color/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 공유 옵션 */}
      <div className="w-full mb-8">
        <div className="text-sm text-gray-500 mb-3">친구들에게 공유하기</div>
        <div className="flex justify-center gap-3">
          {/* 카카오톡 */}
          <button className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white transition hover:opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3C7.03 3 3 6.14 3 10c0 2.48 1.56 4.67 3.93 5.97.28.12.57.38.57.76 0 .19-.04.39-.1.55-.18.55-.51 1.01-.51 1.01l-.03.06c-.09.16-.14.33-.14.51 0 .59.48 1.06 1.07 1.06.21 0 .41-.06.57-.18 0 0 .62-.36 1.06-.65.45-.29.91-.55 1.13-.65.21-.1.43-.15.66-.15h.06C17.04 17.29 21 14.15 21 10c0-3.86-4.03-7-9-7" />
            </svg>
          </button>
          {/* 인스타그램 */}
          <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white transition hover:opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.047 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.055.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.055-.047-1.37-.059-4.04-.059zm0 3.064A5.139 5.139 0 0017.128 12 5.139 5.139 0 0012 17.128 5.139 5.139 0 006.872 12 5.139 5.139 0 0012 6.872zm0 8.464A3.335 3.335 0 018.668 12 3.335 3.335 0 0112 8.668 3.335 3.335 0 0115.332 12 3.335 3.335 0 0112 15.332zM17.338 6.59a1.194 1.194 0 100-2.39 1.194 1.194 0 000 2.39z" />
            </svg>
          </button>
          {/* 페이스북 */}
          <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white transition hover:opacity-90">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
          {/* 이메일 */}
          <button className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white transition hover:opacity-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          {/* URL 복사 */}
          <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition hover:opacity-90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex flex-col w-full gap-3 sm:flex-row">
        <Link
          to={`/funding/${fundingId}`}
          className="flex-1 px-6 py-3 bg-primary-color text-white rounded-md text-center hover:bg-primary-color/90"
        >
          펀딩 페이지로 이동
        </Link>
        <Link
          to="/"
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md text-center hover:bg-gray-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default Complete;
