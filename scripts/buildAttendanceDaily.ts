import { combineDateAndTime } from '@/constants/utils/date';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ONE_HOUR = 60 * 60 * 1000;

/**
 * Tạo explanation nếu chưa tồn tại
 * Quy ước: attendanceId = log OUT hợp lệ
 */
async function createExplanationIfNotExists(
  employeeId: number,
  workScheduleId: number,
  attendanceId: number
) {
  const existed = await prisma.attendanceExplanation.findFirst({
    where: {
      employeeId,
      workScheduleId,
    },
  });

  if (existed) return;

  await prisma.attendanceExplanation.create({
    data: {
      employeeId,
      workScheduleId,
      attendanceId, // 🔥 BẮT BUỘC theo schema
      approvalStatus: 'NO',
      explanationStatus: 'NO',
      submissionStatus: 'NO',
    },
  });
}

async function main() {
  console.log('⏱️ Building attendance daily...');

  // ===== 1. Ngày cần tổng hợp =====
  const workDate = new Date();
  workDate.setHours(0, 0, 0, 0);

  // ===== 2. Lấy toàn bộ lịch làm trong ngày =====
  const schedules = await prisma.workSchedule.findMany({
    where: { workDate },
    include: {
      shift: true,
    },
  });

  for (const schedule of schedules) {
    const { employeeId, shift, scheduleId } = schedule;

    // ===== 3. Lấy toàn bộ log chấm công của nhân viên trong ca =====
    const logs = await prisma.attendanceLog.findMany({
      where: {
        userId: employeeId,
        shiftId: shift.id,
        workDate,
      },
      orderBy: {
        logTime: 'asc',
      },
    });

    // ❗ Không có log → bỏ qua (xử lý vắng không phép riêng nếu cần)
    if (logs.length === 0) {
      continue;
    }

    // ===== 4. Gom nhiều lần chấm IN / OUT =====
    const checkIns = logs.filter((l) => l.logType === 'IN');
    const checkOuts = logs.filter((l) => l.logType === 'OUT');

    // Thiếu IN hoặc OUT → deviation
    if (checkIns.length === 0 || checkOuts.length === 0) {
      const lastLog = logs[logs.length - 1];
      await createExplanationIfNotExists(employeeId, scheduleId, lastLog.id);
      continue;
    }

    // ===== 5. Giờ bắt đầu & kết thúc ca =====
    const shiftStart = combineDateAndTime(schedule.workDate, shift.startTime);

    const shiftEnd = combineDateAndTime(schedule.workDate, shift.endTime);

    // ===== 6. Chọn IN / OUT hợp lệ =====

    // IN hợp lệ: gần giờ bắt đầu ca nhất
    const validCheckIn = checkIns.reduce((prev, curr) => {
      return Math.abs(curr.logTime.getTime() - shiftStart.getTime()) <
        Math.abs(prev.logTime.getTime() - shiftStart.getTime())
        ? curr
        : prev;
    });

    // OUT hợp lệ: lần OUT cuối cùng
    const validCheckOut = checkOuts[checkOuts.length - 1];

    // ===== 7. So sánh giờ & xác định deviation =====
    let hasDeviation = false;

    // Vào trễ
    if (validCheckIn.logTime > shiftStart) {
      hasDeviation = true;
    }

    // Vào sớm quá 1 tiếng
    if (shiftStart.getTime() - validCheckIn.logTime.getTime() > ONE_HOUR) {
      hasDeviation = true;
    }

    // Về sớm
    if (validCheckOut.logTime < shiftEnd) {
      hasDeviation = true;
    }

    // Ra trễ quá 1 tiếng
    if (validCheckOut.logTime.getTime() - shiftEnd.getTime() > ONE_HOUR) {
      hasDeviation = true;
    }

    // ===== 8. Ghi explanation nếu có lệch =====
    if (hasDeviation) {
      await createExplanationIfNotExists(
        employeeId,
        scheduleId,
        validCheckOut.id // 🔥 OUT hợp lệ
      );
    }
  }

  console.log('✅ Done building attendance daily');
}

main()
  .catch((err) => {
    console.error('❌ buildAttendanceDaily error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
