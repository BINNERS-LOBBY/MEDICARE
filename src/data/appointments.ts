export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "in-person" | "telemedicine";
}

let _appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    patientName: "Sarah Johnson",
    doctorId: "d1",
    doctorName: "Dr. James Wilson",
    specialization: "Cardiology",
    date: "2026-03-20",
    time: "10:00 AM",
    status: "upcoming",
    type: "telemedicine",
  },
  {
    id: "a2",
    patientId: "p1",
    patientName: "Sarah Johnson",
    doctorId: "d4",
    doctorName: "Dr. Sarah Martinez",
    specialization: "Pediatrics",
    date: "2026-03-15",
    time: "02:00 PM",
    status: "completed",
    type: "in-person",
  },
];

let _listeners: (() => void)[] = [];

export const appointmentStore = {
  getAppointments: () => _appointments,
  subscribe: (listener: () => void) => {
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  },
  addAppointment: (appt: Appointment) => {
    _appointments = [..._appointments, appt];
    _listeners.forEach((l) => l());
  },
  cancelAppointment: (id: string) => {
    _appointments = _appointments.map((a) =>
      a.id === id ? { ...a, status: "cancelled" as const } : a
    );
    _listeners.forEach((l) => l());
  },
};
