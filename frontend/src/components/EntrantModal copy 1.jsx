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
import { componentMap } from "./componentMap";
import SelectWithAdd from "./SelectWithAdd";
import {
  baseBackEndURL,
  getSelectItems,
  getFieldChoices,
} from "../tools/backendAPI";

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

  const fieldPreset = [
    {
      key: "individual_identical_number",
      name: "individual_identical_number",
      label: "ИИН",
      type: "input",
      props: { placeholder: "Введите ИИН" },
      rules: [
        { required: true, message: `Требуется ввести ИИН` },
        { max: 50, message: `ИИН не должен быть длинее 50 символов` },
      ],
    },
    {
      key: "first_name",
      name: "first_name",
      label: "Имя",
      type: "input",
      props: { placeholder: "Введите имя" },
      rules: [
        { required: true, message: `Требуется ввести имя` },
        { max: 150, message: `Имя не должно быть длинее 150 символов` },
      ],
    },
    {
      key: "last_name",
      name: "last_name",
      label: "Фамилия",
      type: "input",
      props: { placeholder: "Введите фамилию" },
      rules: [
        { required: true, message: `Требуется ввести фамилию` },
        { max: 150, message: `Фамилия не должна быть длинее 150 символов` },
      ],
    },
    {
      key: "birth_date",
      name: "birth_date",
      label: "Дата рождения",
      type: "date",
      props: {
        format: dpFormat,
        style: { width: "100%" },
        placeholder: "Выберите дату рождения",
      },
      rules: [{ required: true, message: `Требуется ввести дату рождения` }],
    },
    {
      key: "gender",
      name: "gender",
      label: "Пол абитуриента",
      type: "select",
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
      props: {
        options: langsOfStudy,
        placeholder: "Выберите язык обучения",
      },
      rules: [{ required: true, message: `Требуется выбрать язык обучения` }],
    },
    {
      key: "study_format",
      name: "study_format",
      label: "Формат обучения",
      type: "select",
      props: {
        options: studyFormats,
        placeholder: "Выберите формат обучения",
      },
      rules: [{ required: true, message: `Требуется выбрать формат обучения` }],
    },
  ];

  useEffect(() => {
    if (!isModalOpen) return;

    getSelectItems("langs_of_study", setLangsOfStudy);
    getSelectItems(
      "previous_place_of_study_types",
      setPreviousPlaceOfStudyTypes,
    );
    getSelectItems("specialties", setSpecialties);
    getSelectItems("quotas", setQuotas);

    getFieldChoices("entrants", "gender")
      .then(setGenderOptions)
      .catch(() => message.error(`Ошибка загрузки списка "пол"`));

    getFieldChoices("entrants", "study_format")
      .then(setStudyFormats)
      .catch(() => message.error(`Ошибка загрузки форматов обучения`));
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedEntrantId) {
      form.setFieldsValue({
        ...selectedEntrantId,
        birth_date: selectedEntrantId.birth_date
          ? dayjs(selectedEntrantId.birth_date)
          : null,
        on_the_budget: selectedEntrantId.on_the_budget ? "true" : "false",
      });
    } else {
      form.resetFields();
    }
  }, [selectedEntrantId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const processed = {
        ...values,
        on_the_budget: values.on_the_budget === "true",
      };
      const url = `${baseBackEndURL}entrants${selectedEntrantId ? "/" + selectedEntrantId.id : ""}`;

      const res = await fetch(url, {
        method: selectedEntrantId ? "PUT" : "POST",
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
    } catch {
      message.error("Проверьте введённые данные.");
    }
  };

  const tabList = [
    {
      key: "1",
      label: "Личные данные",
      children: (
        <Col span={24}>
          {fieldPreset.map((field) => {
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
        </Col>
      ),
    },
    {
      key: "2",
      label: "Образование",
      children: (
        <Col span={24}>
          <Form.Item
            name="specialty"
            label="Специальность"
            rules={[{ required: true }]}
          >
            <Select
              options={specialties}
              placeholder="Выберите специальность"
            />
          </Form.Item>
          <Form.Item
            name="previous_place_of_study_type"
            label="Предыдущее место обучения"
            rules={[{ required: true }]}
          >
            <Select
              options={previousPlaceOfStudyTypes}
              placeholder="Выберите место"
            />
          </Form.Item>
        </Col>
      ),
    },
    {
      key: "3",
      label: "Квоты",
      children: (
        <>
          <Form.Item name="quota" label="Квоты">
            <Select
              mode="multiple"
              options={quotas}
              placeholder="Выберите квоты"
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: "4",
      label: "Родители",
      children: "TODO: добавить parents форму",
    },
  ];

  return (
    <Modal
      title={
        selectedEntrantId
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
