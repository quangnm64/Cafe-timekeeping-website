'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/react-web-ui-shadcn/src/components/ui/button';
import { Card } from '@/react-web-ui-shadcn/src/components/ui/card';
import { Input } from '@/react-web-ui-shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/react-web-ui-shadcn/src/components/ui/select';
import { Textarea } from '@/react-web-ui-shadcn/src/components/ui/textarea';
import { WorkRecord } from './page-work-explaination';
import { shift } from '@/constants/shift';
import axios from 'axios';

interface WorkExplanationFormProps {
  record: WorkRecord;
  onBack: () => void;
}

export function WorkExplanationForm({
  record,
  onBack,
}: WorkExplanationFormProps) {
  useEffect(() => {
    const mainContainer = document.querySelector('main');
    if (mainContainer) mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [reason, setReason] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:00');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // --- LOGIC NHẬP THỜI GIAN 24H TỰ ĐỘNG ---
  const handleTimeInputChange = (
    value: string,
    setter: (val: string) => void
  ) => {
    // 1. Chỉ lấy các chữ số
    const digits = value.replace(/\D/g, '');

    // 2. Định dạng lại theo HH:mm:ss
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.substring(0, 2); // HH
      if (digits.length > 2) {
        formatted += ':' + digits.substring(2, 4); // :mm
      }
      if (digits.length > 4) {
        formatted += ':' + digits.substring(4, 6); // :ss
      }
    }

    setter(formatted);
  };

  // Tự động bù số 0 khi người dùng thoát khỏi ô nhập (onBlur)
  const formatOnBlur = (time: string, setter: (val: string) => void) => {
    if (!time) {
      setter('00:00:00');
      return;
    }
    const parts = time.split(':');
    const hh = (parts[0] || '00').padStart(2, '0');
    const mm = (parts[1] || '00').padStart(2, '0');
    const ss = (parts[2] || '00').padStart(2, '0');
    setter(`${hh}:${mm}:${ss}`);
  };

  const handleShiftSelect = (value: string) => {
    const selected = shift.find((s) => s.id.toString() === value);
    if (selected) {
      setShiftCode(selected.id.toString());
      setStartTime(selected.startTime);
      setEndTime(selected.endTime);
    }
  };

  const handleSubmit = async () => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      alert(
        'Thời gian không hợp lệ. Vui lòng nhập đúng định dạng 24h (HH:mm:ss). Ví dụ: 14:30:00'
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/explaination', {
        content: 'submit',
        workDate: record.workSchedule.workDate,
        reason,
        notes,
        startTime,
        endTime,
        shiftCode,
        id: record.id,
        explanationStatus: record.explanationStatus,
      });
      alert('Thành công!');
      onBack();
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="bg-[#658C58] text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onBack}
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold uppercase">Giải trình công</h1>
        </div>
      </div>

      <Card className="p-6 shadow-md border-l-4 border-l-[#658C58]">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[#658C58]">
            Mã nhân viên: {record.employeeId}
          </h3>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Ngày làm việc:</span>{' '}
            {new Date(record.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </Card>

      <Card className="p-6 shadow-md border border-gray-100">
        <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">
          Chi tiết giải trình
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chọn lý do
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full border-gray-300 h-11">
                <SelectValue placeholder="Chọn lý do..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error">
                  Thiếu/Lỗi (Do chưa chấm công vào/ra được)
                </SelectItem>
                <SelectItem value="shift-change">
                  Ca: Đổi/Chưa phân/Phân sai...
                </SelectItem>
                <SelectItem value="off">Nghỉ đột xuất</SelectItem>
                <SelectItem value="late-early">Vào trễ/Ra sớm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mã ca mới
            </label>
            <Select onValueChange={handleShiftSelect}>
              <SelectTrigger className="w-full border-gray-300 h-11">
                <SelectValue placeholder="Chọn mã ca..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {shift.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ bắt đầu
              </label>
              <Input
                type="text"
                placeholder="00:00:00"
                value={startTime}
                onChange={(e) =>
                  handleTimeInputChange(e.target.value, setStartTime)
                }
                onBlur={() => formatOnBlur(startTime, setStartTime)}
                className="border-gray-300 h-11 font-mono text-center text-lg"
                maxLength={8}
              />
              <p className="text-[10px] text-gray-400 mt-1 italic text-center">
                * Nhập 24h (Ví dụ: 143000)
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Giờ kết thúc
              </label>
              <Input
                type="text"
                placeholder="00:00:00"
                value={endTime}
                onChange={(e) =>
                  handleTimeInputChange(e.target.value, setEndTime)
                }
                onBlur={() => formatOnBlur(endTime, setEndTime)}
                className="border-gray-300 h-11 font-mono text-center text-lg"
                maxLength={8}
              />
              <p className="text-[10px] text-gray-400 mt-1 italic text-center">
                * Nhập 24h (Ví dụ: 154500)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú chi tiết
            </label>
            <Textarea
              placeholder="Nhập ghi chú..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 min-h-[120px] resize-none"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hình ảnh (Tối đa 2)
            </label>
            <div className="flex gap-4 mt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-28 h-28 border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 2 && (
                <label className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                  <Upload className="h-6 w-6 text-gray-400 group-hover:text-[#658C58]" />
                  <span className="text-[10px] text-gray-400 mt-1 font-medium group-hover:text-[#658C58]">
                    Tải ảnh
                  </span>
                </label>
              )}
            </div>
          </div> */}

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || !reason || !shiftCode}
              className="w-full bg-[#658C58] hover:bg-[#547549] text-white font-bold text-lg py-7 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN GỬI GIẢI TRÌNH'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
