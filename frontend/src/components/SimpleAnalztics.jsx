import React, { useEffect, useState } from "react";
import { Table, Spin, Typography, message } from "antd";
import { getRowDataByURLandEndpointname } from "../tools/backendAPI";

const { Title } = Typography;

const SimpleAnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRowDataByURLandEndpointname("grants", (responseList) => {
      const data = responseList.results.map((grant) => ({
        id: grant?.id,
        qualification: `${grant?.qualification?.name} - ${grant?.qualification?.specialty}`,
        previous_place_of_study_type: grant?.previous_place_of_study_type?.name,
        places: grant.places,
        actual: grant.actual,
        fulfilled_percent: grant.fulfilled_percent,
      }));
      setData(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Квалификация",
      dataIndex: "qualification",
      key: "qualification",
    },
    {
      title: "Тип предыдущего места обучения",
      dataIndex: "previous_place_of_study_type",
      key: "previous_place_of_study_type",
    },
    {
      title: "Мест",
      dataIndex: "places",
      key: "places",
    },
    {
      title: "Процент заполнения",
      dataIndex: "fulfilled_percent",
      key: "fulfilled_percent",
      render: (value) =>
        value !== null ? (
          `${value}%`
        ) : (
          <i style={{ color: "#999" }}>Нет данных</i>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Аналитика по набору</Title>

      {loading ? (
        <Spin tip="Загрузка данных..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      )}
    </div>
  );
};

export default SimpleAnalyticsTable;
