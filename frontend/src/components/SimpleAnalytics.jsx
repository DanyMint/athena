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
import { useCallback, useEffect, useState } from "react";

const { Title } = Typography;

const getFilters = (filters) => {
  const formatedFilters = [];
  filters.map(({ key, value }) => {
    if (
      typeof value !== "undefined" &&
      value !== null &&
      typeof key !== "undefined" &&
      key?.length > 0
    ) {
      formatedFilters.push(`${key}=${value}`);
    }
  });
  return formatedFilters;
};

const SimpleAnalyticsTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedStudyBase, setSelectedStudyBase] = useState(null);
  const [qualificationsList, setQualificationsList] = useState([]);
  const [langsOfStudy, setLangsOfStudy] = useState([]);
  const [selectedLangOfStudy, setSelectedLangOfStudy] = useState([]);
  const [studyBaseList, setStudyBaseList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchData = (responseList) => {
    const rawData = responseList.results.map((grant) => ({
      name: grant?.name,
      langOfStudy: grant?.language_of_study?.name,
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

  const loadData = useCallback(() => {
    const filters = getFilters([
      { key: "previous_place_of_study_type", value: selectedStudyBase },
      { key: "qualification", value: selectedQualification },
      { key: "language_of_study", value: selectedLangOfStudy },
    ]);

    setLoading(true);
    fetchItems(
      "grants",
      {
        page: currentPage,
        pageSize,
        filters,
      },
      fetchData,
    );
  }, [
    currentPage,
    pageSize,
    selectedStudyBase,
    selectedQualification,
    selectedLangOfStudy,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    getSelectItemsUneversal("qualifications", setQualificationsList, {
      customMapFunc: (item) => ({
        value: item["id"],
        label: `${item["code"]} -${item["name"]}`,
      }),
    });

    getSelectItemsUneversal("langs_of_study", setLangsOfStudy, {
      customMapFunc: (item) => ({
        value: item["id"],
        label: item["name"],
      }),
    });

    getSelectItemsUneversal("previous_place_of_study_types", setStudyBaseList, {
      customMapFunc: (item) => ({
        value: item["id"],
        label: item["name"],
      }),
    });
  }, []);

  const handleClearFilters = () => {
    setSelectedQualification(null);
    setSelectedStudyBase(null);
  };

  const columns = [
    {
      title: "Имя гранта",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Язык обучения",
      dataIndex: "langOfStudy",
      key: "langOfStudy",
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
            className="w-3/12"
            placeholder="Фильтровать по квалификации"
            value={selectedQualification}
            onChange={setSelectedQualification}
            allowClear
            style={{ height: 40 }}
            options={qualificationsList}
          />

          <Select
            className="w-3/12"
            placeholder="Фильтровать по языку обучения"
            value={selectedLangOfStudy}
            onChange={setSelectedLangOfStudy}
            allowClear
            style={{ height: 40 }}
            options={langsOfStudy}
          />

          <Select
            className="w-3/12"
            placeholder="Фильтровать по базе обучения"
            value={selectedStudyBase}
            onChange={setSelectedStudyBase}
            allowClear
            style={{ height: 40 }}
            options={studyBaseList}
          />

          <Button className="w-2/8" onClick={handleClearFilters} size="large">
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
