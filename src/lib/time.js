export const parseDate = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
);

export const parseDateRange = (start, end) => `${parseDate(start)} - ${parseDate(end)}`;


export const parseMonthYear = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
);

export const parseDayMonth = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
);
