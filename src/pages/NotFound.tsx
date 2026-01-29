import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import shieldNavLogo from "@/assets/shieldnav-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-destructive/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg glass-card p-12 rounded-[3rem] border-white/10 relative z-10 shadow-2xl"
      >
        <img
          src={shieldNavLogo}
          alt="ShieldNav"
          className="h-28 w-auto mx-auto mb-8 drop-shadow-2xl opacity-80"
        />
        <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-zinc-300 mb-4 font-heading">
          Off-Route Detected
        </h2>
        <p className="text-zinc-500 mb-10 text-lg font-medium leading-relaxed">
          The path you're tracking doesn't seem to exist in our safer database.
          Let's recalculate and get you back into the safe zone.
        </p>
        <Link to="/">
          <Button size="lg" className="h-16 px-10 text-lg font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 transition-all hover:scale-[1.05] active:scale-[0.95]">
            <Home className="h-6 w-6 mr-3" />
            Recalculate to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
