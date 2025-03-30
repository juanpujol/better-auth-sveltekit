export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image: string | null | undefined | undefined;
  createdAt: Date;
  updatedAt: Date;
}
