export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  joined_at: Date;
}

export interface UserDTO {
  username: string;
  email: string;
  password_hash: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface CredentialsDTO {
  email: string;
  password: string;
}
