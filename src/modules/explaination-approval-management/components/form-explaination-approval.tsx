'use client';

import { useState, useMemo, useEffect } from 'react';
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
import axios from 'axios';

// --- Types & Constants ---
type ReportStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'overridden';

const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Từ chối' },
  { value: 'overridden', label: 'Đã can thiệp' },
];

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
  status: Exclude<ReportStatus, 'all'>;
  currentReviewer?: string;
  reviewer?: string;
  reviewDate?: string;
  isLocked: boolean;
  auditLogs: AuditLog[];
}

// --- Mock Data ---
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

  // Filters State
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 11, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2025, 11, 31));
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>('all');
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  async function fetchStatus() {
    await axios
      .post('/api/explaination', {
        fromDate: fromDate,
        toDate: toDate,
        content: 'getData',
      })
      .then((res) => {
        console.log(res.data.result);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  useEffect(() => {
    fetchStatus();
  }, []);
  // Logic: Filter data
  const filteredExplanations = useMemo(() => {
    return explanations.filter((exp) => {
      const [d, m, y] = exp.reportDate.split('/').map(Number);
      const expDateObj = new Date(y, m - 1, d);

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
  }, [
    explanations,
    fromDate,
    toDate,
    selectedStore,
    selectedEmployee,
    selectedStatus,
  ]);

  const uniqueStores = useMemo(
    () => Array.from(new Set(explanations.map((e) => e.store))),
    [explanations]
  );

  const getStatusBadge = (status: ReportStatus) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      overridden: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    const labels: Record<string, string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      overridden: 'Đã can thiệp',
    };
    return status !== 'all' ? (
      <Badge className={`${styles[status]} border`}>{labels[status]}</Badge>
    ) : null;
  };

  const handleOverride = () => {
    if (!selectedExplanation || !overrideReason.trim()) return;

    const newStatus =
      selectedExplanation.status === 'approved' ? 'rejected' : 'approved';

    setExplanations((prev) =>
      prev.map((exp) =>
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
                  date: format(new Date(), 'dd/MM/yyyy HH:mm'),
                  reason: overrideReason,
                },
              ],
            }
          : exp
      )
    );

    setOverrideReason('');
    setInterventionOpen(false);
    setDetailsOpen(false);
  };

  return (
    <div className="space-y-3 p-4 cursor-default">
      <div className="pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Quản lý Giải trình Công
        </h1>
        <p className="text-xs text-muted-foreground">
          Quản lý toàn bộ giải trình, can thiệp quyết định và khoá dữ liệu sau
          chốt lương.
        </p>
      </div>

      <Card className="p-3">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1">Cửa hàng</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full border-2 border-primary rounded px-2 py-2 text-sm bg-transparent cursor-pointer"
            >
              <option value="">-- Tất cả --</option>
              {uniqueStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1">
              Mã NV / Tên
            </label>
            <Input
              placeholder="Tìm kiếm..."
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border-2 border-primary h-9"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Từ ngày</label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary h-9"
                >
                  {format(fromDate, 'dd/MM', { locale: vi })}
                  <Calendar className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={(d) => {
                    d && setFromDate(d);
                    setFromDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Đến ngày</label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary h-9"
                >
                  {format(toDate, 'dd/MM', { locale: vi })}
                  <Calendar className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={(d) => {
                    d && setToDate(d);
                    setToDateOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-2 flex items-end">
            <Button
              onClick={() => setLockModalOpen(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-9"
            >
              <Lock className="w-3 h-3 mr-1" /> Khoá dữ liệu
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-5 gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <Card
            key={opt.value}
            onClick={() => setSelectedStatus(opt.value)}
            className={`cursor-pointer transition-all border-2 ${
              selectedStatus === opt.value
                ? 'border-secondary shadow-md'
                : 'border-border'
            }`}
          >
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold">
                {
                  explanations.filter(
                    (e) => opt.value === 'all' || e.status === opt.value
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {opt.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-2 text-left font-semibold uppercase text-xs">
                  Ngày
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase text-xs">
                  Mã NV
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase text-xs">
                  Tên
                </th>
                <th className="px-4 py-2 text-left font-semibold uppercase text-xs">
                  Trạng thái
                </th>
                <th className="px-4 py-2 text-center font-semibold uppercase text-xs">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredExplanations.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3">{exp.reportDate}</td>
                  <td className="px-4 py-3 font-medium">{exp.employeeId}</td>
                  <td className="px-4 py-3 truncate max-w-[150px]">
                    {exp.employeeName}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(exp.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedExplanation(exp);
                        setDetailsOpen(true);
                      }}
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedExplanation && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>Chi tiết Giải trình</DialogTitle>
                  {getStatusBadge(selectedExplanation.status)}
                </div>
              </DialogHeader>

              <div className="bg-muted/30 p-3 rounded text-sm space-y-1">
                <p>
                  <strong>Nhân viên:</strong> {selectedExplanation.employeeName}{' '}
                  ({selectedExplanation.employeeId})
                </p>
                <p>
                  <strong>Lỗi:</strong> {selectedExplanation.issue}
                </p>
                <p>
                  <strong>Nội dung:</strong> {selectedExplanation.explanation}
                </p>
              </div>

              {selectedExplanation.auditLogs.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Lịch sử duyệt
                  </p>
                  {selectedExplanation.auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="text-xs p-2 border rounded bg-blue-50"
                    >
                      <p>
                        <strong>{log.action}</strong> bởi {log.by} lúc{' '}
                        {log.date}
                      </p>
                      {log.reason && (
                        <p className="mt-1 text-blue-700 italic">
                          Lý do: {log.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!selectedExplanation.isLocked &&
                selectedExplanation.status !== 'pending' && (
                  <Button
                    onClick={() => setInterventionOpen(true)}
                    className="w-full bg-purple-600"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" /> Can thiệp Quyết định
                  </Button>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={interventionOpen} onOpenChange={setInterventionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận Can thiệp</DialogTitle>
            <DialogDescription>
              Hành động này sẽ đảo ngược trạng thái hiện tại.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <label className="text-sm font-semibold">
              Lý do Super Admin <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Nhập lý do bắt buộc..."
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setInterventionOpen(false)}
            >
              Hủy
            </Button>
            <Button
              disabled={!overrideReason.trim()}
              className="flex-1 bg-purple-600"
              onClick={handleOverride}
            >
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
