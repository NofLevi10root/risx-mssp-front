function format_date_type_a(response_String) {
  const date = new Date(response_String);

  if (isNaN(date.getTime())) {
    return "NA"; // Invalid date
  }
  // console.log("date",date,   date ===  Invalid Date ,);
  // if (date != typeof object){return "NA"}
  // console.log("date",date,response_String);
  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits with leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits with leading zero
  const year = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits with leading zero
  return `${day}-${month}-${date.getFullYear()} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function format_date_type_a_only_hours(response_String) {
  const date = new Date(response_String);
  if (isNaN(date.getTime())) {
    return "NA"; // Invalid date
  }
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

function format_date_type_a_only_date(response_String) {
  const date = new Date(response_String);
  if (isNaN(date.getTime())) {
    return "NA"; // Invalid date
  }

  const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits with leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits with leading zero
  const year = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits with leading zero
  return `${day}-${month}-${date.getFullYear()}`;
}

function format_date_type_c(inputDate) {
  const [dd, mm, yyyy, hh, min, sec] = inputDate.split("-");
  const formattedDate = `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  return formattedDate;
}

export {
  format_date_type_a,
  format_date_type_a_only_hours,
  format_date_type_a_only_date,
  format_date_type_c,
};
