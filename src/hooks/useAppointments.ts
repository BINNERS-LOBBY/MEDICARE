import { useSyncExternalStore } from "react";
import { appointmentStore, Appointment } from "@/data/appointments";

export function useAppointments() {
  const appointments = useSyncExternalStore(
    appointmentStore.subscribe,
    appointmentStore.getAppointments
  );

  return {
    appointments,
    addAppointment: appointmentStore.addAppointment,
    cancelAppointment: appointmentStore.cancelAppointment,
  };
}
