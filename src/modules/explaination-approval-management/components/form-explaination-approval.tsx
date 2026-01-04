'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Badge } from '@/react-web-ui-shadcn/src/components/ui/badge';
import {
  Calendar,
  Lock,
  RotateCcw,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import { Textarea } from '@/react-web-ui-shadcn/src/components/ui/textarea';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';

interface AuditLog {
  id: string;
  action: string;
  by: string;
  date: string;
  reason?: string;
}

interface ExplanationReport {
  id: string;
  employeeId: string;
  employeeName: string;
  store: string;
  reportDate: string;
  issue: string;
  explanation: string;
  shift?: string;
  hours?: string;
  status: 'pending' | 'approved' | 'rejected' | 'overridden';
  currentReviewer?: string;
  reviewer?: string;
  reviewDate?: string;
  isLocked: boolean;
  auditLogs: AuditLog[];
}

const mockExplanations: ExplanationReport[] = [
  {
    id: '1',
    employeeId: 'PL2115',
    employeeName: 'Nguyễn Minh Quang',
    store: 'Hà Nội',
    reportDate: '21/12/2025',
    issue: 'Ca: Đội/Chưa phân/Phân sai...',
    explanation: 'Tôi muốn giải trình về ca làm việc của mình',
    status: 'approved',
    reviewer: 'Lê Văn C',
    reviewDate: '2024-12-20',
    isLocked: false,
    auditLogs: [
      {
        id: 'log1',
        action: 'Approved',
        by: 'Lê Văn C (Admin Hà Nội)',
        date: '2024-12-20 10:30',
      },
    ],
  },
  {
    id: '2',
    employeeId: 'PL2116',
    employeeName: 'Trần Thị B',
    store: 'TP HCM',
    reportDate: '20/12/2025',
    issue: 'Giờ làm không đúng',
    explanation: 'Có lý do khách quan ngăn không check in kịp thời',
    status: 'pending',
    isLocked: false,
    auditLogs: [],
  },
  {
    id: '3',
    employeeId: 'PL2117',
    employeeName: 'Phạm Văn D',
    store: 'Đà Nẵng',
    reportDate: '19/12/2025',
    issue: 'Bị trừ ca sai',
    explanation: 'Đã làm full ca nhưng hệ thống ghi nhận sai',
    status: 'rejected',
    reviewer: 'Nguyễn Văn F',
    reviewDate: '2024-12-18',
    isLocked: false,
    auditLogs: [
      {
        id: 'log2',
        action: 'Rejected',
        by: 'Nguyễn Văn F (Admin Đà Nẵng)',
        date: '2024-12-18 14:00',
        reason: 'Không đủ chứng cứ',
      },
    ],
  },
];

export function ExplanationApprovalManagementPage() {
  const [explanations, setExplanations] =
    useState<ExplanationReport[]>(mockExplanations);
  const [selectedExplanation, setSelectedExplanation] =
    useState<ExplanationReport | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [lockModalOpen, setLockModalOpen] = useState(false);

  // Filters
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 11, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2025, 11, 31));
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'pending' | 'approved' | 'rejected' | 'overridden'
  >('all');
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const getFilteredExplanations = () => {
    return explanations.filter((exp) => {
      const expDateParts = exp.reportDate.split('/');
      const expDateObj = new Date(
        Number.parseInt(expDateParts[2]),
        Number.parseInt(expDateParts[1]) - 1,
        Number.parseInt(expDateParts[0])
      );

      const isInDateRange = expDateObj >= fromDate && expDateObj <= toDate;
      const matchesStore = !selectedStore || exp.store === selectedStore;
      const matchesEmployee =
        !selectedEmployee ||
        exp.employeeName
          .toLowerCase()
          .includes(selectedEmployee.toLowerCase()) ||
        exp.employeeId.includes(selectedEmployee);
      const matchesStatus =
        selectedStatus === 'all' || exp.status === selectedStatus;

      return isInDateRange && matchesStore && matchesEmployee && matchesStatus;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
            Chờ duyệt
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-300">
            Đã duyệt
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300">
            Từ chối
          </Badge>
        );
      case 'overridden':
        return (
          <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
            Đã can thiệp
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOverride = () => {
    if (!selectedExplanation || !overrideReason.trim()) return;

    const newStatus =
      selectedExplanation.status === 'approved' ? 'rejected' : 'approved';

    setExplanations(
      explanations.map((exp) =>
        exp.id === selectedExplanation.id
          ? {
              ...exp,
              status: 'overridden',
              auditLogs: [
                ...exp.auditLogs,
                {
                  id: `log${Date.now()}`,
                  action: `Override: ${
                    newStatus === 'approved' ? 'Duyệt' : 'Từ chối'
                  }`,
                  by: 'Super Admin',
                  date: new Date().toLocaleString('vi-VN'),
                  reason: overrideReason,
                },
              ],
            }
          : exp
      )
    );

    setOverrideReason('');
    setInterventionOpen(false);
  };

  const filteredExplanations = getFilteredExplanations();
  const uniqueStores = Array.from(new Set(explanations.map((e) => e.store)));

  return (
    <div className="space-y-3 p-4 cursor-default">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Quản lý Giải trình Công
        </h1>
        <p className="text-xs text-muted-foreground">
          Quản lý toàn bộ giải trình từ các Admin cửa hàng, can thiệp quyết
          định, và khoá dữ liệu sau chốt lương
        </p>
      </div>

      {/* Filters - Real-time updates */}
      <Card className="bg-card border-border p-3">
        <div className="grid grid-cols-12 gap-3">
          {/* Store Filter */}
          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Cửa hàng
            </label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full border-2 border-primary rounded px-2 py-2 text-sm bg-transparent text-foreground cursor-pointer"
            >
              <option value="">-- Tất cả --</option>
              {uniqueStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Search */}
          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Mã NV / Tên
            </label>
            <Input
              placeholder="Tìm mã hoặc tên..."
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border-2 border-primary bg-transparent text-foreground text-sm h-9 cursor-text"
            />
          </div>

          {/* From Date */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Từ ngày
            </label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary hover:bg-white font-normal bg-transparent hover:text-black cursor-pointer text-sm h-9"
                >
                  {format(fromDate, 'dd/MM', { locale: vi })}
                  <Calendar className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    if (date) {
                      setFromDate(date);
                      setFromDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Đến ngày
            </label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary hover:bg-white font-normal bg-transparent hover:text-black cursor-pointer text-sm h-9"
                >
                  {format(toDate, 'dd/MM', { locale: vi })}
                  <Calendar className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    if (date) {
                      setToDate(date);
                      setToDateOpen(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Lock Button */}
          <div className="col-span-2 flex items-end">
            <Button
              onClick={() => setLockModalOpen(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer text-sm h-9"
            >
              <Lock className="w-3 h-3 mr-1" />
              Khoá dữ liệu
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Filter Cards */}
      <div className="grid grid-cols-5 gap-2">
        {['all', 'pending', 'approved', 'rejected', 'overridden'].map(
          (status) => {
            const count = explanations.filter(
              (e) => status === 'all' || e.status === status
            ).length;
            const statusLabel =
              status === 'all'
                ? 'Tất cả'
                : status === 'pending'
                ? 'Chờ duyệt'
                : status === 'approved'
                ? 'Đã duyệt'
                : status === 'rejected'
                ? 'Từ chối'
                : 'Đã can thiệp';

            return (
              <Card
                key={status}
                onClick={() => setSelectedStatus(status as string)}
                className={`bg-card border-2 cursor-pointer transition-all ${
                  selectedStatus === status
                    ? 'border-secondary shadow-md'
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                <CardContent className="pt-3 pb-3 px-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {count}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {statusLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>

      {/* Explanations List Table */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Ngày
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Mã NV
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Tên
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Cửa hàng
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Lý do
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Trạng thái
                </th>
                <th className="px-4 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExplanations.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-foreground">
                    {exp.reportDate}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {exp.employeeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground truncate">
                    {exp.employeeName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {exp.store}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground truncate">
                    {exp.issue}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(exp.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => {
                        setSelectedExplanation(exp);
                        setDetailsOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-muted h-8"
                    >
                      Xem <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Drawer */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selectedExplanation && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-foreground">
                      Chi tiết Giải trình
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {selectedExplanation.employeeName} -{' '}
                      {selectedExplanation.store}
                    </DialogDescription>
                  </div>
                  <div>{getStatusBadge(selectedExplanation.status)}</div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-3">
                {/* Basic Info */}
                <div className="space-y-2 text-sm bg-muted/30 p-3 rounded">
                  <p className="font-semibold text-foreground">
                    {selectedExplanation.employeeId} -{' '}
                    {selectedExplanation.employeeName}
                  </p>
                  <p className="text-foreground">
                    Cửa hàng: {selectedExplanation.store}
                  </p>
                  <p className="text-foreground">
                    Ngày làm việc: {selectedExplanation.reportDate}
                  </p>
                  <p className="text-foreground">
                    Lỗi: {selectedExplanation.issue}
                  </p>
                </div>

                {/* Explanation Content */}
                <div className="border-t border-border pt-3 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Nội dung giải trình
                  </p>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm text-blue-900">
                      {selectedExplanation.explanation}
                    </p>
                  </div>
                </div>

                {/* Audit Log Timeline */}
                {selectedExplanation.auditLogs.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Lịch sử duyệt
                    </p>
                    <div className="space-y-2">
                      {selectedExplanation.auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="bg-blue-50 p-2 rounded border border-blue-200 text-xs"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-blue-900">
                                {log.action}
                              </p>
                              <p className="text-blue-800">
                                Ai duyệt: {log.by}
                              </p>
                              <p className="text-blue-800">Lúc: {log.date}</p>
                            </div>
                            {log.reason && (
                              <div className="text-right">
                                <p className="font-semibold text-blue-900">
                                  Lý do:
                                </p>
                                <p className="text-blue-800">{log.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Super Admin Intervention */}
                {!selectedExplanation.isLocked &&
                  selectedExplanation.status !== 'pending' && (
                    <div className="border-t border-border pt-3">
                      <Button
                        onClick={() => setInterventionOpen(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white cursor-pointer h-9"
                      >
                        <RotateCcw className="w-3 h-3 mr-2" />
                        Can thiệp Quyết định
                      </Button>
                    </div>
                  )}

                {/* Locked Status */}
                {selectedExplanation.isLocked && (
                  <div className="border-t border-border pt-3 bg-red-50 p-3 rounded border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm font-semibold text-red-900">
                        Giải trình đã bị khoá
                      </p>
                    </div>
                    <p className="text-xs text-red-800 mt-1">
                      Không thể can thiệp hay thay đổi trạng thái
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Intervention Decision Modal */}
      <Dialog open={interventionOpen} onOpenChange={setInterventionOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
          {selectedExplanation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Can thiệp Quyết định
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Đảo ngược quyết định hiện tại và ghi nhận vào lịch sử duyệt
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                {/* Original Info */}
                <div className="space-y-2 text-sm bg-muted/30 p-3 rounded border border-border">
                  <p className="font-semibold text-foreground">
                    Thông tin giải trình gốc
                  </p>
                  <div className="space-y-1 mt-2">
                    <p className="text-foreground">
                      Nhân viên: {selectedExplanation.employeeName}
                    </p>
                    <p className="text-foreground">
                      Cửa hàng: {selectedExplanation.store}
                    </p>
                    <p className="text-foreground">
                      Ngày chấm công: {selectedExplanation.reportDate}
                    </p>
                    {selectedExplanation.shift && (
                      <p className="text-foreground">
                        Ca làm: {selectedExplanation.shift}
                      </p>
                    )}
                    {selectedExplanation.hours && (
                      <p className="text-foreground">
                        Giờ: {selectedExplanation.hours}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200 mt-2">
                    <p className="text-xs font-semibold text-blue-900 mb-1">
                      Lý do giải trình:
                    </p>
                    <p className="text-sm text-blue-900">
                      {selectedExplanation.explanation}
                    </p>
                  </div>
                </div>

                {/* Current Decision */}
                <div className="space-y-2 text-sm bg-amber-50 p-3 rounded border border-amber-200">
                  <p className="font-semibold text-amber-900">
                    Quyết định hiện tại
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedExplanation.status)}
                    {selectedExplanation.reviewer && (
                      <p className="text-xs text-amber-800">
                        Duyệt bởi {selectedExplanation.reviewer} vào{' '}
                        {selectedExplanation.reviewDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Intervention Reason */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Lý do can thiệp của Super Admin{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <Textarea
                    placeholder="Nhập lý do can thiệp / đảo quyết định…"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="text-sm h-20 border-2 border-border bg-white"
                  />
                  <div className="flex items-start gap-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">
                      Hành động này sẽ thay thế quyết định hiện tại và được ghi
                      nhận vào lịch sử duyệt.
                    </p>
                  </div>
                </div>

                {/* Preview Result */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Xem trước kết quả
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedExplanation.status)}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    {getStatusBadge(
                      selectedExplanation.status === 'approved'
                        ? 'rejected'
                        : 'approved'
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex gap-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setInterventionOpen(false);
                    setOverrideReason('');
                  }}
                  className="flex-1 cursor-pointer h-9"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleOverride}
                  disabled={!overrideReason.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white h-9"
                >
                  Xác nhận Can thiệp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lock Data Modal */}
      <Dialog open={lockModalOpen} onOpenChange={setLockModalOpen}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Khoá Giải trình
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Chọn phạm vi khoá dữ liệu để đảm bảo tính toàn vẹn sau chốt lương
              hoặc xuất báo cáo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full justify-start border-2 border-border hover:border-secondary cursor-pointer h-10 bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    Khoá theo Ngày
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chốt lương theo ngày
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-2 border-border hover:border-secondary cursor-pointer h-10 bg-transparent"
              >
                <Lock className="w-4 h-4 mr-2 text-secondary" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    Khoá theo Tháng
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chốt lương theo tháng
                  </p>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
