export const parseDate = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
);

export const parseDateRange = (start, end) => `${parseDate(start)} - ${parseDate(end)}`;

export const parseTime = (date) => (
  date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
)

export const parseMonthYear = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
);

export const parseMonthDay = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })
);

export const parseMonthDayYear = (date) => (
  date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
)
