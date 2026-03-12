import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking } from "../backend.d";
import { useActor } from "./useActor";

export function useAvailableSubjects(studentClass: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["subjects", studentClass],
    queryFn: async () => {
      if (!actor || !studentClass) return [];
      return actor.getAvailableSubjects(studentClass);
    },
    enabled: !!actor && !isFetching && !!studentClass,
  });
}

export function useAvailableTimeslots() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["timeslots"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableTimeslots();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookingsByPhone(phone: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "phone", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      return actor.getBookingsByParentPhone(phone);
    },
    enabled: !!actor && !isFetching && phone.length === 10,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["bookings", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdminAssigned() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdminAssigned"],
    queryFn: async () => {
      if (!actor) return false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).isAdminAssigned() as Promise<boolean>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).claimFirstAdmin() as Promise<void>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["isAdminAssigned"] });
    },
  });
}

export function useIsTimeslotBooked(
  date: string,
  timeslot: string,
  subject: string,
  studentClass: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["timeslotBooked", date, timeslot, subject, studentClass],
    queryFn: async () => {
      if (!actor || !date || !timeslot || !subject || !studentClass)
        return false;
      return actor.isTimeslotBookedForDate(
        date,
        timeslot,
        subject,
        studentClass,
      );
    },
    enabled:
      !!actor &&
      !isFetching &&
      !!date &&
      !!timeslot &&
      !!subject &&
      !!studentClass,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      studentName: string;
      studentClass: string;
      subject: string;
      date: string;
      timeslot: string;
      parentName: string;
      parentPhone: string;
    }
  >({
    mutationFn: async (data) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        data.studentName,
        data.studentClass,
        data.subject,
        data.date,
        data.timeslot,
        data.parentName,
        data.parentPhone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
