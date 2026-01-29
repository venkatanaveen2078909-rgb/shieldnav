import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, Share2, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SOSButtonProps {
  className?: string;
}

export function SOSButton({ className }: SOSButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isActive) {
      handleEmergencyTrigger();
    }
    return () => clearInterval(interval);
  }, [isActive, countdown]);

  const handleEmergencyTrigger = () => {
    setIsActive(false);
    setIsOpen(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const message = `Emergency: Accident help needed! My live location: ${mapsLink}`;

        if (navigator.share) {
          navigator.share({
            title: 'Emergency Help Needed!',
            text: message,
            url: mapsLink
          }).catch((error) => {
            console.error("Error sharing:", error);
            // Fallback if share fails (e.g. cancelled)
            copyToClipboard(message);
          });
        } else {
          copyToClipboard(message);
        }
      }, (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Could not fetch your location.",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "EMERGENCY ALERT",
      description: "Live location link copied to clipboard. Share immediately!",
      variant: "destructive",
      duration: 10000,
    });
  };

  const startEmergency = () => {
    setIsOpen(true);
    setIsActive(true);
    setCountdown(5);
  };

  const cancelEmergency = () => {
    setIsActive(false);
    setCountdown(5);
  };

  return (
    <>
      {/* Floating SOS Trigger */}
      <motion.div
        className={`fixed z-50 pointer-events-auto ${className || "bottom-10 right-10"}`}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={startEmergency}
          className="relative group flex items-center justify-center w-20 h-20 rounded-full bg-destructive text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(239,68,68,0.6)]"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-[ping_2s_infinite] group-hover:opacity-30" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-spin-slow" />
          <ShieldAlert className="h-10 w-10 fill-current relative z-10" />
        </button>
      </motion.div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
            >
              {/* Header */}
              <div className="bg-destructive p-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <AlertTriangle className="h-14 w-14 mx-auto mb-3 animate-bounce" />
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">Emergency!</h2>
                <p className="text-white/90 font-bold text-sm">Alerting System in {countdown}s</p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="text-center space-y-3">
                  <p className="text-xl font-black text-white leading-tight">
                    Are you in danger?
                  </p>
                  <p className="text-sm text-zinc-400 font-medium">
                    We will instantly transmit your live coordinates to emergency services and your primary safety contacts.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 border-white/5 hover:border-red-500/50 transition-all rounded-3xl"
                    onClick={() => window.open('tel:100')}
                  >
                    <div className="p-2 rounded-xl bg-red-500/20">
                      <Phone className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xs">Police (100)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-white/5 hover:bg-blue-500/10 hover:text-blue-500 border-white/5 hover:border-blue-500/50 transition-all rounded-3xl"
                    onClick={() => window.open('tel:108')}
                  >
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <Phone className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xs">Ambulance (108)</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full h-16 text-lg font-black bg-destructive hover:bg-destructive/90 text-white shadow-2xl shadow-destructive/40 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl"
                    onClick={handleEmergencyTrigger}
                  >
                    <Share2 className="mr-3 h-6 w-6" />
                    SEND ALERT NOW
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full h-12 font-bold text-zinc-500 hover:text-white transition-colors"
                    onClick={() => {
                      setIsOpen(false);
                      cancelEmergency();
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel - I am Safe
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                className="h-2 bg-destructive"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
