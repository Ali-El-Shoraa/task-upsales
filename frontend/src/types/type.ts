export interface AuthUser {
  token: string;
  user: {
    id: number;
    fallName: string;
    email: string;
    profilePic?: string;
    createdAt: string;
  };
}

export interface AuthState {
  authUser: AuthUser | null;
  // isAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingLoading: boolean;

  checkAuth: () => Promise<boolean | undefined>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

export interface SignupData {
  fallName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Movie {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: number;
  location: string;
  duration: number;
  year: number;
  posterUrl: string;
  createdAt: string;
}

export interface MovieQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface MoviesResponse {
  message: string;
  data: Movie[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search: string;
    type: string;
    sortBy: string;
    sortOrder: string;
  };
}

export interface MoviesState {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
}

export interface MovieFormProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: Movie | null;
  mode: "create" | "edit";
}

export type MyComponentProps = {
  handleAddMovie: () => void;
  uniqueTypes: string[];
  setFilterType: (type: string) => void;
  filterType: string;
  setSearch: (value: string) => void;
  search: string;
};
