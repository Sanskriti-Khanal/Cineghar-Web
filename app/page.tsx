import Navbar from "./_components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <h1 className="text-4xl font-semibold text-gray-800">
          This is home page
        </h1>
      </main>
    </div>
  );
}
