export type LogInDto = {
  username: string;
  password: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type UserInfo = {
  account_id: string | null;
  employee_id: string | null;
  role_id: string | null;
  username: string | null;
  last_login: string | Date | null | null;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
