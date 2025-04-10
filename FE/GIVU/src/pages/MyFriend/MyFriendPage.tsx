import { useState, useEffect } from 'react';
import axios from 'axios';

// 친구 인터페이스 업데이트
interface Friend {
  userId: number;
  nickName: string;
  image: string;
}

// API 응답 타입 정의
interface ApiResponse {
  code: string;
  message: string;
  data: Friend[];
}

function MyFriendPage() {
  // 친구 목록 상태
  const [friends, setFriends] = useState<Friend[]>([]);
  // 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);
  // 에러 상태
  const [error, setError] = useState<string | null>(null);
  // 친구 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  // 펀딩 모달 상태
  const [showModal, setShowModal] = useState<boolean>(false);
  // 친구 추가 모달 상태
  const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);
  // 친구 ID 입력 상태
  const [friendId, setFriendId] = useState<string>('');
  // 친구 추가 로딩 상태
  const [addingFriend, setAddingFriend] = useState<boolean>(false);
  // 친구 추가 결과 메시지
  const [addFriendResult, setAddFriendResult] = useState<{ success: boolean, message: string } | null>(null);

  // 친구 목록 조회 API 호출
  useEffect(() => {
    fetchFriends();
  }, []);

  // 친구 목록 조회 함수
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || '';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

      const response = await axios.get<ApiResponse>(`${baseUrl}/friends`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        setFriends(response.data.data);
        setError(null);
      } else {
        setError('친구 목록 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('친구 목록 조회 실패:', err);
      setError('친구 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 친구 검색 기능
  const filteredFriends = friends.filter(friend =>
    friend.nickName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 펀딩하기 버튼 클릭 핸들러
  const handleFundingClick = () => {
    setShowModal(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 친구 추가 모달 열기 핸들러
  const handleOpenAddFriendModal = () => {
    setShowAddFriendModal(true);
    setFriendId('');
    setAddFriendResult(null);
  };

  // 친구 추가 모달 닫기 핸들러
  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
  };

  // 친구 ID 입력 핸들러
  const handleFriendIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendId(e.target.value);
  };

  // 친구 추가 API 호출
  const handleAddFriend = async () => {
    // 입력 값 검증
    if (!friendId.trim()) {
      setAddFriendResult({
        success: false,
        message: '친구 ID를 입력해주세요.'
      });
      return;
    }

    // 숫자만 입력 가능하도록 검증
    if (!/^\d+$/.test(friendId.trim())) {
      setAddFriendResult({
        success: false,
        message: '친구 ID는 숫자만 입력 가능합니다.'
      });
      return;
    }

    try {
      setAddingFriend(true);
      setAddFriendResult(null);

      const token = localStorage.getItem('auth_token') || '';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

      // API 요청 로깅
      console.log(`친구 추가 API 호출: ${baseUrl}/friends/${friendId.trim()}`);

      // 요청 형식 변경: 쿼리 파라미터로 전송
      const response = await axios({
        method: 'post',
        url: `${baseUrl}/friends/${friendId.trim()}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // POST 요청이지만 본문이 비어있는 경우를 처리하기 위해 빈 객체 전달
        data: {}
      });

      console.log('친구 추가 응답:', response);

      // 응답 상태 코드로 성공 여부 판단 (200대 상태 코드는 성공)
      const isSuccess = response.status >= 200 && response.status < 300;

      if (isSuccess) {
        setAddFriendResult({
          success: true,
          message: '친구가 추가되었습니다.'
        });

        // 성공 후 1.5초 후에 모달 닫기
        setTimeout(() => {
          handleCloseAddFriendModal();
        }, 1500);
      } else {
        setAddFriendResult({
          success: false,
          message: response.data?.message || '친구 추가에 실패했습니다.'
        });
      }
    } catch (err: any) {
      console.error('친구 추가 실패:', err);

      // 에러 상세 로깅
      if (err.response) {
        console.error('에러 응답:', err.response.data);
        console.error('에러 상태:', err.response.status);

        // 400 에러인 경우 존재하지 않는 ID 메시지 표시
        if (err.response.status === 400) {
          setAddFriendResult({
            success: false,
            message: '존재하지 않는 ID입니다.'
          });
        } else {
          setAddFriendResult({
            success: false,
            message: err.response?.data?.message || '친구 추가 중 오류가 발생했습니다.'
          });
        }
      } else if (err.request) {
        console.error('요청은 전송되었으나 응답이 없음:', err.request);
        setAddFriendResult({
          success: false,
          message: '서버와 통신 중 오류가 발생했습니다.'
        });
      } else {
        console.error('에러 메시지:', err.message);
        setAddFriendResult({
          success: false,
          message: '친구 추가 중 오류가 발생했습니다.'
        });
      }
    } finally {
      setAddingFriend(false);

      // 성공/실패와 관계없이 친구 목록 다시 불러오기
      // (API 호출이 실제론 성공했을 수 있으므로)
      try {
        await fetchFriends();
      } catch (refreshErr) {
        console.error('친구 목록 새로고침 실패:', refreshErr);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">내 친구</h1>

        {/* 검색창 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="친구 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 친구 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              친구 목록을 불러오는 중...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.userId} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                    <img
                      src={friend.image}
                      alt={`${friend.nickName}의 프로필`}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">{friend.nickName}</h3>
                    </div>
                    <button
                      onClick={handleFundingClick}
                      className="px-4 py-2 bg-primary-color text-white rounded-md text-sm hover:bg-primary-color/90 transition">
                      펀딩하기
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm ? '검색 결과가 없습니다.' : '아직 친구가 없습니다.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 친구 추가 버튼 */}
        <div className="mt-6 text-center">
          <button
            onClick={handleOpenAddFriendModal}
            className="inline-flex items-center px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            친구 추가하기
          </button>
        </div>

        {/* 개발 예정 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <div className="mb-4 text-yellow-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">안내</h3>
                <p className="text-gray-600 mb-4">해당 기능은 추후 개발 예정입니다.</p>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-primary-color text-white py-2 px-4 rounded-md hover:bg-primary-color/90 transition"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 친구 추가 모달 */}
        {showAddFriendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">친구 추가하기</h3>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="친구 ID를 입력하세요"
                    value={friendId}
                    onChange={handleFriendIdChange}
                    disabled={addingFriend}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  />
                </div>

                {addFriendResult && (
                  <div className={`mb-4 text-sm ${addFriendResult.success ? 'text-green-600' : 'text-red-600'}`}>
                    {addFriendResult.message}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={handleCloseAddFriendModal}
                    disabled={addingFriend}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleAddFriend}
                    disabled={addingFriend}
                    className="flex-1 bg-primary-color text-white py-2 px-4 rounded-md hover:bg-primary-color/90 transition flex items-center justify-center"
                  >
                    {addingFriend ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        처리중...
                      </>
                    ) : '추가하기'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyFriendPage; 