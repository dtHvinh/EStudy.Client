export default interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface AuthorType {
  id: number;
  name: string;
  profilePicture?: string;
  creationDate: string;
}

export interface LoadingableComponentProps {
  loading?: boolean;
}

export type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null;
