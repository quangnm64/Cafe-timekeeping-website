export type LogInDto = {
  username: number;
  password: string;
};

export type UserInfo = {
  accountId: number | null;
  employeeId: number | null;
  roleId: number | null;

  employeeCode: number | null;

  lastLogin: Date | null;
};

export type ChangePasswordDto = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
