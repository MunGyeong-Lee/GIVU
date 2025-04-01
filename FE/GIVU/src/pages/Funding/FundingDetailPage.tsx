import React, { useState, useEffect } from "react";

// 임시 데이터 - 후에 API 연동으로 대체 예정
const FUNDING_DATA = {
  id: 1,
  title: "펀딩 제목",
  category: "카테고리",
  currentAmount: 150000,
  targetAmount: 300000,
  percentage: 50, // 달성률
  participantCount: 15,
  remainingDays: 7,
  creator: {
    name: "정도현",
    profileImage: "https://via.placeholder.com/200x200?text=프로필",
    introduction: "간단한 소개"
  },
  description: "애들아 내가 갖고싶은건 거의 다 내돈 내산 해버렸어,, 대신 나 이거 갖고싶어",
  images: [
    "https://via.placeholder.com/800x500?text=이미지1",
    "https://via.placeholder.com/800x500?text=이미지2"
  ],
  participants: [
    {
      id: 1,
      name: "이*경",
      profileImage: "https://via.placeholder.com/50x50",
      amount: 10000,
      message: "내용 생일축하 혹은 어쩌고 내용을 내용 생일축하 혹은 어쩌고 내용들내용 생일축하 혹은 어쩌고 내용들 내용 생일축하 혹은 어쩌고 내용들내용 생일축하 혹은 어쩌고 내용들내용을"
    },
    {
      id: 2,
      name: "장*준",
      profileImage: "https://via.placeholder.com/50x50",
      amount: 20000,
      message: "해당 메세지를 비밀 메세지입니다."
    },
    {
      id: 3,
      name: "이*경",
      profileImage: "https://via.placeholder.com/50x50",
      amount: 30000,
      message: "내용 생일축하 혹은 어쩌고 내용을 내용 생일축하 혹은 어쩌고 내용들내용 생일축하 혹은 어쩌고 내용들 내용 생일축하 혹은 어쩌고 내용들내용 생일축하 혹은 어쩌고 내용들내용을"
    }
  ]
};

// 선물 옵션 데이터
const GIFT_OPTIONS = [
  { amount: 0, label: "직접 입력하기", description: "원하는 금액으로 참여" },
  { amount: 5000, label: "5000원 선물하기", description: "커피 한잔 선물" },
  { amount: 10000, label: "10000원 선물하기", description: "디저트 한 개 선물" },
  { amount: 20000, label: "20000원 선물하기", description: "식사 한끼 선물" },
  { amount: 30000, label: "30000원 선물하기", description: "소품 한 개 선물" },
  { amount: 50000, label: "50000원 선물하기", description: "프리미엄 선물" }
];

const FundingDetailPage = () => {
  // const { id } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  // 컴포넌트가 마운트될 때 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 이미지 슬라이더 제어 함수
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === FUNDING_DATA.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? FUNDING_DATA.images.length - 1 : prev - 1
    );
  };

  // 금액 옵션 선택 함수 수정
  const selectAmount = (amount: number) => {
    if (amount === 0) {
      setIsCustomInput(true);
      setSelectedAmount(null);
    } else {
      setIsCustomInput(false);
      setSelectedAmount(amount);
      setCustomAmount('');
    }
  };

  // 직접 입력 금액 처리 함수
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value));
    } else {
      setSelectedAmount(null);
    }
  };

  // 참여자 목록 토글 함수
  const toggleParticipantsList = () => {
    setShowAllParticipants(!showAllParticipants);
  };

  // 참여자 표시 개수
  const displayedParticipants = showAllParticipants
    ? FUNDING_DATA.participants
    : FUNDING_DATA.participants.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 이미지 슬라이더 섹션 */}
      <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-[400px] flex items-center justify-center">
          <img
            src={FUNDING_DATA.images[currentImageIndex]}
            alt={`펀딩 이미지 ${currentImageIndex + 1}`}
            className="max-h-full object-contain"
          />
        </div>

        {/* 좌우 화살표 버튼 */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          aria-label="이전 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2"
          aria-label="다음 이미지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 이미지 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1}/{FUNDING_DATA.images.length}
        </div>
      </div>

      {/* 펀딩 요약 정보 수정 */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold">{FUNDING_DATA.title}</h1>
          <span className="text-gray-600">{FUNDING_DATA.category}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <span className="text-gray-600">참여자: {FUNDING_DATA.participantCount}명</span>
          </div>
          <div className="md:text-right">
            <div className="text-gray-600">
              현재 모금액: {FUNDING_DATA.currentAmount.toLocaleString()}원 ({FUNDING_DATA.percentage}%)
            </div>
            <div className="font-bold">
              목표 금액: {FUNDING_DATA.targetAmount.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-black h-2.5 rounded-full"
            style={{ width: `${FUNDING_DATA.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 대상자 소개 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">대상자 소개 (카드형식)</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <div className="mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                <span>프로필 이미지</span>
              </div>
              <div className="font-bold">{FUNDING_DATA.creator.name}</div>
              <div className="text-gray-600">{FUNDING_DATA.category}</div>
              <div className="mt-2">{FUNDING_DATA.creator.introduction}</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 md:w-1/2">
            <h3 className="font-bold mb-4">펀딩 소개글 (편지 형식?)</h3>
            <p className="text-gray-600">{FUNDING_DATA.description}</p>
          </div>
        </div>
      </section>

      {/* 참여자 섹션 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">참여자 섹션</h2>
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h3 className="font-bold mb-4">함께하는 사람들 ({FUNDING_DATA.participantCount}명)</h3>
          </div>

          <div className="mb-8">
            <h3 className="font-bold mb-4">참여자 통계 시각화 (차트)</h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="border border-gray-200 rounded-lg p-4 flex-1 flex items-center justify-center h-40">
                <span className="text-gray-400">참여 금액 분포 (도넛 차트)</span>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex-1 flex items-center justify-center h-40">
                <span className="text-gray-400">일별 참여 추이 (라인 차트)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">참여자 목록</h3>
            <div className="space-y-6">
              {displayedParticipants.map((participant) => (
                <div key={participant.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-bold">{participant.name}</span>
                  </div>
                  <p className="text-gray-600 pl-10">{participant.message}</p>
                </div>
              ))}
            </div>

            {FUNDING_DATA.participants.length > 3 && (
              <button
                onClick={toggleParticipantsList}
                className="w-full py-2 border border-gray-200 rounded-md mt-4 text-gray-600 hover:bg-gray-50"
              >
                {showAllParticipants ? "숨기기" : "펼쳐보기"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 선물하기 섹션 수정 */}
      <section className="mb-10">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">
              <span className="text-red-500">생일자님</span>의<br />
              위시 펀딩 동참하기
            </h2>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-purple-600 font-bold">
              목표까지 {(FUNDING_DATA.targetAmount - FUNDING_DATA.currentAmount).toLocaleString()}원 남았어요
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2 my-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${FUNDING_DATA.percentage}%` }}
              ></div>
            </div>
            <div className="text-right text-gray-600">
              목표금액 {FUNDING_DATA.targetAmount.toLocaleString()}원
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {GIFT_OPTIONS.map((option) => (
              <button
                key={option.amount}
                onClick={() => selectAmount(option.amount)}
                className={`p-4 rounded-lg text-white flex flex-col items-start ${
                  selectedAmount === option.amount && !isCustomInput 
                    ? 'bg-gray-800' 
                    : 'bg-black'
                }`}
              >
                <span className="font-bold text-lg mb-2">{option.label}</span>
                <span className="text-sm">{option.description}</span>
              </button>
            ))}
          </div>

          {/* 직접 입력 필드 추가 */}
          {isCustomInput && (
            <div className="mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금액을 직접 입력해주세요
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="금액을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    원
                  </span>
                </div>
                {customAmount && (
                  <p className="mt-2 text-sm text-gray-600">
                    {parseInt(customAmount).toLocaleString()}원을 선물합니다
                  </p>
                )}
              </div>
            </div>
          )}

          <button 
            className={`w-full py-3 text-white font-bold rounded-lg transition ${
              (selectedAmount || (isCustomInput && customAmount)) 
                ? 'bg-black hover:bg-gray-800' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedAmount && (!isCustomInput || !customAmount)}
          >
            {selectedAmount ? 
              `${selectedAmount.toLocaleString()}원 선물하기` : 
              '선물하기'
            }
          </button>
        </div>
      </section>

      {/* 안내사항 섹션 */}
      <section className="mb-6">
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">✓</span> 펀딩 참여 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩에 참여하시면 GIVU 페이로 결제가 진행됩니다</li>
              <li>펀딩 목표 금액 달성 시, 마이페이지 내 펀딩 목록에서 상품 구매를 진행할 수 있습니다.</li>
              <li>펀딩 참여 내역은 마이페이지에서 확인하실 수 있습니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">💰</span> GIVU 페이 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 참여 시 GIVU 페이 잔액이 부족할 경우, 충전 후 참여가 가능합니다</li>
              <li>펀딩 참여 시 참여하신 금액은 GIVU 페이로 차감 완료됩니다</li>
              <li>GIVU 페이 충전 금액의 환불은 고객센터를 통해 가능합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-orange-500 mr-1">🎁</span> 선물 관련 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>목표 금액 달성 시 GIVU 자사몰에 등록된 상품으로 구매가 진행됩니다</li>
              <li>선물 수령자의 주소지로 배송이 이루어집니다</li>
              <li>상품 하자 및 오배송의 경우 교환/반품이 가능합니다</li>
              <li>단순 변심에 의한 교환/반품은 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-red-500 mr-1">❌</span> 펀딩 취소 안내
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 달성률에 따라 취소 정책이 달라집니다.
                <br />(50% 이하 → 참여자 환불 / 50% 이상 → 정상자 GIVU 페이 증정)</li>
              <li>목표 금액 달성 후에는 취소가 불가합니다</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-yellow-500 mr-1">⚠</span> 교환/반품이 불가능한 경우
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>선물 수령자가 상품을 사용하거나 훼손한 경우</li>
              <li>상품의 포장을 개봉하여 가치가 하락한 경우</li>
              <li>시간 경과로 재판매가 어려울 정도로 상품 가치가 하락한 경우</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold flex items-center">
              <span className="text-gray-500 mr-1">📞</span> 고객 지원
            </h3>
            <ul className="ml-4 mt-2 space-y-1 list-disc text-gray-600">
              <li>펀딩 관련 문의: 채널톡 상담</li>
              <li>상품 관련 문의: GIVU 고객센터</li>
              <li>운영시간: 평일 10:00 - 18:00 (주말/공휴일 제외)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FundingDetailPage;