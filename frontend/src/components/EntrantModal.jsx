import {
  Form,
  Modal,
  Input,
  Select,
  DatePicker,
  Col,
  Tabs,
  message,
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SelectWithAdd from "./SelectWithAdd";
import {
  baseBackEndURL,
  getSelectItems,
  getSelectItemsUneversal,
  getFieldChoices,
} from "../tools/backendAPI";
import SelectWithCustomAddForm from "./SelectWithCustomAddForm";

const componentMap = {
  input: Input,
  select: Select,
  date: DatePicker,
};

export default function EntrantModal({
  selectedEntrant,
  isModalOpen,
  setIsModalOpen,
  handleOnModalFormClose,
}) {
  const [form] = Form.useForm();
  const [langsOfStudy, setLangsOfStudy] = useState([]);
  const [previousPlacesOfStudy, setPreviousPlacesOfStudy] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [studyFormats, setStudyFormats] = useState([]);
  const [entrantParents, setEntrantParents] = useState([]);
  const dpFormat = "DD/MM/YYYY";
  const [howToFoundOutAboutList, setHowToFoundOutAboutList] = useState([]);
  const fieldPreset = [
    {
      key: "individual_identical_number",
      name: "individual_identical_number",
      label: "ИИН",
      type: "input",
      tab: "Личные данные",
      props: { placeholder: "Введите ИИН" },
      rules: [
        { required: true, message: `Требуется ввести ИИН` },
        { max: 12, message: `ИИН не должен быть длинее 12 символов` },
        { min: 12, message: `ИИН не должен быть короче 12 символов` },
        {
          pattern: "^\\d{1,}$",
          message: `Поле ИИН должно содержать только цифры!`,
        },
      ],
    },
    {
      key: "last_name",
      name: "last_name",
      label: "Фамилия",
      type: "input",
      tab: "Личные данные",
      props: { placeholder: "Введите фамилию" },
      rules: [
        { required: true, message: `Требуется ввести фамилию` },
        { max: 150, message: `Фамилия не должна быть длинее 150 символов` },
      ],
    },
    {
      key: "first_name",
      name: "first_name",
      label: "Имя",
      type: "input",
      tab: "Личные данные",
      props: { placeholder: "Введите имя" },
      rules: [
        { required: true, message: `Требуется ввести имя` },
        { max: 150, message: `Имя не должно быть длинее 150 символов` },
      ],
    },
    {
      key: "patronymic",
      name: "patronymic",
      label: "Отчество",
      type: "input",
      tab: "Личные данные",
      props: { placeholder: "Введите отчество" },
      rules: [
        { required: false, message: `Требуется ввести отчество` },
        { max: 150, message: `Отчество не должно быть длинее 150 символов` },
      ],
    },
    {
      key: "birth_date",
      name: "birth_date",
      label: "Дата рождения",
      type: "date",
      tab: "Личные данные",
      props: {
        format: dpFormat,
        style: { width: "100%" },
        placeholder: "Выберите дату рождения",
      },
      rules: [{ required: true, message: `Требуется ввести дату рождения` }],
    },
    {
      key: "residence_address",
      name: "residence_address",
      label: "Адрес проживания",
      type: "input",
      tab: "Личные данные",
      props: {
        placeholder: "Введите адрес проживания",
      },
      rules: [
        {
          required: true,
          message: `Поле адрес проживания не должен быть пустым`,
        },
        {
          max: 200,
          message: `Адрес проживания не должен быть длинее 200 символов`,
        },
      ],
    },
    {
      key: "entrant_phone_number",
      name: "entrant_phone_number",
      label: "Номер телефона студента",
      type: "input",
      tab: "Личные данные",
      props: {
        placeholder: "Введите номер телефона",
      },
      rules: [
        {
          required: true,
          message: `Номер телефона важен!`,
        },
        {
          pattern: "^\\d{1,}$",
          message: `Номер телефона должен содержать только цифры!`,
        },
        {
          max: 11,
          message: `Номер телефона не должен быть длинее 11 символов`,
        },
      ],
    },
    {
      key: "gender",
      name: "gender",
      label: "Пол абитуриента",
      type: "select",
      tab: "Личные данные",
      props: {
        options: genderOptions,
        placeholder: "Выберите пол абитуриента",
      },
      rules: [{ required: true, message: `Требуется выбрать пол абитуриента` }],
    },
    {
      key: "language_of_study",
      name: "language_of_study",
      label: "Язык обучения",
      type: "select",
      tab: "Образование",
      props: {
        options: langsOfStudy,
        placeholder: "Выберите язык обучения",
      },
      rules: [{ required: true, message: `Требуется выбрать язык обучения` }],
    },
    {
      key: "on_the_budget",
      name: "on_the_budget",
      label: "Бюджет",
      type: "select",
      tab: "Образование",
      props: {
        options: [
          {
            value: "true",
            label: "По гранту",
          },
          {
            value: "false",
            label: "На платной основе",
          },
        ],
        placeholder: "Выберите основу для обучения",
      },
      rules: [
        {
          required: true,
          message: `Требуется выбрать бюджетное или платное обучение!`,
        },
      ],
    },
    {
      key: "study_format",
      name: "study_format",
      label: "Формат обучения",
      type: "select",
      tab: "Образование",
      props: {
        options: studyFormats,
        placeholder: "Выберите формат обучения",
      },
      rules: [{ required: true, message: `Требуется выбрать формат обучения` }],
    },
    {
      key: "qualification",
      name: "qualification",
      label: "Квалификация",
      type: "select",
      tab: "Образование",
      props: {
        options: qualifications,
        placeholder: "Выберите квалификацию",
      },
      rules: [{ required: true }],
    },
    {
      key: "previous_place_of_study_id",
      name: "previous_place_of_study_id",
      label: "Предыдущее место обучения",
      type: "select",
      tab: "Образование",
      props: {
        options: previousPlacesOfStudy,
        placeholder: "Выберите место",
      },
      rules: [{ required: true }],
    },
    {
      key: "quota",
      name: "quota",
      label: "Квоты",
      type: "select",
      tab: "Квоты",
      props: {
        options: quotas,
        mode: "multiple",
        placeholder: "Выберите квоты",
      },
      rules: [],
    },
  ];

  useEffect(() => {
    if (!isModalOpen) return;

    getSelectItems("langs_of_study", setLangsOfStudy);

    getSelectItemsUneversal("parents", setEntrantParents, {
      customMapFunc: (pps) => {
        return {
          value: pps["id"],
          label: `${pps["last_name"]} ${pps["first_name"]}${pps["patronymic"]?.length > 0 ? pps["patronymic"] : ""}`,
        };
      },
    });

    getSelectItemsUneversal(
      "previous_places_of_study",
      setPreviousPlacesOfStudy,
      {
        customMapFunc: (pps) => {
          return {
            value: pps["id"],
            label: pps["name"],
          };
        },
      },
    );

    getSelectItemsUneversal("qualifications", setQualifications, {
      customMapFunc: (q) => {
        return {
          value: q["name"],
          label: `${q["name"]} - ${q["specialty"] || "Специалность не указана"}`,
        };
      },
    });

    getSelectItems("quotas", setQuotas);

    getFieldChoices("entrants", "gender")
      .then(setGenderOptions)
      .catch(() => message.error(`Ошибка загрузки списка "пол"`));

    getFieldChoices("entrants", "study_format")
      .then(setStudyFormats)
      .catch(() => message.error(`Ошибка загрузки форматов обучения`));

    getSelectItemsUneversal(
      "how_found_out_sources",
      (sources) => {
        setHowToFoundOutAboutList(sources);
      },
      {
        customMapFunc: (source) => ({
          value: source["id"],
          label: source["information_source"],
        }),
      },
    );
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedEntrant) {
      form.setFieldsValue({
        ...selectedEntrant,
        birth_date: selectedEntrant.birth_date
          ? dayjs(selectedEntrant.birth_date)
          : null,
        on_the_budget: selectedEntrant.on_the_budget ? "true" : "false",
        how_found_out_about_college_ids:
          selectedEntrant.how_found_out_about_college,
        previous_place_of_study_id:
          selectedEntrant?.previous_place_of_study?.id,
        parent_ids: selectedEntrant?.parents.map((p) => p?.id),
      });
    } else {
      form.resetFields();
    }
  }, [selectedEntrant]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const processed = {
        ...values,
        on_the_budget: values.on_the_budget === "true",
        college: "b695f38a-cda7-4c7d-a1db-92600414a53b", // TODO: Fetc college ID from sessionProvider
        birth_date: dayjs(values.birth_date).format("YYYY-MM-DD"),
        how_found_out_about_college_ids: [
          values.how_found_out_about_college_ids,
        ],
      };
      const url = `${baseBackEndURL}entrants${selectedEntrant ? "/" + selectedEntrant.id : ""}`;

      const res = await fetch(url, {
        method: selectedEntrant ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processed),
      });

      if (res.ok) {
        message.success("Успешно отправлено!");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error("Ошибка при отправке данных.");
      }
    } catch (e) {
      message.error("Проверьте введённые данные.");
    }
  };

  const groupedFields = fieldPreset.reduce((acc, field) => {
    if (!acc[field.tab]) acc[field.tab] = [];
    acc[field.tab].push(field);
    return acc;
  }, {});

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const cleaned = {};
      for (const key in values) {
        const val = values[key];
        cleaned[key] =
          dayjs.isDayjs(val) && val.isValid() ? val.toISOString() : val;
      }

      const labelField =
        fieldsConfig.find((f) => f.name === "name")?.name ||
        Object.keys(cleaned)[0];
      const labelValue = cleaned[labelField];

      setItems([...items, { label: labelValue, value: labelValue }]);
      onChange(labelValue);
      form.resetFields();
      await addNewElement(endpoint, cleaned);
      message.success("Добавлено");
    } catch (err) {
      message.error("Ошибка валидации");
    }
  };

  const tabList = Object.entries(groupedFields).map(
    ([tabName, fields], idx) => ({
      key: String(idx + 1),
      label: tabName,
      children: (
        <Col span={24}>
          {fields.map((field) => {
            const Component = componentMap[field.type];
            return (
              <Form.Item
                key={field.key}
                name={field.name}
                label={field.label}
                rules={field.rules}
              >
                <Component {...field.props} />
              </Form.Item>
            );
          })}

          {tabName === "Личные данные" && (
            <>
              <Form.Item
                name="citizenship"
                label="Гражданство"
                rules={[{ required: true, message: `Выберите гражданство` }]}
              >
                <SelectWithAdd
                  endPointName="citizenships"
                  selectPlaceholder="Выберите гражданство"
                  inputPlaceholder="Введите гражданство"
                />
              </Form.Item>
              <Form.Item
                name="nationality"
                label="Национальность"
                rules={[{ required: true, message: `Выберите национальность` }]}
              >
                <SelectWithAdd
                  endPointName="nationalities"
                  selectPlaceholder="Выберите национальность"
                  inputPlaceholder="Введите название новой"
                />
              </Form.Item>

              <Form.Item
                name="parent_ids"
                label="Родители"
                rules={[
                  {
                    required: true,
                    message: `Выберите карточку родители`,
                  },
                ]}
              >
                <SelectWithCustomAddForm
                  isMultipleMode
                  endpoint="parents"
                  selectPlaceholder="Выберите родителя"
                  items={entrantParents}
                  setItems={setEntrantParents}
                  fieldsConfig={[
                    {
                      key: "last_name",
                      name: "last_name",
                      label: "Фамилия",
                      type: "input",
                      props: { placeholder: "Введите фамилию родителя" },
                      rules: [
                        {
                          required: true,
                          message: "Введите фамилию родителя",
                        },
                      ],
                    },
                    {
                      key: "first_name",
                      name: "first_name",
                      label: "Имя",
                      type: "input",
                      props: { placeholder: "Введите имя родителя" },
                      rules: [
                        { required: true, message: "Введите имя родителя" },
                      ],
                    },
                    {
                      key: "patronymic",
                      name: "patronymic",
                      label: "Отчество",
                      type: "input",
                      props: { placeholder: "Введите отчество родителя" },
                      rules: [
                        { required: false, message: "Введите имя родителя" },
                      ],
                    },
                    {
                      key: "phone_number",
                      name: "phone_number",
                      label: "Номер телефона",
                      type: "input",
                      props: { placeholder: "Введите номер телефона родителя" },
                      rules: [
                        {
                          required: true,
                          message: "Введите номер телефона родителя",
                        },
                        {
                          pattern: "^\\d{1,}$",
                          message: `Номер телефона должен содержать только цифры!`,
                        },
                        {
                          max: 11,
                          message: `Номер телефона не должен быть длинее 11 символов`,
                        },
                        {
                          min: 11,
                          message: `Номер телефона не должен быть короче 11 символов`,
                        },
                      ],
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {tabName === "Квоты" && (
            <>
              <Form.Item
                name="how_found_out_about_college_ids"
                label="Как узнали о колледже"
                rules={[
                  {
                    required: true,
                    message: `Выберите откуда (от кого) узнали о колледже`,
                  },
                ]}
              >
                <SelectWithCustomAddForm
                  endpoint="how_found_out_sources"
                  selectPlaceholder="Выберите место обучения"
                  items={howToFoundOutAboutList}
                  setItems={setHowToFoundOutAboutList}
                  fieldsConfig={[
                    {
                      key: "information_source",
                      name: "information_source",
                      label: "Источник",
                      type: "input",
                      props: { placeholder: "Введите источник" },
                      rules: [{ required: false, message: "Введите источник" }],
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}
        </Col>
      ),
    }),
  );

  return (
    <Modal
      title={
        selectedEntrant
          ? "Редактирование абитуриента"
          : "Добавление абитуриента"
      }
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={() => {
        setIsModalOpen(false);
        form.resetFields();
      }}
      width={1200}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Tabs tabPosition="left" items={tabList} />
      </Form>
    </Modal>
  );
}
