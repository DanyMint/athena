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
        <Col span={24}>
          <p>Импорт экспорт</p>
          <a
            href={`${baseBackEndURL}export_entrants_to_csv`}
            download="export_entrants_to_csv.pdf"
            className="inline-flex items-center px-4 py-2 hover:text-white bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Экспортировать
          </a>
        </Col>
        {/* <Col span={24}>
          <SettingCard
            title="Гранты"
            baseUrl={grantsAPIURL}
            modalFields={GrantsModalFields}
          />
        </Col> */}
      </Row>
    </div>
  );
}
