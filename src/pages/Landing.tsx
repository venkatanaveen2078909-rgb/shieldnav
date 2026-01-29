import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Shield,
    MapPin,
    Navigation,
    AlertTriangle,
    Radio,
    Phone,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccidentStatsBanner } from "@/components/AccidentStatsBanner";
import shieldNavLogo from "@/assets/shieldnav-logo-large.png";

export default function Landing() {
    const features = [
        {
            icon: <Shield className="h-6 w-6 text-emerald-500" />,
            title: "AI Risk Prediction",
            desc: "Advanced algorithms analyze historical accident data to predict and avoid high-risk zones."
        },
        {
            icon: <MapPin className="h-6 w-6 text-blue-500" />,
            title: "Smart Routing",
            desc: "Choose between Safest, Balanced, and Fastest routes tailored to your comfort level."
        },
        {
            icon: <Radio className="h-6 w-6 text-amber-500" />,
            title: "Voice Alerts",
            desc: "Receive real-time audio warnings when approaching known accident hotspots."
        },
        {
            icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
            title: "Hotspot Mapping",
            desc: "Visualize danger zones with detailed heatmaps of accident frequency and cause."
        },
        {
            icon: <Phone className="h-6 w-6 text-rose-500" />,
            title: "Emergency SOS",
            desc: "One-tap emergency broadcast with live location sharing to your trusted contacts."
        },
        {
            icon: <Navigation className="h-6 w-6 text-indigo-500" />,
            title: "Live Navigation",
            desc: "Turn-by-turn guidance that actively steers you away from developing hazards."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={shieldNavLogo} alt="GuardNav" className="h-10 w-auto" />
                        <span className="text-xl font-bold tracking-tight hidden sm:block">GuardNav</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/auth?mode=login">
                            <Button variant="ghost" className="font-medium">Log in</Button>
                        </Link>
                        <Link to="/auth?mode=signup">
                            <Button className="font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full px-6">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border/50 border border-border backdrop-blur-sm mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">Live Safety Data Active (India)</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black font-heading tracking-tight mb-6 leading-[1.1]">
                            Navigate India's Roads <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 animate-gradient">
                                With Confidence
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            The first AI-powered navigation system designed specifically for Indian road conditions.
                            We prioritize your safety over mere speed.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/auth">
                                <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold shadow-xl shadow-primary/25 hover:scale-105 transition-transform">
                                    Start Your Journey
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border bg-background/50 backdrop-blur-sm hover:bg-muted/50">
                                View Live Map
                            </Button>
                        </div>
                    </motion.div>

                    {/* Live Stats Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-16 w-full max-w-2xl mx-auto"
                    >
                        <AccidentStatsBanner />
                    </motion.div>

                    {/* Annual Stats Context */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mt-12 max-w-4xl mx-auto"
                    >
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-rose-500 mb-2">480,583</h2>
                                    <p className="text-zinc-400 font-medium">Road accidents reported annually in India</p>
                                </div>
                                <div className="h-px w-full md:w-px md:h-20 bg-white/10" />
                                <div>
                                    <p className="text-lg md:text-xl font-medium text-white max-w-sm">
                                        <span className="text-emerald-400 font-bold">GuardNav</span> helps reduce this risk by guiding you through safer, verified routes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-muted/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black font-heading tracking-tight mb-4">
                            Complete Safety Ecosystem
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to stay safe on the road, powered by real-time data and artificial intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-background rounded-2xl p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-border"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl lg:text-4xl font-black font-heading tracking-tight mb-8">
                                How GuardNav Protects You
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { number: "01", title: "Analyze", desc: "We scan your intended route against our database of 50,000+ accident hotspots." },
                                    { number: "02", title: "Optimize", desc: "Our engine solves for the lowest risk probability, not just distance." },
                                    { number: "03", title: "Guide", desc: "You receive vocal warnings for unavoidable risks and real-time support." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6">
                                        <span className="text-5xl font-black text-muted/20">{step.number}</span>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                            <div className="relative glass-card bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Safest Route</span>
                                        <span className="font-bold">96% Score</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-400">
                                        <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Standard GPS</span>
                                        <span className="font-bold">72% Score</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/10 text-center text-xs text-zinc-500 uppercase tracking-widest">
                                        Risk Analysis Complete
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-zinc-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black font-heading mb-4">Why Switch?</h2>
                        <p className="text-zinc-400 max-w-xl mx-auto">See how GuardNav compares to the navigation apps you use every day.</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden">
                        <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5 font-bold">
                            <div>Feature</div>
                            <div className="text-center text-zinc-500">Traditional GPS</div>
                            <div className="text-center text-emerald-400">GuardNav</div>
                        </div>
                        {[
                            { name: "Traffic Updates", gps: true, gn: true },
                            { name: "Turn-by-Turn Nav", gps: true, gn: true },
                            { name: "Accident Hotspot Alerts", gps: false, gn: true },
                            { name: "Route Safety Scoring", gps: false, gn: true },
                            { name: "Night-Time Risk Adjustment", gps: false, gn: true },
                            { name: "Emergency SOS Broadcast", gps: false, gn: true },
                        ].map((row, i) => (
                            <div key={i} className="grid grid-cols-3 p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center">
                                <div className="font-medium">{row.name}</div>
                                <div className="flex justify-center">
                                    {row.gps ? <CheckCircle2 className="h-5 w-5 text-zinc-600" /> : <XCircle className="h-5 w-5 text-zinc-700" />}
                                </div>
                                <div className="flex justify-center">
                                    {row.gn && <CheckCircle2 className="h-6 w-6 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight">
                            Ready for a Safer Journey?
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Join thousands of drivers making the switch to safety-first navigation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth?mode=signup">
                                <Button size="lg" className="h-16 px-10 text-xl rounded-full font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                                    Get Started Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background border-t border-border py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <img src={shieldNavLogo} alt="Logo" className="h-8 w-auto" />
                                <span className="font-bold text-lg">GuardNav</span>
                            </div>
                            <p className="text-muted-foreground max-w-xs">
                                Empowering drivers with AI-driven insights for safer roads across India.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="#" className="hover:text-primary">Features</Link></li>
                                <li><Link to="#" className="hover:text-primary">Safety Data</Link></li>
                                <li><Link to="#" className="hover:text-primary">Download</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link to="#" className="hover:text-primary">About Us</Link></li>
                                <li><Link to="#" className="hover:text-primary">Contact</Link></li>
                                <li><Link to="#" className="hover:text-primary">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
                        <p>&copy; 2024 GuardNav. Safety First.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
