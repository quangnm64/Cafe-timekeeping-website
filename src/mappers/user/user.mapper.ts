import { Employee } from '@/generated/prisma/client';
import { User } from '@/shared/contexts/user-context';

export function mapEmployeeToUser(employee: Employee): User {
  return {
    employeeId: employee.employee_id.toString(),
    fullName: employee.full_name,
    gender: employee.gender,
    dateOfBirth: employee.date_of_birth,

    phone: employee.phone ?? undefined,
    email: employee.email ?? undefined,
    address: employee.address ?? undefined,

    storeId: employee.store_id.toString(),
    positionId: employee.position_id.toString(),

    hireDate: employee.hire_date,
    status: employee.status,

    avatar: employee.avatar ?? undefined,

    createdAt: employee.created_at,
    updatedAt: employee.updated_at,
  };
}
