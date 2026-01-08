'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Badge } from '@/react-web-ui-shadcn/src/components/ui/badge';
import { CheckCircle, XCircle, Calendar, Search } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/react-web-ui-shadcn/src/components/ui/popover';
import { Calendar as CalendarComponent } from '@/react-web-ui-shadcn/src/components/ui/calendar';
import { format, isAfter, isBefore, startOfDay, subDays } from 'date-fns';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import axios from 'axios';

type ReportStatus = 'pending' | 'approved' | 'rejected';
type FilterStatus = 'all' | ReportStatus;

interface APIEmployee {
  fullName: string;
  citizenIdNumber: string;
  currentAddress: string;
  bankAccountNumber: string;
}

interface APIShift {
  id: number;
  shiftName: string;
}

interface APIWorkSchedule {
  workDate: string;
  shift: APIShift;
}

interface APIAttendance {
  logTime: string;
  logType: string;
}

interface APIDataItem {
  id: number;
  employeeId: number;
  approvalStatus: string;
  reason: string;
  note: string;
  workDate: string;
  employee: APIEmployee;
  workSchedule: APIWorkSchedule;
  attendance?: APIAttendance;
}

interface ApprovalReport {
  id: string;
  employeeId: string;
  employeeName: string;
  address: string;
  phone: string;
  reportDate: string;
  shift: string;
  actualHours1: string;
  actualHours2: string;
  issue: string;
  newCode: string;
  explanation: string;
  status: ReportStatus;
}

export default function ExplainationApprovalPage() {
  const [isMounted, setIsMounted] = useState(false);

  const [reports, setReports] = useState<ApprovalReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ApprovalReport | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    reportId: string | null;
  }>({ open: false, action: null, reportId: null });

  const today = new Date();
  const tenDaysAgo = subDays(today, 10);

  const [fromDate, setFromDate] = useState<Date>(tenDaysAgo);
  const [toDate, setToDate] = useState<Date>(today);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [searchInput, setSearchInput] = useState<string>('');

  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: tenDaysAgo,
    toDate: today,
    search: '',
  });

  useEffect(() => {
    setIsMounted(true);
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/explaination-approval', {
        content: 'getdata',
        fromDate: fromDate,
        toDate: toDate,
      });
      const apiResult: APIDataItem[] = res.data.result;

      const mappedData: ApprovalReport[] = apiResult.map(
        (item: APIDataItem) => ({
          id: item.id.toString(),
          employeeId:
            item.employee?.citizenIdNumber || item.employeeId.toString(),
          employeeName: item.employee?.fullName || 'N/A',
          address: item.employee?.currentAddress || 'N/A',
          phone: item.employee?.bankAccountNumber || 'N/A',
          reportDate: item.workDate
            ? format(new Date(item.workDate), 'dd/MM/yyyy')
            : 'N/A',
          shift: item.workSchedule?.shift?.shiftName || 'N/A',
          actualHours1: item.attendance?.logTime
            ? format(new Date(item.attendance.logTime), 'HH:mm')
            : '-',
          actualHours2: '-',
          issue: item.reason || 'N/A',
          newCode: 'N/A',
          explanation: item.note || 'N/A',
          status:
            item.approvalStatus === 'approved'
              ? 'approved'
              : item.approvalStatus === 'rejected'
              ? 'rejected'
              : 'pending',
        })
      );
      console.log(mappedData);
      setReports(mappedData);
    } catch (err) {
      console.error('Lỗi API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromDate = (date: Date | undefined) => {
    if (date) {
      if (isAfter(startOfDay(date), startOfDay(toDate))) {
        alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
        return;
      }
      setFromDate(date);
      setFromDateOpen(false);
    }
  };

  const handleSelectToDate = (date: Date | undefined) => {
    if (date) {
      if (isBefore(startOfDay(date), startOfDay(fromDate))) {
        alert('Ngày kết thúc không được nhỏ hơn ngày bắt đầu!');
        return;
      }
      setToDate(date);
      setToDateOpen(false);
    }
  };

  const handleSearch = () => {
    setAppliedFilters({ fromDate, toDate, search: searchInput });
    fetchStatus();
  };

  const openConfirmDialog = (
    reportId: string,
    action: 'approve' | 'reject'
  ) => {
    setDialogState({ open: true, action, reportId });
  };

  const handleConfirm = async () => {
    if (!selectedReport || !dialogState.action) return;
    setIsLoading(true);
    try {
      const decisionValue =
        dialogState.action === 'approve' ? 'approved' : 'rejected';

      const response = await axios.post('/api/explaination-approval', {
        content: 'approval',
        id: Number(selectedReport.id),
        decision: decisionValue,
      });

      if (response.status === 200) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === selectedReport.id
              ? { ...r, status: decisionValue as ReportStatus }
              : r
          )
        );
      }
    } catch (err) {
      console.error('Lỗi khi lưu vào database:', err);
      alert('Lỗi kết nối server hoặc Enum không tồn tại!');
    } finally {
      setIsLoading(false);
      setDialogState({ open: false, action: null, reportId: null });
      setModalOpen(false);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const styles: Record<ReportStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    const labels: Record<ReportStatus, string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
    };
    return (
      <Badge className={`${styles[status]} border`}>{labels[status]}</Badge>
    );
  };

  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSearch =
      appliedFilters.search === '' ||
      report.employeeId
        .toLowerCase()
        .includes(appliedFilters.search.toLowerCase()) ||
      report.employeeName
        .toLowerCase()
        .includes(appliedFilters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isMounted) {
    return (
      <div className="space-y-4 p-4 max-w-7xl mx-auto animate-pulse">
        <div className="h-32 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 cursor-default max-w-7xl mx-auto">
      <Card className="p-4 shadow-sm">
        <div className="grid grid-cols-12 gap-4 items-end">
          <div className="col-span-3">
            <label className="block text-xs font-bold mb-2 uppercase text-muted-foreground">
              Từ ngày
            </label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary/50 h-10"
                >
                  {format(fromDate, 'dd/MM/yyyy')}
                  <Calendar className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={fromDate}
                  onSelect={handleSelectFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-3">
            <label className="block text-xs font-bold mb-2 uppercase text-muted-foreground">
              Đến ngày
            </label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary/50 h-10"
                >
                  {format(toDate, 'dd/MM/yyyy')}
                  <Calendar className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={toDate}
                  onSelect={handleSelectToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-4">
            <label className="block text-xs font-bold mb-2 uppercase text-muted-foreground">
              Tìm kiếm nhân viên
            </label>
            <Input
              placeholder="Mã NV hoặc Họ tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-2 border-primary/50 h-10"
            />
          </div>

          <div className="col-span-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full h-10 bg-secondary hover:bg-secondary/90 text-white font-bold"
            >
              <Search className="w-4 h-4 mr-2" />{' '}
              {isLoading ? 'ĐANG TẢI...' : 'TÌM KIẾM'}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {(
          [
            {
              id: 'all',
              label: 'Tất cả',
              color: 'border-slate-300',
              text: 'text-slate-700',
            },
            {
              id: 'pending',
              label: 'Chờ duyệt',
              color: 'border-yellow-400',
              text: 'text-yellow-600',
            },
            {
              id: 'approved',
              label: 'Đã duyệt',
              color: 'border-green-500',
              text: 'text-green-600',
            },
            {
              id: 'rejected',
              label: 'Từ chối',
              color: 'border-red-500',
              text: 'text-red-600',
            },
          ] as const
        ).map((stat) => (
          <Card
            key={stat.id}
            onClick={() => setSelectedStatus(stat.id)}
            className={`cursor-pointer transition-all border-l-4 ${
              stat.color
            } ${
              selectedStatus === stat.id
                ? 'bg-slate-50 shadow-md scale-[1.02]'
                : 'hover:bg-slate-50'
            }`}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <span className={`text-2xl font-black ${stat.text}`}>
                {stat.id === 'all'
                  ? reports.length
                  : reports.filter((r) => r.status === stat.id).length}
              </span>
              <span className="text-xs font-medium text-muted-foreground mt-1">
                {stat.label}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-y">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase text-[11px]">
                Mã Nhân Viên
              </th>
              <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase text-[11px]">
                Họ và Tên
              </th>
              <th className="px-4 py-3 text-left font-bold text-slate-600 uppercase text-[11px]">
                Ngày Giải Trình
              </th>
              <th className="px-4 py-3 text-center font-bold text-slate-600 uppercase text-[11px]">
                Trạng Thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setModalOpen(true);
                }}
                className="hover:bg-blue-50/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 font-bold text-primary">
                  {report.employeeId}
                </td>
                <td className="px-4 py-4 font-medium">{report.employeeName}</td>
                <td className="px-4 py-4 text-muted-foreground">
                  {report.reportDate}
                </td>
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(report.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none">
          {selectedReport && (
            <>
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">
                      Chi tiết giải trình
                    </p>
                    <DialogTitle className="text-2xl font-black">
                      ID: {selectedReport.id}
                    </DialogTitle>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border">
                  <div>
                    <p className="text-muted-foreground mb-1">Nhân viên</p>
                    <p className="font-bold">
                      {selectedReport.employeeId} -{' '}
                      {selectedReport.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Ngày làm việc</p>
                    <p className="font-bold">
                      {selectedReport.reportDate} ({selectedReport.shift})
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    Nội dung giải trình (Lý do & Ghi chú)
                  </p>
                  <p className="text-sm bg-white border p-4 rounded-xl italic shadow-sm">
                    {selectedReport.issue} - {selectedReport.explanation}
                  </p>
                </div>
                {selectedReport.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() =>
                        openConfirmDialog(selectedReport.id, 'reject')
                      }
                      className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      <XCircle className="mr-2 w-4 h-4" /> Từ chối
                    </Button>
                    <Button
                      onClick={() =>
                        openConfirmDialog(selectedReport.id, 'approve')
                      }
                      className="flex-1 h-12 bg-secondary hover:bg-secondary/90 text-white font-bold"
                    >
                      <CheckCircle className="mr-2 w-4 h-4" /> Phê duyệt
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={dialogState.open}
        onOpenChange={(open) =>
          !open && setDialogState({ open: false, action: null, reportId: null })
        }
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Xác nhận{' '}
              {dialogState.action === 'approve' ? 'Phê duyệt' : 'Từ chối'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đang thực hiện thay đổi trạng thái cho báo cáo của{' '}
              <b>{selectedReport?.employeeName}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold border-2 text-slate-600">
              QUAY LẠI
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`font-bold text-white ${
                dialogState.action === 'approve'
                  ? 'bg-secondary hover:bg-secondary/90'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              XÁC NHẬN
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
