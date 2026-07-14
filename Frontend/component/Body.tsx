// Body.tsx
import Navbar from "./Navbar";

type BodyProps = {
  scrollToBody2: () => void;
};

export default function Body({ scrollToBody2 }: BodyProps) {
  return (
    <>
      <Navbar /> {/* No token props needed */}

      {/* Hero Section */}
      <div className="relative w-full h-screen ">
        <img
          src="b1.jpg"
          alt="Background"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-black px-4 md:pt-16">
          <div className="px-7 md:px-20">
            <div className="text-4xl md:text-5xl font-bold">Support & Safety for</div>
            <div className="text-4xl md:text-5xl font-bold mt-2">Nepali Migrant Workers</div>
            <div className="text-4xl md:text-5xl font-bold mt-2">Around the World</div>

            <p className="text-lg md:text-xl max-w-2xl mt-3 text-gray-100">
              Emergency support, legal assistance, and financial tools all in one easy to use platform.
            </p>
            <button
              className="mt-14 rounded-full mx-1 px-3 h-10 bg-white hover:scale-105 text-gray-700"
              onClick={scrollToBody2}
            >
              Discover More
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
