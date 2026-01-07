import { useEffect } from 'react';
import { useAuthStore, useAppDispatch } from '../hooks';
import { checkAuthToken } from '../store';

export const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuthStore();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthToken());
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>;
};
