import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// 개발자 정보 타입 정의
interface Developer {
  id: number;
  name: string;
  role: string;
  description: string;
}

function MyFriendPage() {
  const navigate = useNavigate();
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
  // 친구 검색어 상태
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  // 검색 로딩 상태
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  // 친구 추가 로딩 상태
  const [addingFriend, setAddingFriend] = useState<boolean>(false);
  // 친구 추가 결과 메시지
  const [addFriendResult, setAddFriendResult] = useState<{ success: boolean, message: string } | null>(null);
  // 로그인 필요 모달 상태
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  // 개발자 정보 모달 상태
  const [showDeveloperModal, setShowDeveloperModal] = useState<boolean>(false);
  // 개발자 정보 (임시 데이터)
  const [developers] = useState<Developer[]>([
    {
      id: 7,
      name: '신은찬',
      role: 'FE',
      description: '기뷰 서비스의 프론트엔드를 담당하고 있습니다.'
    },
    {
      id: 9,
      name: '박민수',
      role: 'FE',
      description: '기뷰 서비스의 프론트엔드를 담당하고 있습니다.'
    },
    {
      id: 10,
      name: '정지원',
      role: 'Android',
      description: '기뷰 서비스의 안드로이드를 담당하고 있습니다.'
    },
    {
      id: 11,
      name: '이문경',
      role: 'BE',
      description: '기뷰 서비스의 서버 및 인프라를 담당하고 있습니다.'
    },
    {
      id: 12,
      name: '장홍준',
      role: '[팀장]',
      description: '내가 팀장이야'
    },
    {
      id: 13,
      name: '장홍준',
      role: 'Android',
      description: '기뷰 서비스의 안드로이드를 담당하고 있습니다.'
    },
    {
      id: 14,
      name: '정도현',
      role: 'BE',
      description: '기뷰 서비스의 백엔드를 담당하고 있습니다.'
    }
  ]);

  // 개발자 추가 핸들러
  const handleAddDeveloper = async (developerId: number) => {
    try {
      setAddingFriend(true);

      const token = localStorage.getItem('auth_token') || '';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

      const response = await axios({
        method: 'post',
        url: `${baseUrl}/friends/${developerId}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {}
      });

      // 응답 상태 코드로 성공 여부 판단
      const isSuccess = response.status >= 200 && response.status < 300;

      if (isSuccess) {
        alert('개발자와 친구가 되었습니다!');
        // 친구 목록 새로고침
        await fetchFriends();
      } else {
        alert('친구 추가에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error('개발자 친구 추가 실패:', err);

      if (err.response && err.response.status === 400) {
        alert('이미 친구인 개발자입니다.');
      } else {
        alert('친구 추가 중 오류가 발생했습니다.');
      }
    } finally {
      setAddingFriend(false);
    }
  };

  // 개발자 모달 열기 핸들러
  const handleOpenDeveloperModal = () => {
    setShowDeveloperModal(true);
  };

  // 개발자 모달 닫기 핸들러
  const handleCloseDeveloperModal = () => {
    setShowDeveloperModal(false);
  };

  // 인증 확인 및 로그인 모달 표시
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setShowLoginModal(true);
      }
    };

    checkAuth();
  }, []);

  // 로그인 페이지로 이동
  const handleGoToLogin = () => {
    navigate('/login');
  };

  // 친구 목록 조회 API 호출
  useEffect(() => {
    fetchFriends();
  }, []);

  // 친구 목록 조회 함수
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || '';

      // 토큰이 없으면 API 호출하지 않음
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

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

  // 친구 삭제 핸들러
  const handleDeleteFriend = async (friendId: number) => {
    if (window.confirm('정말로 이 친구를 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('auth_token') || '';
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

        console.log(`친구 삭제 API 호출: ${baseUrl}/friends/${friendId}`);

        const response = await axios.delete(`${baseUrl}/friends/${friendId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        console.log('친구 삭제 응답:', response.data);

        if (response.status === 200) {
          alert('친구가 삭제되었습니다.');
          // 친구 목록 새로고침
          await fetchFriends();
        }
      } catch (err) {
        console.error('친구 삭제 실패:', err);
        alert('친구 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 친구 추가 모달 열기 핸들러
  const handleOpenAddFriendModal = () => {
    setShowAddFriendModal(true);
    // 빈 검색어로 초기화
    setSearchQuery('');
    setSearchResults([]);
    setAddFriendResult(null);
  };

  // 친구 추가 모달 닫기 핸들러
  const handleCloseAddFriendModal = () => {
    setShowAddFriendModal(false);
  };

  // 친구 검색어 입력 핸들러
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 친구 검색 핸들러
  const handleSearchFriends = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const token = localStorage.getItem('auth_token') || '';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

      // 스웨거 문서에 따른 올바른 API 형식 적용
      const url = `${baseUrl}/friends/search?username=${encodeURIComponent(searchQuery)}`;
      console.log(`친구 검색 API 호출: ${url}`);

      const response = await axios.get<ApiResponse>(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('검색 응답:', response.data);

      if (response.data && response.data.code === 'SUCCESS' && Array.isArray(response.data.data)) {
        setSearchResults(response.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('친구 검색 실패:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 친구 추가 API 호출
  const handleAddFriend = async (userId: string) => {
    try {
      setAddingFriend(true);
      setAddFriendResult(null);

      const token = localStorage.getItem('auth_token') || '';
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://j12d107.p.ssafy.io/api';

      // API 요청 로깅
      console.log(`친구 추가 API 호출: ${baseUrl}/friends/${userId}`);

      const response = await axios({
        method: 'post',
        url: `${baseUrl}/friends/${userId}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
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

        // 친구 목록 새로고침
        await fetchFriends();
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
    }
  };

  // 친구 목록 검색창 엔터 키 핸들러
  const handleMainSearchKeyDown = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    // 메인 검색창에서는 특별한 동작 필요 없음 (이미 onChange로 필터링됨)
  };

  // 친구 추가 모달 검색창 엔터 키 핸들러
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 폼 제출 방지
      if (searchQuery.trim()) {
        handleSearchFriends();
      }
    }
  };

  // 로그인이 필요하면 로그인 모달만 표시
  if (showLoginModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="text-center">
            <div className="mb-4 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">로그인이 필요합니다</h3>
            <p className="text-gray-600 mb-4">친구 목록을 확인하려면 로그인이 필요합니다.</p>
            <button
              onClick={handleGoToLogin}
              className="w-full bg-primary-color text-white py-2 px-4 rounded-md hover:bg-primary-color/90 transition"
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">내 친구</h1>

        <div className="bg-primary-color/10 rounded-lg p-4 mb-6 border border-primary-color/20 shadow-sm">
          <p className="text-gray-700 mb-2">
            <span className="font-medium text-primary-color">친구</span>와 함께하는 나만의 기뷰 네트워크
          </p>
          <p className="text-sm text-gray-600">
            친구를 추가하면 친구만 볼 수 있는 <span className="text-primary-color font-medium">비밀 펀딩</span>을 확인할 수 있어요.
            특별한 사람들과 함께하는 의미 있는 기뷰를 시작해보세요.
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="친구 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleMainSearchKeyDown}
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
                      onClick={() => handleDeleteFriend(friend.userId)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition">
                      삭제
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

        {/* 버튼 그룹 */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleOpenAddFriendModal}
            className="inline-flex items-center px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            친구 추가하기
          </button>

          <button
            onClick={handleOpenDeveloperModal}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            개발자랑 친구하기
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
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">친구 추가하기</h3>
                <p className="text-gray-600 text-sm mt-1">사용자 이름으로 검색하여 친구를 추가하세요</p>
              </div>

              {/* 검색 UI */}
              <div>
                <div className="flex mb-4">
                  <input
                    type="text"
                    placeholder="친구 이름 검색..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent"
                  />
                  <button
                    onClick={handleSearchFriends}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="bg-primary-color text-white py-2 px-4 rounded-r-md hover:bg-primary-color/90 transition"
                  >
                    {searchLoading ? '검색 중...' : '검색'}
                  </button>
                </div>

                <div className="mb-6 border rounded-md overflow-hidden">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="inline-block animate-spin h-5 w-5 border-2 border-primary-color border-t-transparent rounded-full mr-2"></div>
                      검색 중...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {searchResults.map(user => (
                        <div key={user.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 transition">
                          <div className="flex items-center">
                            <img
                              src={user.image || '/avatar.png'}
                              alt={user.nickName}
                              className="w-10 h-10 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/avatar.png";
                              }}
                            />
                            <div>
                              <h4 className="text-sm font-medium">{user.nickName}</h4>
                              <p className="text-xs text-gray-500">ID: {user.userId}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddFriend(user.userId.toString())}
                            disabled={addingFriend}
                            className="ml-2 px-3 py-1 bg-primary-color text-white text-sm rounded-md hover:bg-primary-color/90 transition"
                          >
                            추가
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery && !searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      검색 결과가 없습니다.
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      찾고 싶은 친구 이름을 입력하세요.
                    </div>
                  )}
                </div>
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
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 개발자 정보 모달 */}
        {showDeveloperModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">GIVU 개발자들</h3>
                <p className="text-gray-600 text-sm mt-1">개발자와 친구가 되어보세요!</p>
              </div>

              <div className="divide-y divide-gray-200">
                {developers.map(developer => (
                  <div key={developer.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">{developer.name}</h4>
                        <p className="text-sm text-gray-500">{developer.role}</p>
                        <p className="text-sm text-gray-600 mt-1">{developer.description}</p>
                      </div>
                      <button
                        onClick={() => handleAddDeveloper(developer.id)}
                        disabled={addingFriend}
                        className="ml-4 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
                      >
                        친구 추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDeveloperModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyFriendPage; 