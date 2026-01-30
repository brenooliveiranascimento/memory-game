import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';

export function useLoginViewModel() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setAuthenticated } = useAuthStore();

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setError(null);
  }, []);

  const handleLogin = useCallback(async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Por favor, digite seu nome');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await setAuthenticated(true, trimmedName);
      setIsLoading(false);
      return true;
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  }, [name, setAuthenticated]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    name,
    isLoading,
    error,
    setName: handleNameChange,
    handleLogin,
    clearError,
  };
}
