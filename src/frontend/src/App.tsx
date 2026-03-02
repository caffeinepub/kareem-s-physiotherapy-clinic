import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Award,
  Bone,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Hand,
  Heart,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Phone,
  Quote,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "./hooks/useActor";

// ─── Smooth scroll helper ───────────────────────────────────────────────────
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ─── Click sound helper ──────────────────────────────────────────────────────
function playClickSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
    osc.onended = () => ctx.close();
  } catch {
    // Silently ignore if Web Audio API is unavailable
  }
}

// ─── Fade-in animation variants ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── YouTube SVG icon ────────────────────────────────────────────────────────
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Navigation ─────────────────────────────────────────────────────────────
function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Treatments", id: "treatments" },
    { label: "Physiotherapy", id: "physiotherapy" },
    { label: "Conditions Treated", id: "conditions" },
    { label: "Reviews", id: "reviews" },
    { label: "Gallery", id: "gallery" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Contact", id: "contact" },
  ];

  const youtubeUrl = "https://youtube.com/@kareems_physiotherapy";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              scrollTo("home");
            }}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/uploads/Logo-KC-1.jpg"
              alt="Kareem's Physiotherapy Clinic"
              className="h-16 w-16 object-contain"
              fetchPriority="high"
              decoding="sync"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => {
                  playClickSound();
                  scrollTo(link.id);
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary"
              >
                {link.label}
              </button>
            ))}
            {/* YouTube tab */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#FF0000] hover:text-[#cc0000] transition-colors rounded-md hover:bg-red-50"
            >
              <YouTubeIcon className="w-4 h-4" />
              YouTube
            </a>
            <Button
              onClick={() => {
                playClickSound();
                scrollTo("appointment");
              }}
              className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Request Appointment
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-border"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => {
                    playClickSound();
                    scrollTo(link.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-secondary rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
              {/* YouTube tab (mobile) */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  playClickSound();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#FF0000] hover:text-[#cc0000] hover:bg-red-50 rounded-md transition-colors"
              >
                <YouTubeIcon className="w-4 h-4" />
                YouTube
              </a>
              <Button
                onClick={() => {
                  playClickSound();
                  scrollTo("appointment");
                  setMenuOpen(false);
                }}
                className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Request Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-physiotherapy-colorful.dim_1920x900.jpg')",
        }}
      />
      {/* Overlay */}
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
              ⭐ 5.0 · 144 Google Reviews
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="hero-title-shadow font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white text-center tracking-tight mb-2"
          >
            Kareem's Physiotherapy Clinic
          </motion.h2>

          <motion.h1
            variants={fadeUp}
            className="hero-title-shadow font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight"
          >
            Restoring Movement.{" "}
            <span className="hero-accent-text block">Enhancing Lives.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl sm:text-2xl text-white/90 font-medium max-w-2xl leading-snug"
          >
            Your trusted clinic for expert musculoskeletal care in PCMC, Pune.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-base text-white max-w-xl leading-relaxed"
          >
            Whether it's a sports injury, chronic back pain, or post-surgical
            recovery — we provide evidence-based treatment tailored to get you
            moving again.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <button
              type="button"
              onClick={() => scrollTo("appointment")}
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shadow-lg"
            >
              Book Your Assessment Today
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("about")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 transition-all"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M0,80 C360,20 1080,20 1440,80 L1440,80 L0,80 Z"
            fill="oklch(0.97 0.004 245)"
          />
        </svg>
      </div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Doctor photo */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            <div className="relative">
              <div className="w-72 h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl ring-4 ring-primary/10">
                <img
                  src="/assets/uploads/Passport-Photo-1.jpg"
                  alt="Dr. Asif N. Kareem - Physiotherapist"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating credential badge */}
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-xs font-semibold opacity-80">Master of</p>
                <p className="text-sm font-bold">Physiotherapy</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-8">
              {[
                { value: "10+", label: "Years Experience" },
                { value: "5000+", label: "Patients Treated" },
                { value: "100%", label: "Evidence-Based" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl font-bold teal-gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <div>
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                Meet Your Doctor
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2 leading-tight">
                Dr. Asif N. Kareem <span className="text-primary">(PT)</span>
              </h2>
              <p className="text-muted-foreground text-sm font-medium mt-3 leading-relaxed">
                Master of Physiotherapy (Musculoskeletal) &nbsp;|&nbsp;
                Diplomate in International Sports and Orthopaedic Manual Therapy
              </p>
            </div>

            <p className="text-foreground/80 leading-relaxed text-base">
              At Kareem's Physiotherapy Clinic, we believe recovery requires
              more than just machines— it requires expert assessment and a
              personalized touch. Led by Dr. Asif N. Kareem, we combine advanced
              international manual therapy techniques with customized
              rehabilitation plans to ensure you recover effectively and
              sustainably.
            </p>

            {/* Pull quote */}
            <blockquote className="relative pl-6 py-4 border-l-4 border-primary bg-secondary/60 rounded-r-xl">
              <p className="font-display text-lg text-foreground italic leading-relaxed">
                "Pain shouldn't dictate your quality of life. My goal is to
                provide you with a definitive diagnosis and a clear, functional
                path to recovery."
              </p>
              <footer className="mt-3 text-sm font-semibold text-primary">
                — Dr. Asif N. Kareem
              </footer>
            </blockquote>

            <button
              type="button"
              onClick={() => scrollTo("appointment")}
              className="btn-gold self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-md mt-2"
            >
              Schedule a Consultation
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Treatments Section ──────────────────────────────────────────────────────
const treatments = [
  {
    icon: Hand,
    title: "Manual Therapy",
    description:
      "Joint mobilizations and soft tissue techniques for immediate pain relief.",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    accentClass: "card-accent-blue",
    subtitle: "Hands-on joint & soft tissue techniques",
    image: "/assets/generated/treatment-manual-therapy.dim_800x500.jpg",
    detailDescription:
      "Manual therapy is a clinical approach using skilled hands-on techniques to diagnose and treat musculoskeletal pain and dysfunction. Dr. Kareem applies targeted joint mobilizations and soft tissue manipulation to reduce pain, restore joint range of motion, and improve overall function — without relying on machines or medications. Each session is tailored to your specific presentation and diagnosis.",
    conditions: [
      "Neck & shoulder stiffness",
      "Frozen shoulder (adhesive capsulitis)",
      "Lower back pain & stiffness",
      "Hip and knee joint restrictions",
      "Muscle tightness and trigger points",
      "Headaches of cervical origin",
    ],
  },
  {
    icon: Activity,
    title: "Sports Rehabilitation",
    description: "Returning athletes to their peak performance after injury.",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accentClass: "card-accent-emerald",
    subtitle: "Returning athletes to peak performance",
    image: "/assets/generated/treatment-sports-rehab.dim_800x500.jpg",
    detailDescription:
      "Our sports rehabilitation program is designed to get athletes — from weekend warriors to competitive professionals — back to their sport safely and efficiently. Dr. Kareem conducts a thorough biomechanical assessment to identify the root cause of your injury, then builds a progressive rehabilitation plan combining manual therapy, corrective exercises, and sport-specific training to restore strength, stability, and confidence.",
    conditions: [
      "Ligament sprains (ACL, MCL, ankle)",
      "Muscle strains and tears",
      "Tennis elbow & golfer's elbow",
      "Rotator cuff injuries",
      "Shin splints and stress fractures",
      "Overuse and repetitive strain injuries",
    ],
  },
  {
    icon: Bone,
    title: "Back & Spine Care",
    description:
      "Specialized protocols for lumbar pain, sciatica, and postural correction.",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    accentClass: "card-accent-teal",
    subtitle: "Specialized protocols for lumbar & spinal conditions",
    image: "/assets/generated/treatment-back-spine.dim_800x500.jpg",
    detailDescription:
      "Back and spine conditions are among the most common and debilitating musculoskeletal problems. Our clinic uses evidence-based assessment and internationally recognized spinal therapy protocols to identify the precise source of your pain. Treatment typically includes spinal mobilization, neurodynamic techniques, postural correction exercises, and patient education — giving you long-term relief and reducing recurrence.",
    conditions: [
      "Lower back pain (acute & chronic)",
      "Sciatica and nerve root compression",
      "Lumbar disc herniation",
      "Postural imbalance and flat back",
      "Spondylosis and facet joint pain",
      "Thoracic stiffness and rib pain",
    ],
  },
  {
    icon: Heart,
    title: "Post-Operative Recovery",
    description:
      "Gentle, effective guidance to regain range of motion after surgery.",
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    accentClass: "card-accent-rose",
    subtitle: "Guided rehabilitation after surgery",
    image: "/assets/generated/treatment-post-operative.dim_800x500.jpg",
    detailDescription:
      "Recovering from surgery requires a carefully phased approach to restore mobility, strength, and function safely. Dr. Kareem designs post-operative rehabilitation programs in alignment with surgical protocols, using gentle manual techniques to reduce scar tissue and swelling, followed by progressive exercise to rebuild muscle control and joint stability. The goal is to help you regain independence and return to full function as quickly and safely as possible.",
    conditions: [
      "Knee replacement (TKR)",
      "Hip replacement (THR)",
      "ACL reconstruction",
      "Rotator cuff repair",
      "Spinal surgery recovery",
      "Fracture fixation and plating",
    ],
  },
  {
    icon: Monitor,
    title: "Ergonomic Assessments",
    description:
      "Tailored advice to fix the root cause of your pain at home or work.",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    accentClass: "card-accent-amber",
    subtitle: "Fixing the root cause at home and work",
    image: "/assets/generated/treatment-ergonomic.dim_800x500.jpg",
    detailDescription:
      "Many cases of chronic neck, back, and shoulder pain originate from how we sit, stand, or work for hours each day. An ergonomic assessment by Dr. Kareem involves a detailed evaluation of your workstation, posture, and movement habits, followed by personalized recommendations to reduce mechanical stress on your body. This can include chair and screen height adjustments, posture correction exercises, and a customized home exercise program.",
    conditions: [
      "Desk-related neck and shoulder pain",
      "Lower back pain from prolonged sitting",
      "Wrist and forearm strain (RSI)",
      "Eye strain and tension headaches",
      "Poor posture and forward head position",
      "Work-from-home pain syndromes",
    ],
  },
];

function TreatmentsSection() {
  const [selectedTreatment, setSelectedTreatment] = useState<
    (typeof treatments)[0] | null
  >(null);

  const handleBookAppointment = () => {
    setSelectedTreatment(null);
    scrollTo("appointment");
  };

  return (
    <section id="treatments" className="py-24 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Our Services
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Expert Treatments &amp; Services
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              We specialize in conditions of the musculoskeletal system,
              including:
            </p>
          </motion.div>

          {/* Cards grid */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {treatments.map((treatment) => {
              const Icon = treatment.icon;
              return (
                <motion.div
                  key={treatment.title}
                  variants={fadeUp}
                  className="h-full"
                >
                  <button
                    type="button"
                    className="w-full h-full text-left"
                    onClick={() => setSelectedTreatment(treatment)}
                    aria-label={`Learn more about ${treatment.title}`}
                  >
                    <Card
                      className={`treatment-card h-full border-border/60 bg-card hover:border-primary/30 hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300 ${treatment.accentClass}`}
                    >
                      <CardContent className="p-7 flex flex-col gap-5 min-h-[220px]">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${treatment.iconBg}`}
                        >
                          <Icon className={`w-7 h-7 ${treatment.iconColor}`} />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <h3 className="font-display font-bold text-xl text-foreground leading-tight">
                            {treatment.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                            {treatment.description}
                          </p>
                        </div>
                        {/* Learn More row */}
                        <div className="flex items-center gap-1 text-primary text-sm font-semibold pt-2 border-t border-border/40">
                          <span>Learn More</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                </motion.div>
              );
            })}

            {/* CTA card */}
            <motion.div variants={fadeUp} className="h-full">
              <button
                type="button"
                className="treatment-card w-full h-full rounded-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-5 p-7 text-center min-h-[220px]"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.28 0.08 215), oklch(0.20 0.06 220))",
                  border: "1px solid oklch(0.40 0.10 215 / 0.4)",
                }}
                onClick={() => scrollTo("appointment")}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white/80" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-white font-display font-bold text-xl leading-tight">
                    Not sure which treatment?
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Book an assessment — Dr. Kareem will build your personal
                    recovery plan.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 transition-colors px-5 py-2 rounded-full border border-white/20">
                  Book Assessment <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Treatment Detail Dialog */}
      <Dialog
        open={!!selectedTreatment}
        onOpenChange={(open) => {
          if (!open) setSelectedTreatment(null);
        }}
      >
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden gap-0">
          {selectedTreatment && (
            <>
              {/* Header image */}
              <div className="relative w-full h-52 sm:h-64 overflow-hidden bg-secondary/40">
                <img
                  src={selectedTreatment.image}
                  alt={selectedTreatment.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Title over image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {selectedTreatment.title}
                    </DialogTitle>
                    <p className="text-white/80 text-sm font-medium mt-1">
                      {selectedTreatment.subtitle}
                    </p>
                  </DialogHeader>
                </div>
              </div>

              {/* Scrollable body */}
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 sm:p-8 flex flex-col gap-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-display font-bold text-lg text-foreground mb-3">
                      About This Treatment
                    </h4>
                    <p className="text-foreground/75 text-sm leading-relaxed">
                      {selectedTreatment.detailDescription}
                    </p>
                  </div>

                  {/* Conditions / Benefits list */}
                  <div>
                    <h4 className="font-display font-bold text-lg text-foreground mb-3">
                      Conditions We Treat
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {selectedTreatment.conditions.map((condition) => (
                        <li
                          key={condition}
                          className="flex items-start gap-2.5 text-sm text-foreground/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-2 pb-1">
                    <button
                      type="button"
                      onClick={handleBookAppointment}
                      className="btn-gold w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-base shadow-md"
                    >
                      Book an Appointment for {selectedTreatment.title}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─── Physiotherapy Section ───────────────────────────────────────────────────
const physiotherapyTypes = [
  {
    title: "Manual Therapy",
    image: "/assets/generated/physio-manual-therapy-card.dim_600x400.jpg",
    description:
      "Hands-on joint mobilizations, manipulation, and soft tissue techniques to reduce pain, restore joint range of motion, and improve musculoskeletal function.",
  },
  {
    title: "Exercise Therapy",
    image: "/assets/generated/physio-exercise-therapy-card.dim_600x400.jpg",
    description:
      "Customized therapeutic exercise programs designed to rebuild strength, improve flexibility, restore balance, and prevent re-injury. Progressive and goal-oriented.",
  },
  {
    title: "Electrotherapy",
    image: "/assets/generated/physio-electrotherapy-card.dim_600x400.jpg",
    description:
      "Evidence-based electrotherapy modalities including TENS, ultrasound therapy, and interferential current to reduce pain, promote tissue healing, and decrease inflammation.",
  },
  {
    title: "Dry Needling",
    image: "/assets/generated/dry-needling-treatment.dim_800x600.jpg",
    description:
      "Precise insertion of thin needles into myofascial trigger points to release muscle tightness, reduce referred pain, and restore normal movement patterns.",
  },
  {
    title: "Postural Rehabilitation",
    image: "/assets/generated/treatment-ergonomic.dim_800x500.jpg",
    description:
      "Systematic correction of faulty posture and movement patterns through targeted exercises, ergonomic advice, and neuromuscular re-education for lasting relief.",
  },
];

function PhysiotherapySection() {
  return (
    <section id="physiotherapy" className="py-0 overflow-hidden">
      {/* Banner */}
      <div className="relative w-full h-56 sm:h-72">
        <img
          src="/assets/generated/physiotherapy-section-banner.dim_1200x500.jpg"
          alt="What is Physiotherapy"
          className="w-full h-56 sm:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-white/70 text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            Our Approach
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            What is Physiotherapy?
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="section-alt py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-12"
          >
            {/* Intro */}
            <motion.p
              variants={fadeUp}
              className="text-foreground/75 text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto"
            >
              Physiotherapy is a healthcare profession that assesses, diagnoses,
              treats, and prevents a wide range of health conditions and
              movement disorders. At Kareem's Physiotherapy Clinic, we use
              evidence-based physiotherapy approaches tailored to each patient's
              unique needs.
            </motion.p>

            {/* Cards grid */}
            <motion.div
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full"
            >
              {physiotherapyTypes.map((type) => (
                <motion.div
                  key={type.title}
                  variants={fadeUp}
                  className="h-full"
                >
                  <Card className="h-full border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        src={type.image}
                        alt={type.title}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <CardContent className="p-5 flex flex-col gap-2 flex-1">
                      <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {type.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <button
                type="button"
                onClick={() => scrollTo("appointment")}
                className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shadow-lg"
              >
                Book Your Physiotherapy Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Conditions Treated Section ──────────────────────────────────────────────
const conditionGroups = [
  {
    icon: Bone,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    title: "Spine & Back",
    conditions: [
      "Lower back pain",
      "Sciatica & nerve compression",
      "Lumbar disc herniation",
      "Spondylosis & facet joint pain",
      "Thoracic stiffness",
      "Coccyx (tailbone) pain",
      "Postural imbalance",
    ],
  },
  {
    icon: Activity,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Shoulder & Neck",
    conditions: [
      "Frozen shoulder (adhesive capsulitis)",
      "Rotator cuff injuries",
      "Cervical spondylosis",
      "Neck pain & stiffness",
      "Whiplash injury",
      "Cervicogenic headache",
      "Shoulder impingement",
    ],
  },
  {
    icon: Heart,
    iconColor: "text-rose-600",
    iconBg: "bg-rose-50",
    title: "Knee & Hip",
    conditions: [
      "Knee osteoarthritis",
      "Patellofemoral pain syndrome",
      "IT band syndrome",
      "Hip bursitis",
      "Groin strain",
      "Patella tendinopathy",
      "Pre & post knee/hip replacement",
    ],
  },
  {
    icon: Award,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Sports Injuries",
    conditions: [
      "ACL / MCL ligament sprains",
      "Muscle strains & tears",
      "Tennis elbow & golfer's elbow",
      "Shin splints",
      "Plantar fasciitis",
      "Ankle sprains",
      "Overuse & repetitive strain injuries",
    ],
  },
  {
    icon: CheckCircle2,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Post-Surgical Recovery",
    conditions: [
      "Post knee replacement rehab",
      "Post hip replacement rehab",
      "ACL reconstruction recovery",
      "Rotator cuff repair rehab",
      "Spinal surgery recovery",
      "Fracture fixation & plating",
    ],
  },
  {
    icon: BookOpen,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Neurological & Other",
    conditions: [
      "Stroke rehabilitation",
      "Cerebral palsy physiotherapy",
      "Peripheral neuropathy",
      "Parkinson's disease rehab",
      "Balance & coordination disorders",
      "Fibromyalgia",
      "Chronic fatigue management",
    ],
  },
];

function ConditionsTreatedSection() {
  return (
    <section id="conditions" className="py-0 overflow-hidden">
      {/* Banner */}
      <div className="relative w-full h-56 sm:h-72">
        <img
          src="/assets/generated/conditions-treated-banner.dim_1200x500.jpg"
          alt="Conditions We Treat"
          className="w-full h-56 sm:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-white/70 text-xs font-semibold tracking-[0.25em] uppercase mb-2">
            Expert Care For
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            Conditions We Treat
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-12"
          >
            {/* Intro */}
            <motion.p
              variants={fadeUp}
              className="text-foreground/75 text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto"
            >
              We treat a comprehensive range of musculoskeletal, neurological,
              and post-surgical conditions. If you don't see your condition
              below, contact us — Dr. Kareem will assess and advise.
            </motion.p>

            {/* Condition groups grid */}
            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {conditionGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <motion.div key={group.title} variants={fadeUp}>
                    <Card className="h-full border-border/60 bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6 flex flex-col gap-4">
                        {/* Icon + Title */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${group.iconBg}`}
                          >
                            <GroupIcon
                              className={`w-5 h-5 ${group.iconColor}`}
                            />
                          </div>
                          <h3 className="font-display font-bold text-lg text-foreground leading-snug">
                            {group.title}
                          </h3>
                        </div>

                        {/* Conditions list */}
                        <ul className="flex flex-col gap-2">
                          {group.conditions.map((condition) => (
                            <li
                              key={condition}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-1" />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => scrollTo("appointment")}
                className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shadow-lg"
              >
                Book an Assessment
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-muted-foreground text-sm">
                Don't see your condition?{" "}
                <a
                  href="https://wa.me/919922866669"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Ask Dr. Kareem on WhatsApp
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Why Choose Us Section ───────────────────────────────────────────────────
const whyChooseUs = [
  {
    icon: BookOpen,
    title: "Evidence-Based Practice",
    description:
      "We utilize the latest musculoskeletal research to guide your recovery.",
  },
  {
    icon: UserCheck,
    title: "Individualized Care",
    description:
      'No "cookie-cutter" treatments. Every program is built around your body and your goals.',
  },
  {
    icon: Award,
    title: "Expert Credentials",
    description:
      "Master-level education and international training in manual therapy.",
  },
];

function WhyChooseUsSection() {
  return (
    <section className="py-24 section-dark-teal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-14"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mt-3 leading-tight">
              Why Choose Us?
            </h2>
            <p className="text-white/60 mt-4 text-base leading-relaxed">
              We combine clinical expertise with genuine personal attention —
              because your recovery deserves both.
            </p>
          </motion.div>

          {/* Three pillars */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden w-full"
          >
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              const numeral = ["01", "02", "03"][index];
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="flex flex-col gap-5 p-10 bg-white/5 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl font-bold text-white/10 leading-none select-none">
                      {numeral}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white/70" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-8 h-0.5 bg-white/30 mb-4" />
                    <h3 className="font-display font-bold text-xl text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA strip */}
          <motion.div variants={fadeUp}>
            <button
              type="button"
              onClick={() => scrollTo("appointment")}
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base shadow-xl"
            >
              Start Your Recovery Today
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Reviews Section ─────────────────────────────────────────────────────────
const patientReviews = [
  {
    name: "Bebi A",
    rating: 5,
    text: "I suffered a middle cerebral artery stroke that left me with weakness on one side of my body and difficulty with balance and coordination. When I started physiotherapy at Kareem's Physiotherapy Clinic, I could barely move my hand and leg. Under Dr. Asif Kareem's guidance, I began a structured rehabilitation program including neuro-motor re-education, balance training, and functional mobility exercises. Today, I can walk with confidence and perform my daily activities without major assistance.",
  },
  {
    name: "Sanjeebit C",
    rating: 5,
    text: "I have had the pleasure of being treated by Dr. Asif Kareem, and I cannot speak highly enough of his superb knowledge, exceptional skills, and caring approach. Dr. Kareem combines his vast expertise with a genuine concern for his patients' well-being. His personalized treatment plans and attention to detail have truly made a difference in my recovery. I highly recommend Dr. Kareem to anyone in need of top-tier physiotherapy care.",
  },
  {
    name: "Sharvari N",
    rating: 5,
    text: "I am incredibly grateful for the care my mother received from Dr. Asif during her post-knee replacement surgery. He took the time to understand my mother's pain and suggested a recovery plan that was both effective and manageable. My mother was initially anxious about the rehabilitation process, but Dr. Asif ensured she was comfortable and motivated every step of the way. Today, she is more confident than we ever imagined. I would highly recommend Dr. Asif to anyone who needs physiotherapy, especially for post-surgical recovery.",
  },
];

function ReviewsSection() {
  return (
    <section id="reviews" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Patient Stories
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              What Our Patients Say
            </h2>
            <p className="text-muted-foreground mt-3 text-base font-medium">
              5.0 ★ · 144 reviews on Google
            </p>
          </motion.div>

          {/* Review cards */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {patientReviews.map((review) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                className="h-full"
              >
                <Card className="h-full border-border/60 bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
                  <CardContent className="p-7 flex flex-col gap-5 h-full">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-primary/30 flex-shrink-0" />

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {["s1", "s2", "s3", "s4", "s5"]
                        .slice(0, review.rating)
                        .map((k) => (
                          <Star
                            key={k}
                            className="w-4 h-4 text-amber-400 fill-amber-400"
                          />
                        ))}
                    </div>

                    {/* Review text */}
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      "{review.text}"
                    </p>

                    {/* Reviewer name */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Verified Google Review
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View More on Google CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-muted-foreground text-sm">
              Showing 3 of 144 reviews
            </p>
            <a
              href="https://www.google.com/search?q=kareem%27s+physiotherapy+clinic%2C+relieve+pain+and+recover+faster&oq=k&gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MgYIABBFGDwyCAgBEEUYJxg7MgYIAhBFGDsyBggDEEUYOTIGCAQQRRg7MgYIBRAjGCcyBggGEEUYPDIGCAcQRRg80gEIMTM4NmowajSoAgGwAgHxBTSZVWSqQwqP8QU0mVVkqkMKjw&sourceid=chrome&ie=UTF-8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-border/60 bg-white hover:bg-secondary/60 text-sm font-semibold text-foreground transition-all shadow-sm hover:shadow-md group"
            >
              {/* Google G logo */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>View All 144 Reviews on Google</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Contact Section ─────────────────────────────────────────────────────────
function ContactSection() {
  const googleMapsUrl =
    "https://www.google.com/maps/place/Kareem's+Physiotherapy+Clinic+(Relieve+Pain,+Restore+Life)/@18.6153875,73.7841595,17z/data=!3m1!4b1!4m6!3m5!1s0x3bc2b951279bafa3:0xb38fce7298153c72!8m2!3d18.6153875!4d73.7867344!16s%2Fg%2F11y484vlfn";
  const googleBusinessUrl =
    "https://www.google.com/maps/place/Kareem's+Physiotherapy+Clinic+(Relieve+Pain,+Restore+Life)/@18.6153875,73.7867344,17z";

  return (
    <section id="contact" className="py-24 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-12"
        >
          <motion.div variants={fadeUp} className="text-center max-w-xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Visit Us
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Get in Touch
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="w-full max-w-5xl grid lg:grid-cols-2 gap-8"
          >
            {/* Info Card */}
            <Card className="border-border/60 shadow-lg overflow-hidden">
              {/* Card header */}
              <div className="bg-primary px-8 py-6">
                <h3 className="font-display text-2xl font-bold text-primary-foreground">
                  Kareem's Physiotherapy Clinic
                </h3>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Expert Musculoskeletal Care
                </p>
              </div>

              <CardContent className="p-8 flex flex-col gap-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Address
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5">
                      530/4 Blue Heaven, Jyotiba Nagar, Kalewadi Abhiyanta
                      Colony, Chatrapati Shivaji Maharaj Chowk, Pune 411017
                    </p>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-xs font-medium mt-1.5 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      Get Directions
                    </a>
                  </div>
                </div>

                {/* Phone + WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-semibold text-foreground text-sm">
                      Phone / WhatsApp
                    </p>
                    <a
                      href="tel:+919922866669"
                      className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      +91 99228 66669
                    </a>
                    <a
                      href="https://wa.me/919922866669"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#25D366] hover:text-[#20b858] text-sm font-medium transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                        aria-hidden="true"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Message on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Email
                    </p>
                    <a
                      href="mailto:kareemsphysiotherapy@gmail.com"
                      className="text-primary hover:text-primary/80 text-sm font-medium mt-0.5 transition-colors break-all"
                    >
                      kareemsphysiotherapy@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">
                      Clinic Hours
                    </p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start justify-between bg-secondary/50 rounded-lg px-4 py-2.5 gap-4">
                        <span className="text-sm font-medium text-foreground whitespace-nowrap">
                          Monday – Saturday
                        </span>
                        <span className="text-sm text-muted-foreground text-right">
                          8:00 AM – 1:00 PM &amp; 4:00 PM – 6:00 PM
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-amber-50 rounded-lg px-4 py-2.5">
                        <span className="text-sm font-medium text-foreground">
                          Sunday
                        </span>
                        <span className="text-sm text-amber-700 font-medium">
                          Prior Appointment Only
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Business Profile link */}
                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-border/30">
                    {/* Google "G" logo */}
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      View on Google Business
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ⭐ 5.0 · 144 reviews
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </a>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => scrollTo("appointment")}
                  className="btn-gold w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-md mt-2"
                >
                  Book an Appointment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>

            {/* Map embed */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden border border-border/60 shadow-lg h-full min-h-[400px]">
                <iframe
                  title="Kareem's Physiotherapy Clinic Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.0!2d73.7841595!3d18.6153875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b951279bafa3%3A0xb38fce7298153c72!2sKareem's+Physiotherapy+Clinic+(Relieve+Pain%2C+Restore+Life)!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "400px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-border/60 bg-white hover:bg-secondary/60 text-sm font-semibold text-foreground transition-colors shadow-sm"
              >
                <MapPin className="w-4 h-4 text-primary" />
                Open in Google Maps
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Appointment Section ─────────────────────────────────────────────────────
// Generate 30-min time slots for clinic hours: 08:00–13:00 and 16:00–18:00
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const ranges = [
    { start: 8, end: 13 },
    { start: 16, end: 18 },
  ];
  for (const range of ranges) {
    for (let h = range.start; h < range.end; h++) {
      const hStr = h.toString().padStart(2, "0");
      slots.push(`${hStr}:00`);
      slots.push(`${hStr}:30`);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function formatTimeSlot(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  const h = Number.parseInt(hStr, 10);
  const m = mStr;
  const period = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m} ${period}`;
}

function AppointmentSection() {
  const { actor } = useActor();
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const isSunday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(`${dateStr}T00:00:00`);
    return d.getDay() === 0;
  };

  const sendToWhatsApp = (data: {
    name: string;
    phone: string;
    preferredDatetime: string;
    reason: string;
    isSundayRequest?: boolean;
  }) => {
    const sundayNote = data.isSundayRequest
      ? "\n\n⚠️ *Note: This is a Sunday appointment request. Patient is requesting a prior call to confirm availability.*"
      : "";
    const formatted = `*New Appointment Request*\n\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Preferred Date & Time:* ${data.preferredDatetime}\n*Reason for Visit:* ${data.reason}${sundayNote}`;
    const waUrl = `https://wa.me/919922866669?text=${encodeURIComponent(formatted)}`;
    window.open(waUrl, "_blank");
  };

  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      preferredDatetime: string;
      reason: string;
      isSundayRequest?: boolean;
    }) => {
      // Try to save to backend in background — never block the user flow
      try {
        if (actor) {
          await actor
            .submitAppointmentRequest(
              data.name,
              data.phone,
              "",
              data.preferredDatetime,
              data.reason,
            )
            .catch(() => {
              // Silently ignore backend errors
            });
        }
      } catch {
        // Never surface backend errors to the user
      }
      return data;
    },
    onSuccess: () => {
      setSuccess(true);
      formRef.current?.reset();
      setSelectedDate("");
      setSelectedTime("");
    },
    onError: () => {
      // Even if somehow an error occurs, treat it as success
      // since WhatsApp already received the message
      setSuccess(true);
      formRef.current?.reset();
      setSelectedDate("");
      setSelectedTime("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const preferredDatetime =
      selectedDate && selectedTime
        ? `${selectedDate} at ${formatTimeSlot(selectedTime)}`
        : (fd.get("preferredDatetime") as string);
    const submissionData = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      preferredDatetime,
      reason: fd.get("reason") as string,
      isSundayRequest: isSunday(selectedDate),
    };
    // Open WhatsApp immediately as a direct user gesture (avoids popup blockers)
    sendToWhatsApp(submissionData);
    // Always mark as success immediately — WhatsApp already has the data
    setSuccess(true);
    formRef.current?.reset();
    setSelectedDate("");
    setSelectedTime("");
    // Also try to save to backend in background (fire-and-forget)
    mutation.mutate(submissionData);
  };

  return (
    <section id="appointment" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-10"
        >
          <motion.div variants={fadeUp} className="text-center">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Take the First Step
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Request an Appointment
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              Fill out the form below and we'll contact you shortly to confirm
              your booking.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="w-full">
            <Card className="border-border/60 shadow-xl">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4 py-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-foreground">
                        Request Submitted!
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Your appointment request has been submitted! Your
                        details have been sent to the clinic via WhatsApp. We'll
                        contact you shortly to confirm.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="mt-4 text-primary text-sm font-semibold hover:underline"
                      >
                        Submit another request
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      ref={formRef}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-5"
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="name"
                            className="font-semibold text-sm text-foreground"
                          >
                            Full Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            required
                            disabled={mutation.isPending}
                            className="border-input focus:border-primary"
                            autoComplete="name"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label
                            htmlFor="phone"
                            className="font-semibold text-sm text-foreground"
                          >
                            Phone Number{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Your phone number"
                            required
                            disabled={mutation.isPending}
                            className="border-input focus:border-primary"
                            autoComplete="tel"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="font-semibold text-sm text-foreground">
                          Preferred Date &amp; Time{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <Input
                              id="preferredDate"
                              name="preferredDate"
                              type="date"
                              required
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              disabled={mutation.isPending}
                              className="border-input focus:border-primary"
                              min={new Date().toISOString().split("T")[0]}
                            />
                          </div>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            required
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            disabled={mutation.isPending}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select time</option>
                            <optgroup label="Morning (8:00 AM – 1:00 PM)">
                              {TIME_SLOTS.filter(
                                (s) => Number.parseInt(s) < 13,
                              ).map((slot) => (
                                <option key={slot} value={slot}>
                                  {formatTimeSlot(slot)}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Evening (4:00 PM – 6:00 PM)">
                              {TIME_SLOTS.filter(
                                (s) => Number.parseInt(s) >= 16,
                              ).map((slot) => (
                                <option key={slot} value={slot}>
                                  {formatTimeSlot(slot)}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        {/* Sunday special notice */}
                        <AnimatePresence>
                          {isSunday(selectedDate) && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.98 }}
                              transition={{ duration: 0.25 }}
                              className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex flex-col gap-3"
                              role="alert"
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-amber-500 text-xl leading-none mt-0.5">
                                  📅
                                </span>
                                <div className="flex flex-col gap-1">
                                  <p className="text-amber-900 font-bold text-sm leading-snug">
                                    Sunday: Prior Call Appointment Only
                                  </p>
                                  <p className="text-amber-700 text-sm leading-relaxed">
                                    Sunday appointments are by prior call only.
                                    Please call or WhatsApp Dr. Kareem to
                                    confirm your slot before submitting this
                                    form.
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                <a
                                  href="tel:+919922866669"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors shadow-sm"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call Now: 9922866669
                                </a>
                                <a
                                  href="https://wa.me/919922866669?text=Hello%20Dr.%20Kareem%2C%20I%20would%20like%20to%20schedule%20an%20appointment%20on%20Sunday.%20Please%20let%20me%20know%20the%20available%20timings.%20Thank%20you."
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20b858] text-white text-sm font-bold transition-colors shadow-sm"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 flex-shrink-0"
                                    aria-hidden="true"
                                  >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                  </svg>
                                  WhatsApp for Sunday Slot
                                </a>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="reason"
                          className="font-semibold text-sm text-foreground"
                        >
                          Reason for Visit{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="reason"
                          name="reason"
                          placeholder="Briefly describe your pain or condition (e.g., lower back pain, sports injury, post-surgery recovery...)"
                          required
                          disabled={mutation.isPending}
                          rows={4}
                          className="border-input focus:border-primary resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="btn-gold w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-base shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Book My Appointment
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-muted-foreground">
                        By submitting, you agree to be contacted by our clinic
                        staff to confirm your appointment.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/uploads/Logo-KC-1.jpg"
                alt="Kareem's Physiotherapy Clinic"
                className="h-14 w-14 object-contain"
                loading="eager"
                decoding="sync"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Expert musculoskeletal care in PCMC, Pune. Restoring movement,
              enhancing lives.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Quick Links</h4>
            {[
              { label: "Home", id: "home" },
              { label: "About Dr. Kareem", id: "about" },
              { label: "Treatments", id: "treatments" },
              { label: "Physiotherapy", id: "physiotherapy" },
              { label: "Conditions Treated", id: "conditions" },
              { label: "Gallery", id: "gallery" },
              { label: "Testimonials", id: "testimonials" },
              { label: "Contact", id: "contact" },
            ].map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => {
                  playClickSound();
                  scrollTo(link.id);
                }}
                className="text-white/60 hover:text-white text-sm text-left transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://youtube.com/@kareems_physiotherapy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#FF0000]/80 hover:text-[#FF0000] text-sm transition-colors"
            >
              <YouTubeIcon className="w-3.5 h-3.5" />
              YouTube Channel
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-white text-sm">Contact</h4>
            <a
              href="tel:+919922866669"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 99228 66669
            </a>
            <a
              href="https://wa.me/919922866669"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#25D366]/80 hover:text-[#25D366] text-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:kareemsphysiotherapy@gmail.com"
              className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors break-all"
            >
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              kareemsphysiotherapy@gmail.com
            </a>
            <div className="flex items-start gap-2 text-white/60 text-sm">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              530/4 Blue Heaven, Jyotiba Nagar, Kalewadi Abhiyanta Colony,
              Chatrapati Shivaji Maharaj Chowk, Pune 411017
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/50 text-xs text-center">
            Copyright © {year} Kareem's Physiotherapy Clinic | All Rights
            Reserved
          </p>
          <p className="text-white/40 text-xs text-center">
            Built with{" "}
            <Heart className="inline w-3 h-3 text-rose-400 fill-current" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Gallery Section ─────────────────────────────────────────────────────────
const clinicInteriorPhotos = [
  {
    src: "/assets/uploads/2025-09-13-1--2.jpg",
    alt: "Fitness & exercise room inside clinic",
  },
  {
    src: "/assets/uploads/2025-09-13-2--3.jpg",
    alt: "Treatment room with therapy beds",
  },
  { src: "/assets/uploads/2025-09-13-4.jpg", alt: "Consultation room" },
  { src: "/assets/uploads/2025-07-15-5.jpg", alt: "Clinic exterior building" },
];

const clinicPromoPhotos = [
  {
    src: "/assets/uploads/2025-12-02-1.jpg",
    alt: "Stay Strong as a Family - Kareem's Physiotherapy Clinic",
  },
  {
    src: "/assets/uploads/2025-12-02-1--2.jpg",
    alt: "Dr. Asif Kareem - Physiotherapy Steps to Recovery",
  },
  { src: "/assets/uploads/2025-07-14-11.webp", alt: "Our services" },
  {
    src: "/assets/uploads/2024-12-20-12.webp",
    alt: "Conditions & treatments info",
  },
  {
    src: "/assets/uploads/2025-07-15-7.webp",
    alt: "Conditions treated poster",
  },
  { src: "/assets/uploads/2025-08-11-8.webp", alt: "Hijama camp poster" },
  { src: "/assets/uploads/2025-08-16-6.webp", alt: "Clinic chargesheet" },
  {
    src: "/assets/uploads/2025-11-13-9.webp",
    alt: "Dr. Kareem at CME Soldierathon event",
  },
];

// Real photos sourced directly from Kareem's Physiotherapy Clinic Google Business profile
// thumb: s200 for fast grid loading; full: high-res s1200 for lightbox
const googleBusinessPhotos = [
  {
    thumb:
      "https://lh3.googleusercontent.com/ep6kCWXTCuEEqUTGXO3akgb3PoFYYgR7ETcaUtNczjfV5fScPxdJQrpsuXpPP0knjr4ZFrb_5uBbsUPmUA=s200",
    full: "https://lh3.googleusercontent.com/ep6kCWXTCuEEqUTGXO3akgb3PoFYYgR7ETcaUtNczjfV5fScPxdJQrpsuXpPP0knjr4ZFrb_5uBbsUPmUA=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/F08E8ZkQxvwM-FwepVSJliuPuRWe5r2g1-CDiik_QYPHWlEl7kVFPTSimqGYo2dgYdblGGuJegr7Dng4tQ=s200",
    full: "https://lh3.googleusercontent.com/F08E8ZkQxvwM-FwepVSJliuPuRWe5r2g1-CDiik_QYPHWlEl7kVFPTSimqGYo2dgYdblGGuJegr7Dng4tQ=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/A5W13dhGUTDod94XoXdNbEAzAMdzACtLcKgKGmWGfawp_LqYdddb_8sxY6QwgHpvZ3tI19KeP6eYxWul7g=s200",
    full: "https://lh3.googleusercontent.com/A5W13dhGUTDod94XoXdNbEAzAMdzACtLcKgKGmWGfawp_LqYdddb_8sxY6QwgHpvZ3tI19KeP6eYxWul7g=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/gHy8mXHL6HS2OSXIGkZd75hMzjnauINGRfFBUntpSgRps2NE2GZt2Mkrw8241oSfgYtvrTclBH-LEE9uyw=s200",
    full: "https://lh3.googleusercontent.com/gHy8mXHL6HS2OSXIGkZd75hMzjnauINGRfFBUntpSgRps2NE2GZt2Mkrw8241oSfgYtvrTclBH-LEE9uyw=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/9wxZINQOu8Z1TnMTQb-N9xGhY2_1l-B1cYJxLvroVchdt7pKe4LNKilfEzCjy96dSuFGMBjaQUixY2ShyA=s200",
    full: "https://lh3.googleusercontent.com/9wxZINQOu8Z1TnMTQb-N9xGhY2_1l-B1cYJxLvroVchdt7pKe4LNKilfEzCjy96dSuFGMBjaQUixY2ShyA=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/WqxG0HL8QYgDS5xkVsfQbHhs0DgkFsk5hIrX5evSyaMUGNatz9n6pQw-gApW40lwEcVoUKrWqKw9xZZpwQ=s200",
    full: "https://lh3.googleusercontent.com/WqxG0HL8QYgDS5xkVsfQbHhs0DgkFsk5hIrX5evSyaMUGNatz9n6pQw-gApW40lwEcVoUKrWqKw9xZZpwQ=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/PkJdg9196AuKLHTDefl782MHkBpcfEvwnLHcLhg8noy629I6jev2JFj7U7SPUMiImc_HAb6bSRSFdNeuGA=s200",
    full: "https://lh3.googleusercontent.com/PkJdg9196AuKLHTDefl782MHkBpcfEvwnLHcLhg8noy629I6jev2JFj7U7SPUMiImc_HAb6bSRSFdNeuGA=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/iYbM4yijuwR7gSugZJvK6JLu-uh_dxYuymOv4oCXpZUidVSJXTOePKja8MBO0nrD9HLuD49yXiaBcUnG1Q=s200",
    full: "https://lh3.googleusercontent.com/iYbM4yijuwR7gSugZJvK6JLu-uh_dxYuymOv4oCXpZUidVSJXTOePKja8MBO0nrD9HLuD49yXiaBcUnG1Q=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/eCI9aBSTw1IMLFabR_BtQvE1CzOeS_X-fCHoGTsAfVTt3Zy3qdGDToYgnhrhkj2obEnszDpoCR4D5iFRaQ=s200",
    full: "https://lh3.googleusercontent.com/eCI9aBSTw1IMLFabR_BtQvE1CzOeS_X-fCHoGTsAfVTt3Zy3qdGDToYgnhrhkj2obEnszDpoCR4D5iFRaQ=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/bSCGyLmmjgvqJ2tKAF0I9xMOQl7eKes0OkPcTB0JjvxmbDjyW6YV4M1DYizZimMVZ_GhyU4aYHL5jNWpSA=s200",
    full: "https://lh3.googleusercontent.com/bSCGyLmmjgvqJ2tKAF0I9xMOQl7eKes0OkPcTB0JjvxmbDjyW6YV4M1DYizZimMVZ_GhyU4aYHL5jNWpSA=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/upZA_z05h0WTgyiNfkCNVtD3Dj-FnjUhNy3mthnZwA2n9TWcj9qtLjqHr0p0kSMdrB3hC2ePHNkEhQSrWA=s200",
    full: "https://lh3.googleusercontent.com/upZA_z05h0WTgyiNfkCNVtD3Dj-FnjUhNy3mthnZwA2n9TWcj9qtLjqHr0p0kSMdrB3hC2ePHNkEhQSrWA=s1200",
  },
  {
    thumb:
      "https://lh3.googleusercontent.com/Hvau1zaHCl3lSVc-9CfmIUMTiXvrdM7tkSgEYDoQ259DdliwmRFnBjk5r2bI7qaKUPxlq4S4Xc1i01Tosg=s200",
    full: "https://lh3.googleusercontent.com/Hvau1zaHCl3lSVc-9CfmIUMTiXvrdM7tkSgEYDoQ259DdliwmRFnBjk5r2bI7qaKUPxlq4S4Xc1i01Tosg=s1200",
  },
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Lazy-loading image with skeleton placeholder for fast perceived performance
function LazyImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function GallerySection() {
  const [showMoreGoogle, setShowMoreGoogle] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Inside Our Clinic
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Our Clinic Gallery
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              A look inside Kareem's Physiotherapy Clinic
            </p>
          </motion.div>

          {/* ── Clinic Interior Photos ── */}
          <motion.div variants={fadeUp} className="w-full">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
              Our Clinic
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {clinicInteriorPhotos.map((photo, i) => (
                <motion.div
                  key={photo.src}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setLightboxSrc(photo.src)}
                  className="aspect-[4/3] overflow-hidden rounded-xl border border-border/40 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                >
                  <LazyImage
                    src={photo.src}
                    alt={photo.alt}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority={i < 4}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Promotional Materials ── */}
          <motion.div variants={fadeUp} className="w-full">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
              Promotional Materials
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {clinicPromoPhotos.map((photo) => (
                <motion.div
                  key={photo.src}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setLightboxSrc(photo.src)}
                  className="aspect-[4/3] overflow-hidden rounded-xl border border-border/40 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                >
                  <LazyImage
                    src={photo.src}
                    alt={photo.alt}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Show More Google Business Photos ── */}
          <motion.div
            variants={fadeUp}
            className="w-full flex flex-col items-center gap-6"
          >
            <button
              type="button"
              onClick={() => setShowMoreGoogle((prev) => !prev)}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-border/60 bg-white hover:bg-secondary/60 text-sm font-semibold text-foreground transition-all shadow-sm hover:shadow-md group"
            >
              <GoogleIcon />
              <span>{showMoreGoogle ? "Show Less" : "Show More Photos"}</span>
              <motion.span
                animate={{ rotate: showMoreGoogle ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex"
              >
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.span>
            </button>

            <AnimatePresence>
              {showMoreGoogle && (
                <motion.div
                  key="google-photos"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full overflow-hidden"
                >
                  <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
                    More Clinic Photos
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {googleBusinessPhotos.map((photo, index) => (
                      <motion.div
                        key={photo.thumb}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setLightboxSrc(photo.full)}
                        className="aspect-[4/3] overflow-hidden rounded-xl border border-border/40 cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <LazyImage
                          src={photo.thumb}
                          alt={`Kareem's Physiotherapy Clinic — photo ${index + 1}`}
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* View All Photos CTA */}
          <motion.div variants={fadeUp}>
            <a
              href="https://www.google.com/search?q=kareem%27s+physiotherapy+clinic%2C+relieve+pain+and+recover+faster&oq=k&gs_lcrp=EgZjaHJvbWUqCAgBEEUYJxg7MgYIABBFGDwyCAgBEEUYJxg7MgYIAhBFGDsyBggDEEUYOTIGCAQQRRg7MgYIBRAjGCcyBggGEEUYPDIGCAcQRRg80gEIMTM4NmowajSoAgGwAgHxBTSZVWSqQwqP8QU0mVVkqkMKjw&sourceid=chrome&ie=UTF-8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-border/60 bg-white hover:bg-secondary/60 text-sm font-semibold text-foreground transition-all shadow-sm hover:shadow-md group"
            >
              <GoogleIcon />
              <span>View All Photos on Google</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxSrc(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              key={lightboxSrc}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={lightboxSrc}
              alt="Enlarged clinic gallery view"
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[90vh] w-full object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Patient Testimonials Section ─────────────────────────────────────────────
const testimonialVideos = [
  {
    title: "Patient Recovery Story",
    embedUrl: "https://www.youtube.com/embed/lINJT3FWFxQ",
  },
  {
    title: "Patient Testimonial",
    embedUrl: "https://www.youtube.com/embed/o15iPgHxXyQ",
  },
  {
    title: "Patient Testimonial",
    embedUrl: "https://www.youtube.com/embed/ufpQEPi3LGE",
  },
];

function PatientTestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-center gap-12"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center max-w-2xl">
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Real Patient Stories
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Patient Testimonials
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              Hear from our patients in their own words
            </p>
          </motion.div>

          {/* Video grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
          >
            {testimonialVideos.map((video) => (
              <motion.div key={video.embedUrl} variants={fadeUp}>
                <Card className="border-border/60 bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="absolute inset-0 w-full h-full rounded-t-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-bold text-foreground leading-snug">
                      {video.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Kareem's Physiotherapy Clinic
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* YouTube channel CTA */}
          <motion.div variants={fadeUp}>
            <a
              href="https://youtube.com/@kareems_physiotherapy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FF0000] hover:bg-[#cc0000] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg group"
            >
              <YouTubeIcon className="w-4 h-4" />
              View More on YouTube
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── WhatsApp Floating Button ────────────────────────────────────────────────
function WhatsAppButton() {
  const waUrl = "https://wa.me/919922866669";
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold text-sm px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      Chat on WhatsApp
    </a>
  );
}

// ─── Intro Splash ────────────────────────────────────────────────────────────
function IntroSplash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // Show splash for 2.8s total, then trigger exit
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.18 0.06 220), oklch(0.12 0.04 225))",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Outer pulsing glow ring */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(circle, oklch(0.60 0.20 195 / 0.28) 0%, transparent 65%)",
        }}
      />
      {/* Mid glow layer */}
      <div
        className="absolute w-[380px] h-[380px] rounded-full animate-pulse"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.22 190 / 0.40) 0%, transparent 62%)",
          animationDelay: "0.4s",
        }}
      />
      {/* Inner bright glow */}
      <div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.24 185 / 0.65) 0%, transparent 58%)",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img
          src="/assets/uploads/Logo-KC-1.jpg"
          alt="Kareem's Physiotherapy Clinic"
          className="w-52 h-52 object-contain drop-shadow-2xl"
          fetchPriority="high"
          decoding="sync"
        />

        {/* Clinic name */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-white font-display font-bold text-xl sm:text-2xl tracking-wide text-center">
            Kareem's Physiotherapy Clinic
          </p>
          <p className="text-white/60 text-sm tracking-widest uppercase">
            Relieve Pain · Restore Life
          </p>
        </div>

        {/* Static underline */}
        <div
          className="h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"
          style={{ width: 200 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Global click sound hook ─────────────────────────────────────────────────
function useGlobalClickSound() {
  useEffect(() => {
    const INTERACTIVE = [
      "button",
      "a",
      '[role="button"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[role="option"]',
      "summary",
      "label",
      "select",
      "input[type=radio]",
      "input[type=checkbox]",
    ].join(",");

    function handleClick(e: MouseEvent) {
      const target = e.target as Element;
      if (target?.closest(INTERACTIVE)) {
        playClickSound();
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, []);
}

// ─── App Root ────────────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  useGlobalClickSound();

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroSplash onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="min-h-screen font-body">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <TreatmentsSection />
          <PhysiotherapySection />
          <ConditionsTreatedSection />
          <WhyChooseUsSection />
          <ReviewsSection />
          <GallerySection />
          <PatientTestimonialsSection />
          <ContactSection />
          <AppointmentSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
}
