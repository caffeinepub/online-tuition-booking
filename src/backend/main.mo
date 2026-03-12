import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Booking {
    public func compare(booking1 : Booking, booking2 : Booking) : Order.Order {
      Nat.compare(booking1.id, booking2.id);
    };
  };

  type Booking = {
    id : Nat;
    studentName : Text;
    studentClass : Text;
    subject : Text;
    date : Text;
    timeslot : Text;
    parentName : Text;
    parentPhone : Text;
    status : Text;
    createdAt : Int;
  };

  // Initialize the user system state and authorization mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let bookings = Map.empty<Nat, Booking>();
  var nextBookingId = 1;

  let availableTimeslots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];

  let availableSubjects = [
    "Math",
    "Science",
    "English",
    "Hindi",
    "EVS",
    "Social Studies",
  ];

  // Check if any admin has been assigned yet
  public query func isAdminAssigned() : async Bool {
    accessControlState.adminAssigned;
  };

  // Claim admin role -- only works if no admin has been assigned yet
  public shared ({ caller }) func claimFirstAdmin() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Must be logged in to claim admin");
    };
    if (accessControlState.adminAssigned) {
      Runtime.trap("Admin has already been assigned");
    };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
  };

  // Create a new booking (returns booking id)
  public shared ({ caller }) func createBooking(
    studentName : Text,
    studentClass : Text,
    subject : Text,
    date : Text,
    timeslot : Text,
    parentName : Text,
    parentPhone : Text,
  ) : async Nat {
    if (not isValidClass(studentClass)) {
      Runtime.trap("Invalid class. Must be between 2 and 6.");
    };

    if (not isValidSubject(subject)) {
      Runtime.trap("Invalid subject.");
    };

    if (not isValidTimeslot(timeslot)) {
      Runtime.trap("Invalid timeslot.");
    };

    if (isTimeslotBooked(date, timeslot, subject, studentClass)) {
      Runtime.trap("Timeslot already booked for this date, subject, and class.");
    };

    let booking : Booking = {
      id = nextBookingId;
      studentName;
      studentClass;
      subject;
      date;
      timeslot;
      parentName;
      parentPhone;
      status = "confirmed";
      createdAt = Time.now();
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;

    booking.id;
  };

  // Get all bookings (for admin/tutor)
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  // Get bookings filtered by date
  public query ({ caller }) func getBookingsByDate(date : Text) : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can view bookings by date");
    };
    bookings.values().toArray().filter(func(b) { b.date == date }).sort();
  };

  // Get a single booking by id
  public query ({ caller }) func getBookingById(id : Nat, parentPhone : Text) : async Booking {
    if (not bookings.containsKey(id)) {
      Runtime.trap("Booking does not exist");
    };
    
    let booking = bookings.get(id).unwrap();
    
    // Admin can view any booking, parents can only view their own bookings
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      if (booking.parentPhone != parentPhone) {
        Runtime.trap("Unauthorized: Can only view your own bookings");
      };
    };
    
    booking;
  };

  // Cancel a booking by id
  public shared ({ caller }) func cancelBooking(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can cancel bookings");
    };
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking does not exist") };
      case (?booking) {
        let updatedBooking = { booking with status = "cancelled" };
        bookings.add(id, updatedBooking);
      };
    };
  };

  // Get available subjects per class (classes 2-6)
  public query ({ caller }) func getAvailableSubjects(_class : Text) : async [Text] {
    if (not isValidClass(_class)) {
      Runtime.trap("Invalid class. Must be between 2 and 6.");
    };
    availableSubjects;
  };

  // Get available timeslots
  public query ({ caller }) func getAvailableTimeslots() : async [Text] {
    availableTimeslots;
  };

  // Check if a timeslot is booked for a given date+subject+class
  public query ({ caller }) func isTimeslotBookedForDate(date : Text, timeslot : Text, subject : Text, studentClass : Text) : async Bool {
    isTimeslotBooked(date, timeslot, subject, studentClass);
  };

  // Check if timeslot is booked (internal)
  func isTimeslotBooked(date : Text, timeslot : Text, subject : Text, studentClass : Text) : Bool {
    bookings.values().toArray().any(
      func(b) {
        b.date == date and b.timeslot == timeslot and b.subject == subject and b.studentClass == studentClass and b.status == "confirmed"
      }
    );
  };

  // Get bookings by parent phone number
  public query ({ caller }) func getBookingsByParentPhone(parentPhone : Text) : async [Booking] {
    bookings.values().toArray().filter(func(b) { b.parentPhone == parentPhone }).sort();
  };

  // Helper functions
  func isValidClass(_class : Text) : Bool {
    switch (_class) {
      case ("2") { true };
      case ("3") { true };
      case ("4") { true };
      case ("5") { true };
      case ("6") { true };
      case (_) { false };
    };
  };

  func isValidSubject(subject : Text) : Bool {
    availableSubjects.find(func(s) { s == subject }) != null;
  };

  func isValidTimeslot(timeslot : Text) : Bool {
    availableTimeslots.find(func(t) { t == timeslot }) != null;
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
