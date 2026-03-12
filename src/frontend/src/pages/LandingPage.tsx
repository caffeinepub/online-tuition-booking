import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  FlaskConical,
  Globe,
  IndianRupee,
  Languages,
  Leaf,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

const subjects = [
  {
    name: "Mathematics",
    icon: Calculator,
    color: "bg-orange-100 text-orange-600",
    desc: "Numbers, shapes & problem solving",
  },
  {
    name: "Science",
    icon: FlaskConical,
    color: "bg-blue-100 text-blue-600",
    desc: "Experiments & discoveries",
  },
  {
    name: "English",
    icon: BookOpen,
    color: "bg-green-100 text-green-600",
    desc: "Grammar, reading & writing",
  },
  {
    name: "Hindi",
    icon: Languages,
    color: "bg-purple-100 text-purple-600",
    desc: "Language & literature",
  },
  {
    name: "EVS",
    icon: Leaf,
    color: "bg-emerald-100 text-emerald-600",
    desc: "Environment & our world",
  },
  {
    name: "Social Studies",
    icon: Globe,
    color: "bg-rose-100 text-rose-600",
    desc: "History, civics & geography",
  },
];

const features = [
  {
    icon: Star,
    title: "Expert Tutor",
    desc: "Experienced and passionate about teaching young minds",
    color: "text-amber-500",
  },
  {
    icon: Clock,
    title: "1-Hour Sessions",
    desc: "Focused, distraction-free online classes every session",
    color: "text-blue-500",
  },
  {
    icon: IndianRupee,
    title: "Only ₹150/class",
    desc: "Quality education at the most affordable price",
    color: "text-green-500",
  },
];

const steps = [
  {
    num: "01",
    title: "Pick Subject & Class",
    desc: "Choose the subject and class level that fits your child",
  },
  {
    num: "02",
    title: "Choose a Timeslot",
    desc: "Pick a convenient date and time from available slots",
  },
  {
    num: "03",
    title: "Pay & Confirm",
    desc: "Pay ₹150 online and receive your booking confirmation",
  },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main>
      {/* Hero */}
      <section className="bg-hero-pattern py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-accent/30 text-accent-foreground border-0 font-medium">
                Classes 2 to 6 · Online
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-5">
                Quality Tuitions
                <br />
                <span className="text-gradient-orange">for Classes 2–6</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-md">
                Live, interactive 1-hour online classes from the comfort of
                home. Expert guidance in all core subjects — for just{" "}
                <strong className="text-foreground">₹150 per class</strong>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="text-base px-8"
                  onClick={() => navigate({ to: "/book" })}
                  data-ocid="hero.book_button"
                >
                  Book Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base"
                  onClick={() => navigate({ to: "/my-bookings" })}
                >
                  My Bookings
                </Button>
              </div>

              <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
                {[
                  "No registration fee",
                  "Instant confirmation",
                  "Easy cancellation",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <img
                src="/assets/generated/hero-tuition.dim_800x500.png"
                alt="Child studying online"
                className="w-full max-w-lg rounded-3xl shadow-warm object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-2">
              Why Choose LearnRight?
            </h2>
            <p className="text-muted-foreground">
              Everything you need for your child's academic success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover text-center p-6 border-border">
                  <CardContent className="pt-4">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                      <f.icon className={`w-7 h-7 ${f.color}`} />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold mb-2">
              Subjects We Offer
            </h2>
            <p className="text-muted-foreground">
              Comprehensive coverage for all core school subjects
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Card
                  className="card-hover cursor-pointer"
                  onClick={() => navigate({ to: "/book" })}
                >
                  <CardContent className="p-5">
                    <div
                      className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}
                    >
                      <s.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-sm md:text-base">
                      {s.name}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {s.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Book your first class in under 2 minutes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-lg">
                    {s.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate({ to: "/book" })}>
              Book Your First Class <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
