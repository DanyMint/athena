import React from "react";
import { Col, Row } from "antd";
import SettingCard from "../components/SettingCard";
import { baseBackEndURL } from "../tools/backendAPI";

const DirectoryManagement = () => {
  const quotaAPIURL = `${baseBackEndURL}quotas`;
  const specialtyAPIURL = `${baseBackEndURL}specialties`;
  const previusPlaceOfStudytypeAPIURL = `${baseBackEndURL}previous_place_of_study_types`;
  const previusPlaceOfStudyAPIURL = `${baseBackEndURL}previous_places_of_study`;
  const langsOfStudyAPIURL = `${baseBackEndURL}langs_of_study`;
  const nationalitiesAPIURL = `${baseBackEndURL}nationalities`;
  const citizenshipsAPIURL = `${baseBackEndURL}citizenships`;
  const qualificationsAPIURL = `${baseBackEndURL}qualifications`;

  const quotaModalFields = [
    {
      name: "name",
      label: "Название Квоты",
      placeholder: "Введите название",
      rules: [
        { required: true, message: `Требуется ввести название квоты` },
        {
          max: 50,
          message: "Название должно быть не больше 50 символов",
        },
      ],
    },
    {
      name: "description",
      label: "Описание Квоты",
      placeholder: "Введите описание",
      rules: [
        { required: true, message: `Требуется ввести описание квоты` },
        {
          max: 350,
          message: "Описание должно быть не больше 350 символов",
        },
      ],
    },
  ];

  const specialtyModalFields = [
    {
      name: "name",
      label: "Название специальности",
      placeholder: "Введите название",
      rules: [
        { required: true, message: `Требуется ввести название специальности` },
        {
          max: 100,
          message: "Название должно быть не больше 100 символов",
        },
      ],
    },
    {
      name: "code",
      label: "Код специальности",
      placeholder: "Введите код",
      rules: [
        { required: true, message: `Требуется ввести код специальности` },
        {
          max: 50,
          message: "Код должен быть не больше 50 символов",
        },
      ],
    },
  ];

  const previusPlaceOfStudyTypeModalFields = [
    {
      name: "name",
      label: "Тип базы обучения",
      placeholder: "Например 9 класс..",
      rules: [
        { required: true, message: `Требуется ввести тип базы обучения` },
        {
          max: 30,
          message: "Тип базы обучения должно быть не больше 30 символов",
        },
      ],
    },
  ];

  const langsOfStudyModalFields = [
    {
      name: "name",
      label: "Язык обучения",
      placeholder: "Введите язык",
      rules: [
        { required: true, message: `Требуется ввести название языка обучения` },
        {
          max: 20,
          message: "Название языка обучения должно быть не больше 20 символов",
        },
      ],
    },
  ];

  const nationalitiesModalFields = [
    {
      name: "name",
      label: "Национальность",
      placeholder: "Введите национальность",
      rules: [
        { required: true, message: `Требуется ввести название национальности` },
        {
          max: 100,
          message: "Название национальности должно быть не больше 100 символов",
        },
      ],
    },
  ];

  const citizenshipsModalFields = [
    {
      name: "name",
      label: "Гражданство",
      placeholder: "Введите гражданство",
      rules: [
        { required: true, message: `Требуется ввести название гражданствa` },
        {
          max: 100,
          message: "Название гражданствa должно быть не больше 100 символов",
        },
      ],
    },
  ];

  const qualificationsModalFields = [
    {
      name: "name",
      label: "Название квалификации",
      placeholder: "Введите название",
      rules: [
        { required: true, message: `Требуется ввести название квалификации` },
        {
          max: 100,
          message: "Название квалификации должно быть не больше 100 символов",
        },
      ],
    },
    {
      name: "code",
      label: "Код квалификации",
      placeholder: "Введите код",
      rules: [
        { required: true, message: `Требуется ввести код квалификации` },
        {
          max: 50,
          message: "Код квалификации должно быть не больше 50 символов",
        },
      ],
    },
    {
      name: "specialty",
      isSelectWithAdd: true,
      label: "Специальность",
      selectPlaceholder: "Выберите специальность",
      selectEndPointName: "specialties",
      inputPlaceholder: "Введите название специальности",
      rules: [{ required: true, message: `Требуется выбрать специальность` }],
    },
  ];

  const previusPlaceOfStudyModalFields = [
    {
      name: "name",
      label: "Учреждение",
      placeholder: "Введите название учреждения",
      rules: [
        { required: true, message: `Требуется ввести название учреждения` },
        {
          max: 150,
          message: "Название учреждения должно быть не больше 150 символов",
        },
      ],
    },
    {
      name: "previous_place_of_study_type",
      isSelectWithAdd: true,
      label: "Тип базы обучения",
      selectPlaceholder: "Выберите тип базы обучения",
      selectEndPointName: "previous_place_of_study_types",
      inputPlaceholder: "Введите тип базы обучения",
      rules: [
        { required: true, message: `Требуется выбрать тип базы обучения` },
      ],
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <SettingCard
            title="Квоты"
            baseUrl={quotaAPIURL}
            modalFields={quotaModalFields}
          />
        </Col>
        <Col span={12}>
          <SettingCard
            title="Специальности"
            baseUrl={specialtyAPIURL}
            modalFields={specialtyModalFields}
          />
        </Col>
        <Col span={12}>
          <SettingCard
            title="Квалификации"
            baseUrl={qualificationsAPIURL}
            modalFields={qualificationsModalFields}
          />
        </Col>
        <Col span={12}>
          <SettingCard
            title="Типы базы обучения"
            baseUrl={previusPlaceOfStudytypeAPIURL}
            modalFields={previusPlaceOfStudyTypeModalFields}
          />
        </Col>
        <Col span={12}>
          <SettingCard
            title="Список учреждений"
            baseUrl={previusPlaceOfStudyAPIURL}
            modalFields={previusPlaceOfStudyModalFields}
          />
        </Col>
        <Col span={12}>
          <SettingCard
            title="Языки обучения"
            baseUrl={langsOfStudyAPIURL}
            modalFields={langsOfStudyModalFields}
          />
        </Col>

        <Col span={12}>
          <SettingCard
            title="Список национальностей"
            baseUrl={nationalitiesAPIURL}
            modalFields={nationalitiesModalFields}
          />
        </Col>

        <Col span={12}>
          <SettingCard
            title="Список гражданств"
            baseUrl={citizenshipsAPIURL}
            modalFields={citizenshipsModalFields}
          />
        </Col>
      </Row>
    </div>
  );
};
export default DirectoryManagement;
