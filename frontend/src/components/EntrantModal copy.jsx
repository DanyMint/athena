import Reac, { useEffect, useState, useSyncExternalStore } from "react";
import {
  DatePicker,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  message,
  Tabs,
} from "antd";
import SelectWithAdd from "./SelectWithAdd";
import {
  baseBackEndURL,
  getSelectItems,
  getFieldChoices,
} from "../tools/backendAPI";
import dayjs from "dayjs";
import { months } from "dayjs/locale/zh-cn";

export default function EntrantModal({
  selectedEntrantId,
  isModalOpen,
  setIsModalOpen,
  handleOnModalFormClose,
}) {
  const [form] = Form.useForm();
  const [langsOfStudy, setLangsOfStudy] = useState([]);
  const [previousPlaceOfStudyTypes, setPreviousPlaceOfStudyTypes] = useState(
    [],
  );
  const [specialties, setSpecialties] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [studyFormats, setStudyFormats] = useState([]);
  const dpFormat = "DD/MM/YYYY";

  const inputFieldPreset = [
    {
      key: "individual_identical_number",
      name: "individual_identical_number",
      label: "ИИН",
      rules: [
        { required: true, message: `Требуется ввести ИИН` },
        { max: 50, message: `ИИН не должен быть длинее 50 символов` },
      ],
      placeholder: "Введите ИИН",
      initialValue: selectedEntrantId?.individual_identical_number || null,
    },
    {
      key: "first_name",
      name: "first_name",
      label: "Имя",
      rules: [
        { required: true, message: `Требуется ввести имя` },
        { max: 150, message: `Имя не должно быть длинее 150 символов` },
      ],
      placeholder: "Введите имя",
      initialValue: selectedEntrantId?.first_name || null,
    },
    {
      key: "last_name",
      name: "last_name",
      label: "Фамилия",
      rules: [
        { required: true, message: `Требуется ввести фамилию` },
        { max: 150, message: `Фамилия не должна быть длинее 150 символов` },
      ],
      placeholder: "Введите фамилию",
      initialValue: selectedEntrantId?.last_name || null,
    },
    {
      key: "patronymic",
      name: "patronymic",
      label: "Отчество",
      rules: [
        { required: false },
        { max: 150, message: `Отчество не должно быть длинее 150 символов` },
      ],
      placeholder: "Введите отчество",
      initialValue: selectedEntrantId?.patronymic || null,
    },
    {
      key: "entrant_phone_number",
      name: "entrant_phone_number",
      label: "Номер телефона студента",
      rules: [
        {
          required: false,
        },
        {
          pattern: "^\\d{1,11}$",
          message: `Не валидный номер телефона!`,
        },
        {
          max: 11,
          message: `Номер телефона не должен быть длинее 11 символов`,
        },
      ],
      placeholder: "Введите номер телефона",
      initialValue: selectedEntrantId?.entrant_phone_number || null,
    },
    {
      key: "residence_address",
      name: "residence_address",
      label: "Адрес проживания",
      rules: [
        {
          required: false,
        },
        {
          max: 200,
          message: `Адрес проживания не должен быть длинее 200 символов`,
        },
      ],
      placeholder: "Введите адрес проживания",
      initialValue: selectedEntrantId?.residence_address || null,
    },
  ];

  const selectFieldPreset = [
    {
      key: "on_the_budget",
      name: "on_the_budget",
      label: "Бюджет",
      rules: [
        {
          required: true,
          message: `Требуется выбрать бюджетное или платное обучение!`,
        },
      ],
      defaultValue: "true",
      placeholder: "Выберите основу для обучения",
      options: [
        {
          value: "true",
          label: "На бюджетной основе",
        },
        {
          value: "false",
          label: "На платной основе",
        },
      ],
    },
    {
      key: "language_of_study",
      name: "language_of_study",
      label: "Язык обучения",
      rules: [{ required: true, message: `Требуется выбрать язык обучения` }],
      defaultValue: null,
      placeholder: "Выберите язык обучения",
      options: langsOfStudy,
    },
    {
      key: "previous_place_of_study_type",
      name: "previous_place_of_study_type",
      label: "Предыдущее место обучения",
      rules: [
        {
          required: true,
          message: `Требуется выбрать предыдущее место обучения`,
        },
      ],
      defaultValue: null,
      placeholder: "Выберите предыдущее место обучения",
      options: previousPlaceOfStudyTypes,
    },
    {
      key: "specialty",
      name: "specialty",
      label: "Специальность",
      rules: [
        {
          required: true,
          message: `Требуется выбрать специальность`,
        },
      ],
      defaultValue: null,
      placeholder: "Выберите специальность",
      options: specialties,
    },
    {
      key: "study_format",
      name: "study_format",
      label: "Формат обучения",
      rules: [
        {
          required: true,
          message: `Требуется выбрать формат обучения`,
        },
      ],
      defaultValue: studyFormats[0],
      placeholder: "Выберите формат обучения",
      options: studyFormats,
    },
  ];

  useEffect(() => {
    if (!isModalOpen) return;
    getSelectItems("langs_of_study", (langsList) => {
      setLangsOfStudy(langsList);
    });

    getSelectItems("previous_place_of_study_types", (studyTypes) => {
      setPreviousPlaceOfStudyTypes(studyTypes);
    });

    getSelectItems("specialties", (specialtiesFromBackend) => {
      setSpecialties(specialtiesFromBackend);
    });

    getSelectItems("quotas", (qoutasFromBackend) => {
      setQuotas(qoutasFromBackend);
    });

    getFieldChoices("entrants", "gender")
      .then((choices) => {
        setGenderOptions(choices);
      })
      .catch(() => {
        message.error(`Ошибка: Неудалось загрузить список опций "пол"`);
      });

    getFieldChoices("entrants", "study_format")
      .then((choices) => {
        setStudyFormats(choices);
      })
      .catch((error) => {
        message.error(`Ошибка: Неудалось загрузить список форматов обучения`);
      });
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedEntrantId) {
      form.setFieldsValue({
        ...selectedEntrantId,
        birth_date: selectedEntrantId.birth_date
          ? dayjs(selectedEntrantId.birth_date)
          : null,
        on_the_budget: selectedEntrantId.on_the_budget ? "true" : "false", // Преобразуем булево в строку
      });
    } else {
      form.resetFields(); // Сброс формы для нового элемента
    }
  }, [selectedEntrantId]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    if (selectedEntrantId) {
      handleOnModalFormClose(selectedEntrantId);
    }
    setIsModalOpen(false);
  };

  const modalTitle =
    selectedEntrantId !== null
      ? "Редактирование абитуриента"
      : "Добавление абитуриента";

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Проверка и получение значений формы
      const processedValues = {
        ...values,
        quota: values.quota || [],
        study_format: values.study_format?.value || studyFormats[0].value,
        gender: values.gender?.value || genderOptions[0].value,
        on_the_budget: values.on_the_budget === "true",
      };

      // Убираем поля, значения которых undefined
      const filteredValues = Object.fromEntries(
        Object.entries(processedValues).filter(
          ([_, value]) => value !== undefined && value !== "",
        ),
      );

      const url = `${baseBackEndURL}entrants`;
      let response = "";

      if (selectedEntrantId) {
        const fullURL = url + "/" + selectedEntrantId.id;

        // Отправка данных на сервер
        response = await fetch(fullURL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredValues),
        });
        if (selectedEntrantId) {
          handleOnModalFormClose(selectedEntrantId);
        }
      } else {
        // Отправка данных на сервер
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filteredValues),
        });
      }

      if (response.ok) {
        message.success("Данные успешно отправлены!");
        form.resetFields();
        setIsModalOpen(false);
      } else {
        message.error("Ошибка при отправке данных.");
      }
    } catch (error) {
      message.error("Проверьте введённые данные.");
    }
  };

  const tabList = [
    {
      key: "1",
      label: "Личные данные",
      children: (
        <Col span={24}>
          {inputFieldPreset.map((field) => (
            <Form.Item
              key={field.key}
              name={field.name}
              label={field.label}
              rules={field.rules}
              validateFirst
            >
              <Input placeholder={field.placeholder} />
            </Form.Item>
          ))}

          <Form.Item
            key="birth_date"
            name="birth_date"
            label="Дата рождения"
            rules={[
              { required: true, message: `Требуется ввести дату рождения` },
            ]}
            // initialValue={dayjs(editingItem?.birth_date) || null}
          >
            <DatePicker
              style={{
                width: "100%",
              }}
              format={{
                format: dpFormat,
                type: "mask",
              }}
              placeholder="Выберите дату рождения"
            />
          </Form.Item>

          <Form.Item
            key="citizenship"
            name="citizenship"
            label="Гражданство"
            rules={[
              { required: true, message: `Требуется выбрать гражданство` },
            ]}
          >
            <SelectWithAdd
              endPointName="citizenships"
              selectPlaceholder="Выберети гражданство"
              inputPlaceholder="Введите гражданство"
            />
          </Form.Item>

          <Form.Item
            key="nationality"
            name="nationality"
            label="Национальность"
            rules={[
              { required: true, message: `Требуется выбрать национальность` },
            ]}
          >
            <SelectWithAdd
              endPointName="nationalities"
              selectPlaceholder="Выберети национальность"
              inputPlaceholder="Введите название новой"
            />
          </Form.Item>

          <Form.Item
            key="gender"
            name="gender"
            label="Пол абитуриента"
            rules={[
              {
                required: true,
                message: `Требуется выбрать пол абитуриента`,
              },
            ]}
          >
            <Select
              placeholder="Выберите пол абитуриента"
              options={genderOptions}
            ></Select>
          </Form.Item>
        </Col>
      ),
    },
    {
      key: "2",
      label: "Образование",
      children: (
        <Col span={24}>
          {selectFieldPreset.map((field) => (
            <Form.Item
              key={field.key}
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              <Select
                placeholder={field.placeholder}
                options={field.options}
              ></Select>
            </Form.Item>
          ))}
        </Col>
      ),
    },
    {
      key: "3",
      label: "Квоты",
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "Родители",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <Modal
      className=""
      title={modalTitle}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={1200}
    >
      <Form form={form} layout="vertical" requiredMark="optional">
        <Tabs tabPosition="left" defaultActiveKey="1" items={tabList} />
        <Col span={12}></Col>
        <Col span={12}>
          <Form.Item key="quota" name="quota" label="Квоты">
            <Select
              mode="multiple"
              allowClear
              placeholder="Выбирете квоты"
              options={quotas}
            ></Select>
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
}
