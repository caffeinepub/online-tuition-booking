import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              LearnRight
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Quality online tuitions for Classes 2–6. Expert teaching, flexible
              timings, and affordable pricing.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-base mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li>
                <a href="/" className="hover:opacity-100 transition-opacity">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="hover:opacity-100 transition-opacity"
                >
                  Book a Class
                </a>
              </li>
              <li>
                <a
                  href="/my-bookings"
                  className="hover:opacity-100 transition-opacity"
                >
                  My Bookings
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-base mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@learnright.edu
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Online — India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs opacity-50">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
            className="underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
