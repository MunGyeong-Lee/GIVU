import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createReview } from '../../services/review.service';
import { motion } from 'framer-motion';

const FundingReviewWritePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fundingId = searchParams.get('fundingId');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as File[]
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!fundingId) {
      navigate('/funding');
    }
  }, [fundingId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fundingId) {
      setError('펀딩 ID가 없습니다.');
      return;
    }

    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 이미지가 없는 경우 기본 이미지 경로 사용
      const reviewData = {
        ...formData,
        fundingId: parseInt(fundingId),
        defaultImagePath: formData.images.length === 0 ? "/src/assets/images/default-finding-image.jpg" : undefined
      };

      await createReview(reviewData);

      showSuccessMessage();
      
      setTimeout(() => {
        navigate('/funding/review');
      }, 1500);
    } catch (err: any) {
      setError(err.message || '후기 작성 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        images: [file]
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const goToNextStep = () => {
    if (formData.title.trim() === '') {
      setError('제목을 입력해주세요.');
      return;
    }
    setError(null);
    setStep(2);
  };
  
  const goToPrevStep = () => {
    setStep(1);
  };
  
  const showSuccessMessage = () => {
    console.log('후기가 성공적으로 등록되었습니다.');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            펀딩 후기 작성
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 max-w-md mx-auto"
          >
            펀딩을 통해 얻은 경험을 공유해주세요. 여러분의 솔직한 후기가 다른 사용자들에게 도움이 됩니다.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${
                step >= 2 ? 'bg-rose-500' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-xs text-gray-500 w-24 text-center">기본 정보</div>
            <div className="text-xs text-gray-500 w-24 text-center">상세 내용</div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="후기의 제목을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end mt-8">
              <button
                type="button"
                onClick={goToNextStep}
                className="px-6 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-sm hover:shadow-md flex items-center"
              >
                다음 단계
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.form 
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                후기 내용 <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="펀딩을 통해 얻은 경험과 느낌을 자세히 작성해주세요."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 업로드
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div 
                  className={`border-2 border-dashed rounded-xl ${
                    previewImage ? 'border-rose-300 bg-rose-50' : 'border-gray-300 hover:border-rose-300 bg-gray-50 hover:bg-rose-50'
                  } transition-colors p-4 text-center cursor-pointer w-full sm:w-1/3 h-48 relative overflow-hidden`}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">클릭하여 이미지 선택</p>
                      <p className="text-xs text-gray-400">권장: 1200x800px</p>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-600 mb-2">
                    이미지는 후기의 신뢰도를 높여줍니다. 펀딩 상품의 사진을 공유해주세요.
                  </p>
                  
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, images: [] }));
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      이미지 삭제
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between mt-8">
              <button
                type="button"
                onClick={goToPrevStep}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                이전
              </button>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-sm hover:shadow-md flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      작성 중...
                    </>
                  ) : (
                    <>
                      작성 완료
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.form>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-200"
        >
          <h3 className="text-sm font-semibold text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            좋은 후기 작성 팁
          </h3>
          <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-7 list-disc">
            <li>펀딩 목표가 어떻게 달성되었는지 구체적으로 설명해주세요.</li>
            <li>상품이나 서비스에 대한 솔직한 평가를 공유해주세요.</li>
            <li>다른 사람들이 참고할 수 있는 유용한 정보를 포함해주세요.</li>
            <li>개인정보나 민감한 내용은 포함하지 말아주세요.</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FundingReviewWritePage; 