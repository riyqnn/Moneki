export default function ResourcesSection() {
  return (
    <section id="resources" className="px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-custom3">Resources for Your Well-being</h2>
        <p className="text-custom3/80 max-w-lg mx-auto mt-2">
          Access helpful tools and information to support your mental health.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="p-10 rounded-2xl shadow">
            <h3 className="text-2xl font-bold text-custom3 mb-3">Articles & Guides</h3>
            <p className="text-custom3/80">
              Read expert articles and practical guides for daily wellness.
            </p>
            <a href="#" className="inline-block bg-custom2 text-custom3 px-6 py-2 rounded-full mt-6">
              Explore
            </a>
          </div>

          <div className="p-10 rounded-2xl shadow">
            <h3 className="text-2xl font-bold text-custom3 mb-3">Meditation & Mindfulness</h3>
            <p className="text-custom3/80">Access our library of guided meditations.</p>
            <a href="#" className="inline-block bg-custom2 text-custom3 px-6 py-2 rounded-full mt-6">
              Start Now
            </a>
          </div>

          <div className="p-10 rounded-2xl shadow">
            <h3 className="text-2xl font-bold text-custom3 mb-3">Workouts & Activities</h3>
            <p className="text-custom3/80">
              Discover exercises that boost your mental well-being.
            </p>
            <a href="#" className="inline-block bg-custom2 text-custom3 px-6 py-2 rounded-full mt-6">
              Get Moving
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
