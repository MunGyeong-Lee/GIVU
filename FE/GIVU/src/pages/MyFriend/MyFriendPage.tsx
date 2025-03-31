import { useState } from 'react';

interface Friend {
  id: number;
  name: string;
  profileImage: string;
  lastActive: string;
}

function MyFriendPage() {
  // 친구 목록 상태 (임시 데이터)
  const [friends] = useState<Friend[]>([
    {
      id: 1,
      name: '김민수',
      profileImage: 'https://via.placeholder.com/50',
      lastActive: '1시간 전'
    },
    {
      id: 2,
      name: '이지연',
      profileImage: 'https://via.placeholder.com/50',
      lastActive: '오늘'
    },
    {
      id: 3,
      name: '박준호',
      profileImage: 'https://via.placeholder.com/50',
      lastActive: '어제'
    },
    {
      id: 4,
      name: '최서연',
      profileImage: 'https://via.placeholder.com/50',
      lastActive: '3일 전'
    }
  ]);

  // 친구 검색 상태
  const [searchTerm, setSearchTerm] = useState('');

  // 친구 검색 기능
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="divide-y divide-gray-200">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <div key={friend.id} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                  <img
                    src={friend.profileImage}
                    alt={`${friend.name}의 프로필`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">{friend.name}</h3>
                    <p className="text-sm text-gray-500">마지막 활동: {friend.lastActive}</p>
                  </div>
                  <button className="px-4 py-2 bg-primary-color text-white rounded-md text-sm hover:bg-primary-color/90 transition">
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
        </div>

        {/* 친구 추가 버튼 */}
        <div className="mt-6 text-center">
          <button className="inline-flex items-center px-4 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            친구 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyFriendPage; 