'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Badge } from '@/react-web-ui-shadcn/src/components/ui/badge';
import { Calendar, Lock, RotateCcw, ChevronRight, Search } from 'lucide-react';
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
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Skeleton } from '@/react-web-ui-shadcn/src/components/ui/skeleton';
import axios from 'axios';

// --- Types ---
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
  id: string; // ID của bảng Approval
  explanationId: string; // ID của bảng Explanation
  employeeId: string;
  employeeName: string;
  store: string;
  reportDate: string;
  issue: string;
  explanation: string;
  status: Exclude<ReportStatus, 'all'>;
  reviewer?: string;
  reviewDate?: string;
  isLocked: boolean;
  auditLogs: AuditLog[];
}

interface APIResponseItem {
  id: number;
  decision: 'approved' | 'rejected' | 'pending';
  approverId: number | null;
  approvedAt: string | null;
  explanation: {
    id: number;
    reason: string;
    note: string | null;
    employee: { id: number; fullName: string; storeId: number };
    attendance: { workDate: string; status: string; shiftId: number };
  };
}

export function ExplanationApprovalManagementPage() {
  const [explanations, setExplanations] = useState<ExplanationReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExplanation, setSelectedExplanation] =
    useState<ExplanationReport | null>(null);

  // UI States
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [interventionOpen, setInterventionOpen] = useState(false);

  // Filter States (Temp states for inputs)
  const [tempStore, setTempStore] = useState('');
  const [tempEmployee, setTempEmployee] = useState('');
  const [fromDate, setFromDate] = useState<Date>(subDays(new Date(), 10)); // 10 ngày trước
  const [toDate, setToDate] = useState<Date>(new Date()); // Hôm nay
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>('all');

  // Applied States (Only update when click Search)
  const [filters, setFilters] = useState({
    store: '',
    employee: '',
    from: subDays(new Date(), 10),
    to: new Date(),
  });

  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    await axios
      .get('/api/staff-approval-management')
      .then((res) => {
        const apiResult: APIResponseItem[] = res.data.result;

        if (Array.isArray(apiResult)) {
          const mappedData: ExplanationReport[] = apiResult.map((item) => {
            const exp = item.explanation;
            const emp = exp?.employee;
            const att = exp?.attendance;

            return {
              id: item.id.toString(),
              explanationId: exp?.id.toString() || '',
              employeeId: emp?.id?.toString() || 'N/A',
              employeeName: emp?.fullName || 'Không rõ',
              store:
                emp?.storeId === 2 ? 'Hà Nội' : `Chi nhánh ${emp?.storeId}`,
              reportDate: att?.workDate
                ? format(new Date(att.workDate), 'dd/MM/yyyy')
                : '---',
              issue:
                att?.status === 'Deviation' ? 'Sai lệch công' : 'Lỗi chấm công',
              explanation: exp?.reason || 'N/A',
              status:
                item.decision === 'rejected'
                  ? 'rejected'
                  : item.decision === 'approved'
                  ? 'approved'
                  : 'pending',
              isLocked: false,
              auditLogs: item.approvedAt
                ? [
                    {
                      id: `log-${item.id}`,
                      action:
                        item.decision === 'rejected' ? 'Từ chối' : 'Đã duyệt',
                      by: `Admin ${item.approverId}`,
                      date: format(
                        new Date(item.approvedAt),
                        'dd/MM/yyyy HH:mm'
                      ),
                      reason: exp?.note || undefined,
                    },
                  ]
                : [],
            };
          });
          setExplanations(mappedData);
        }
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSearch = () => {
    setFilters({
      store: tempStore,
      employee: tempEmployee,
      from: fromDate,
      to: toDate,
    });
  };

  const filteredExplanations = useMemo(() => {
    return explanations.filter((exp) => {
      const [d, m, y] = exp.reportDate.split('/').map(Number);
      const expDateObj = startOfDay(new Date(y, m - 1, d));

      const isInDateRange =
        expDateObj >= startOfDay(filters.from) &&
        expDateObj <= endOfDay(filters.to);
      const matchesStore = !filters.store || exp.store === filters.store;
      const matchesEmployee =
        !filters.employee ||
        exp.employeeName
          .toLowerCase()
          .includes(filters.employee.toLowerCase()) ||
        exp.employeeId.includes(filters.employee);
      const matchesStatus =
        selectedStatus === 'all' || exp.status === selectedStatus;

      return isInDateRange && matchesStore && matchesEmployee && matchesStatus;
    });
  }, [explanations, filters, selectedStatus]);

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
      <Badge className={`${styles[status]} border shadow-none font-normal`}>
        {labels[status]}
      </Badge>
    ) : null;
  };

  const handleOverride = async (report: ExplanationReport | null) => {
    if (!report) return;
    setIsLoading(true);

    // Xác định decision mới (đảo ngược trạng thái)
    const newDecision = report.status === 'approved' ? 'rejected' : 'approved';

    try {
      const result = await axios.post('/api/staff-approval-management', {
        approvalId: report.id,
        explanationId: report.explanationId,
        decision: newDecision,
        employeeName: report.employeeName,
      });
      alert(result.data.message);
      await fetchStatus();

      setInterventionOpen(false);
      setDetailsOpen(false);
    } catch (err) {
      console.error('Lỗi can thiệp:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 cursor-default">
      <Card className="p-3">
        <div className="grid grid-cols-12 gap-3 items-end">
          {/* <div className="col-span-3">
            <label className="block text-xs font-medium mb-1">Cửa hàng</label>
            <select
              value={tempStore}
              onChange={(e) => setTempStore(e.target.value)}
              className="w-full border-2 border-primary rounded px-2 py-2 text-sm bg-transparent"
            >
              <option value="">-- Tất cả --</option>
              {uniqueStores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div> */}

          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1">
              Mã NV / Tên
            </label>
            <Input
              placeholder="Tìm kiếm..."
              value={tempEmployee}
              onChange={(e) => setTempEmployee(e.target.value)}
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
                  {format(fromDate, 'dd/MM/yyyy')}
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
                  {format(toDate, 'dd/MM/yyyy')}
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

          <div className="col-span-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 h-9"
            >
              <Search className="w-4 h-4 mr-2" /> Tìm kiếm
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
              {isLoading ? (
                <Skeleton className="h-6 w-10 mx-auto" />
              ) : (
                <div className="text-xl font-bold">
                  {
                    explanations.filter(
                      (e) => opt.value === 'all' || e.status === opt.value
                    ).length
                  }
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {opt.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
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
        )}
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
              <div className="bg-muted/30 p-3 rounded text-sm space-y-2">
                <p>
                  <strong>Nhân viên:</strong> {selectedExplanation.employeeName}
                </p>
                <p>
                  <strong>Cửa hàng:</strong> {selectedExplanation.store}
                </p>
                <p>
                  <strong>Loại lỗi:</strong> {selectedExplanation.issue}
                </p>
                <p>
                  <strong>Nội dung giải trình:</strong>{' '}
                  {selectedExplanation.explanation}
                </p>
              </div>
              {!selectedExplanation.isLocked &&
                selectedExplanation.status !== 'pending' && (
                  <Button
                    onClick={() => setInterventionOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
              Bạn có chắc chắn muốn đảo ngược trạng thái duyệt của nhân viên
              <span className="font-bold text-foreground">
                {' '}
                {selectedExplanation?.employeeName}
              </span>{' '}
              không?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setInterventionOpen(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => handleOverride(selectedExplanation)}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
