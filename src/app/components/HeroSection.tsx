export default function HeroSection() {
  return (
    <section className="w-full mt-20 flex justify-center py-24 text-center">
      <div className="relative w-[90%] h-[450px] flex flex-col items-center overflow-hidden justify-center bg-custom2 mx-auto p-16 rounded-3xl">
        <h1 className="text-5xl font-bold text-custom3 mb-6">Credit Access for Everyone</h1>
        <p className="text-lg text-custom3/80 max-w-xl mx-auto mb-8">
          AI analyzes behavioral and contextual data to help lenders evaluate borrowers more accurately.
        </p>

        <a
          href="/form"
          className="w-fit bg-custom3 text-custom1 px-8 py-3 rounded-full hover:scale-105 transition"
        >
          Get Started
        </a>

        <img
          src="/hero1.png"
          className="xl:w-[220px] md:w-[150px] w-[100px] absolute left-0 bottom-0"
          alt=""
        />
        <img
          src="/hero2.png"
          className="xl:w-[220px] md:w-[150px] w-[100px] absolute right-0 bottom-0"
          alt=""
        />
      </div>
    </section>
  );
}
