export default function AboutSection() {
  return (
    <section className="px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center">
        <div>
          <h2 className="text-5xl font-bold text-custom3 mb-4">
            What is Moniq AI?
          </h2>
          <p className="text-custom3/80 text-lg mb-6">
            Moniq AI is an AI based credit scoring system that uses alternative 
            data such as images text and behavioral patterns to generate fair and 
            explainable credit decisions for borrowers without formal financial records.
          </p>
          <a 
            href="#" 
            className="bg-custom3 text-custom1 px-6 py-2 rounded-full hover:scale-105 transition inline-block"
          >
            Learn More
          </a>
        </div>

        <div className="flex justify-end">
          <img src="/about.png" className="w-[450px]" alt="" />
        </div>
      </div>
    </section>
  );
}
