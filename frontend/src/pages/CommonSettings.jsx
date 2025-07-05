import { Col, Row } from "antd";
import SettingCard from "../components/SettingCard";
import { baseBackEndURL } from "../tools/backendAPI";

export default function CommonSettings() {
  const grantsAPIURL = `${baseBackEndURL}grants`;
  const GrantsModalFields = [
    {
      name: "name",
      label: "Предыдущее место обучения",
      placeholder: "Введите название предыдущего места обучения",
      rules: [
        { required: true, message: `Требуется ввести название местa обучения` },
        {
          max: 30,
          message: "Названия местa обучения должно быть не больше 30 символов",
        },
      ],
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col span={24}>Информация о колледже</Col>
        <Col span={24}>
          <SettingCard
            title="Гранты"
            baseUrl={grantsAPIURL}
            modalFields={GrantsModalFields}
          />
        </Col>
      </Row>
    </div>
  );
}
