import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface FundingData {
  id: string;
  title: string;
  image: string;
  status: string;
  achievementRate?: number;
  // ... 기타 필요한 속성들
}

const FundingReviewWrite = () => {
  const { fundingId } = useParams<{ fundingId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fundingData, setFundingData] = useState<FundingData | null>(null);
  
  useEffect(() => {
    const fetchFundingData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 로컬 스토리지에서 인증 토큰과 회원 ID 가져오기
        const accessToken = localStorage.getItem('accessToken');
        const memberId = localStorage.getItem('memberId');
        
        if (!accessToken || !memberId) {
          setError('로그인이 필요합니다.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }
        
        // 펀딩 정보 가져오기
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/fundings/${fundingId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        
        const fundingData = response.data;
        setFundingData(fundingData);
        
        // 펀딩이 종료되지 않았거나 달성률이 100% 미만인 경우 접근 제한
        if (fundingData.status !== "종료") {
          setError('펀딩이 종료된 후에만 후기를 작성할 수 있습니다.');
          setTimeout(() => {
            navigate('/funding/review');
          }, 2000);
          return;
        }
        
        if (fundingData.achievementRate === undefined || fundingData.achievementRate < 100) {
          setError('달성률이 100% 이상인 펀딩에 대해서만 후기를 작성할 수 있습니다.');
          setTimeout(() => {
            navigate('/funding/review');
          }, 2000);
          return;
        }
        
      } catch (err) {
        console.error('펀딩 정보를 가져오는 중 오류가 발생했습니다:', err);
        setError('펀딩 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    if (fundingId) {
      fetchFundingData();
    } else {
      setError('잘못된 접근입니다.');
      navigate('/funding/review');
    }
  }, [fundingId, navigate]);
  
  return (
    <div className="funding-review-write">
      {loading && <p>로딩 중...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && fundingData && (
        <>
          <h1>펀딩 후기 작성</h1>
          <div className="funding-info">
            <div className="funding-image">
              <img src={fundingData.image} alt={fundingData.title} />
            </div>
            <div className="funding-details">
              <h3>{fundingData.title}</h3>
              <p>달성률: {fundingData.achievementRate}%</p>
            </div>
          </div>
          
          {/* 후기 작성 폼 */}
          {/* ... existing code ... */}
        </>
      )}
    </div>
  );
};

export default FundingReviewWrite; 