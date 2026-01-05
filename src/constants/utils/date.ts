/**
 * Ghép DATE + TIME thành Date (giữ đúng ngày, đúng giờ)
 * workDate: Date (00:00:00)
 * time: string | Date (HH:mm:ss)
 */
export function combineDateAndTime(workDate: Date, time: string | Date): Date {
  const date = new Date(workDate);

  if (typeof time === 'string') {
    // time dạng "HH:mm" hoặc "HH:mm:ss"
    const [h, m, s = '0'] = time.split(':');
    date.setHours(Number(h), Number(m), Number(s), 0);
  } else {
    // time là Date (Prisma TIME)
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  }

  return date;
}
