export default function Footer() {
  return (
    <footer className="w-full bg-custom3 text-custom1 px-6 md:px-16 py-16 pt-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

        <div>
          <h4 className="font-bold mb-3">Solusi</h4>
          <ul className="space-y-2 opacity-80 hover:opacity-100">
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Resources</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Company</h4>
          <ul className="space-y-2 opacity-80 hover:opacity-100">
            <li><a href="#">About</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Support</h4>
          <ul className="space-y-2 opacity-80 hover:opacity-100">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Connect</h4>
          <ul className="space-y-2 opacity-80 hover:opacity-100">
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center pt-10 border-t border-custom1/20 mt-16 opacity-70">
        © 2024 Moniq AI. All rights reserved.
      </div>
    </footer>
  );
}
