import { useAppSelector } from './useAppDispatch';

export const useAuthStore = () => {

  const authState = useAppSelector(state => state.auth);


  return {
    ...authState
  }
}
