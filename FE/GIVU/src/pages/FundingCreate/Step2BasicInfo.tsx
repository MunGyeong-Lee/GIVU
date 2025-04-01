import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BasicInfo {
  title: string;
  description: string;
  mainImage?: string;
  additionalImages?: string[]; // 추가 이미지를 저장할 배열
}

interface Step2BasicInfoProps {
  basicInfo: BasicInfo;
  updateBasicInfo: (info: BasicInfo) => void;
  onNext: () => void;
  onPrev: () => void;
  productPrice: number;
  productImage?: string;
}

// 드래그 가능한 이미지 아이템 컴포넌트
const SortableImageItem = ({
  id,
  index,
  image,
  onRemove
}: {
  id: string;
  index: number;
  image: string;
  onRemove: (index: number) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white border border-gray-200 rounded-lg overflow-hidden ${isDragging ? 'shadow-md' : ''}`}
    >
      <div className="flex items-center p-2">
        <div
          className="flex-shrink-0 mr-2 text-gray-400 cursor-grab active:cursor-grabbing p-1"
          {...attributes}
          {...listeners}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
        <div className="flex flex-grow items-center">
          <div className="h-14 w-14 overflow-hidden rounded flex-shrink-0 bg-gray-50 mr-3">
            <img src={image} alt={`추가 이미지 ${index + 1}`} className="h-full w-full object-cover" />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium truncate">이미지 {index + 1}</p>
            <p className="text-xs text-gray-500">순서 변경 가능</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-gray-400 hover:text-red-500 ml-2 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Step2BasicInfo: React.FC<Step2BasicInfoProps> = ({
  basicInfo,
  updateBasicInfo,
  onNext,
  onPrev,
  productPrice,
  productImage
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(basicInfo.mainImage || null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(
    basicInfo.additionalImages || []
  );
  const [errors, setErrors] = useState<Partial<Record<keyof BasicInfo, string>>>({});

  // dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 이동해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 상태가 변경되면 미리보기도 업데이트
  useEffect(() => {
    setAdditionalImagePreviews(basicInfo.additionalImages || []);
  }, [basicInfo.additionalImages]);

  // 상품 이미지가 있고 기존 이미지가 없으면 상품 이미지를 기본 이미지로 설정
  useEffect(() => {
    if (productImage) {
      updateBasicInfo({
        ...basicInfo,
        mainImage: productImage
      });
      setImagePreview(productImage);
    }
  }, [productImage]);

  // 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...basicInfo, [name]: value };
    updateBasicInfo(updatedInfo);

    // 에러 상태 업데이트
    validateField(name as keyof BasicInfo, value);
  };

  // 필드 유효성 검사
  const validateField = (field: keyof BasicInfo, value: string | number | string[] | undefined) => {
    let error = '';

    switch (field) {
      case 'title':
        if (value === '') error = '제목을 입력해주세요.';
        else if (typeof value === 'string' && value.length > 50) error = '제목은 50자 이내로 입력해주세요.';
        break;
      case 'description':
        if (value === '') error = '설명을 입력해주세요.';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  // 모든 필드 유효성 검사
  const validateForm = () => {
    const fields: (keyof BasicInfo)[] = ['title', 'description'];
    let isValid = true;

    fields.forEach(field => {
      const value = basicInfo[field];
      // value가 undefined일 수 있는 경우를 처리
      if (value !== undefined) {
        const fieldIsValid = validateField(field, value);
        if (!fieldIsValid) isValid = false;
      } else {
        // undefined인 경우 에러 표시
        setErrors(prev => ({ ...prev, [field]: `${field} 값을 입력해주세요.` }));
        isValid = false;
      }
    });

    return isValid;
  };

  // 다음 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // 대표 이미지 업로드 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 대표 이미지는 변경 불가능하므로 기능 제거
    e.preventDefault();
  };

  // 추가 이미지 업로드 핸들러
  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;

        // 이미지 미리보기 및 실제 데이터 동시에 업데이트
        const newAdditionalImages = [...(basicInfo.additionalImages || []), result];

        setAdditionalImagePreviews([...additionalImagePreviews, result]);

        // 기본 정보 업데이트
        updateBasicInfo({
          ...basicInfo,
          additionalImages: newAdditionalImages
        });

        console.log('Added new image, total:', newAdditionalImages.length);
      };

      reader.readAsDataURL(file);

      // 파일 선택 창이 다시 열릴 수 있도록 input 값 초기화
      e.target.value = '';
    }
  };

  // 추가 이미지 삭제 핸들러
  const handleRemoveAdditionalImage = (index: number) => {
    // 미리보기와 실제 데이터 동시에 업데이트
    const newAdditionalImages = [...(basicInfo.additionalImages || [])];
    newAdditionalImages.splice(index, 1);

    setAdditionalImagePreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    console.log('Removed image at index:', index, 'remaining:', newAdditionalImages.length);

    updateBasicInfo({
      ...basicInfo,
      additionalImages: newAdditionalImages
    });
  };

  // 드래그 앤 드롭으로 이미지 순서 변경 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 드롭 위치가 없으면 아무것도 하지 않음
    if (!over) return;

    // ID가 같으면 순서 변경이 없음
    if (active.id === over.id) return;

    // 인덱스 추출 (ID 형식: "image-0", "image-1" 등)
    const activeIndex = parseInt(active.id.toString().split('-')[1]);
    const overIndex = parseInt(over.id.toString().split('-')[1]);

    // 순서 변경
    const newAdditionalImages = arrayMove(
      [...(basicInfo.additionalImages || [])],
      activeIndex,
      overIndex
    );

    console.log('Reordered:', active.id, 'to position of', over.id);
    console.log('New order:', newAdditionalImages);

    // 상태 업데이트
    setAdditionalImagePreviews(arrayMove(additionalImagePreviews, activeIndex, overIndex));

    updateBasicInfo({
      ...basicInfo,
      additionalImages: newAdditionalImages
    });
  };

  // 추가 이미지 최대 개수
  const MAX_ADDITIONAL_IMAGES = 3;

  return (
    <div className="p-6">
      {/* 헤더 영역 */}
      <div className="mb-8 text-center border-b pb-6">
        <h2 className="text-2xl font-bold mb-2">기본 정보 입력</h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          펀딩에 필요한 기본 정보를 입력해주세요. 펀딩 제목과 설명은 펀딩 페이지에 표시됩니다.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 왼쪽: 이미지 업로드 영역 */}
          <div className="md:col-span-1 space-y-6">
            {/* 대표 이미지 영역 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                대표 이미지 <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl overflow-hidden relative flex flex-col items-center justify-center transition-all h-[280px] ${imagePreview
                  ? 'border-primary-color bg-primary-color/5'
                  : 'border-gray-300 bg-gray-50'
                  }`}
              >
                {imagePreview ? (
                  <div className="w-full h-full relative">
                    <img
                      src={imagePreview}
                      alt="대표 이미지"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm font-medium mb-1">이미지 없음</p>
                    <p className="text-gray-400 text-xs">단계 1에서 상품을 선택하면<br />대표 이미지가 자동 설정됩니다</p>
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">권장 크기: 1200 x 800px</p>
              <p className="mt-1 text-xs text-primary-color text-center">
                상품 이미지가 대표 이미지로 자동 설정됩니다. 변경할 수 없습니다.
              </p>
            </div>

            {/* 추가 이미지 영역 - dnd-kit 사용 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex justify-between">
                <span>추가 이미지 <span className="text-gray-400 text-xs">(선택)</span></span>
                <span className="text-xs text-gray-500">{additionalImagePreviews.length}/{MAX_ADDITIONAL_IMAGES}</span>
              </label>

              {/* 추가 이미지 업로드 안내 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                <div className="flex items-start">
                  <div className="text-primary-color mr-3 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">1개 이상의 이미지를 등록하면 이미지 슬라이더로 제공됩니다.</span><br />
                    대표 이미지는 변경할 수 없습니다.
                  </p>
                </div>
              </div>

              {/* dnd-kit 구현 */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-2">
                  <SortableContext
                    items={additionalImagePreviews.map((_, i) => `image-${i}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {additionalImagePreviews.map((image, index) => (
                      <SortableImageItem
                        key={`image-${index}`}
                        id={`image-${index}`}
                        index={index}
                        image={image}
                        onRemove={handleRemoveAdditionalImage}
                      />
                    ))}
                  </SortableContext>

                  {/* 추가 이미지 업로드 버튼 */}
                  {additionalImagePreviews.length < MAX_ADDITIONAL_IMAGES && (
                    <div
                      onClick={() => document.getElementById('additional-image-upload')?.click()}
                      className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700">이미지 추가하기</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {MAX_ADDITIONAL_IMAGES - additionalImagePreviews.length}개 더 추가 가능
                      </p>
                    </div>
                  )}

                  <input
                    id="additional-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                    disabled={additionalImagePreviews.length >= MAX_ADDITIONAL_IMAGES}
                  />
                </div>
              </DndContext>

              <p className="mt-2 text-xs text-gray-500 text-center">추가 이미지는 최대 3개까지 등록 가능합니다</p>
            </div>
          </div>

          {/* 오른쪽: 텍스트 입력 영역 */}
          <div className="md:col-span-2 space-y-6">
            {/* 펀딩 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2 text-gray-700">
                펀딩 제목 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={basicInfo.title}
                onChange={handleChange}
                placeholder="펀딩 제목을 입력하세요 (최대 50자)"
                maxLength={50}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-color/30 focus:border-primary-color transition-all ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors.title ? (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.title}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  펀딩의 성격과 목적을 잘 나타내는 제목을 작성해주세요.
                </p>
              )}
              <div className="mt-1 text-right text-xs text-gray-400">
                {basicInfo.title ? basicInfo.title.length : 0}/50
              </div>
            </div>

            {/* 펀딩 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-700">
                펀딩 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={basicInfo.description}
                onChange={handleChange}
                placeholder="펀딩에 대한 설명을 입력하세요. 펀딩의 목적, 사용 계획 등을 자세히 적어주세요."
                rows={5}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary-color/30 focus:border-primary-color transition-all resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
              />
              {errors.description ? (
                <p className="mt-1.5 text-sm text-red-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.description}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-gray-500">
                  펀딩의 목적과 의미를 충분히 설명해주세요. 구체적일수록 참여율이 높아집니다.
                </p>
              )}
            </div>

            {/* 목표 금액 (표시만) */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                목표 금액
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={productPrice?.toLocaleString() || '0'}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-bold cursor-not-allowed"
                  disabled
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-500 font-medium">원</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                선택한 상품의 가격이 목표 금액으로 자동 설정됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between mt-10 border-t pt-6">
          <button
            onClick={onPrev}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            이전 단계
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors flex items-center font-medium shadow-md"
          >
            다음 단계
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2BasicInfo;
