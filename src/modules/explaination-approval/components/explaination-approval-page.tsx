'use client';

import { useState } from 'react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import { Badge } from '@/react-web-ui-shadcn/src/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  History,
  Calendar,
  Search,
} from 'lucide-react';
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
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';

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
  status: 'pending' | 'approved' | 'rejected';
  reviewer?: string;
  reviewDate?: string;
  reviewNotes?: string;
}

const mockReports: ApprovalReport[] = [
  {
    id: '1',
    employeeId: 'PL2115',
    employeeName: 'Nguyễn Minh Quang',
    address: '21 Ngô Gia Tư - KHA',
    phone: '06183836',
    reportDate: '21/12/2025',
    shift: 'OFF',
    actualHours1: '-',
    actualHours2: '-',
    issue: 'Ca: Đội/Chưa phân/Phân sai...',
    newCode: '1133 Ca PLH',
    explanation: 'Tôi muốn giải trình về ca làm việc của mình',
    status: 'pending',
  },
  {
    id: '2',
    employeeId: 'PL2116',
    employeeName: 'Trần Thị B',
    address: 'Hà Nội',
    phone: '0987654321',
    reportDate: '20/12/2025',
    shift: 'MORNING',
    actualHours1: '8',
    actualHours2: '-',
    issue: 'Giờ làm không đúng',
    newCode: '1100 Ca Sáng',
    explanation: 'Có lý do khách quan ngăn không check in kịp thời',
    status: 'approved',
    reviewer: 'Lê Văn C',
    reviewDate: '2024-12-20',
    reviewNotes: 'Đã kiểm tra và xác nhận',
  },
  {
    id: '3',
    employeeId: 'PL2117',
    employeeName: 'Phạm Văn D',
    address: 'TP HCM',
    phone: '0912345678',
    reportDate: '19/12/2025',
    shift: 'AFTERNOON',
    actualHours1: '4',
    actualHours2: '4',
    issue: 'Bị trừ ca sai',
    newCode: '1200 Ca Chiều',
    explanation: 'Đã làm full ca nhưng hệ thống ghi nhận sai',
    status: 'pending',
  },
  {
    id: '4',
    employeeId: 'PL2118',
    employeeName: 'Hoàng Văn E',
    address: 'Đà Nẵng',
    phone: '0898765432',
    reportDate: '18/12/2025',
    shift: 'EVENING',
    actualHours1: '6',
    actualHours2: '2',
    issue: 'Nhầm ca làm việc',
    newCode: '1150 Ca Tối',
    explanation: 'System ghi nhầm ca do lỗi kỹ thuật',
    status: 'rejected',
    reviewer: 'Nguyễn Văn F',
    reviewDate: '2024-12-18',
    reviewNotes: 'Không đủ chứng cứ',
  },
];

export default function ExplainationApprovalPage() {
  const [reports, setReports] = useState<ApprovalReport[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<ApprovalReport | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    action: 'approve' | 'reject' | null;
    reportId: string | null;
  }>({ open: false, action: null, reportId: null });

  const [fromDate, setFromDate] = useState<Date>(new Date(2025, 11, 1));
  const [toDate, setToDate] = useState<Date>(new Date(2025, 11, 31));
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: new Date(2025, 11, 1),
    toDate: new Date(2025, 11, 31),
    search: '',
  });
  const [hasSearched, setHasSearched] = useState(false);

  const openConfirmDialog = (
    reportId: string,
    action: 'approve' | 'reject'
  ) => {
    setDialogState({ open: true, action, reportId });
  };

  const handleConfirm = () => {
    if (!dialogState.reportId || !dialogState.action) return;

    setReports(
      reports.map((report) =>
        report.id === dialogState.reportId
          ? {
              ...report,
              status:
                dialogState.action === 'approve' ? 'approved' : 'rejected',
              reviewer: 'Admin Hiện tại',
              reviewDate: new Date().toLocaleDateString('vi-VN'),
              reviewNotes:
                dialogState.action === 'approve' ? 'Đã duyệt' : 'Không duyệt',
            }
          : report
      )
    );

    setDialogState({ open: false, action: null, reportId: null });
    setModalOpen(false);
  };

  const getFilteredReports = () => {
    return reports.filter((report) => {
      const reportDateParts = report.reportDate.split('/');
      const reportDateObj = new Date(
        Number.parseInt(reportDateParts[2]),
        Number.parseInt(reportDateParts[1]) - 1,
        Number.parseInt(reportDateParts[0])
      );

      const isInDateRange =
        reportDateObj >= appliedFilters.fromDate &&
        reportDateObj <= appliedFilters.toDate;

      const matchesStatus =
        selectedStatus === 'all' || report.status === selectedStatus;

      const matchesSearch =
        !hasSearched ||
        appliedFilters.search === '' ||
        report.employeeId
          .toLowerCase()
          .includes(appliedFilters.search.toLowerCase()) ||
        report.employeeName
          .toLowerCase()
          .includes(appliedFilters.search.toLowerCase());

      return isInDateRange && matchesStatus && matchesSearch;
    });
  };

  const getStatusCountsForCards = () => {
    return reports.filter((report) => {
      const reportDateParts = report.reportDate.split('/');
      const reportDateObj = new Date(
        Number.parseInt(reportDateParts[2]),
        Number.parseInt(reportDateParts[1]) - 1,
        Number.parseInt(reportDateParts[0])
      );

      // Sửa ở đây: Dùng appliedFilters thay vì state trực tiếp
      return (
        reportDateObj >= appliedFilters.fromDate &&
        reportDateObj <= appliedFilters.toDate
      );
    });
  };

  const filteredReports = getFilteredReports();
  const dateFilteredReports = getStatusCountsForCards();

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
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };
  const handleSearch = () => {
    setHasSearched(true);
    setAppliedFilters({
      fromDate: fromDate,
      toDate: toDate,
      search: searchInput,
    });
  };
  return (
    <div className="space-y-3 cursor-default">
      <Card className="bg-card border-border p-3">
        <div className="grid grid-cols-12 gap-3 items-end">
          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Từ ngày
            </label>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary hover:bg-white font-normal bg-transparent hover:text-black cursor-pointer text-sm h-9"
                >
                  {format(fromDate, 'dd/MM/yyyy', { locale: vi })}
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

          <div className="col-span-3">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Đến ngày
            </label>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between border-2 border-primary hover:bg-white font-normal bg-transparent hover:text-black cursor-pointer text-sm h-9"
                >
                  {format(toDate, 'dd/MM/yyyy', { locale: vi })}
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

          <div className="col-span-4">
            <label className="block text-xs font-medium mb-1 text-foreground">
              Mã NV / Tên
            </label>
            <Input
              placeholder="Nhập mã hoặc tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border-2 border-primary bg-transparent text-foreground placeholder:text-muted-foreground cursor-text text-sm h-9"
            />
          </div>

          <div className="col-span-2">
            <Button
              onClick={handleSearch}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold h-9 rounded-lg shadow-md transition-all cursor-pointer text-sm"
            >
              <Search className="w-3 h-3 mr-1" />
              Tìm
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-2">
        <Card
          onClick={() => setSelectedStatus('all')}
          className={`bg-card border-2 cursor-pointer transition-all ${
            selectedStatus === 'all'
              ? 'border-secondary shadow-md'
              : 'border-border hover:border-secondary/50'
          }`}
        >
          <CardContent className="pt-3 pb-3 px-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {dateFilteredReports.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tất cả</p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus('pending')}
          className={`bg-card border-2 cursor-pointer transition-all ${
            selectedStatus === 'pending'
              ? 'border-yellow-500 shadow-md'
              : 'border-border hover:border-yellow-300'
          }`}
        >
          <CardContent className="pt-3 pb-3 px-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  dateFilteredReports.filter((r) => r.status === 'pending')
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Chờ duyệt
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus('approved')}
          className={`bg-card border-2 cursor-pointer transition-all ${
            selectedStatus === 'approved'
              ? 'border-green-600 shadow-md'
              : 'border-border hover:border-green-400'
          }`}
        >
          <CardContent className="pt-3 pb-3 px-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  dateFilteredReports.filter((r) => r.status === 'approved')
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Đã duyệt
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus('rejected')}
          className={`bg-card border-2 cursor-pointer transition-all ${
            selectedStatus === 'rejected'
              ? 'border-red-600 shadow-md'
              : 'border-border hover:border-red-400'
          }`}
        >
          <CardContent className="pt-3 pb-3 px-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  dateFilteredReports.filter((r) => r.status === 'rejected')
                    .length
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Từ chối
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Mã NV
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Tên
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Ngày
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                    setModalOpen(true);
                  }}
                  className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {report.employeeId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground truncate">
                    {report.employeeName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {report.reportDate}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <DialogTitle className="text-foreground">
                      TÔNG ({selectedReport.id})
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {selectedReport.employeeName}
                    </DialogDescription>
                  </div>
                  <div>{getStatusBadge(selectedReport.status)}</div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-foreground">
                    {selectedReport.employeeId} - {selectedReport.employeeName}
                  </p>
                  <p className="text-foreground">
                    Ngày: {selectedReport.reportDate}
                  </p>
                  <p className="text-foreground">Ca: {selectedReport.shift}</p>
                  <p className="text-foreground">
                    Công thực tế 1: {selectedReport.actualHours1}
                  </p>
                  <p className="text-foreground">
                    Công thực tế 2: {selectedReport.actualHours2}
                  </p>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 uppercase mb-1">
                      Vấn đề
                    </p>
                    <p className="text-sm text-blue-900">
                      {selectedReport.issue}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded border border-blue-200">
                    <p className="text-xs font-semibold text-blue-900 uppercase mb-1">
                      Mã mới
                    </p>
                    <p className="text-sm text-blue-900">
                      {selectedReport.newCode}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Trạng thái: Đã giải trình
                  </p>
                  <p className="text-sm text-foreground italic">
                    {selectedReport.explanation}
                  </p>
                </div>

                {selectedReport.status !== 'pending' && (
                  <div className="border-t border-border pt-3 bg-secondary/10 p-2 rounded space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Trạng thái:{' '}
                      <span className="text-secondary font-normal">
                        {selectedReport.status === 'approved'
                          ? 'Đã duyệt'
                          : 'Từ chối'}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Người duyệt: {selectedReport.reviewer} (
                      {selectedReport.reviewDate})
                    </p>
                  </div>
                )}

                {selectedReport.status === 'pending' && (
                  <div className="border-t border-border pt-3 flex gap-2">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/20 flex-1 bg-transparent cursor-pointer transition-colors text-sm h-9"
                    >
                      <History className="w-3 h-3 mr-2" />
                      Lịch sử
                    </Button>
                    <Button
                      onClick={() =>
                        openConfirmDialog(selectedReport.id, 'approve')
                      }
                      className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors text-sm h-9"
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Duyệt
                    </Button>
                    <Button
                      onClick={() =>
                        openConfirmDialog(selectedReport.id, 'reject')
                      }
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 cursor-pointer transition-colors text-sm h-9"
                    >
                      <XCircle className="w-3 h-3 mr-2" />
                      Không duyệt
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
        onOpenChange={(open) => {
          if (!open)
            setDialogState({ open: false, action: null, reportId: null });
        }}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Xác nhận {dialogState.action === 'approve' ? 'Duyệt' : 'Từ chối'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Bạn có chắc chắn muốn{' '}
              {dialogState.action === 'approve' ? 'duyệt' : 'từ chối'} báo cáo
              này? Hành động này không thể được hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer hover:bg-muted">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={`cursor-pointer ${
                dialogState.action === 'approve'
                  ? 'bg-secondary hover:bg-secondary/80'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
