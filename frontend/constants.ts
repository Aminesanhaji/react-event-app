
import { User, Event, UserRole, EventStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: "user1", nom: "alice", email: "alice@example.com", prenom: "Alice", tel: "0123456780", password: "password", role: UserRole.PARTICIPANT },
  { id: "user2", nom: "bob", email: "bob@example.com", password: "password", role: UserRole.ORGANISATEUR },
  { id: "user3", nom: "charlie", email: "charlie@example.com", password: "password", role: UserRole.ADMINISTRATEUR },
  { id: "user4", nom: "david", email: "david@example.com", prenom: "David", tel: "0123456781", password: "password", role: UserRole.PARTICIPANT },
  { id: "user5", nom: "eve", email: "eve@example.com", password: "password", role: UserRole.ORGANISATEUR },
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: "event1",
    titre: "Conférence Tech Innovante", // Changed from name
    date: "2024-09-15T10:00:00Z",
    description: "Une conférence sur les dernières innovations technologiques.",
    lieu: "Palais des Congrès, Paris", // Changed from location
    organizerId: "user2", // Bob
    status: EventStatus.PENDING,
    registeredParticipantIds: [],
  },
  {
    id: "event2",
    titre: "Atelier de Développement Web", // Changed from name
    date: "2024-10-05T14:00:00Z",
    description: "Apprenez les bases du développement web moderne avec React et Tailwind.",
    lieu: "Espace Numérique, Lyon", // Changed from location
    organizerId: "user5", // Eve
    status: EventStatus.APPROVED,
    registeredParticipantIds: ["user1"],
  },
  {
    id: "event3",
    titre: "Festival de Musique Électronique", // Changed from name
    date: "2024-08-20T18:00:00Z",
    description: "Un weekend de musique électronique avec des DJs internationaux.",
    lieu: "Plein Air, Marseille", // Changed from location
    organizerId: "user2", // Bob
    status: EventStatus.APPROVED,
    registeredParticipantIds: ["user1", "user4"],
  },
  {
    id: "event4",
    titre: "Salon du Livre Ancien", // Changed from name
    date: "2024-11-10T09:00:00Z",
    description: "Découvrez des trésors littéraires et rencontrez des libraires passionnés.",
    lieu: "Halle aux Toiles, Rouen", // Changed from location
    organizerId: "user5", // Eve
    status: EventStatus.PENDING,
    registeredParticipantIds: [],
  }
];

export const APP_TITLE = "Gestion d'Événements Pro";
