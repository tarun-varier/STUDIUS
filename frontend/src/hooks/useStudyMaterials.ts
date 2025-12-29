import { useState, useEffect, useCallback } from 'react';
import { resourcesApi } from '@/lib/api/client';
import { StudyMaterial } from '@/types';

export function useStudyMaterials() {
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudyMaterials = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await resourcesApi.getStudyMaterials();
      setStudyMaterials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch study materials');
      console.error('Error fetching study materials:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyMaterials();
  }, [fetchStudyMaterials]);

  const createStudyMaterial = async (formData: FormData) => {
    try {
      const newMaterial = await resourcesApi.createStudyMaterial(formData);
      setStudyMaterials(prev => [newMaterial, ...prev]);
      return newMaterial;
    } catch (err) {
      throw err;
    }
  };

  return {
    studyMaterials,
    isLoading,
    error,
    refetch: fetchStudyMaterials,
    createStudyMaterial,
  };
}
