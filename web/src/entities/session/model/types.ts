export interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}
