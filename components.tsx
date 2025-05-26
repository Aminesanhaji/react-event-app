
import React, { useState, useEffect, useCallback } from 'react';
import { User, Event, UserRole, EventStatus, Reminder } from './types';
import { MOCK_USERS } from './constants';
import * as api from './services';

// --- Icon Components ---
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const PencilSquareIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.082l-3.287-.082zM9 4.5l1.081.616m0 0L10.5 5.79M9 4.5l-.54.308m1.54-1.825L10.5 2.25m0 0l.54-.308m0 0l.54.308m0 0l1.081-.616m2.174 0l1.081-.616m0 0l.54.308m0 0l.54-.308m0 0l1.081.616m-4.889 2.174l1.081.616m0 0l1.081.616m0 0l1.081-.616m0 0l1.081-.616m0 0L10.5 5.79" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const FloppyDiskIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V10.5a2.25 2.25 0 11-4.5 0V3.75m4.5 0V3.75m-4.5 0V3.75m0 0A2.25 2.25 0 009.75 6H5.25A2.25 2.25 0 003 8.25v1.5M3 8.25v1.5m0 0A2.25 2.25 0 005.25 12h13.5A2.25 2.25 0 0021 9.75V8.25m-18 0V8.25" />
 </svg>
);


// --- Generic UI Components ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-sky-400">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl" aria-label="Fermer">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyles = "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition ease-in-out duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-sky-500 hover:bg-sky-600 focus:ring-sky-500 text-white",
    secondary: "bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 text-slate-100",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
    success: "bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white",
    neutral: "bg-slate-700 hover:bg-slate-600 focus:ring-slate-500 text-slate-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Auth Components ---
interface LoginFormProps {
  onLogin: (user: User) => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const [nom, setNom] = useState(''); // Changed from username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nom || !password) {
      setError('Veuillez entrer un nom d\'utilisateur et un mot de passe.');
      return;
    }
    try {
      const loggedInUser = await api.login(nom, password); // Use nom
      if (loggedInUser) {
        onLogin(loggedInUser);
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-sky-400 mb-8 text-center">Connexion</h1>
        {error && <p className="bg-red-800 border border-red-700 text-red-100 px-4 py-3 rounded-md mb-6 text-sm" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-slate-300 mb-1">
              Nom d'utilisateur (essayez: alice, bob, charlie)
            </label>
            <input
              id="nom" // Changed from username
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="ex: alice"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Mot de passe (essayez: password)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="Mot de passe"
              required
              aria-required="true"
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
         <div className="mt-6 text-center text-sm text-slate-400">
            <p>Utilisateurs de test :</p>
            <ul className="list-disc list-inside">
                <li>alice (Participant) / password</li>
                <li>bob (Organisateur) / password</li>
                <li>charlie (Administrateur) / password</li>
            </ul>
        </div>
      </div>
    </div>
  );
};


// --- Event Components ---
interface EventCardProps {
  event: Event;
  currentUser: User;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
  onSendReminder?: (eventId: string) => void;
  onViewParticipants?: (event: Event) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event, currentUser, onRegister, onUnregister, onEdit, onDelete, onApprove, onReject, onSendReminder, onViewParticipants
}) => {
  const isRegistered = event.registeredParticipantIds.includes(currentUser.id);
  const isOrganizer = event.organizerId === currentUser.id;
  const isAdmin = currentUser.role === UserRole.ADMINISTRATEUR;
  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date();

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.APPROVED: return "text-green-400 bg-green-900/50";
      case EventStatus.PENDING: return "text-yellow-400 bg-yellow-900/50";
      case EventStatus.REJECTED: return "text-red-400 bg-red-900/50";
      case EventStatus.CANCELLED: return "text-slate-500 bg-slate-700/50";
      default: return "text-slate-400 bg-slate-600/50";
    }
  };

  return (
    <article className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-sky-500/30">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-sky-400">{event.titre}</h3> {/* Changed from event.name */}
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{event.description}</p>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-4 w-4 mr-2 text-sky-500" aria-hidden="true" />
            {eventDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-sky-500" aria-hidden="true" />
            {event.lieu} {/* Changed from event.location */}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700 flex flex-wrap gap-2">
          {currentUser.role === UserRole.PARTICIPANT && event.status === EventStatus.APPROVED && !isPastEvent && (
            isRegistered ? (
              <Button variant="secondary" size="sm" onClick={() => onUnregister?.(event.id)}>Se désinscrire</Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => onRegister?.(event.id)}>S'inscrire</Button>
            )
          )}
          {isOrganizer && onEdit && onDelete && (
            <>
              <Button variant="secondary" size="sm" onClick={() => onEdit(event)}><PencilSquareIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Modifier</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(event.id)}><TrashIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Supprimer</Button>
            </>
          )}
          {isOrganizer && onViewParticipants && (
            <Button variant="secondary" size="sm" onClick={() => onViewParticipants(event)}>Participants ({event.registeredParticipantIds.length})</Button>
          )}
          {isOrganizer && onSendReminder && event.status === EventStatus.APPROVED && event.registeredParticipantIds.length > 0 && !isPastEvent && (
            <Button variant="secondary" size="sm" onClick={() => onSendReminder(event.id)}><BellIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Envoyer Rappels</Button>
          )}
          {isAdmin && event.status === EventStatus.PENDING && onApprove && onReject && (
            <>
              <Button variant="success" size="sm" onClick={() => onApprove(event.id)}><CheckCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Approuver</Button>
              <Button variant="danger" size="sm" onClick={() => onReject(event.id)}><XCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Rejeter</Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

interface EventFormProps {
  onSubmit: (eventData: Omit<Event, 'id' | 'status' | 'registeredParticipantIds' | 'organizerId'> & { organizerId?: string; date: string }) => void;
  onClose: () => void;
  initialData?: Event | null;
  currentUser: User;
}

export const EventForm: React.FC<EventFormProps> = ({ onSubmit, onClose, initialData, currentUser }) => {
  const [titre, setTitre] = useState(initialData?.titre || ''); // Changed from name
  const [date, setDate] = useState(initialData?.date ? new Date(initialData.date).toISOString().substring(0, 16) : '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [lieu, setLieu] = useState(initialData?.lieu || ''); // Changed from location

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !date || !description || !lieu) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    // Convert date back to ISO string if it's just date-time local string
    const dateISO = new Date(date).toISOString();
    onSubmit({ titre, date: dateISO, description, lieu, organizerId: initialData?.organizerId || currentUser.id });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="eventTitre" className="block text-sm font-medium text-slate-300">Titre de l'événement</label> {/* Changed from "Nom de l'événement" */}
        <input type="text" id="eventTitre" value={titre} onChange={e => setTitre(e.target.value)} required 
               className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
      </div>
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-slate-300">Date et heure</label>
        <input type="datetime-local" id="eventDate" value={date} onChange={e => setDate(e.target.value)} required
               className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
      </div>
      <div>
        <label htmlFor="eventDescription" className="block text-sm font-medium text-slate-300">Description</label>
        <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} required
                  className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="eventLieu" className="block text-sm font-medium text-slate-300">Lieu</label> {/* Changed from "Lieu" */}
        <input type="text" id="eventLieu" value={lieu} onChange={e => setLieu(e.target.value)} required
               className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
        <Button type="submit" variant="primary">{initialData ? "Mettre à jour" : "Créer l'événement"}</Button>
      </div>
    </form>
  );
};

// --- Role-Specific Views ---

// Participant View
interface ParticipantViewProps {
  currentUser: User;
  events: Event[];
  onRegister: (eventId: string) => void;
  onUnregister: (eventId: string) => void;
  reminders: (Reminder & { eventTitre: string })[]; // Updated reminder type
}
export const ParticipantView: React.FC<ParticipantViewProps> = ({ currentUser, events, onRegister, onUnregister, reminders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableEvents = events.filter(event => 
    event.status === EventStatus.APPROVED &&
    (event.titre.toLowerCase().includes(searchTerm.toLowerCase()) || // Changed from event.name
     event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const registeredEvents = events.filter(event => event.registeredParticipantIds.includes(currentUser.id) && event.status === EventStatus.APPROVED);
  const upcomingRegisteredEvents = registeredEvents.filter(e => new Date(e.date) >= new Date()).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8">
      <section aria-labelledby="reminders-heading">
        <h2 id="reminders-heading" className="text-2xl font-semibold text-sky-400 mb-4">Mes Rappels</h2>
        {reminders.length > 0 ? (
          <ul className="space-y-3">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="bg-slate-800 p-4 rounded-lg shadow flex items-start">
                <BellIcon className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-slate-100">{reminder.eventTitre}</p>
                  <p className="text-slate-300 text-sm">{reminder.contenu}</p>
                  <p className="text-xs text-slate-500 mt-1">Envoyé le: {new Date(reminder.dateEnvoie).toLocaleString('fr-FR')}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">Vous n'avez aucun rappel pour le moment.</p>
        )}
      </section>

      <section aria-labelledby="upcoming-events-heading">
        <h2 id="upcoming-events-heading" className="text-2xl font-semibold text-sky-400 mb-4">Mes Événements à Venir</h2>
        {upcomingRegisteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingRegisteredEvents.map(event => (
              <EventCard key={event.id} event={event} currentUser={currentUser} onUnregister={onUnregister} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Vous n'êtes inscrit à aucun événement à venir.</p>
        )}
      </section>

      <section aria-labelledby="search-events-heading">
        <h2 id="search-events-heading" className="text-2xl font-semibold text-sky-400 mb-4">Chercher et S'inscrire à des Événements</h2>
        <input 
          type="search" 
          placeholder="Rechercher des événements par titre ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-sky-500 focus:border-sky-500"
          aria-label="Rechercher des événements"
        />
        {availableEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableEvents.map(event => (
              <EventCard key={event.id} event={event} currentUser={currentUser} onRegister={onRegister} onUnregister={onUnregister} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Aucun événement disponible correspondant à votre recherche.</p>
        )}
      </section>
    </div>
  );
};

// Organizer View
interface OrganizerViewProps {
  currentUser: User;
  events: Event[];
  users: User[];
  onCreateEvent: (eventData: Omit<Event, 'id' | 'status' | 'registeredParticipantIds'>) => void;
  onUpdateEvent: (eventId: string, eventData: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
  onSendReminderToAll: (eventId: string) => void;
}
export const OrganizerView: React.FC<OrganizerViewProps> = ({ currentUser, events, users, onCreateEvent, onUpdateEvent, onDeleteEvent, onSendReminderToAll }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [participantsModalEvent, setParticipantsModalEvent] = useState<Event | null>(null);

  const myEvents = events.filter(event => event.organizerId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEventFormSubmit = (eventData: Omit<Event, 'id' | 'status' | 'registeredParticipantIds' | 'organizerId'> & { organizerId?: string; date: string }) => {
    if (editingEvent) {
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      onCreateEvent({ ...eventData, organizerId: currentUser.id });
    }
    setIsEventModalOpen(false);
  };
  
  const handleViewParticipants = (event: Event) => {
    setParticipantsModalEvent(event);
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="organized-events-heading">
        <div className="flex justify-between items-center mb-4">
          <h2 id="organized-events-heading" className="text-2xl font-semibold text-sky-400">Mes Événements Organisés</h2>
          <Button variant="primary" onClick={handleOpenCreateModal}>Créer un Événement</Button>
        </div>
        {myEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                currentUser={currentUser} 
                onEdit={handleOpenEditModal} 
                onDelete={onDeleteEvent}
                onSendReminder={onSendReminderToAll}
                onViewParticipants={handleViewParticipants}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Vous n'avez organisé aucun événement.</p>
        )}
      </section>

      <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title={editingEvent ? "Modifier l'Événement" : "Créer un Nouvel Événement"}>
        <EventForm onSubmit={handleEventFormSubmit} onClose={() => setIsEventModalOpen(false)} initialData={editingEvent} currentUser={currentUser}/>
      </Modal>

      {participantsModalEvent && (
        <Modal 
          isOpen={!!participantsModalEvent} 
          onClose={() => setParticipantsModalEvent(null)} 
          title={`Participants pour: ${participantsModalEvent.titre}`} /* Changed from .name */
        >
          {participantsModalEvent.registeredParticipantIds.length > 0 ? (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {participantsModalEvent.registeredParticipantIds.map(userId => {
                const participant = users.find(u => u.id === userId);
                return (
                  <li key={userId} className="p-3 bg-slate-700 rounded-md text-slate-200">
                    {participant ? `${participant.prenom || ''} ${participant.nom}`.trim() : 'Utilisateur inconnu'} {/* Display full name */}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-slate-400">Aucun participant inscrit pour cet événement.</p>
          )}
        </Modal>
      )}
    </div>
  );
};

// Admin View
interface AdminViewProps {
  currentUser: User;
  events: Event[];
  users: User[];
  onApproveEvent: (eventId: string) => void;
  onRejectEvent: (eventId: string) => void;
  onUpdateUserRole: (userId: string, role: UserRole) => void;
}
export const AdminView: React.FC<AdminViewProps> = ({ currentUser, events, users, onApproveEvent, onRejectEvent, onUpdateUserRole }) => {
  const pendingEvents = events.filter(event => event.status === EventStatus.PENDING);
  const otherEvents = events.filter(event => event.status !== EventStatus.PENDING);

  return (
    <div className="space-y-8">
      <section aria-labelledby="pending-events-heading">
        <h2 id="pending-events-heading" className="text-2xl font-semibold text-sky-400 mb-4">Valider les Événements en Attente</h2>
        {pendingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                currentUser={currentUser} 
                onApprove={onApproveEvent} 
                onReject={onRejectEvent} 
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Aucun événement en attente de validation.</p>
        )}
      </section>

      <section aria-labelledby="manage-users-heading">
        <h2 id="manage-users-heading" className="text-2xl font-semibold text-sky-400 mb-4">Gérer les Rôles des Utilisateurs</h2>
        <div className="bg-slate-800 shadow-lg rounded-lg p-2 sm:p-4">
          <ul className="divide-y divide-slate-700">
            {users.filter(u => u.id !== currentUser.id).map(user => ( 
              <li key={user.id} className="py-3 sm:py-4 px-1 sm:px-2 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="text-lg font-medium text-slate-100">{`${user.prenom || ''} ${user.nom}`.trim()}</p> {/* Display full name */}
                  <p className="text-sm text-slate-400">Rôle actuel: {user.role}</p>
                  <p className="text-sm text-slate-500">Email: {user.email}</p>
                  {user.tel && <p className="text-sm text-slate-500">Tel: {user.tel}</p>}
                </div>
                <div className="mt-2 sm:mt-0">
                  <label htmlFor={`role-select-${user.id}`} className="sr-only">Changer le rôle de {user.nom}</label>
                  <select 
                    id={`role-select-${user.id}`}
                    value={user.role} 
                    onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                    className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    {Object.values(UserRole).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      
      <section aria-labelledby="all-other-events-heading">
        <h2 id="all-other-events-heading" className="text-2xl font-semibold text-sky-400 mb-4">Tous les Autres Événements</h2>
         {otherEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Aucun autre événement à afficher.</p>
        )}
      </section>
    </div>
  );
};

// --- Profile View ---
interface ProfileViewProps {
  currentUser: User;
  onNavigateBack: () => void;
  onSaveProfile: (updatedData: Partial<Pick<User, 'nom' | 'prenom' | 'email' | 'tel'>>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onNavigateBack, onSaveProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: currentUser.nom,
    prenom: currentUser.prenom || '',
    email: currentUser.email,
    tel: currentUser.tel || '',
  });
  const [errors, setErrors] = useState<{ nom?: string; email?: string }>({});

  // Update form data if currentUser changes (e.g., after save)
  useEffect(() => {
    setFormData({
      nom: currentUser.nom,
      prenom: currentUser.prenom || '',
      email: currentUser.email,
      tel: currentUser.tel || '',
    });
  }, [currentUser]);

  const displayName = currentUser.prenom ? `${currentUser.prenom} ${currentUser.nom}` : currentUser.nom;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { nom?: string; email?: string } = {};
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse email n'est pas valide.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    await onSaveProfile({
      nom: formData.nom.trim(),
      prenom: formData.prenom.trim() || undefined, // Send undefined if empty, not empty string
      email: formData.email.trim(),
      tel: formData.tel.trim() || undefined, // Send undefined if empty
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ // Reset to original currentUser data
      nom: currentUser.nom,
      prenom: currentUser.prenom || '',
      email: currentUser.email,
      tel: currentUser.tel || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const inputClass = "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="max-w-2xl mx-auto bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10">
      <div className="flex items-center mb-8">
        <UserCircleIcon className="h-20 w-20 text-sky-400 mr-6" aria-hidden="true" />
        <div>
          <h2 className="text-3xl font-bold text-sky-400">{isEditing ? "Modifier le Profil" : displayName}</h2>
          <p className="text-slate-400 text-lg">{currentUser.role}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-sky-300 mb-3">Informations Personnelles</h3>
          <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
            {/* Nom */}
            <div>
              <label htmlFor="profileNom" className="block text-sm font-medium text-slate-400 mb-1">Nom:</label>
              {isEditing ? (
                <>
                  <input type="text" id="profileNom" name="nom" value={formData.nom} onChange={handleInputChange} className={inputClass} required aria-required="true" />
                  {errors.nom && <p className={errorClass} role="alert">{errors.nom}</p>}
                </>
              ) : (
                <p className="text-slate-100">{currentUser.nom}</p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="profilePrenom" className="block text-sm font-medium text-slate-400 mb-1">Prénom:</label>
              {isEditing ? (
                <input type="text" id="profilePrenom" name="prenom" value={formData.prenom} onChange={handleInputChange} className={inputClass} />
              ) : (
                <p className="text-slate-100">{currentUser.prenom || 'N/A'}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-400 mb-1">Email:</label>
              {isEditing ? (
                <>
                  <input type="email" id="profileEmail" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} required aria-required="true" />
                  {errors.email && <p className={errorClass} role="alert">{errors.email}</p>}
                </>
              ) : (
                <p className="text-slate-100">{currentUser.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="profileTel" className="block text-sm font-medium text-slate-400 mb-1">Téléphone:</label>
              {isEditing ? (
                <input type="tel" id="profileTel" name="tel" value={formData.tel} onChange={handleInputChange} className={inputClass} />
              ) : (
                <p className="text-slate-100">{currentUser.tel || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <div>
            <h3 className="text-xl font-semibold text-sky-300 mb-2">Rôle et Permissions</h3>
            <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-slate-300">Vous êtes connecté en tant que <span className="font-semibold text-sky-400">{currentUser.role}</span>.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
        {!isEditing && (
          <Button variant="secondary" onClick={onNavigateBack} size="md">
            <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Retour au Tableau de Bord
          </Button>
        )}

        {isEditing ? (
          <>
            <Button variant="secondary" onClick={handleCancel} size="md">
              <XCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSave} size="md">
              <FloppyDiskIcon className="h-5 w-5 mr-1" aria-hidden="true" />
              Enregistrer les modifications
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)} size="md">
            <PencilSquareIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Modifier le Profil
          </Button>
        )}
      </div>
    </div>
  );
};
