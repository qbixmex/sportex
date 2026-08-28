export class User {
  id!: string;
  name!: string;
  username?: string;
  email!: string;
  emailVerified?: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  password!: string;
  isActive?: boolean;

  createdAt!: Date;
  updatedAt?: Date;
}
