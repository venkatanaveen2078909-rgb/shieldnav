import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Phone, Mail, User, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import shieldNavLogo from "@/assets/shieldnav-logo-large.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { contacts, isLoading, addContact, deleteContact } = useEmergencyContacts();

  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    contact_type: "phone" as "phone" | "email",
    value: "",
    is_primary: false,
  });

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addContact.mutateAsync(newContact);
      toast({
        title: "Contact Added",
        description: `${newContact.name} has been added to your emergency contacts.`,
      });
      setNewContact({
        name: "",
        contact_type: "phone",
        value: "",
        is_primary: false,
      });
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    try {
      await deleteContact.mutateAsync(id);
      toast({
        title: "Contact Removed",
        description: `${name} has been removed from your emergency contacts.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-5">
            <img src={shieldNavLogo} alt="ShieldNav" className="h-20 w-auto drop-shadow-2xl" />
            <h1 className="font-black text-3xl tracking-tight text-white font-heading">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 glass-card border-white/10 rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="flex items-center gap-6 mb-8">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(0,102,255,0.1)]">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white font-heading">
                  {user?.user_metadata?.full_name || "User"}
                </h2>
                <p className="text-zinc-400 font-medium">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full h-14 rounded-2xl border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold transition-all"
            >
              Sign Out Securely
            </Button>
          </Card>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 glass-card border-white/10 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/20 rounded-2xl border border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl font-heading">
                    Safety Network
                  </h3>
                  <p className="text-sm text-zinc-400 font-medium">
                    Priority emergency contacts
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setIsAdding(true)}
                disabled={isAdding}
                className="rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Contact
              </Button>
            </div>

            {/* Add Contact Form */}
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-muted/50 rounded-xl space-y-4"
              >
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Contact name"
                    value={newContact.name}
                    onChange={(e) =>
                      setNewContact({ ...newContact, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Type</Label>
                  <Select
                    value={newContact.contact_type}
                    onValueChange={(value: "phone" | "email") =>
                      setNewContact({ ...newContact, contact_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {newContact.contact_type === "phone"
                      ? "Phone Number"
                      : "Email Address"}
                  </Label>
                  <Input
                    placeholder={
                      newContact.contact_type === "phone"
                        ? "+91 98765 43210"
                        : "contact@example.com"
                    }
                    value={newContact.value}
                    onChange={(e) =>
                      setNewContact({ ...newContact, value: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddContact}
                    disabled={addContact.isPending}
                    className="flex-1"
                  >
                    {addContact.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Contact"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Contacts List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No emergency contacts added yet.</p>
                <p className="text-sm mt-1">
                  Add contacts to quickly share your location in emergencies.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background rounded-lg">
                        {contact.contact_type === "phone" ? (
                          <Phone className="h-4 w-4 text-primary" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {contact.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contact.value}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteContact(contact.id, contact.name)
                      }
                      className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <img
              src={shieldNavLogo}
              alt="ShieldNav"
              className="h-24 w-auto mx-auto mb-6 drop-shadow-xl"
            />
            <h4 className="font-semibold text-foreground">ShieldNav</h4>
            <p className="text-sm text-muted-foreground">
              AI-Powered Accident-Aware Route Planner
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Version 1.0.0
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
