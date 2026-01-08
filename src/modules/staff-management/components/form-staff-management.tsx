'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
} from '@/react-web-ui-shadcn/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/alert-dialog';
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Building2,
  CreditCard,
  MapPin,
  Calendar,
  RotateCcw,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import axios from 'axios';
import { ScrollArea } from '@/react-web-ui-shadcn/src/components/ui/scroll-area';
import { format } from 'date-fns';

// --- Interfaces ---
interface Employee {
  id: number;
  fullName: string;
  citizenIdNumber: string;
  gender: string;
  dateOfBirth: string;
  currentAddress: string;
  bankName: string;
  bankAccountNumber: string;
  hireDate: string;
  university: string;
  major: string;
  storeId: number;
  positionId: number;
}

interface DetailRowProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
}

function DetailRow({ label, value, icon: Icon }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#658C58]/60" />} {label}
      </span>
      <span className="text-sm font-semibold text-slate-700">
        {value || '---'}
      </span>
    </div>
  );
}

export function SuperAdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [targetEmpId, setTargetEmpId] = useState<number | null>(null);
  // Quản lý màn hình hiển thị: 'list' (danh sách) hoặc 'edit' (chỉnh sửa)
  const [currentView, setCurrentView] = useState<'list' | 'edit'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/staff-management');
      setEmployees(res.data.result || []);
      console.log(res.data.result);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchEmployees();
  }, [fetchEmployees]);

  if (!isMounted) return null;

  // --- Logic Xử lý Dữ liệu ---
  const itemsPerPage = 5;
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.citizenIdNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const resetPassword = async (id: number) => {
    try {
      const result = await axios.post('/api/staff-management', {
        content: 'reset-password',
        id: id,
      });
      alert(result.data.message);
    } catch (err) {
      console.error(err);
    }
  };
  const handleConfirmReset = async (id: number) => {
    setIsResetDialogOpen(false); // Đóng dialog ngay
    setProcessingId(id); // Bắt đầu trạng thái Loading cho dòng này

    try {
      const result = await axios.post('/api/staff-management', {
        content: 'reset-password',
        id: id,
        newPassword: '123456789', // Gửi kèm mật khẩu mặc định nếu server cần
      });

      if (result.data.status) {
        // Có thể dùng toast thay alert cho đẹp
        alert('Thành công: ' + result.data.message);
      }
    } catch (err) {
      console.error('Lỗi Reset:', err);
      alert('Có lỗi xảy ra khi reset mật khẩu.');
    } finally {
      setProcessingId(null); // Tắt loading, trả lại nút cho user
      setTargetEmpId(null);
    }
  };
  // const handleDelete = async (id: number) => {
  //   if (!selectedEmployee) return;

  //   try {
  //     setIsLoading(true);

  //     const response = await axios.post('/api/staff-management', {
  //       content: 'delete-staff',
  //       id: selectedEmployee.id,
  //     });

  //     if (response.data && response.data.status === true) {
  //       const updatedDataFromServer = response.data.result;

  //       setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  //       setDeleteConfirmId(null);

  //       console.log('Dữ liệu đã đồng bộ từ server:', updatedDataFromServer);
  //       setCurrentView('list');
  //       alert(response.data.message);
  //     } else {
  //       alert(response.data.message || 'Cập nhật thất bại');
  //     }
  //   } catch (err) {
  //     alert('Lỗi kết nối server hoặc lỗi hệ thống.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSaveEdit = async () => {
    if (!selectedEmployee) return;

    try {
      setIsLoading(true);

      const response = await axios.post('/api/staff-management', {
        content: 'edit-staff',
        data: selectedEmployee,
      });

      if (response.data && response.data.status === true) {
        const updatedDataFromServer = response.data.result;

        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee.id ? updatedDataFromServer : emp
          )
        );

        console.log('Dữ liệu đã đồng bộ từ server:', updatedDataFromServer);
        setCurrentView('list');
        alert(response.data.message);
      } else {
        alert(response.data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      alert('Lỗi kết nối server hoặc lỗi hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'edit' && selectedEmployee) {
    const handleChange = (
      field: keyof Employee | string,
      value: string | number
    ) => {
      setSelectedEmployee({
        ...selectedEmployee,
        [field]: value,
      });
    };

    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between border-b pb-4 bg-white sticky top-0 z-10 p-3 rounded">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('list')}
              className="rounded-full w-10 h-10 p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-[#658C58]">
                CHỈNH SỬA NHÂN VIÊN
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Đang chỉnh sửa hồ sơ của: {selectedEmployee.fullName}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentView('list')}
              className="px-6 font-semibold"
            >
              HỦY BỎ
            </Button>
            <Button
              className="bg-[#658C58] hover:bg-[#658C58]/90 text-white px-8 font-semibold"
              onClick={handleSaveEdit}
            >
              <Save className="w-4 h-4 mr-2" /> LƯU THAY ĐỔI
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-sm border-t-4 border-t-[#658C58]">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#658C58]" /> Định danh & Cá nhân
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Họ và tên
                  </label>
                  <Input
                    value={selectedEmployee.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Giới tính
                    </label>
                    <select
                      className="w-full border rounded-md h-10 px-3 text-sm focus:ring-2 focus:ring-[#658C58]/20 outline-none"
                      value={selectedEmployee.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={selectedEmployee.dateOfBirth || ''}
                      onChange={(e) =>
                        handleChange('dateOfBirth', e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Số CCCD
                  </label>
                  <Input
                    value={selectedEmployee.citizenIdNumber || ''}
                    onChange={(e) =>
                      handleChange('citizenIdNumber', e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Ngày cấp
                    </label>
                    <Input type="date" defaultValue="2015-01-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Nơi cấp
                    </label>
                    <Input defaultValue="Ho Chi Minh City" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Quốc tịch
                    </label>
                    <Input defaultValue="Vietnamese" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Dân tộc
                    </label>
                    <Input defaultValue="Kinh" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Tôn giáo
                    </label>
                    <Input defaultValue="None" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CỘT 2: ĐỊA CHỈ & HỌC VẤN */}
          <Card className="shadow-sm border-t-4 border-t-[#658C58]">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#658C58]" /> Địa chỉ & Học vấn
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Địa chỉ thường trú
                  </label>
                  <Input
                    value={selectedEmployee.currentAddress || ''}
                    onChange={(e) =>
                      handleChange('currentAddress', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Địa chỉ hiện tại
                  </label>
                  <Input defaultValue="Current Address 1" />
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Trình độ học vấn
                    </label>
                    <Input defaultValue="Bachelor" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Chuyên ngành
                    </label>
                    <Input
                      value={selectedEmployee.major || ''}
                      onChange={(e) => handleChange('major', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase text-slate-500">
                      Trường đào tạo
                    </label>
                    <Input
                      value={selectedEmployee.university || ''}
                      onChange={(e) =>
                        handleChange('university', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CỘT 3: CÔNG VIỆC & TÀI CHÍNH */}
          <Card className="shadow-sm border-t-4 border-t-[#658C58]">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#658C58]" /> Công việc &
                Tài chính
              </h3>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Ngày vào làm
                  </label>
                  <Input
                    type="date"
                    value={
                      format(selectedEmployee.hireDate, 'yyyy-MM-dd') || ''
                    }
                    onChange={(e) => handleChange('hireDate', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Ngân hàng
                  </label>
                  <Input
                    value={selectedEmployee.bankName || ''}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Số tài khoản
                  </label>
                  <Input
                    value={selectedEmployee.bankAccountNumber || ''}
                    onChange={(e) =>
                      handleChange('bankAccountNumber', e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Mã số thuế
                  </label>
                  <Input defaultValue="TAX000001" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase text-slate-500">
                    Cửa hàng ID (Cơ sở làm việc)
                  </label>
                  <Input
                    type="number"
                    value={selectedEmployee.storeId || 0}
                    onChange={(e) =>
                      handleChange('storeId', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN DANH SÁCH (MẶC ĐỊNH) ---
  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="employees">Quản lý nhân viên</TabsTrigger>
          <TabsTrigger value="password">Đặt lại mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc CCCD..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Button className="bg-[#658C58] hover:bg-[#658C58]/90">
              <Plus className="w-4 h-4 mr-2" /> Thêm nhân viên
            </Button>
          </div>

          <Card className="overflow-hidden bg-white border shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[11px]">
                    Nhân viên
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[11px]">
                    Số CCCD
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-slate-600 uppercase text-[11px]">
                    Cửa hàng ID
                  </th>
                  <th className="px-4 py-4 text-right font-bold text-slate-600 uppercase text-[11px]">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-muted-foreground"
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : paginatedEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-20 text-center text-muted-foreground"
                    >
                      Không tìm thấy nhân viên nào.
                    </td>
                  </tr>
                ) : (
                  paginatedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsDetailModalOpen(true);
                      }}
                      className="border-b hover:bg-[#658C58]/5 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        {emp.fullName}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono">
                        {emp.citizenIdNumber}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        Store #{emp.storeId}
                      </td>
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#658C58] hover:bg-[#658C58] hover:text-white"
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setCurrentView('edit');
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive hover:text-white"
                            onClick={() => setDeleteConfirmId(emp.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        {/* Tab Đặt lại mật khẩu (Giữ cấu trúc bảng của bạn) */}
        <TabsContent value="password">
          <Card className="overflow-hidden bg-white border">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-4 text-left font-bold uppercase text-[11px]">
                    Nhân viên
                  </th>
                  <th className="px-4 py-4 text-left font-bold uppercase text-[11px]">
                    CCCD
                  </th>
                  <th className="px-4 py-4 text-left font-bold uppercase text-[11px]">
                    Trạng thái
                  </th>
                  <th className="px-4 py-4 text-right font-bold uppercase text-[11px]">
                    Mật khẩu
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium">{emp.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {emp.citizenIdNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded">
                        ĐANG HOẠT ĐỘNG
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Hiển thị Skeleton hoặc Loading khi đang reset */}
                      {processingId === emp.id ? (
                        <div className="flex justify-end">
                          <div className="h-7 w-20 bg-slate-200 animate-pulse rounded" />
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] font-bold"
                          disabled={processingId !== null} // Khóa tất cả các nút reset khác
                          onClick={() => {
                            setTargetEmpId(emp.id);
                            setIsResetDialogOpen(true);
                          }}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" /> RESET
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* DIALOG XÁC NHẬN */}
          <AlertDialog
            open={isResetDialogOpen}
            onOpenChange={setIsResetDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#658C58]">
                  Xác nhận Reset mật khẩu?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này sẽ đặt lại mật khẩu của nhân viên về mặc định:{' '}
                  <strong className="text-red-500">123456789</strong>. Nhân viên
                  có thể thay đổi sau khi đăng nhập.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTargetEmpId(null)}>
                  Hủy
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#658C58] hover:bg-[#658C58]/90"
                  onClick={() => {
                    if (targetEmpId) handleConfirmReset(targetEmpId);
                  }}
                >
                  Xác nhận Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Phân trang */}
        <div className="flex items-center justify-between mt-4 bg-slate-50 p-2 rounded-lg border">
          <span className="text-xs font-medium text-muted-foreground ml-2">
            Hiển thị trang {currentPage} trên tổng {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Tabs>

      {/* --- DIALOG CHI TIẾT --- */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none shadow-2xl rounded-xl">
          {selectedEmployee && (
            <div className="flex flex-col">
              <div className="bg-[#658C58] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <User className="w-5 h-5" />
                  <DialogTitle className="text-base font-bold uppercase tracking-tight">
                    {selectedEmployee.fullName}
                  </DialogTitle>
                </div>
              </div>

              <ScrollArea className="max-h-[60vh]">
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-white">
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-bold text-[#658C58] uppercase border-b pb-1">
                      Cá nhân
                    </h4>
                    <DetailRow
                      label="Số CCCD"
                      value={selectedEmployee.citizenIdNumber}
                    />
                    <DetailRow
                      label="Ngày sinh"
                      value={format(selectedEmployee.dateOfBirth, 'yyyy-MM-dd')}
                      icon={Calendar}
                    />
                    <DetailRow
                      label="Giới tính"
                      value={
                        selectedEmployee.gender === 'female' ? 'Nữ' : 'Nam'
                      }
                    />
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-bold text-[#658C58] uppercase border-b pb-1">
                      Công việc
                    </h4>
                    <DetailRow
                      label="Học vấn"
                      value={selectedEmployee.university}
                      icon={GraduationCap}
                    />
                    <DetailRow
                      label="Chuyên ngành"
                      value={selectedEmployee.major}
                    />
                    <DetailRow
                      label="Cơ sở"
                      value={`ID: ${selectedEmployee.storeId}`}
                      icon={Building2}
                    />
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-[10px] font-bold text-[#658C58] uppercase border-b pb-1">
                      Liên hệ & TK
                    </h4>
                    <DetailRow
                      label="Ngân hàng"
                      value={selectedEmployee.bankAccountNumber}
                      icon={CreditCard}
                    />
                    <p className="text-[10px] text-slate-400 -mt-3 font-medium">
                      {selectedEmployee.bankName}
                    </p>
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                      <DetailRow
                        label="Địa chỉ"
                        value={selectedEmployee.currentAddress}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="px-6 py-3 bg-slate-50 border-t flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[11px] font-bold"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  ĐÓNG
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- ALERT DIALOG XÁC NHẬN XÓA --- */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Xác nhận xóa nhân viên?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này{' '}
              <strong className="text-slate-900">không thể hoàn tác</strong>.
              Mọi dữ liệu liên quan đến nhân viên này sẽ bị xóa vĩnh viễn khỏi
              hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel className="border-none hover:bg-slate-100">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Tôi chắc chắn, hãy xóa
            </AlertDialogAction>
          </div> */}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
