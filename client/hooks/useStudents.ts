import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  hostel?: string;
  room?: string;
  [key: string]: any;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const API = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API}/api/students`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch students: ${res.statusText}`);
        }
        
        const data = await res.json();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, loading, error };
};
