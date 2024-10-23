const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
});

export const formatCurrency = (amount) => {
  return formatter.format(amount);
};

export const formatPercent = (percent) => {
  return `${parseInt(percent)}%`;
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString();
};

export const formatDate = (date) => {
  const dateObj = new Date(date);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

export function customRound(num) {
  let decimalPart = num % 1;

  if (decimalPart < 0.5) {
    return +Math.floor(num);
  } else if (decimalPart > 0.5) {
    return +Math.ceil(num);
  } else {
    return +num;
  }
}
