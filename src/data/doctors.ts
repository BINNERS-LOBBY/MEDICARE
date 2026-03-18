export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  availability: string[];
  avatar: string;
  bio: string;
}

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    name: "Dr. James Wilson",
    specialization: "Cardiology",
    experience: 15,
    rating: 4.9,
    availability: ["Mon", "Wed", "Fri"],
    avatar: "JW",
    bio: "Specialist in cardiovascular diseases with 15 years of clinical experience.",
  },
  {
    id: "d2",
    name: "Dr. Emily Chen",
    specialization: "Dermatology",
    experience: 10,
    rating: 4.8,
    availability: ["Tue", "Thu", "Sat"],
    avatar: "EC",
    bio: "Board-certified dermatologist specializing in skin health and cosmetic procedures.",
  },
  {
    id: "d3",
    name: "Dr. Michael Brown",
    specialization: "Orthopedics",
    experience: 12,
    rating: 4.7,
    availability: ["Mon", "Tue", "Thu"],
    avatar: "MB",
    bio: "Expert in joint replacement surgery and sports medicine rehabilitation.",
  },
  {
    id: "d4",
    name: "Dr. Sarah Martinez",
    specialization: "Pediatrics",
    experience: 8,
    rating: 4.9,
    availability: ["Mon", "Wed", "Fri", "Sat"],
    avatar: "SM",
    bio: "Compassionate pediatrician dedicated to children's health and development.",
  },
  {
    id: "d5",
    name: "Dr. Robert Kim",
    specialization: "Neurology",
    experience: 20,
    rating: 4.8,
    availability: ["Tue", "Wed", "Fri"],
    avatar: "RK",
    bio: "Leading neurologist with expertise in neurodegenerative disorders.",
  },
  {
    id: "d6",
    name: "Dr. Lisa Thompson",
    specialization: "General Medicine",
    experience: 11,
    rating: 4.6,
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    avatar: "LT",
    bio: "Experienced general practitioner providing comprehensive primary care.",
  },
];

export const SPECIALIZATIONS = [...new Set(DOCTORS.map((d) => d.specialization))];

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];
