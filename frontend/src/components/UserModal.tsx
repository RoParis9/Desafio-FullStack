'use client';
import { useState, useEffect } from 'react';
import { User } from '@/types/user.types';
import { usersService } from '@/services/users.service';
import { UserForm } from './UserForm';

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  onUserDeleted: () => void;
}

export function UserModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
  onUserDeleted,
}: UserModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  useEffect(() => {
    setCurrentUser(user);
    setIsEditing(false);
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentUser(user);
  };

  const handleSave = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setIsEditing(false);
    onUserUpdated();
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await usersService.remove(user.id);
      onUserDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao deletar usuário');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      const updatedUser = user.isActive
        ? await usersService.deactivate(user.id)
        : await usersService.activate(user.id);
      setCurrentUser(updatedUser);
      onUserUpdated();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Erro ao alterar status do usuário');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-100">
            {isEditing ? 'Editar Usuário' : 'Detalhes do Usuário'}
          </h2>
          <button
            onClick={onClose}
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

        {isEditing ? (
          <UserForm
            user={currentUser}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Nome
                </label>
                <p className="text-zinc-100">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Email
                </label>
                <p className="text-zinc-100">{currentUser?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Perfil
                </label>
                <p className="text-zinc-100">
                  {currentUser?.profile?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Status
                </label>
                <p className="text-zinc-100">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      currentUser?.isActive
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {currentUser?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Criado em
                </label>
                <p className="text-zinc-100">
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString(
                        'pt-BR',
                      )
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400">
                  Atualizado em
                </label>
                <p className="text-zinc-100">
                  {currentUser?.updatedAt
                    ? new Date(currentUser.updatedAt).toLocaleDateString(
                        'pt-BR',
                      )
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-zinc-700 pt-4">
              <button
                onClick={handleEdit}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={handleToggleActive}
                disabled={isToggling}
                className={`flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors ${
                  currentUser?.isActive
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {isToggling
                  ? 'Processando...'
                  : currentUser?.isActive
                    ? 'Desativar'
                    : 'Ativar'}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

