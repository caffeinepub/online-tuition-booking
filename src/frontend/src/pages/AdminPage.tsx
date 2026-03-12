import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAllBookings,
  useCancelBooking,
  useClaimFirstAdmin,
  useIsAdminAssigned,
  useIsCallerAdmin,
} from "@/hooks/useQueries";
import {
  CalendarDays,
  KeyRound,
  Loader2,
  LogIn,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { Booking } from "../backend.d";

function statusColor(status: string) {
  if (status === "confirmed" || status === "active")
    return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

export function AdminPage() {
  const [filterDate, setFilterDate] = useState("");
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: isAdminAssigned, isLoading: assignedLoading } =
    useIsAdminAssigned();
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings();
  const cancelBooking = useCancelBooking();
  const claimAdmin = useClaimFirstAdmin();

  const isLoggedIn = !!identity;
  const isLoading = adminLoading || assignedLoading;

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  // State 1: Not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Admin Login</h2>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Sign in with Internet Identity to access the admin dashboard and
            manage LearnRight bookings.
          </p>
          <Button
            className="w-full"
            size="lg"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="admin.login_button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            {isLoggingIn ? "Connecting..." : "Login with Internet Identity"}
          </Button>
        </div>
      </div>
    );
  }

  // State 2: Logged in, no admin assigned yet — first-time setup
  if (!isAdmin && !isAdminAssigned) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md">
        <div className="rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">
            First-Time Setup
          </h2>
          <p className="text-muted-foreground mb-2 text-sm leading-relaxed">
            No admin has been set up yet.
          </p>
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            Since you're the first to access this page, you can claim admin
            access and start managing bookings.
          </p>
          {claimAdmin.isError && (
            <div
              className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
              data-ocid="admin.error_state"
            >
              Failed to claim admin access. Please try again.
            </div>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={() => claimAdmin.mutate()}
            disabled={claimAdmin.isPending}
            data-ocid="admin.claim_button"
          >
            {claimAdmin.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <KeyRound className="w-4 h-4 mr-2" />
            )}
            {claimAdmin.isPending ? "Claiming..." : "Claim Admin Access"}
          </Button>
        </div>
      </div>
    );
  }

  // State 3: Logged in, admin already assigned, not this user
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">
          You do not have admin privileges to view this page.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const filtered = filterDate
    ? (bookings ?? []).filter((b) => b.date === filterDate)
    : (bookings ?? []);
  const todayCount = (bookings ?? []).filter((b) => b.date === today).length;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage all class bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Bookings"
          value={(bookings ?? []).length}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          icon={CalendarDays}
          label="Today's Classes"
          value={todayCount}
          color="text-primary"
          bg="bg-orange-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Bookings"
          value={
            (bookings ?? []).filter((b) => b.status !== "cancelled").length
          }
          color="text-green-600"
          bg="bg-green-50"
        />
      </div>

      <div className="flex gap-3 items-end mb-6">
        <div className="space-y-1">
          <Label>Filter by Date</Label>
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            data-ocid="admin.date_input"
            className="w-48"
          />
        </div>
        {filterDate && (
          <Button variant="outline" onClick={() => setFilterDate("")}>
            Clear Filter
          </Button>
        )}
      </div>

      {bookingsLoading ? (
        <div data-ocid="admin.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="admin.empty_state">
          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="font-semibold">No bookings found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filterDate ? `No classes on ${filterDate}` : "No bookings yet"}
          </p>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl border"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Timeslot</TableHead>
                <TableHead>Parent Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking, idx) => (
                <AdminRow
                  key={booking.id.toString()}
                  booking={booking}
                  index={idx + 1}
                  onCancel={() => cancelBooking.mutateAsync(booking.id)}
                  cancelling={cancelBooking.isPending}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AdminRow({
  booking,
  index,
  onCancel,
  cancelling,
}: {
  booking: Booking;
  index: number;
  onCancel: () => void;
  cancelling: boolean;
}) {
  return (
    <TableRow data-ocid="admin.row">
      <TableCell className="font-medium">{booking.studentName}</TableCell>
      <TableCell>{booking.studentClass}</TableCell>
      <TableCell>{booking.subject}</TableCell>
      <TableCell>{booking.date}</TableCell>
      <TableCell>{booking.timeslot}</TableCell>
      <TableCell>{booking.parentPhone}</TableCell>
      <TableCell>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(booking.status)}`}
        >
          {booking.status}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {booking.status !== "cancelled" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                data-ocid="admin.delete_button"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Booking #{index}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cancel {booking.studentName}'s {booking.subject} class on{" "}
                  {booking.date}?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="admin.cancel_button">
                  No, Keep
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onCancel}
                  disabled={cancelling}
                  className="bg-destructive text-destructive-foreground"
                  data-ocid="admin.confirm_button"
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Yes, Cancel"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
