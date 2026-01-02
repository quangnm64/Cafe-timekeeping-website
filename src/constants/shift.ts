export interface ShiftTime {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

export const shift: ShiftTime[] = [
  { id: 1, name: 'S000', startTime: '00:00:00', endTime: '00:00:00' },

  { id: 2, name: 'S063', startTime: '06:30:00', endTime: '10:30:00' },
  { id: 3, name: 'S063', startTime: '06:30:00', endTime: '11:30:00' },
  { id: 4, name: 'S063', startTime: '06:30:00', endTime: '12:30:00' },
  { id: 5, name: 'S063', startTime: '06:30:00', endTime: '13:30:00' },
  { id: 6, name: 'S063', startTime: '06:30:00', endTime: '14:30:00' },

  { id: 7, name: 'S070', startTime: '07:00:00', endTime: '11:00:00' },
  { id: 8, name: 'S070', startTime: '07:00:00', endTime: '12:00:00' },
  { id: 9, name: 'S070', startTime: '07:00:00', endTime: '13:00:00' },
  { id: 10, name: 'S070', startTime: '07:00:00', endTime: '14:00:00' },
  { id: 11, name: 'S070', startTime: '07:00:00', endTime: '15:00:00' },

  { id: 12, name: 'S073', startTime: '07:30:00', endTime: '11:30:00' },
  { id: 13, name: 'S073', startTime: '07:30:00', endTime: '12:30:00' },
  { id: 14, name: 'S073', startTime: '07:30:00', endTime: '13:30:00' },
  { id: 15, name: 'S073', startTime: '07:30:00', endTime: '14:30:00' },
  { id: 16, name: 'S073', startTime: '07:30:00', endTime: '15:30:00' },

  { id: 17, name: 'S080', startTime: '08:00:00', endTime: '12:00:00' },
  { id: 18, name: 'S080', startTime: '08:00:00', endTime: '13:00:00' },
  { id: 19, name: 'S080', startTime: '08:00:00', endTime: '14:00:00' },
  { id: 20, name: 'S080', startTime: '08:00:00', endTime: '15:00:00' },
  { id: 21, name: 'S080', startTime: '08:00:00', endTime: '16:00:00' },

  { id: 22, name: 'S083', startTime: '08:30:00', endTime: '12:30:00' },
  { id: 23, name: 'S083', startTime: '08:30:00', endTime: '13:30:00' },
  { id: 24, name: 'S083', startTime: '08:30:00', endTime: '14:30:00' },
  { id: 25, name: 'S083', startTime: '08:30:00', endTime: '15:30:00' },
  { id: 26, name: 'S083', startTime: '08:30:00', endTime: '16:30:00' },

  { id: 27, name: 'S090', startTime: '09:00:00', endTime: '13:00:00' },
  { id: 28, name: 'S090', startTime: '09:00:00', endTime: '14:00:00' },
  { id: 29, name: 'S090', startTime: '09:00:00', endTime: '15:00:00' },
  { id: 30, name: 'S090', startTime: '09:00:00', endTime: '16:00:00' },
  { id: 31, name: 'S090', startTime: '09:00:00', endTime: '17:00:00' },

  { id: 32, name: 'S093', startTime: '09:30:00', endTime: '13:30:00' },
  { id: 33, name: 'S093', startTime: '09:30:00', endTime: '14:30:00' },
  { id: 34, name: 'S093', startTime: '09:30:00', endTime: '15:30:00' },
  { id: 35, name: 'S093', startTime: '09:30:00', endTime: '16:30:00' },
  { id: 36, name: 'S093', startTime: '09:30:00', endTime: '17:30:00' },

  { id: 37, name: 'S100', startTime: '10:00:00', endTime: '14:00:00' },
  { id: 38, name: 'S100', startTime: '10:00:00', endTime: '15:00:00' },
  { id: 39, name: 'S100', startTime: '10:00:00', endTime: '16:00:00' },
  { id: 40, name: 'S100', startTime: '10:00:00', endTime: '17:00:00' },
  { id: 41, name: 'S100', startTime: '10:00:00', endTime: '18:00:00' },

  { id: 42, name: 'S103', startTime: '10:30:00', endTime: '14:30:00' },
  { id: 43, name: 'S103', startTime: '10:30:00', endTime: '15:30:00' },
  { id: 44, name: 'S103', startTime: '10:30:00', endTime: '16:30:00' },
  { id: 45, name: 'S103', startTime: '10:30:00', endTime: '17:30:00' },
  { id: 46, name: 'S103', startTime: '10:30:00', endTime: '18:30:00' },

  { id: 47, name: 'S110', startTime: '11:00:00', endTime: '15:00:00' },
  { id: 48, name: 'S110', startTime: '11:00:00', endTime: '16:00:00' },
  { id: 49, name: 'S110', startTime: '11:00:00', endTime: '17:00:00' },
  { id: 50, name: 'S110', startTime: '11:00:00', endTime: '18:00:00' },
  { id: 51, name: 'S110', startTime: '11:00:00', endTime: '19:00:00' },

  { id: 52, name: 'S113', startTime: '11:30:00', endTime: '15:30:00' },
  { id: 53, name: 'S113', startTime: '11:30:00', endTime: '16:30:00' },
  { id: 54, name: 'S113', startTime: '11:30:00', endTime: '17:30:00' },
  { id: 55, name: 'S113', startTime: '11:30:00', endTime: '18:30:00' },
  { id: 56, name: 'S113', startTime: '11:30:00', endTime: '19:30:00' },

  { id: 57, name: 'S120', startTime: '12:00:00', endTime: '16:00:00' },
  { id: 58, name: 'S120', startTime: '12:00:00', endTime: '17:00:00' },
  { id: 59, name: 'S120', startTime: '12:00:00', endTime: '18:00:00' },
  { id: 60, name: 'S120', startTime: '12:00:00', endTime: '19:00:00' },
  { id: 61, name: 'S120', startTime: '12:00:00', endTime: '20:00:00' },

  { id: 62, name: 'S123', startTime: '12:30:00', endTime: '16:30:00' },
  { id: 63, name: 'S123', startTime: '12:30:00', endTime: '17:30:00' },
  { id: 64, name: 'S123', startTime: '12:30:00', endTime: '18:30:00' },
  { id: 65, name: 'S123', startTime: '12:30:00', endTime: '19:30:00' },
  { id: 66, name: 'S123', startTime: '12:30:00', endTime: '20:30:00' },

  { id: 67, name: 'S130', startTime: '13:00:00', endTime: '17:00:00' },
  { id: 68, name: 'S130', startTime: '13:00:00', endTime: '18:00:00' },
  { id: 69, name: 'S130', startTime: '13:00:00', endTime: '19:00:00' },
  { id: 70, name: 'S130', startTime: '13:00:00', endTime: '20:00:00' },
  { id: 71, name: 'S130', startTime: '13:00:00', endTime: '21:00:00' },

  { id: 72, name: 'S133', startTime: '13:30:00', endTime: '17:30:00' },
  { id: 73, name: 'S133', startTime: '13:30:00', endTime: '18:30:00' },
  { id: 74, name: 'S133', startTime: '13:30:00', endTime: '19:30:00' },
  { id: 75, name: 'S133', startTime: '13:30:00', endTime: '20:30:00' },
  { id: 76, name: 'S133', startTime: '13:30:00', endTime: '21:30:00' },

  { id: 77, name: 'S140', startTime: '14:00:00', endTime: '18:00:00' },
  { id: 78, name: 'S140', startTime: '14:00:00', endTime: '19:00:00' },
  { id: 79, name: 'S140', startTime: '14:00:00', endTime: '20:00:00' },
  { id: 80, name: 'S140', startTime: '14:00:00', endTime: '21:00:00' },
  { id: 81, name: 'S140', startTime: '14:00:00', endTime: '22:00:00' },

  { id: 82, name: 'S143', startTime: '14:30:00', endTime: '18:30:00' },
  { id: 83, name: 'S143', startTime: '14:30:00', endTime: '19:30:00' },
  { id: 84, name: 'S143', startTime: '14:30:00', endTime: '20:30:00' },
  { id: 85, name: 'S143', startTime: '14:30:00', endTime: '21:30:00' },
  { id: 86, name: 'S143', startTime: '14:30:00', endTime: '22:30:00' },

  { id: 87, name: 'S150', startTime: '15:00:00', endTime: '19:00:00' },
  { id: 88, name: 'S150', startTime: '15:00:00', endTime: '20:00:00' },
  { id: 89, name: 'S150', startTime: '15:00:00', endTime: '21:00:00' },
  { id: 90, name: 'S150', startTime: '15:00:00', endTime: '22:00:00' },

  { id: 91, name: 'S153', startTime: '15:30:00', endTime: '19:30:00' },
  { id: 92, name: 'S153', startTime: '15:30:00', endTime: '20:30:00' },
  { id: 93, name: 'S153', startTime: '15:30:00', endTime: '21:30:00' },
  { id: 94, name: 'S153', startTime: '15:30:00', endTime: '22:30:00' },

  { id: 95, name: 'S160', startTime: '16:00:00', endTime: '20:00:00' },
  { id: 96, name: 'S160', startTime: '16:00:00', endTime: '21:00:00' },
  { id: 97, name: 'S160', startTime: '16:00:00', endTime: '22:00:00' },

  { id: 98, name: 'S163', startTime: '16:30:00', endTime: '20:30:00' },
  { id: 99, name: 'S163', startTime: '16:30:00', endTime: '21:30:00' },
  { id: 100, name: 'S163', startTime: '16:30:00', endTime: '22:30:00' },

  { id: 101, name: 'S170', startTime: '17:00:00', endTime: '21:00:00' },
  { id: 102, name: 'S170', startTime: '17:00:00', endTime: '22:00:00' },

  { id: 103, name: 'S173', startTime: '17:30:00', endTime: '21:30:00' },
  { id: 104, name: 'S173', startTime: '17:30:00', endTime: '22:30:00' },

  { id: 105, name: 'S180', startTime: '18:00:00', endTime: '22:00:00' },
  { id: 106, name: 'S183', startTime: '18:30:00', endTime: '22:30:00' },
  { id: 107, name: 'S000', startTime: '00:00:00', endTime: '00:00:00' },
];
