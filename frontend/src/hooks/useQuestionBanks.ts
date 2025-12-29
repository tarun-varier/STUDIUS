import { useState, useEffect, useCallback } from 'react';
import { resourcesApi } from '@/lib/api/client';
import { QuestionBank } from '@/types';

export function useQuestionBanks() {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionBanks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await resourcesApi.getQuestionBanks();
      setQuestionBanks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch question banks');
      console.error('Error fetching question banks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  const createQuestionBank = async (formData: FormData) => {
    try {
      const newBank = await resourcesApi.createQuestionBank(formData);
      setQuestionBanks(prev => [newBank, ...prev]);
      return newBank;
    } catch (err) {
      throw err;
    }
  };

  return {
    questionBanks,
    isLoading,
    error,
    refetch: fetchQuestionBanks,
    createQuestionBank,
  };
}
