
import { User, Event, UserRole, EventStatus, Reminder } from './types';
import { MOCK_USERS, INITIAL_EVENTS } from './constants';

// Simulate a database
let users: User[] = [...MOCK_USERS];
let events: Event[] = [...INITIAL_EVENTS];
let reminders: Reminder[] = []; // Simulate a database for reminders

// --- Auth Service ---
export const login = async (nom: string, password_mock: string): Promise<User | null> => {
  // In a real app, this would involve an API call and password hashing.
  // For this mock, we just find the user by nom.
  // The password check is trivial for demo purposes.
  const user = users.find(u => u.nom === nom && u.password === password_mock);
  return user ? { ...user } : null; // Return a copy
};

// --- Event Service ---
export const getAllEvents = async (): Promise<Event[]> => {
  return [...events]; // Return a copy
};

export const getEventById = async (id: string): Promise<Event | undefined> => {
  return events.find(event => event.id === id);
};

export const createEvent = async (eventData: Omit<Event, 'id' | 'status' | 'registeredParticipantIds' > & { organizerId: string }): Promise<Event> => {
  const newEvent: Event = {
    ...eventData,
    id: `event${Date.now()}`,
    status: EventStatus.PENDING,
    registeredParticipantIds: [],
  };
  events.push(newEvent);
  return { ...newEvent };
};

export const updateEvent = async (id: string, updates: Partial<Event>): Promise<Event | null> => {
  const eventIndex = events.findIndex(event => event.id === id);
  if (eventIndex === -1) return null;
  events[eventIndex] = { ...events[eventIndex], ...updates };
  return { ...events[eventIndex] };
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  const initialLength = events.length;
  events = events.filter(event => event.id !== id);
  return events.length < initialLength;
};

export const registerForEvent = async (eventId: string, userId: string): Promise<Event | null> => {
  const event = events.find(e => e.id === eventId);
  if (event && !event.registeredParticipantIds.includes(userId) && event.status === EventStatus.APPROVED) {
    event.registeredParticipantIds.push(userId);
    return { ...event };
  }
  return null;
};

export const unregisterFromEvent = async (eventId: string, userId: string): Promise<Event | null> => {
  const event = events.find(e => e.id === eventId);
  if (event) {
    event.registeredParticipantIds = event.registeredParticipantIds.filter(id => id !== userId);
    return { ...event };
  }
  return null;
};

// --- User Service ---
export const getAllUsers = async (): Promise<User[]> => {
  return [...users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  })]; 
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  users[userIndex].role = newRole;
  const { password, ...userWithoutPassword } = users[userIndex];
  return { ...userWithoutPassword };
};

export const updateUserProfile = async (userId: string, updates: Partial<Pick<User, 'nom' | 'prenom' | 'email' | 'tel'>>): Promise<User | null> => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  // Ensure only allowed fields are updated
  const allowedUpdates: Partial<User> = {};
  if (updates.nom !== undefined) allowedUpdates.nom = updates.nom;
  if (updates.prenom !== undefined) allowedUpdates.prenom = updates.prenom;
  if (updates.email !== undefined) allowedUpdates.email = updates.email;
  if (updates.tel !== undefined) allowedUpdates.tel = updates.tel;

  users[userIndex] = { ...users[userIndex], ...allowedUpdates };
  
  // Return user data without password
  const { password, ...userWithoutPassword } = users[userIndex];
  return { ...userWithoutPassword };
};


// --- Reminder Service (Mock) ---
export const sendReminder = async (eventId: string, participantId: string): Promise<Reminder | null> => {
  const event = events.find(e => e.id === eventId);
  const participant = users.find(u => u.id === participantId);

  if (event && participant) {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      eventId: eventId,
      userId: participantId,
      contenu: `Rappel: N'oubliez pas l'événement "${event.titre}" le ${new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}.`,
      dateEnvoie: new Date().toISOString(),
    };
    reminders.push(newReminder);
    console.log(`Reminder created and stored for event ${event.titre} for user ${participant.nom}`);
    return newReminder;
  }
  console.error(`Failed to send reminder for event ${eventId} to participant ${participantId}`);
  return null;
};

export const getRemindersForUser = async (userId: string): Promise<(Reminder & { eventTitre: string })[]> => {
  const userReminders = reminders.filter(r => r.userId === userId);
  // Filter for reminders of approved and upcoming/recent events for practical display
  const practicalReminders = userReminders.filter(r => {
    const event = events.find(e => e.id === r.eventId);
    return event && event.status === EventStatus.APPROVED; // Could also check if event date is upcoming
  });

  const populatedReminders = await Promise.all(practicalReminders.map(async r => {
    const event = await getEventById(r.eventId);
    return { ...r, eventTitre: event?.titre || "Événement inconnu" };
  }));
  
  // Sort by send date, most recent first
  return populatedReminders.sort((a,b) => new Date(b.dateEnvoie).getTime() - new Date(a.dateEnvoie).getTime());
};
