import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function FundingReviewWritePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (!files) {
      return;
    }

    const newImages: File[] = [...images];
    const newImagePreviewUrls: string[] = [...imagePreviewUrls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newImages.push(file);

      // 이미지 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newImagePreviewUrls.push(reader.result);
          setImagePreviewUrls([...newImagePreviewUrls]);
        }
      };
      reader.readAsDataURL(file);
    }

    setImages(newImages);
  };

  // 이미지 제거 핸들러
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];

    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 여기서 실제로는 API 호출하여 서버에 저장
    console.log({ title, content, images });

    // 성공 시 목록 페이지로 리다이렉트
    alert('후기가 성공적으로 등록되었습니다.');
    navigate('/funding/review');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* 헤더 */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold">펀딩 후기 작성</h1>
        <p className="text-gray-600 mt-1">
          받은 선물과 펀딩 경험에 대한 후기를 남겨주세요.
        </p>
      </div>

      {/* 후기 작성 폼 */}
      <form onSubmit={handleSubmit}>
        {/* 제목 입력 */}
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-medium">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="제목을 입력해주세요"
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            이미지 첨부
          </label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center">
            <input
              type="file"
              id="image-upload"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">이미지를 드래그하거나 클릭하여 업로드</p>
                <p className="text-gray-400 text-sm mt-1">최대 5MB, JPG, PNG 파일</p>
              </div>
            </label>
          </div>

          {/* 이미지 미리보기 */}
          {imagePreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`미리보기 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 내용 입력 */}
        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 font-medium">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md min-h-[200px]"
            placeholder="펀딩 경험과 받은 선물에 대한 후기를 작성해주세요"
            required
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-2">
          <Link
            to="/funding/review"
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            취소
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default FundingReviewWritePage; 