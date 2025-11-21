import WorkCard from "./atom/WorkCard";

export default function HowItWorks() {
  return (
    <section id="howitworks" className="px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto text-center">
        
        <h2 className="text-4xl font-bold text-custom3 mb-4">
          How Moniq AI Works
        </h2>

        <p className="text-custom3/80 max-w-lg mx-auto mb-12">
          Moniq AI processes raw field data, transforms it into structured insight,
          scores it using a Hybrid SPK engine, and returns explainable lending decisions.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <WorkCard
            title="1. Data Collection"
            desc="Field agents input borrower data such as images, notes, demographics, and business information through the platform."
          />

          {/* Step 2 */}
          <WorkCard
            title="2. AI Analysis"
            desc="Gemini and Vision AI extract meaning from the data, turning text and images into measurable indicators."
          />

          {/* Step 3 */}
          <WorkCard
            title="3. Hybrid SPK (WASPAS)"
            desc="The quantified indicators are processed through WASPAS to generate a ranking-based credit score."
          />
        </div>
      </div>
    </section>
  );
}
