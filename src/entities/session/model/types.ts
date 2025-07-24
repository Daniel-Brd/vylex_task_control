export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}
