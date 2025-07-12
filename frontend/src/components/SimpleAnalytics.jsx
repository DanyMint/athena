import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  Typography,
  Select,
  Flex,
  Card,
  Button,
  message,
} from "antd";
import { fetchItems, getSelectItemsUneversal } from "../tools/backendAPI";

const { Title } = Typography;

const SimpleAnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedStudyBase, setSelectedStudyBase] = useState(null);
  const [qualificationsList, setQualificationsList] = useState([]);
  const [studyBaseList, setStudyBaseList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchData = (responseList) => {
    const rawData = responseList.results.map((grant) => ({
      id: grant?.id,
      qualification: `${grant?.qualification?.name} - ${grant?.qualification?.specialty}`,
      qualificationRaw: grant?.qualification?.name,
      previous_place_of_study_type: grant?.previous_place_of_study_type?.name,
      places: grant.places,
      actual: grant.actual,
      fulfilled_percent: grant.fulfilled_percent,
    }));
    setTotal(responseList?.count);
    setData(rawData);
    setLoading(false);
  };

  const loadData = () => {
    const filters = [];
    if (
      typeof selectedQualification !== "undefined" &&
      selectedQualification !== null
    ) {
      filters.push(`qualification=${selectedQualification}`);
    }

    if (
      typeof selectedStudyBase !== "undefined" &&
      selectedStudyBase !== null
    ) {
      filters.push(`previous_place_of_study_type=${selectedStudyBase}`);
    }

    setLoading(true);
    fetchItems(
      "grants",
      {
        page: currentPage,
        filters: filters,
        pageSize: pageSize,
      },
      fetchData,
    );
  };

  useEffect(() => {
    getSelectItemsUneversal("qualifications", setQualificationsList, {
      customMapFunc: (item) => ({
        value: item["id"],
        label: `${item["code"]} -${item["name"]}`,
      }),
    });

    getSelectItemsUneversal("previous_place_of_study_types", setStudyBaseList, {
      customMapFunc: (item) => ({
        value: item["id"],
        label: item["name"],
      }),
    });

    loadData();
  }, [currentPage, pageSize, selectedQualification, selectedStudyBase]);

  const handleClearFilters = () => {
    setSelectedQualification(null);
    setSelectedStudyBase(null);
    loadData();
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
      title: "База обучения обучения",
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
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h2 className="mb-4 mt-0">Аналитика по набору</h2>
        <Flex wrap gap="middle" justify="space-between" align="center">
          <Select
            className="w-2/5"
            placeholder="Выберите квалификацию"
            value={selectedQualification}
            onChange={(e) => {
              setSelectedQualification(e);
              loadData();
            }}
            allowClear
            style={{ height: 40 }}
            options={qualificationsList}
          />

          <Select
            className="w-2/5"
            placeholder="Выберите базу обучения"
            value={selectedStudyBase}
            onChange={(e) => {
              setSelectedStudyBase(e);
              loadData();
            }}
            allowClear
            style={{ height: 40 }}
            options={studyBaseList}
          />

          <Button onClick={handleClearFilters} size="large">
            Сбросить фильтры
          </Button>
        </Flex>
      </Card>

      {loading ? (
        <Spin tip="Загрузка данных..." size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          bordered
          scroll={{ y: 500 }}
          pagination={{
            pageSizeOptions: ["5", "10", "15", "20"],
            current: currentPage,
            pageSize: pageSize,
            total: total,
            position: ["bottomCenter"],
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
