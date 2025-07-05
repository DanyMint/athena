export const fetchSettingCardItems = async (
  baseUrl,
  page = 1,
  searchQuery = "",
) => {
  let url = baseUrl;

  if (page !== 1) {
    url += "?page=" + page;
  }

  if (searchQuery.length > 0) {
    url += url.includes("?")
      ? "&search=" + searchQuery
      : "?search=" + searchQuery;
  }

  try {
    const response = await axios.get(url);
    return {
      items: response.data.results,
      count: response.data.count,
    };
  } catch (error) {
    message.error("Ошибка загрузки данных");
    throw error;
  }
};
