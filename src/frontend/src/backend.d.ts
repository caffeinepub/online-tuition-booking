import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: bigint;
    timeslot: string;
    status: string;
    studentName: string;
    subject: string;
    date: string;
    createdAt: bigint;
    parentPhone: string;
    studentClass: string;
    parentName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelBooking(id: bigint): Promise<void>;
    createBooking(studentName: string, studentClass: string, subject: string, date: string, timeslot: string, parentName: string, parentPhone: string): Promise<bigint>;
    getAllBookings(): Promise<Array<Booking>>;
    getAvailableSubjects(_class: string): Promise<Array<string>>;
    getAvailableTimeslots(): Promise<Array<string>>;
    getBookingById(id: bigint, parentPhone: string): Promise<Booking>;
    getBookingsByDate(date: string): Promise<Array<Booking>>;
    getBookingsByParentPhone(parentPhone: string): Promise<Array<Booking>>;
    getCallerUserRole(): Promise<UserRole>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isTimeslotBookedForDate(date: string, timeslot: string, subject: string, studentClass: string): Promise<boolean>;
    isAdminAssigned(): Promise<boolean>;
    claimFirstAdmin(): Promise<void>;
}
