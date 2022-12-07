import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarService {
  private daysOfTheWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  private remapGetDay(day: number): number {
    return (day + 6) % 7;
  }

  private getFirstAndLastCalendarDayOfMonth(
    month: number,
    year: number,
  ): Date[] {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    return [firstDayOfMonth, lastDayOfMonth];
  }

  generateCalendar(month: number, year: number): Date[][] {
    month--;

    const calendar: Date[][] = [
      new Array(7).fill(undefined),
      new Array(7).fill(undefined),
      new Array(7).fill(undefined),
      new Array(7).fill(undefined),
      new Array(7).fill(undefined),
      new Array(7).fill(undefined),
    ];

    const [firstDayCurrentMonth, lastDayCurrentMonth] =
      this.getFirstAndLastCalendarDayOfMonth(month, year);

    const rows = 6;
    const cols = 7;

    let startCol = this.remapGetDay(firstDayCurrentMonth.getDay());
    let dayCounter = 1;
    let lastDayCurrentMonthIndexes = {
      row: -1,
      col: -1,
    };

    for (let row = 0; row < rows; row++) {
      for (let col = startCol; col < cols; col++) {
        if (dayCounter <= lastDayCurrentMonth.getDate()) {
          calendar[row][col] = new Date(year, month, dayCounter++);
          lastDayCurrentMonthIndexes = { row, col };
        }
      }
      startCol = 0;
    }

    const [, lastDayPreviousMonth] = this.getFirstAndLastCalendarDayOfMonth(
      month - 1,
      year,
    );

    startCol = this.remapGetDay(firstDayCurrentMonth.getDay()) - 1;
    dayCounter = lastDayPreviousMonth.getDate();

    if (startCol !== -1)
      for (let col = startCol; col >= 0; col--) {
        calendar[0][col] = new Date(year, month - 1, dayCounter--);
      }

    startCol = lastDayCurrentMonthIndexes.col;
    dayCounter = 1;

    for (let row = lastDayCurrentMonthIndexes.row; row < rows; row++) {
      for (let col = startCol; col < cols; col++) {
        if (!calendar[row][col])
          calendar[row][col] = new Date(year, month + 1, dayCounter++);
      }
      startCol = 0;
    }

    return calendar;
  }

  private isCurrentMonth(day: Date, month: number): 'true' | 'false' {
    return day.getMonth() === month ? 'true' : 'false';
  }
}
