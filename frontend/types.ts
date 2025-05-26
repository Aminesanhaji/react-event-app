
export enum UserRole {
  PARTICIPANT = "Participant",
  ORGANISATEUR = "Organisateur",
  ADMINISTRATEUR = "Administrateur",
}

export interface User {
  id: string;
  nom: string; // Changed from username
  email: string; // Added field
  prenom?: string; // Added field, optional
  tel?: string; // Added field, optional
  role: UserRole;
  password?: string; // Represents motDePasse, only for mock auth
}

export enum EventStatus {
  PENDING = "En attente",
  APPROVED = "Approuvé",
  REJECTED = "Rejeté",
  CANCELLED = "Annulé",
}

export interface Event {
  id: string;
  titre: string; // Changed from name
  date: string;
  description: string;
  lieu: string; // Changed from location
  organizerId: string;
  status: EventStatus;
  registeredParticipantIds: string[];
}

export interface Reminder {
  id: string;
  eventId: string;
  userId: string; // Participant's ID
  contenu: string; // Changed from message
  dateEnvoie: string; // Changed from sentDate
}
