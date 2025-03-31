const AppDownloadSection = () => {
  return (
    <section className="mb-10">
      <h2 className="text-center mb-5 text-2xl">앱 다운로드</h2>
      <div className="flex gap-5 justify-center">
        <button className="bg-gray-500 border-none text-white p-[50px] w-[200px] cursor-pointer">플레이스토어</button>
        <button className="bg-gray-500 border-none text-white p-[50px] w-[200px] cursor-pointer">QR코드</button>
      </div>
    </section>
  );
};

export default AppDownloadSection; 