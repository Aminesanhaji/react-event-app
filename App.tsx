
import React, { useState, useEffect, useCallback } from 'react';
import { User, Event, UserRole, EventStatus, Reminder } from './types';
import * as api from './services';
import { LoginForm, ParticipantView, OrganizerView, AdminView, Button, ProfileView } from './components';
import { APP_TITLE } from './constants';

type CurrentView = 'dashboard' | 'profile';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<(Reminder & { eventTitre: string })[]>([]);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');

  const showMessage = (message: string) => {
    setGlobalMessage(message);
    setTimeout(() => setGlobalMessage(null), 3500);
  };

  const fetchData = useCallback(async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setIsLoading(true);
    try {
      const [fetchedEvents, fetchedUsers] = await Promise.all([
        api.getAllEvents(),
        api.getAllUsers()
      ]);
      setEvents(fetchedEvents);
      setUsers(fetchedUsers); // Update users list
      if (currentUser) {
         const userReminders = await api.getRemindersForUser(currentUser.id);
         setReminders(userReminders);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showMessage("Erreur lors de la récupération des données.");
    } finally {
      if (showLoadingIndicator) setIsLoading(false);
    }
  }, [currentUser]); // Removed showMessage from dependencies as it's stable

  useEffect(() => {
    fetchData();
  }, [fetchData]); // currentUser changes will trigger fetchData via its own dependency

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard'); 
    showMessage(`Bienvenue ${user.prenom ? user.prenom : user.nom}!`);
    // Fetch data is already called by useEffect due to currentUser change, 
    // but explicit call ensures it happens immediately after login if needed for reminders.
    fetchData(false); // Fetch data without full loading spinner if login was quick
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setReminders([]);
    setCurrentView('dashboard'); 
    showMessage("Vous avez été déconnecté.");
  };

  // Event handlers
  const handleRegisterForEvent = async (eventId: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    const updatedEvent = await api.registerForEvent(eventId, currentUser.id);
    if (updatedEvent) {
      showMessage(`Inscription à "${updatedEvent.titre}" réussie!`);
      await fetchData();
    } else {
      showMessage("Erreur lors de l'inscription. L'événement n'est peut-être plus disponible ou déjà inscrit.");
      setIsLoading(false);
    }
  };

  const handleUnregisterFromEvent = async (eventId: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    const updatedEvent = await api.unregisterFromEvent(eventId, currentUser.id);
    if (updatedEvent) {
      showMessage(`Désinscription de "${updatedEvent.titre}" réussie.`);
      await fetchData(); 
    } else {
      showMessage("Erreur lors de la désinscription.");
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'status' | 'registeredParticipantIds'>) => {
    setIsLoading(true);
    const newEvent = await api.createEvent(eventData);
    showMessage(`Événement "${newEvent.titre}" créé. Il est en attente de validation.`);
    await fetchData();
  };

  const handleUpdateEvent = async (eventId: string, eventData: Partial<Event>) => {
    setIsLoading(true);
    const updatedEvent = await api.updateEvent(eventId, eventData);
    if (updatedEvent) {
      showMessage(`Événement "${updatedEvent.titre}" mis à jour.`);
      await fetchData();
    } else {
      showMessage("Erreur lors de la mise à jour de l'événement.");
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
      setIsLoading(true);
      const success = await api.deleteEvent(eventId);
      if (success) {
        showMessage("Événement supprimé.");
        await fetchData();
      } else {
        showMessage("Erreur lors de la suppression de l'événement.");
        setIsLoading(false);
      }
    }
  };
  
  const handleApproveEvent = async (eventId: string) => {
    setIsLoading(true);
    const updatedEvent = await api.updateEvent(eventId, { status: EventStatus.APPROVED });
    if (updatedEvent) {
      showMessage(`Événement "${updatedEvent.titre}" approuvé.`);
      await fetchData();
    } else {
      showMessage("Erreur lors de l'approbation.");
      setIsLoading(false);
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    setIsLoading(true);
    const updatedEvent = await api.updateEvent(eventId, { status: EventStatus.REJECTED });
    if (updatedEvent) {
      showMessage(`Événement "${updatedEvent.titre}" rejeté.`);
      await fetchData();
    } else {
      showMessage("Erreur lors du rejet.");
      setIsLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: UserRole) => {
    setIsLoading(true);
    const updatedUser = await api.updateUserRole(userId, role);
    if (updatedUser) {
      const targetUser = users.find(u => u.id === userId);
      showMessage(`Rôle de ${targetUser?.prenom || targetUser?.nom} mis à jour à ${role}.`);
      await fetchData(); // Refetches all users
    } else {
      showMessage("Erreur lors de la mise à jour du rôle.");
      setIsLoading(false);
    }
  };

  const handleUpdateUserProfile = async (updatedData: Partial<Pick<User, 'nom' | 'prenom' | 'email' | 'tel'>>) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updatedUser = await api.updateUserProfile(currentUser.id, updatedData);
      if (updatedUser) {
        setCurrentUser(updatedUser); // Update current user state
        // Update the user in the global users list as well
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        showMessage("Profil mis à jour avec succès !");
      } else {
        showMessage("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      showMessage("Une erreur technique est survenue.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSendReminderToAll = async (eventId: string) => {
    setIsLoading(true);
    const event = events.find(e => e.id === eventId);
    if (!event) {
      showMessage("Événement non trouvé.");
      setIsLoading(false);
      return;
    }

    let count = 0;
    for (const participantId of event.registeredParticipantIds) {
        const reminderSent = await api.sendReminder(eventId, participantId);
        if(reminderSent) count++;
    }
    showMessage(`${count} rappel(s) envoyé(s) pour "${event.titre}".`);
    await fetchData(); 
  };

  const navigateToProfile = () => setCurrentView('profile');
  const navigateToDashboard = () => setCurrentView('dashboard');


  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} isLoading={isLoading && !currentUser} />;
  }

  const displayName = currentUser.prenom ? `${currentUser.prenom} ${currentUser.nom}` : currentUser.nom;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header>
        <nav className="bg-slate-800 shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <button onClick={navigateToDashboard} className="focus:outline-none">
                   <h1 className="text-3xl font-bold text-sky-400 hover:text-sky-300 transition-colors">{APP_TITLE}</h1>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden sm:block">
                  Connecté: <button onClick={navigateToProfile} className="font-semibold text-sky-400 hover:text-sky-300 focus:outline-none focus:underline transition-colors">{displayName}</button> ({currentUser.role})
                </span>
                 <Button variant="neutral" size="sm" onClick={navigateToProfile} className="sm:hidden">
                  Profil
                </Button>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {globalMessage && (
        <div className="fixed top-5 right-5 bg-sky-500 text-white py-2 px-4 rounded-md shadow-lg z-[100]" role="status" aria-live="polite">
          {globalMessage}
        </div>
      )}

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading && !globalMessage && currentView === 'dashboard' ? ( // Show loader primarily for dashboard initial load or heavy ops
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-slate-400">Chargement des données...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400 ml-3"></div>
          </div>
        ) : (
          <>
            {currentView === 'profile' && currentUser && (
              <ProfileView 
                currentUser={currentUser} 
                onNavigateBack={navigateToDashboard}
                onSaveProfile={handleUpdateUserProfile} 
              />
            )}
            {currentView === 'dashboard' && (
              <>
                {currentUser.role === UserRole.PARTICIPANT && (
                  <ParticipantView 
                    currentUser={currentUser} 
                    events={events} 
                    onRegister={handleRegisterForEvent} 
                    onUnregister={handleUnregisterFromEvent}
                    reminders={reminders}
                  />
                )}
                {currentUser.role === UserRole.ORGANISATEUR && (
                  <OrganizerView 
                    currentUser={currentUser} 
                    events={events} 
                    users={users}
                    onCreateEvent={handleCreateEvent} 
                    onUpdateEvent={handleUpdateEvent} 
                    onDeleteEvent={handleDeleteEvent}
                    onSendReminderToAll={handleSendReminderToAll}
                  />
                )}
                {currentUser.role === UserRole.ADMINISTRATEUR && (
                  <AdminView 
                    currentUser={currentUser} 
                    events={events} 
                    users={users} 
                    onApproveEvent={handleApproveEvent}
                    onRejectEvent={handleRejectEvent}
                    onUpdateUserRole={handleUpdateUserRole}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
      <footer className="text-center py-8 mt-8 border-t border-slate-700">
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} {APP_TITLE}. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default App;
