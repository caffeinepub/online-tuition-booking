import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl text-foreground"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span>
            Learn<span className="text-gradient-orange">Right</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Home
          </Link>
          <Link
            to="/"
            hash="subjects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Subjects
          </Link>
          <Link
            to="/book"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.link"
          >
            Book Now
          </Link>
          <Link
            to="/my-bookings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.my_bookings_link"
          >
            My Bookings
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.admin_link"
          >
            Admin
          </Link>
        </nav>

        <Button
          className="hidden md:flex"
          onClick={() => navigate({ to: "/book" })}
          data-ocid="nav.book_button"
        >
          Book a Class
        </Button>

        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
          <Link
            to="/"
            className="text-sm font-medium py-2"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/book"
            className="text-sm font-medium py-2"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
          <Link
            to="/my-bookings"
            className="text-sm font-medium py-2"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.my_bookings_link"
          >
            My Bookings
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium py-2"
            onClick={() => setMenuOpen(false)}
            data-ocid="nav.admin_link"
          >
            Admin
          </Link>
          <Button
            className="w-full mt-2"
            onClick={() => {
              navigate({ to: "/book" });
              setMenuOpen(false);
            }}
            data-ocid="nav.book_button"
          >
            Book a Class
          </Button>
        </div>
      )}
    </header>
  );
}
