import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type KYCStatus = 'pending' | 'verified' | 'rejected' | null;

const useKYC = (userId: string | undefined) => {
  const [kycStatus, setKYCStatus] = useState<KYCStatus>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching KYC:', error.message);
        setKYCStatus(null);
      } else {
        setKYCStatus(data?.status || null);
      }

      setLoading(false);
    };

    fetchKYCStatus();
  }, [userId]);

  return { kycStatus, loading };
};

export default useKYC;
