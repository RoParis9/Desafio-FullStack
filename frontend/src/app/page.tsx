'use client';
import { useEffect, useState } from 'react';
import { usersService } from '@/services/users.service';
import { profilesService } from '@/services/profiles.service';
import { User } from '@/types/user.types';
import { Profile } from '@/types/profile.types';
import { useDebounce } from '@/hooks/useDebounce';
import { UserModal } from '@/components/UserModal';
import { UserForm } from '@/components/UserForm';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchById, setSearchById] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchingById, setSearchingById] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, profilesData] = await Promise.all([
          usersService.findAll(),
          profilesService.findAll(),
        ]);
        setAllUsers(usersData);
        setUsers(usersData);
        setProfiles(profilesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allUsers;

    if (selectedProfileId) {
      filtered = filtered.filter(
        (user) => user.profileId === selectedProfileId,
      );
    }

    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.profile?.name.toLowerCase().includes(searchLower)
        );
      });
    }

    setUsers(filtered);
  }, [debouncedSearchTerm, selectedProfileId, allUsers]);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserUpdated = async () => {
    try {
      const data = await usersService.findAll();
      setAllUsers(data);
      if (selectedUser) {
        const updatedUser = data.find((u) => u.id === selectedUser.id);
        if (updatedUser) setSelectedUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const handleUserDeleted = async () => {
    try {
      const data = await usersService.findAll();
      setAllUsers(data);
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const handleUserCreated = async () => {
    try {
      const data = await usersService.findAll();
      setAllUsers(data);
      setIsCreateModalOpen(false);
      setSearchTerm('');
      setSelectedProfileId('');
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  const handleSearchById = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchById.trim()) return;

    setSearchingById(true);
    try {
      const user = await usersService.findOne(searchById.trim());
      setSelectedUser(user);
      setIsModalOpen(true);
      setSearchById('');
    } catch (error) {
      console.error('Error searching user by ID:', error);
      alert('Usuário não encontrado');
    } finally {
      setSearchingById(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900">
        <p className="text-lg text-zinc-100">
          Carregando usuários...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-100">
            Gerenciamento de Usuários
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Criar Usuário
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <form
            onSubmit={handleSearchById}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="Buscar usuário por ID..."
              value={searchById}
              onChange={(e) => setSearchById(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-400 shadow-sm transition-colors focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <button
              type="submit"
              disabled={searchingById || !searchById.trim()}
              className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchingById ? 'Buscando...' : 'Buscar ID'}
            </button>
          </form>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Buscar por nome, email ou perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 placeholder-zinc-400 shadow-sm transition-colors focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            >
              <option value="">Todos os perfis</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-sm transition-all hover:border-zinc-600 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-100">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    {user.email}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    user.isActive
                      ? 'bg-green-900 text-green-200'
                      : 'bg-red-900 text-red-200'
                  }`}
                >
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="mt-4 border-t border-zinc-700 pt-4">
                <p className="text-sm text-zinc-400">
                  <span className="font-medium">Perfil:</span>{' '}
                  {user.profile?.name || 'N/A'}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Criado em:{' '}
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && allUsers.length > 0 && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8 text-center">
            <p className="text-zinc-400">
              Nenhum usuário encontrado para &quot;{debouncedSearchTerm}&quot;.
            </p>
          </div>
        )}

        {allUsers.length === 0 && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-8 text-center">
            <p className="text-zinc-400">
              Nenhum usuário encontrado.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      )}

      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-100">
                Criar Novo Usuário
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
                aria-label="Fechar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
            <UserForm
              onSave={handleUserCreated}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
