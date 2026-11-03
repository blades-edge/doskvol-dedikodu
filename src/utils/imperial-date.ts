export const imperialMonths = ["Mendar", "Kalivet", "Suran", "Ulsivet", "Volnivet", "Elisar"] as const;

type ImperialDate = { day: number; month: (typeof imperialMonths)[number]; year: number };

export function imperialDateOrder({ day, month, year }: ImperialDate) {
  return (year * imperialMonths.length + imperialMonths.indexOf(month)) * 60 + day;
}

export function formatImperialDate({ day, month, year }: ImperialDate) {
  return `${day} ${month} ${year}`;
}
