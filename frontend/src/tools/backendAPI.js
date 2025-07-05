import axios from "axios";
import { message } from "antd";

export const baseBackEndURL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * Represents a book.
 * @constructor
 * @param {string} itemName - Endpoint name
 * @param {function} callBackFunc - getSelectItems put into this function list from backend
 */
export const getRowDataByURLandEndpointname = (itemName, callBackFunc) => {
  const itemAPIURL = `${baseBackEndURL}${itemName}`;

  axios
    .get(itemAPIURL)
    .then((response) => {
      const responseList = response.data;
      callBackFunc(responseList);
    })
    .catch(() => message.error(`Ошибка! Неудалось загрузить: ${itemName}`));
};

/**
 * Получает список элементов с сервера и трансформирует их под нужный формат.
 *
 * @param {string} endpoint - имя эндпоинта, например 'previous_place_of_study'
 * @param {(options: Array) => void} callBackFunc - функция для передачи готовых options
 * @param {object} config - объект с параметрами:
 *        - labelField: поле из item, которое использовать как label
 *        - valueField: поле из item, которое использовать как value
 *        - customMapFunc: опционально — собственная map-функция для item
 */
export const getSelectItemsUneversal = (
  endpoint,
  callBackFunc,
  config = { labelField: "name", valueField: "name", customMapFunc: null },
) => {
  const url = `${baseBackEndURL}${endpoint}`;

  axios
    .get(url)
    .then((response) => {
      const results = response.data.results || response.data;

      let options = [];

      if (typeof config.customMapFunc === "function") {
        options = results.map(config.customMapFunc);
      } else {
        options = results.map((item) => ({
          value: item[config.valueField],
          label: item[config.labelField],
        }));
      }

      callBackFunc(options);
    })
    .catch(() => message.error(`Ошибка! Не удалось загрузить список опций`));
};

/**
 * Return options for select antd
 * @constructor
 * @param {string} itemName - Endpoint name
 * @param {function} callBackFunc - getSelectItems put into this function list from backend
 */
export const getSelectItems = (itemName, callBackFunc) => {
  const itemAPIURL = `${baseBackEndURL}${itemName}`;

  axios
    .get(itemAPIURL)
    .then((response) => {
      const responseList = response.data.results.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      callBackFunc(responseList);
    })
    .catch(() =>
      message.error(`Ошибка! Неудалось загрузить список опций для ${itemName}`),
    );
};

export const addNewElementMultiField = (fieldname, dataObject) => {
  const url = `${baseBackEndURL}${fieldname}`;

  axios
    .post(url, dataObject)
    .then(() => {
      message.success("Элемент успешно добавлен на сервер");
    })
    .catch(() => {
      message.error("Ошибка! Не удалось добавить данные на сервер");
    });
};

/**
 * Return options for select antd
 * @constructor
 * @param {string}  fieldname - endpoint name
 * @param {string} name - field name
 */
export const addNewElement = (fieldname, name) => {
  const url = `${baseBackEndURL}${fieldname}`;
  const data = {
    name: name,
  };

  axios
    .post(url, data)
    .catch(() => message.error("Ошибка! Неудалось добавиь данныe на сервер"));
};

export const getEndpointOption = async (endpointName) => {
  const url = `${baseBackEndURL}${endpointName}`;

  try {
    const response = await axios.options(url);
    const options = response?.data?.actions?.POST;
    return options; // Возвращает объект
  } catch (error) {
    message.error("Ошибка загрузки options");
    return null; // Возвращает null в случае ошибки
  }
};

export const getFieldChoices = async (endpointName, fieldName) => {
  try {
    const options = await getEndpointOption(endpointName);

    if (!options || !(fieldName in options)) {
      message.error(`Ошибка! Нет options для поля ${fieldName}`);
      return [];
    }

    return options[fieldName].choices.map((item) => ({
      value: item.value,
      label: item.display_name,
    }));
  } catch (error) {
    message.error(`Ошибка загрузки данных для поля ${fieldName}`);
    return [];
  }
};

/**
 * Return options for select antd
 * @constructor
 * @param {string} endpointName - endpoint name
 * @param {Number} page - page for load (default = 1)
 * @param {string} searchQuery - search data (default = null)
 * @param {[string]} filters - list of string filters. Example: ["quota=1"]
 * @param {Number} pageSize - page_size
 */
export const fetchItems = (
  endpointName,
  { page = 1, searchQuery = null, filters = [], pageSize = 10 },
  callBackFunc,
) => {
  let url = baseBackEndURL + endpointName;
  url += "?page=" + page;
  url += "&page_size=" + pageSize;

  if (searchQuery !== null || searchQuery === "") {
    url += "&search=" + searchQuery;
  }

  if (filters.length > 0) {
    filters.forEach((item) => {
      url += "&" + item;
    });
  }

  axios
    .get(url)
    .then((response) => {
      callBackFunc(response.data);
    })
    .catch(() =>
      message.error(`Ошибка загрузки данных для поля ${endpointName}`),
    );
};

export async function deleteItemBy(endpointName, itemId, callBackFunc) {
  if (typeof endpointName === "undefined" || typeof itemId === "undefined") {
    message.error(`Не удалось удалить элемент`);
    return;
  }

  const baseUrl = baseBackEndURL + endpointName;

  axios
    .delete(`${baseUrl}/${itemId}`)
    .then(() => {
      message.success("Элемент удален");
      callBackFunc();
    })
    .catch(() => message.error("Ошибка удаления элемента"));
}
