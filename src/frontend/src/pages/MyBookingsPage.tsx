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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookingsByPhone, useCancelBooking } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  Clock,
  Loader2,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import type { Booking } from "../backend.d";

function statusColor(status: string) {
  if (status === "confirmed" || status === "active")
    return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

export function MyBookingsPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: bookings,
    isLoading,
    isError,
  } = useBookingsByPhone(searchPhone);
  const cancelBooking = useCancelBooking();

  function handleSearch() {
    if (/^[0-9]{10}$/.test(phoneInput)) {
      setSearchPhone(phoneInput);
      queryClient.invalidateQueries({
        queryKey: ["bookings", "phone", phoneInput],
      });
    }
  }

  async function handleCancel(id: bigint) {
    await cancelBooking.mutateAsync(id);
    queryClient.invalidateQueries({
      queryKey: ["bookings", "phone", searchPhone],
    });
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-1">My Bookings</h1>
        <p className="text-muted-foreground">
          Enter your phone number to view your booked classes
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label>Parent Phone Number</Label>
              <Input
                type="tel"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                value={phoneInput}
                onChange={(e) =>
                  setPhoneInput(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-ocid="my_bookings.phone_input"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={phoneInput.length !== 10}
              data-ocid="my_bookings.search_button"
            >
              <Search className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && searchPhone && (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-destructive py-8">
          Failed to load bookings. Try again.
        </div>
      )}

      {!isLoading && searchPhone && bookings?.length === 0 && (
        <div className="text-center py-16" data-ocid="my_bookings.empty_state">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="font-display font-semibold text-lg mb-1">
            No bookings found
          </h3>
          <p className="text-muted-foreground text-sm">
            No classes booked for this phone number.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/book" })}>
            Book a Class
          </Button>
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {bookings.length} booking(s) found
          </p>
          {bookings.map((booking, idx) => (
            <BookingCard
              key={booking.id.toString()}
              booking={booking}
              index={idx + 1}
              onCancel={() => handleCancel(booking.id)}
              cancelling={cancelBooking.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({
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
    <Card data-ocid={`my_bookings.item.${index}`} className="overflow-hidden">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-semibold text-base">
                {booking.studentName}
              </span>
              <Badge variant="outline">{booking.studentClass}</Badge>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(booking.status)}`}
              >
                {booking.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> {booking.subject}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> {booking.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {booking.timeslot}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> {booking.parentName}
              </span>
            </div>
          </div>

          {booking.status !== "cancelled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 shrink-0"
                  data-ocid={`my_bookings.cancel_button.${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="my_bookings.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will cancel {booking.studentName}'s {booking.subject}{" "}
                    class on {booking.date} at {booking.timeslot}. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="my_bookings.cancel_button">
                    Keep Booking
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onCancel}
                    disabled={cancelling}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    data-ocid="my_bookings.confirm_button"
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
        </div>
      </CardContent>
    </Card>
  );
}
