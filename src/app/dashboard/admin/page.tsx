'use client';

import { useState, useEffect } from 'react';
import {getUsers, createUser, deleteUser} from '@/services/userApi';
import {
  UserPlus,
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Shield,
  Home
} from 'lucide-react';
import Link from 'next/link';

type UserRole = 'admin' | 'ga' | 'gl' | 'gt' | 'pd' | 'pt' | 'ra' | 'sc' | 'sco';

interface UserData {
  _id: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'inactive' | 'pending';
  createdAt?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  lastConnection?: string;
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrateur',
  ga: 'Gardien',
  gl: 'Gestionnaire Locative',
  gt: 'Gestionnaire Technique',
  pd: 'Prestataire Diagnostic',
  pt: 'Prestataire Travaux',
  ra: 'Responsable d\'Agence',
  sc: 'Service Contentieux',
  sco: 'Service Comptable'
};

const statusLabels: Record<'active' | 'inactive' | 'pending', string> = {
  active: 'Actif',
  inactive: 'Inactif',
  pending: 'En attente'
};

const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const usersPerPage = 3;

  // État pour le formulaire d'ajout d'utilisateur
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'gt' as UserRole,
    firstName: '',
    lastName: '',
    phone: '',
    generatePassword: true,
    customPassword: ''
  });

  // Données utilisateurs du backend
  const [usersData, setUsersData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsersData(res.data);
      } catch {
        // Erreur lors du chargement des utilisateurs
      } finally {
        // Fin du chargement
      }
    };
    fetchUsers();
  }, []);

  // Filtrer les utilisateurs selon les critères
  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Gestion du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox' && 'checked' in e.target) {
      setNewUser({
        ...newUser,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [formError, setFormError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const password = newUser.generatePassword ? generateRandomPassword() : newUser.customPassword;
    try {
      await createUser({
        email: newUser.email,
        role: newUser.role,
        temporaryPassword: password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        status: 'pending',
        lastConnection: 'Jamais',
        createdAt: new Date().toLocaleDateString('fr-FR')
      });
      // Recharger la liste
      const res = await getUsers();
      setUsersData(res.data);
      setNewUser({
        email: '',
        role: 'gt',
        firstName: '',
        lastName: '',
        phone: '',
        generatePassword: true,
        customPassword: ''
      });
      setActiveTab('list');
      setCurrentPage(1);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response === 'object' &&
        (err as { response?: { data?: { error?: string } } }).response !== null &&
        (err as { response?: { data?: { error?: string } } }).response !== undefined &&
        (err as { response?: { data?: { error?: string } } }).response !== undefined &&
        'data' in (err as { response?: { data?: { error?: string } } }).response!
      ) {
        setFormError(
          ((err as { response?: { data?: { error?: string } } }).response?.data?.error) ||
          'Erreur lors de la création de l’utilisateur'
        );
      } else {
        setFormError('Erreur lors de la création de l’utilisateur');
      }
      console.error('Erreur création utilisateur:', err);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id);
        // Recharger la liste
        const res = await getUsers();
        setUsersData(res.data);
      } catch {
        // Erreur lors de la suppression
      }
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      {/* Header avec navigation vers les dashboards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <Link href="/dashboard/admin" className="mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            <Home className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 flex items-center">
            <Shield className="h-6 w-6 mr-2 md:h-8 md:w-8 md:mr-3" />
            Administration des Utilisateurs
          </h1>
        </div>
        
        <div className="w-full md:w-auto flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg flex items-center"
            onClick={() => setActiveTab('add')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Navigation vers les autres dashboards */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link 
          href="/dashboard/ga" 
          className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          Dashboard Gardien
        </Link>
        <Link 
          href="/dashboard/gl" 
          className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          Dashboard Gestionnaire Locative
        </Link>
        <Link 
          href="/dashboard/gt" 
          className="px-3 py-1.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
        >
          Dashboard Gestionnaire Technique
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="pt-4 mb-6 border-b border-gray-200 dark:border-neutral-700 overflow-x-auto">
        <div className="flex space-x-2 sm:space-x-4 min-w-max">
          {[
            { id: 'list', label: 'Liste des utilisateurs', icon: <Users className="h-4 w-4 mr-1" /> },
            { id: 'add', label: 'Ajouter un utilisateur', icon: <UserPlus className="h-4 w-4 mr-1" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'list' | 'add')}
              className={`py-2 px-3 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Filtrer par rôle
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
              >
                <option value="all">Tous les rôles</option>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Filtrer par statut
              </label>
              <select
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'inactive' | 'pending')}
              >
                <option value="all">Tous les statuts</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'list' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Liste des Utilisateurs ({filteredUsers.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Dernière connexion</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Date de création</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-neutral-200">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-neutral-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                          : user.role === 'gt' || user.role === 'gl'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : user.role === 'pd' || user.role === 'pt'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : user.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.status ? statusLabels[user.status] : 'Non défini'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        {user.lastConnection}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 dark:text-neutral-200">
                        {user.createdAt}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          onClick={() => handleDeleteUser(user._id.toString())}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-neutral-300">
                    Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">
                      {Math.min(startIndex + usersPerPage, filteredUsers.length)}
                    </span> sur <span className="font-medium">{filteredUsers.length}</span> utilisateurs
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronsRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200 mb-1">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500 dark:text-neutral-400">Aucun utilisateur ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-200 flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Ajouter un nouvel utilisateur
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  required
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Mot de passe
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="generatePassword"
                      name="generatePassword"
                      checked={newUser.generatePassword}
                      onChange={() => setNewUser({...newUser, generatePassword: true})}
                      className="mr-2"
                    />
                    <label htmlFor="generatePassword" className="text-sm text-gray-700 dark:text-neutral-300">
                      Générer un mot de passe automatiquement
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="customPassword"
                      name="generatePassword"
                      checked={!newUser.generatePassword}
                      onChange={() => setNewUser({...newUser, generatePassword: false})}
                      className="mr-2"
                    />
                    <label htmlFor="customPassword" className="text-sm text-gray-700 dark:text-neutral-300">
                      Définir un mot de passe personnalisé
                    </label>
                  </div>
                  
                  {!newUser.generatePassword && (
                    <div className="mt-2">
                      <input
                        type="password"
                        placeholder="Saisir le mot de passe"
                        value={newUser.customPassword}
                        onChange={(e) => setNewUser({...newUser, customPassword: e.target.value})}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg"
              >
                Créer l&apos;utilisateur
              </button>
              {formError && (
                <div className="mt-2 text-xs text-red-600 text-center">{formError}</div>
              )}
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default AdminUsersPage;