import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Ban,
  Calendar,
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  LogOut,
  MessageSquare,
  Phone,
  RefreshCw,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import type { AppointmentRequest } from "./backend";
import { useActor } from "./hooks/useActor";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "pending" | "confirmed" | "cancelled" | "rescheduled";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  // ts is in nanoseconds
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "rescheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-amber-100 text-amber-800 border-amber-200";
  }
}

function buildWhatsAppMessage(
  appt: AppointmentRequest,
  customNote?: string,
): string {
  const base = `Hello ${appt.name}, this is Kareem's Physiotherapy Clinic. Your appointment is scheduled for ${appt.preferredDatetime}.`;
  return customNote ? `${base} ${customNote}` : base;
}

// ─── PIN Gate ──────────────────────────────────────────────────────────────────

function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === "1234") {
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 1500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center admin-bg">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-80 shadow-2xl border-0">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h1
                  className="text-xl font-semibold text-foreground"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  }}
                >
                  Admin Access
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Kareem's Physiotherapy Clinic
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  maxLength={4}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className={`text-center text-lg tracking-widest h-12 ${error ? "border-destructive ring-destructive" : ""}`}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-xs text-center mt-1"
                  >
                    Incorrect PIN. Please try again.
                  </motion.p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={pin.length !== 4}
              >
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  icon: Icon,
  colorClass,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Appointment Card ──────────────────────────────────────────────────────────

function AppointmentCard({ appt }: { appt: AppointmentRequest }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState(appt.notes || "");
  const [showNotes, setShowNotes] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDatetime, setNewDatetime] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async ({ status, note }: { status: string; note: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateAppointmentStatus(appt.id, status, note);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(`Appointment ${variables.status}`);
    },
    onError: () => toast.error("Failed to update appointment"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deleteAppointmentRequest(appt.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment deleted");
    },
    onError: () => toast.error("Failed to delete appointment"),
  });

  const isPending = updateMutation.isPending || deleteMutation.isPending;

  function handleConfirm() {
    updateMutation.mutate({ status: "confirmed", note: notes });
  }

  function handleCancel() {
    updateMutation.mutate({ status: "cancelled", note: notes });
  }

  function handleReschedule() {
    if (!newDatetime) return;
    updateMutation.mutate({ status: "rescheduled", note: newDatetime });
    setShowReschedule(false);
    setNewDatetime("");
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    deleteMutation.mutate();
  }

  const whatsAppUrl = `https://wa.me/91${appt.phone}?text=${encodeURIComponent(buildWhatsAppMessage(appt))}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base leading-tight">
                  {appt.name}
                </h3>
                <a
                  href={`tel:${appt.phone}`}
                  className="flex items-center gap-1 text-sm text-primary hover:underline mt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  {appt.phone}
                </a>
              </div>
            </div>
            <Badge
              className={`text-xs font-medium px-2 py-0.5 border rounded-full ${getStatusColor(appt.status)}`}
              variant="outline"
            >
              {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
            </Badge>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0 text-primary/60" />
              <span className="truncate">
                {appt.preferredDatetime || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0 text-primary/60" />
              <span className="truncate">
                {formatTimestamp(appt.timestamp)}
              </span>
            </div>
            {appt.reason && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                <FileText className="w-4 h-4 flex-shrink-0 text-primary/60 mt-0.5" />
                <span>{appt.reason}</span>
              </div>
            )}
            {appt.notes && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-primary/60 mt-0.5" />
                <span className="italic">{appt.notes}</span>
              </div>
            )}
          </div>

          {/* Notes toggle */}
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showNotes ? "rotate-180" : ""}`}
            />
            Add/edit notes
          </button>

          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this appointment..."
                  className="text-sm resize-none h-20"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reschedule input */}
          <AnimatePresence>
            {showReschedule && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="New date & time (e.g. 15 Jan 2026, 10:00 AM)"
                    value={newDatetime}
                    onChange={(e) => setNewDatetime(e.target.value)}
                    className="text-sm flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReschedule}
                    disabled={!newDatetime || isPending}
                  >
                    Set
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowReschedule(false)}
                  >
                    ✕
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={handleConfirm}
              disabled={isPending || appt.status === "confirmed"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3 text-xs gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Confirm
            </Button>
            <Button
              size="sm"
              onClick={handleCancel}
              disabled={isPending || appt.status === "cancelled"}
              variant="destructive"
              className="h-8 px-3 text-xs gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => setShowReschedule(!showReschedule)}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule
            </Button>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="sm"
                className="bg-[#25D366] hover:bg-[#1ebe5a] text-white h-8 px-3 text-xs gap-1.5"
              >
                <SiWhatsapp className="w-3.5 h-3.5" />
                WhatsApp
              </Button>
            </a>
            <Button
              size="sm"
              variant={deleteConfirm ? "destructive" : "ghost"}
              onClick={handleDelete}
              disabled={isPending}
              className={`h-8 px-3 text-xs gap-1.5 ml-auto ${!deleteConfirm ? "text-muted-foreground hover:text-destructive" : ""}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleteConfirm ? "Tap again to confirm" : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

function AppointmentSkeleton() {
  return (
    <Card className="border border-border">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { actor, isFetching } = useActor();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useQuery<AppointmentRequest[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      const results = await actor.getAllAppointmentRequests();
      return [...results].sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });

  const filtered =
    activeTab === "all"
      ? appointments
      : appointments.filter((a) => a.status.toLowerCase() === activeTab);

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status.toLowerCase() === "pending")
      .length,
    confirmed: appointments.filter(
      (a) => a.status.toLowerCase() === "confirmed",
    ).length,
    cancelled: appointments.filter(
      (a) => a.status.toLowerCase() === "cancelled",
    ).length,
  };

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "confirmed", label: "Confirmed", count: stats.confirmed },
    { id: "cancelled", label: "Cancelled", count: stats.cancelled },
    {
      id: "rescheduled",
      label: "Rescheduled",
      count: appointments.filter(
        (a) => a.status.toLowerCase() === "rescheduled",
      ).length,
    },
  ];

  return (
    <div className="min-h-screen admin-bg">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/Logo-KC-1.jpg"
              alt="Kareem's Physiotherapy Clinic"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1
                className="text-base font-bold text-foreground leading-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}
              >
                Appointment Planner
              </h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total"
            count={stats.total}
            icon={Users}
            colorClass="bg-primary/10 text-primary"
          />
          <StatCard
            label="Pending"
            count={stats.pending}
            icon={AlertCircle}
            colorClass="bg-amber-100 text-amber-700"
          />
          <StatCard
            label="Confirmed"
            count={stats.confirmed}
            icon={CalendarCheck}
            colorClass="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            label="Cancelled"
            count={stats.cancelled}
            icon={Ban}
            colorClass="bg-red-100 text-red-700"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-muted-foreground hover:bg-secondary border border-border"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-white/25 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <AppointmentSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-8 text-center">
              <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium">
                Failed to load appointments
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Please refresh the page
              </p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-white">
            <CardContent className="p-12 text-center">
              <CalendarCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {activeTab === "all"
                  ? "No appointments yet"
                  : `No ${activeTab} appointments`}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {activeTab === "all"
                  ? "New appointment requests will appear here"
                  : "Switch to 'All' to see all appointments"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {filtered.map((appt) => (
                <AppointmentCard key={String(appt.id)} appt={appt} />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/60 pb-4">
          Auto-refreshes every 30 seconds · Kareem's Physiotherapy Clinic Admin
        </p>
      </main>
      <Toaster />
    </div>
  );
}

// ─── Main AdminPage ─────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PinGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />;
}
