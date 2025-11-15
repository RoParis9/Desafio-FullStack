export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  profileId: string;
  isActive?: boolean;
}
