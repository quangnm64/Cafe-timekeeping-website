'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
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
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
  const [reason, setReason] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:00');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 2 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    const result = await axios.post('/api/explaination', {
      content: 'submit',
      reason: reason,
      notes: notes,
      startTime: startTime,
      endTime: endTime,
      shiftCode: shiftCode,
      id: record.id,
      explanationStatus: record.explanationStatus,
    });
    console.log(result.data.status);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-[#658C58] text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">GIẢI TRÌNH CÔNG</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Upload className="h-5 w-5" />
        </Button>
      </div>

      <Card className="p-6 shadow-md border-l-4 border-l-[#658C58]">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-[#658C58]">
            Mã nhân viên: {record.employeeId}
          </h3>
          <p className="font-semibold">Lý do: {record.reason}</p>

          <p className="text-sm">
            <span className="font-medium">Ngày:</span>{' '}
            {new Date(record.createdAt).toLocaleDateString('vi-VN')}
          </p>

          <p className="text-sm">
            <span className="font-medium">Giờ vào đề xuất:</span>{' '}
            {record.proposedCheckInTime
              ? new Date(record.proposedCheckInTime).toLocaleTimeString(
                  'vi-VN',
                  { hour: '2-digit', minute: '2-digit' }
                )
              : 'Chưa có'}
          </p>

          <p className="text-sm">
            <span className="font-medium">Giờ ra đề xuất:</span>{' '}
            {record.proposedCheckOutTime
              ? new Date(record.proposedCheckOutTime).toLocaleTimeString(
                  'vi-VN',
                  { hour: '2-digit', minute: '2-digit' }
                )
              : 'Chưa có'}
          </p>

          <p className="text-sm">
            <span className="font-medium">Trạng thái gửi:</span>{' '}
            <span
              className={
                record.submissionStatus === 'YES'
                  ? 'text-green-600'
                  : 'text-orange-500'
              }
            >
              {record.submissionStatus === 'YES' ? 'Đã gửi' : 'Chưa gửi'}
            </span>
          </p>

          <p className="text-sm">
            <span className="font-medium">Trạng thái duyệt:</span>{' '}
            <span
              className={
                record.approvalStatus === 'YES'
                  ? 'text-green-600'
                  : 'text-gray-500'
              }
            >
              {record.approvalStatus === 'YES' ? 'Đã duyệt' : 'Chờ duyệt'}
            </span>
          </p>
        </div>
      </Card>

      <Card className="p-6 shadow-md">
        <h2 className="text-lg font-bold mb-4">Lý do giải trình</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Chọn lý do</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Đổi/Chưa phân/Phân sai..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="change">Đổi ca</SelectItem>
                <SelectItem value="not-assigned">Chưa phân</SelectItem>
                <SelectItem value="wrong-assignment">Phân sai</SelectItem>
                <SelectItem value="other">Lý do khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nhập mã ca mới
            </label>
            <Input
              type="text"
              placeholder="5430 - 04:00 - 08:00 // 16:00 - 20:00"
              value={shiftCode}
              onChange={(e) => setShiftCode(e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Giờ bắt đầu 1
              </label>
              <Input
                type="text"
                placeholder="00:00:00"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Giờ kết thúc 1
              </label>
              <Input
                type="text"
                placeholder="00:00:00"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú</label>
            <Textarea
              placeholder="Nhập ghi chú"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cập nhật hình ảnh (Tối đa 2 ảnh)
            </label>
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                >
                  <img
                    src={URL.createObjectURL(img) || '/placeholder.svg'}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
              {images.length < 2 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                  <Upload className="h-8 w-8 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 font-bold text-lg py-6"
          >
            Thêm lý do
          </Button>
        </div>
      </Card>
    </div>
  );
}
