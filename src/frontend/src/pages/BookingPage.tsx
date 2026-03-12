import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import {
  useAvailableSubjects,
  useAvailableTimeslots,
  useCreateBooking,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  IndianRupee,
  Loader2,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const CLASSES = ["Class 2", "Class 3", "Class 4", "Class 5", "Class 6"];

const STEPS = [
  "Class & Subject",
  "Date & Timeslot",
  "Student Details",
  "Payment",
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={`text-xs hidden md:block ${
                i === current
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-8 md:w-16 h-0.5 mb-4 ${
                i < current ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function BookingPage() {
  const [step, setStep] = useState(0);
  const [studentClass, setStudentClass] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [studentName, setStudentName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [bookingId, setBookingId] = useState<bigint | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isFetching: actorFetching } = useActor();
  const { data: subjects, isLoading: subjectsLoading } =
    useAvailableSubjects(studentClass);
  const { data: timeslots, isLoading: timeslotsLoading } =
    useAvailableTimeslots();
  const createBooking = useCreateBooking();

  const today = new Date().toISOString().split("T")[0];

  function validateStep() {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!studentClass) errs.studentClass = "Please select a class";
      if (!subject) errs.subject = "Please select a subject";
    }
    if (step === 1) {
      if (!date) errs.date = "Please select a date";
      if (!timeslot) errs.timeslot = "Please select a timeslot";
    }
    if (step === 2) {
      if (!studentName.trim()) errs.studentName = "Student name is required";
      if (!parentName.trim()) errs.parentName = "Parent name is required";
      if (!/^[0-9]{10}$/.test(parentPhone))
        errs.parentPhone = "Enter a valid 10-digit phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep()) setStep((s) => s + 1);
  }

  async function handlePay() {
    if (!validateStep()) return;
    try {
      const id = await createBooking.mutateAsync({
        studentName,
        studentClass,
        subject,
        date,
        timeslot,
        parentName,
        parentPhone,
      });
      setBookingId(id);
      setStep(4);
    } catch (e) {
      console.error(e);
    }
  }

  if (actorFetching) {
    return (
      <div
        className="container mx-auto px-4 py-16 text-center"
        data-ocid="booking.loading_state"
      >
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Connecting...</p>
      </div>
    );
  }

  // Success screen
  if (step === 4 && bookingId !== null) {
    return (
      <div
        className="container mx-auto px-4 py-16 max-w-lg text-center"
        data-ocid="booking.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your class has been successfully booked.
          </p>

          <Card className="text-left mb-6">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold">
                  #{bookingId.toString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium">{studentClass}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subject</span>
                <span className="font-medium">{subject}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Timeslot</span>
                <span className="font-medium">{timeslot}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-green-600">₹150</span>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={() => {
              setStep(0);
              setBookingId(null);
              setStudentClass("");
              setSubject("");
              setDate("");
              setTimeslot("");
              setStudentName("");
              setParentName("");
              setParentPhone("");
            }}
          >
            Book Another Class
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-display font-bold">Book a Class</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details to reserve your spot
        </p>
      </div>

      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {step === 0 && (
                  <>
                    <BookOpen className="w-5 h-5 text-primary" /> Class &amp;
                    Subject
                  </>
                )}
                {step === 1 && (
                  <>
                    <CalendarDays className="w-5 h-5 text-primary" /> Date &amp;
                    Timeslot
                  </>
                )}
                {step === 2 && (
                  <>
                    <User className="w-5 h-5 text-primary" /> Student Details
                  </>
                )}
                {step === 3 && (
                  <>
                    <IndianRupee className="w-5 h-5 text-primary" /> Payment
                    Summary
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Step 0: Class & Subject */}
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Select Class</Label>
                    <Select
                      value={studentClass}
                      onValueChange={(v) => {
                        setStudentClass(v);
                        setSubject("");
                      }}
                    >
                      <SelectTrigger data-ocid="booking.class_select">
                        <SelectValue placeholder="Choose class..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.studentClass && (
                      <p className="text-destructive text-xs">
                        {errors.studentClass}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Select Subject</Label>
                    {subjectsLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={subject}
                        onValueChange={setSubject}
                        disabled={!studentClass}
                      >
                        <SelectTrigger data-ocid="booking.subject_select">
                          <SelectValue
                            placeholder={
                              studentClass
                                ? "Choose subject..."
                                : "Select class first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(subjects ?? []).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.subject && (
                      <p className="text-destructive text-xs">
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Step 1: Date & Timeslot */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      data-ocid="booking.date_input"
                    />
                    {errors.date && (
                      <p className="text-destructive text-xs">{errors.date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Select Timeslot</Label>
                    {timeslotsLoading ? (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-12" />
                        ))}
                      </div>
                    ) : (
                      <TimeslotPicker
                        timeslots={timeslots ?? []}
                        selected={timeslot}
                        onSelect={setTimeslot}
                        date={date}
                        subject={subject}
                        studentClass={studentClass}
                      />
                    )}
                    {errors.timeslot && (
                      <p className="text-destructive text-xs">
                        {errors.timeslot}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Student Name</Label>
                    <Input
                      placeholder="e.g. Aryan Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      data-ocid="booking.student_name_input"
                    />
                    {errors.studentName && (
                      <p className="text-destructive text-xs">
                        {errors.studentName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Parent/Guardian Name</Label>
                    <Input
                      placeholder="e.g. Rajesh Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      data-ocid="booking.parent_name_input"
                    />
                    {errors.parentName && (
                      <p className="text-destructive text-xs">
                        {errors.parentName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Parent Phone (10 digits)</Label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={parentPhone}
                      onChange={(e) =>
                        setParentPhone(e.target.value.replace(/\D/g, ""))
                      }
                      data-ocid="booking.parent_phone_input"
                    />
                    {errors.parentPhone && (
                      <p className="text-destructive text-xs">
                        {errors.parentPhone}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Booking Summary
                    </h3>
                    {[
                      ["Student", studentName],
                      ["Class", studentClass],
                      ["Subject", subject],
                      ["Date", date],
                      ["Timeslot", timeslot],
                      ["Parent", parentName],
                      ["Contact", parentPhone],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border rounded-xl p-4 flex justify-between items-center bg-primary/5">
                    <span className="font-display font-semibold">
                      Total Amount
                    </span>
                    <Badge className="text-lg px-4 py-1 bg-primary text-primary-foreground">
                      ₹150
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By proceeding, you confirm the booking details are correct.
                    Payment is non-refundable once class begins.
                  </p>

                  {createBooking.isError && (
                    <div
                      className="flex items-center gap-2 text-destructive text-sm"
                      data-ocid="booking.error_state"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Failed to create booking. Please try again.
                    </div>
                  )}

                  <Button
                    className="w-full text-base h-12"
                    onClick={handlePay}
                    disabled={createBooking.isPending}
                    data-ocid="booking.pay_button"
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>Pay ₹150 &amp; Confirm Booking</>
                    )}
                  </Button>
                </>
              )}

              {/* Navigation */}
              {step < 3 && (
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    data-ocid="booking.back_button"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={nextStep} data-ocid="booking.next_button">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
              {step === 3 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="w-full"
                  data-ocid="booking.back_button"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Edit Details
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TimeslotPicker({
  timeslots,
  selected,
  onSelect,
  date,
  subject,
  studentClass,
}: {
  timeslots: string[];
  selected: string;
  onSelect: (v: string) => void;
  date: string;
  subject: string;
  studentClass: string;
}) {
  const { actor } = useActor();
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [checking, setChecking] = useState(false);

  async function checkAll() {
    if (!actor || !date || !subject || !studentClass || timeslots.length === 0)
      return;
    setChecking(true);
    try {
      const results = await Promise.all(
        timeslots.map((ts) =>
          actor.isTimeslotBookedForDate(date, ts, subject, studentClass),
        ),
      );
      const booked = new Set<string>();
      results.forEach((isBooked, i) => {
        if (isBooked) booked.add(timeslots[i]);
      });
      setBookedSlots(booked);
    } finally {
      setChecking(false);
    }
  }

  // Check when date/subject/class changes
  useState(() => {
    checkAll();
  });

  if (checking) {
    return (
      <div className="grid grid-cols-2 gap-2" data-ocid="booking.loading_state">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2" data-ocid="booking.timeslot_select">
      {timeslots.map((ts) => {
        const isBooked = bookedSlots.has(ts);
        const isSelected = selected === ts;
        return (
          <button
            key={ts}
            type="button"
            disabled={isBooked}
            onClick={() => !isBooked && onSelect(ts)}
            className={`px-3 py-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isBooked
                ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                : isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-white border-border hover:border-primary hover:bg-primary/5"
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> {ts}
            {isBooked && <span className="text-xs opacity-70">(Booked)</span>}
          </button>
        );
      })}
      {timeslots.length === 0 && (
        <p className="col-span-2 text-muted-foreground text-sm text-center py-4">
          No timeslots available.
        </p>
      )}
    </div>
  );
}
