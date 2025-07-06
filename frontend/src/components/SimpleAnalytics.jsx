import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Typography,
  Input,
  Select,
  Row,
  Col,
  Card,
  Button,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getRowDataByURLandEndpointname } from "../tools/backendAPI";

const { Title } = Typography;

const SimpleAnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedStudyType, setSelectedStudyType] = useState(null);
  const [qualificationsList, setQualificationsList] = useState([]);
  const [studyTypeList, setStudyTypeList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getRowDataByURLandEndpointname("grants", (responseList) => {
      const rawData = responseList.results.map((grant) => ({
        id: grant?.id,
        qualification: `${grant?.qualification?.name} - ${grant?.qualification?.specialty}`,
        qualificationRaw: grant?.qualification?.name,
        previous_place_of_study_type: grant?.previous_place_of_study_type?.name,
        places: grant.places,
        actual: grant.actual,
        fulfilled_percent: grant.fulfilled_percent,
      }));

      const qualifications = [
        ...new Set(
          rawData.map((item) => item.qualificationRaw).filter(Boolean),
        ),
      ];

      const studyTypes = [
        ...new Set(
          rawData
            .map((item) => item.previous_place_of_study_type)
            .filter(Boolean),
        ),
      ];

      setData(rawData);
      setQualificationsList(qualifications);
      setStudyTypeList(studyTypes);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter((item) =>
        item.qualification?.toLowerCase().includes(lower),
      );
    }

    if (selectedStudyType) {
      result = result.filter(
        (item) => item.previous_place_of_study_type === selectedStudyType,
      );
    }

    setFilteredData(result);
  }, [data, searchText, selectedStudyType]);

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedStudyType(null);
  };

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

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Поиск по квалификации"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Фильтр по типу учебного заведения"
              value={selectedStudyType}
              onChange={setSelectedStudyType}
              allowClear
              style={{ width: "100%", height: 40 }}
              options={studyTypeList.map((type) => ({
                value: type,
                label: type,
              }))}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button onClick={handleClearFilters} size="middle">
              Сбросить фильтры
            </Button>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Spin tip="Загрузка данных..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          bordered
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showTotal: (total, range) =>
              `Показано ${range[0]}-${range[1]} из ${total}`,
          }}
        />
      )}
    </div>
  );
};

export default SimpleAnalyticsTable;
