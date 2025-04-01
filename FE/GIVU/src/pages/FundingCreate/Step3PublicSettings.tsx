import React, { useState } from 'react';

interface PublicSettings {
  isPublic: boolean;
  allowComments: boolean;
  showParticipants: boolean;
  password?: string;
}

interface Step3PublicSettingsProps {
  publicSettings: PublicSettings;
  updatePublicSettings: (settings: PublicSettings) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step3PublicSettings: React.FC<Step3PublicSettingsProps> = ({
  publicSettings,
  updatePublicSettings,
  onNext,
  onPrev
}) => {
  const [passwordError, setPasswordError] = useState<string>('');

  // 토글 변경 핸들러
  const handleToggleChange = (field: keyof PublicSettings) => {
    updatePublicSettings({
      ...publicSettings,
      [field]: !publicSettings[field]
    });

    // 비공개로 변경할 때 비밀번호 필드 초기화
    if (field === 'isPublic' && publicSettings.isPublic) {
      updatePublicSettings({
        ...publicSettings,
        isPublic: false,
        password: ''
      });
    }
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    updatePublicSettings({
      ...publicSettings,
      password
    });

    // 비밀번호 유효성 검사
    if (!publicSettings.isPublic && password.length < 4) {
      setPasswordError('비밀번호는 최소 4자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    // 비공개 설정인 경우 비밀번호 필수 검사
    if (!publicSettings.isPublic) {
      if (!publicSettings.password || publicSettings.password.length < 4) {
        setPasswordError('비밀번호는 최소 4자 이상이어야 합니다.');
        return;
      }
    }

    onNext();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">공개 설정</h2>
        <p className="text-gray-600">펀딩의 공개 범위와 기능을 설정해주세요.</p>
      </div>

      <div className="space-y-8">
        {/* 공개 범위 설정 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">공개 범위</h3>

          <div className="space-y-4">
            {/* 전체 공개 옵션 */}
            <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => updatePublicSettings({ ...publicSettings, isPublic: true })}>
              <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full mr-3">
                {publicSettings.isPublic && (
                  <div className="w-4 h-4 bg-primary-color rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">전체 공개</h4>
                <p className="text-sm text-gray-600">누구나 이 펀딩을 검색하고 볼 수 있습니다.</p>
              </div>
            </div>

            {/* 비공개 옵션 */}
            <div className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => updatePublicSettings({ ...publicSettings, isPublic: false })}>
              <div className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-full mr-3">
                {!publicSettings.isPublic && (
                  <div className="w-4 h-4 bg-primary-color rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">비공개</h4>
                <p className="text-sm text-gray-600">링크를 가진 사람만 이 펀딩을 볼 수 있습니다.</p>
              </div>
            </div>
          </div>

          {/* 비밀번호 입력 (비공개 선택 시) */}
          {!publicSettings.isPublic && (
            <div className="mt-4 ml-9">
              <label className="block text-sm font-medium mb-2">
                펀딩 비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={publicSettings.password || ''}
                  onChange={handlePasswordChange}
                  className={`w-full p-2 border rounded-md ${passwordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-500">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                펀딩에 참여하려는 사람들에게 이 비밀번호를 알려주세요.
              </p>
            </div>
          )}
        </div>

        {/* 기능 설정 */}
        <div>
          <h3 className="text-lg font-medium mb-4">기능 설정</h3>
          <div className="space-y-4">
            {/* 댓글 허용 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">댓글 허용</h4>
                <p className="text-sm text-gray-600">펀딩 참여자들이 댓글을 작성할 수 있습니다.</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => handleToggleChange('allowComments')}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${publicSettings.allowComments ? 'bg-primary-color' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${publicSettings.allowComments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* 참여자 표시 */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">참여자 표시</h4>
                <p className="text-sm text-gray-600">펀딩에 참여한 사람들의 정보를 표시합니다.</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => handleToggleChange('showParticipants')}
                  className={`w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${publicSettings.showParticipants ? 'bg-primary-color' : 'bg-gray-300'
                    }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${publicSettings.showParticipants ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          이전 단계
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-color text-white rounded-md hover:bg-primary-color/90"
        >
          다음 단계
        </button>
      </div>
    </div>
  );
};

export default Step3PublicSettings;
