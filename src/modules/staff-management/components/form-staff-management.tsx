'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/tabs';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/alert-dialog';
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';

interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  position: string;
  phone: string;
  store: string;
  email: string;
}

export function SuperAdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      employeeCode: 'EMP001',
      name: 'Nguyễn Văn A',
      position: 'Nhân viên bán hàng',
      phone: '0912345678',
      store: 'Cửa hàng 1',
      email: 'nva@example.com',
    },
    {
      id: '2',
      employeeCode: 'EMP002',
      name: 'Trần Thị B',
      position: 'Quản lý',
      phone: '0923456789',
      store: 'Cửa hàng 2',
      email: 'ttb@example.com',
    },
    {
      id: '3',
      employeeCode: 'EMP003',
      name: 'Lê Văn C',
      position: 'Kế toán',
      phone: '0934567890',
      store: 'Cửa hàng 1',
      email: 'lvc@example.com',
    },
    {
      id: '4',
      employeeCode: 'EMP004',
      name: 'Phạm Thị D',
      position: 'Nhân viên bán hàng',
      phone: '0945678901',
      store: 'Cửa hàng 2',
      email: 'ptd@example.com',
    },
    {
      id: '5',
      employeeCode: 'EMP005',
      name: 'Đặng Văn E',
      position: 'Giám đốc',
      phone: '0956789012',
      store: 'Cửa hàng 3',
      email: 'dve@example.com',
    },
    {
      id: '6',
      employeeCode: 'EMP006',
      name: 'Đặng Văn E',
      position: 'Giám đốc',
      phone: '0956789012',
      store: 'Cửa hàng 3',
      email: 'dve@example.com',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editData, setEditData] = useState<Employee | null>(null);

  const itemsPerPage = 5;

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    setDeleteConfirm(null);
  };

  const handleEditSave = () => {
    if (editData) {
      setEmployees(
        employees.map((emp) => (emp.id === editData.id ? editData : emp))
      );
      setIsEditModalOpen(false);
      setEditData(null);
    }
  };

  const handleViewDetails = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (emp: Employee) => {
    setEditData({ ...emp });
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản trị Super Admin</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý nhân viên, duyệt giải trình, và đặt lại mật khẩu
        </p>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees" className="cursor-pointer">
            Quản lý nhân viên
          </TabsTrigger>
          <TabsTrigger value="approvals" className="cursor-pointer">
            Duyệt giải trình
          </TabsTrigger>
          <TabsTrigger value="password" className="cursor-pointer">
            Đặt lại mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent className="cursor-pointer">
                <DialogHeader>
                  <DialogTitle>Thêm nhân viên mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Tên nhân viên" />
                  <Input placeholder="Mã nhân viên" />
                  <Input placeholder="Chức vụ" />
                  <Input placeholder="Số điện thoại" />
                  <Input placeholder="Email" />
                  <select className="w-full px-3 py-2 border rounded-md cursor-pointer">
                    <option>Chọn cửa hàng</option>
                    <option>Cửa hàng 1</option>
                    <option>Cửa hàng 2</option>
                  </select>
                  <Button className="w-full bg-primary hover:bg-primary/90 cursor-pointer">
                    Tạo nhân viên
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Tên
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Mã NV
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Cửa hàng
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => handleViewDetails(emp)}
                    className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {emp.employeeCode}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {emp.store}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(emp);
                          }}
                          className="cursor-pointer bg-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog
                          open={deleteConfirm === emp.id}
                          onOpenChange={(open) =>
                            !open && setDeleteConfirm(null)
                          }
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(emp.id);
                            }}
                            className="cursor-pointer text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <AlertDialogContent className="cursor-pointer">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Xác nhận xóa nhân viên
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn chắc chắn muốn xóa nhân viên {emp.name} (
                                {emp.employeeCode})?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel className="cursor-pointer">
                                Hủy
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(emp.id)}
                                className="cursor-pointer bg-destructive hover:bg-destructive/90"
                              >
                                Xóa
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages} ({filteredEmployees.length} kết
              quả)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="cursor-pointer">
              <DialogHeader>
                <DialogTitle>Thông tin chi tiết nhân viên</DialogTitle>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên</p>
                      <p className="font-semibold">{selectedEmployee.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Mã nhân viên
                      </p>
                      <p className="font-semibold">
                        {selectedEmployee.employeeCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chức vụ</p>
                      <p className="font-semibold">
                        {selectedEmployee.position}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cửa hàng</p>
                      <p className="font-semibold">{selectedEmployee.store}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="font-semibold">{selectedEmployee.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 cursor-pointer"
                    onClick={() => handleEditClick(selectedEmployee)}
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="cursor-pointer">
              <DialogHeader>
                <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
              </DialogHeader>
              {editData && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Tên</label>
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Mã nhân viên
                    </label>
                    <Input
                      value={editData.employeeCode}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          employeeCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Chức vụ
                    </label>
                    <Input
                      value={editData.position}
                      onChange={(e) =>
                        setEditData({ ...editData, position: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Cửa hàng
                    </label>
                    <select
                      value={editData.store}
                      onChange={(e) =>
                        setEditData({ ...editData, store: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md cursor-pointer"
                    >
                      <option>Cửa hàng 1</option>
                      <option>Cửa hàng 2</option>
                      <option>Cửa hàng 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Số điện thoại
                    </label>
                    <Input
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">
                      Email
                    </label>
                    <Input
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 cursor-pointer bg-transparent"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
                      onClick={handleEditSave}
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">1</p>
                  <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">1</p>
                  <p className="text-sm text-muted-foreground">Đã duyệt</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">0</p>
                  <p className="text-sm text-muted-foreground">Từ chối</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Danh sách giải trình sẽ hiển thị tại đây
          </p>
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid gap-4">
            {filteredEmployees.map((emp) => (
              <Card key={emp.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {emp.employeeCode} | {emp.position} | {emp.store}
                      </p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                      <Lock className="w-4 h-4 mr-2" />
                      Đặt lại mật khẩu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
