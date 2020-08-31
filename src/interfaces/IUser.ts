interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default IUser;
