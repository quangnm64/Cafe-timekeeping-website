'use client';

import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '@/lib/auth/get-current-user';

import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import {
  Card,
  CardContent,
} from '@/react-web-ui-shadcn/src/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/react-web-ui-shadcn/src/components/ui/dialog';

import { Calendar, Send, Search } from 'lucide-react';
import { shift } from '@/constants/shift';

interface ScheduleItem {
  workDate: string;
  shiftId: number;
}

interface ShiftAssignment {
  id?: string;
  employeeId: string;
  dateKey: string;
  shiftId: string;
}

export type UserType = {
  id: number;
  fullName: string;
  taxCode?: string;
  storeId: number;
  schedules?: ScheduleItem[];
};

const DAYS_TEXT = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
];

export function ArrangeWorkSchedulePage() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [staff, setStaff] = useState<UserType[]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    employeeId: string;
    dateKey: string;
  } | null>(null);

  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitStatus, setSubmitStatus] = useState(false);

  const nextWeekDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  }, []);

  const daysInNextWeek = useMemo(() => {
    const d = new Date(nextWeekDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  }, [nextWeekDate]);

  const getDateKey = (date: Date) => date.toISOString().slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        await axios
          .post('/api/arrange-schedule', {
            content: 'getdata',
            monday: daysInNextWeek[0],
            sunday: daysInNextWeek[6],
            storeId: user.storeId,
          })
          .then((res) => {
            const staffData: UserType[] = res.data.result ?? [];
            console.log(res.data);
            setStaff(staffData);
            setSubmitStatus(Boolean(res.data.status));
            const mappedAssignments: ShiftAssignment[] = staffData.flatMap(
              (emp) =>
                (emp.schedules ?? []).map((s) => ({
                  id: String(emp.id),
                  employeeId: String(emp.id),
                  dateKey: new Date(s.workDate).toISOString().slice(0, 10),
                  shiftId: String(s.shiftId),
                }))
            );
            setAssignments(mappedAssignments);
          });
      } catch {
        alert('Có lỗi xảy ra');
      }
    };

    fetchData();
  }, [daysInNextWeek]);

  const filteredShifts = useMemo(() => {
    return shift.filter((s) =>
      `${s.name} ${s.startTime} ${s.endTime}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCellClick = (employeeId: string, date: Date) => {
    setSelectedCell({ employeeId, dateKey: getDateKey(date) });
    setShowTimeModal(true);
  };

  const handleTimeSelect = (shiftId: string) => {
    if (!selectedCell) return;

    setAssignments((prev) => [
      ...prev.filter(
        (a) =>
          !(
            a.employeeId === selectedCell.employeeId &&
            a.dateKey === selectedCell.dateKey
          )
      ),
      { ...selectedCell, shiftId },
    ]);

    setShowTimeModal(false);
    setSearchTerm('');
  };

  const handlePreSubmit = () => {
    const totalRequired = staff.length * 7;
    if (assignments.length < totalRequired) {
      alert('Vui lòng điền đầy đủ lịch!');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/arrange-schedule', {
        content: 'submit',
        schedule: assignments,
      });
    } catch {
      alert('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between bg-white p-5 rounded-2xl shadow">
        <div className="flex gap-3 items-center">
          <Calendar className="text-orange-600" />
          <div>
            <h1 className="font-bold text-lg">Sắp xếp lịch tuần sau</h1>
            <p className="text-sm text-gray-500">
              {daysInNextWeek[0].toLocaleDateString('vi-VN')} -{' '}
              {daysInNextWeek[6].toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        <Button onClick={handlePreSubmit} disabled={isSubmitting}>
          <Send className="w-4 h-4 mr-2" />
          {submitStatus ? 'Nộp lại lịch' : 'Nộp lịch'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#54754a] text-white">
                <th className="p-4 sticky left-0 bg-[#54754a]">Nhân viên</th>
                {daysInNextWeek.map((d, i) => (
                  <th key={i} className="p-4 text-center">
                    <div className="text-xs">{DAYS_TEXT[i]}</div>
                    <div className="font-bold">
                      {d.getDate()}/{d.getMonth() + 1}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {staff.map((emp) => (
                <tr key={emp.id} className="border-b">
                  <td className="p-4 sticky left-0 bg-white font-bold">
                    {emp.fullName}
                  </td>

                  {daysInNextWeek.map((date, idx) => {
                    const key = getDateKey(date);
                    const assign = assignments.find(
                      (a) =>
                        Number(a.employeeId) === emp.id && a.dateKey === key
                    );
                    const shiftItem = shift.find(
                      (s) => s.id === Number(assign?.shiftId)
                    );

                    return (
                      <td
                        key={idx}
                        onClick={() => handleCellClick(emp.id.toString(), date)}
                        className="p-2 text-center cursor-pointer"
                      >
                        {shiftItem ? (
                          <div className="bg-emerald-50 rounded-lg text-xs p-2">
                            <div className="font-bold">{shiftItem.name}</div>
                            <div>
                              {shiftItem.startTime} - {shiftItem.endTime}
                            </div>
                          </div>
                        ) : (
                          <div className="italic text-gray-400">Trống</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={showTimeModal} onOpenChange={setShowTimeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn ca làm</DialogTitle>
            <div className="relative mt-3">
              <Search className="absolute left-2 top-3 w-4 h-4 text-gray-400" />
              <Input
                className="pl-8"
                placeholder="Tìm ca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </DialogHeader>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredShifts.map((s) => (
              <Button
                key={s.id}
                variant="outline"
                className="w-full justify-between"
                onClick={() => handleTimeSelect(String(s.id))}
              >
                <div>
                  <div className="font-bold">{s.name}</div>
                  <div className="text-xs">
                    {s.startTime} - {s.endTime}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận nộp lịch?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn chắc chắn muốn nộp lịch làm việc tuần sau?
          </AlertDialogDescription>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalSubmit}>
              Xác nhận
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
