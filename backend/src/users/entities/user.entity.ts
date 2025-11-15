import { Profile } from 'src/profiles/entities/profile.entity';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profileId: string;
  profile?: Profile;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
