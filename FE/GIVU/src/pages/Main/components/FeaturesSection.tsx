

const FeaturesSection = () => {
  return (
    <section className="mb-10">
      <h2 className="text-center mb-5 text-2xl">GIVU의 차별점</h2>
      <div className="flex gap-5 justify-between">
        <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
          <p>특징 1</p>
          <p>설명</p>
        </div>
        <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
          <p>특징 2</p>
          <p>설명</p>
        </div>
        <div className="bg-gray-500 h-[200px] flex-1 flex flex-col justify-center items-center text-white">
          <p>특징 3</p>
          <p>설명</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 