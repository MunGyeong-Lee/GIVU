import React from 'react';

export type FundingStatus = 'all' | 'pending' | 'completed';

interface StatusFilterProps {
  selectedStatus: FundingStatus;
  onStatusChange: (status: FundingStatus) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedStatus, onStatusChange }) => {
  // 각 상태가 선택되었을 때 호출되는 함수
  const handleStatusChange = (status: FundingStatus) => {
    // 즉시 DOM 업데이트를 위해 setTimeout 사용
    setTimeout(() => {
      onStatusChange(status);
    }, 0);
  };

  return (
    <div className="flex items-center">
      <div className="inline-flex p-1 bg-white rounded-full shadow-sm relative z-10">
        {/* 전체 */}
        <div
          className={`status-btn px-5 py-1.5 rounded-full cursor-pointer mx-0.5 transition-colors duration-200 relative z-20 text-sm font-medium
            ${selectedStatus === 'all' ? 'active-status' : 'inactive-status'}`}
          onClick={() => handleStatusChange('all')}
          style={{
            backgroundColor: selectedStatus === 'all' ? '#FF5B61' : 'transparent',
            color: selectedStatus === 'all' ? 'white' : '#6B7280',
            boxShadow: selectedStatus === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          전체
        </div>

        {/* 진행중 */}
        <div
          className={`status-btn px-5 py-1.5 rounded-full cursor-pointer mx-0.5 transition-colors duration-200 relative z-20 text-sm font-medium
            ${selectedStatus === 'pending' ? 'active-status' : 'inactive-status'}`}
          onClick={() => handleStatusChange('pending')}
          style={{
            backgroundColor: selectedStatus === 'pending' ? '#FF5B61' : 'transparent',
            color: selectedStatus === 'pending' ? 'white' : '#6B7280',
            boxShadow: selectedStatus === 'pending' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          진행중
        </div>

        {/* 완료 */}
        <div
          className={`status-btn px-5 py-1.5 rounded-full cursor-pointer mx-0.5 transition-colors duration-200 relative z-20 text-sm font-medium
            ${selectedStatus === 'completed' ? 'active-status' : 'inactive-status'}`}
          onClick={() => handleStatusChange('completed')}
          style={{
            backgroundColor: selectedStatus === 'completed' ? '#FF5B61' : 'transparent',
            color: selectedStatus === 'completed' ? 'white' : '#6B7280',
            boxShadow: selectedStatus === 'completed' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          완료
        </div>
      </div>

      <style>
        {`
          .status-btn.active-status {
            background-color: #FF5B61 !important;
            color: white !important;
          }
          
          .status-btn.inactive-status:hover {
            color: #4B5563 !important;
          }
        `}
      </style>
    </div>
  );
};

export default StatusFilter;
