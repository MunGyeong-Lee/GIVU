const CategorySection = () => {
  return (
    <div className="flex justify-between gap-2.5 mb-10">
      <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">생활</button>
      <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">굿즈</button>
      <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">홈인</button>
      <button className="bg-gray-500 border-none text-white py-4 flex-1 cursor-pointer">기타</button>
    </div>
  );
};

export default CategorySection; 