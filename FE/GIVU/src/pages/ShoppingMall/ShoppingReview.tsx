import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ShoppingReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [star, setStar] = useState(5);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 리뷰 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      
      // 이미지가 있는 경우 먼저 업로드
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);

        // 이미지 업로드 엔드포인트 수정
        const imageResponse = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/upload/image`, 
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        imageUrl = imageResponse.data.imageUrl; // 응답 구조에 따라 수정
      }

      // 리뷰 데이터 전송
      await axios.post(`${import.meta.env.VITE_BASE_URL}/products/${id}/reviews`, {
        title,
        body,
        star,
        image: imageUrl
      });

      alert('리뷰가 성공적으로 등록되었습니다.');
      navigate(`/shopping/product/${id}`); // 경로 수정
    } catch (error) {
      console.error('리뷰 등록 중 오류가 발생했습니다:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 리뷰 작성</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 별점 선택 */}
        <div>
          <label className="block text-sm font-medium mb-2">별점</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div
                key={value}
                onClick={() => setStar(value)}
                className="cursor-pointer"
              >
                <svg 
                  className={`w-8 h-8 ${value <= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* 제목 입력 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="리뷰 제목을 입력해주세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-2">내용</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md h-32"
            placeholder="리뷰 내용을 입력해주세요"
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium mb-2">이미지 첨부</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full p-2 text-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            이미지 선택
          </label>
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="미리보기"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:bg-gray-400"
          >
            {loading ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoppingReview;
