import React from "react";
import { Input, Button, Tag, Table, Select, Row, Col, Card } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const EntrantsList = ({
  setSelectedEntrantId,
  onSelectEntrant,
  handleAddEntrant,
  entrantsList,
  selectedQualification,
  setSelectedQualification,
  selectedQuotas,
  setSelectedQuotas,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  searchText,
  setSearchText,
  specialties,
  quotas,
  entrantsCount,
}) => {
  const handleRowClick = (record) => {
    onSelectEntrant(record);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSelectedQuotas([]);
    setSelectedQualification(null);
  };

  const columns = [
    {
      title: "ФИО",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, entrant) =>
        `${entrant.last_name || ""} ${entrant.first_name || ""} ${
          entrant.patronymic || ""
        }`,
    },
    {
      title: "ИИН",
      dataIndex: "individual_identical_number",
      key: "individual_identical_number",
    },
    {
      title: "Квалификация",
      dataIndex: "qualification",
      key: "qualification",
    },
    {
      title: "Квоты",
      dataIndex: "quota",
      key: "quotas",
      render: (quota) =>
        quota.map((quota) => (
          <Tag color="blue" key={quota}>
            {quota}
          </Tag>
        )),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card
        title={
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input.Search
                placeholder="Введите ФИО или ИИН"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Выберите квалификацию"
                value={selectedQualification}
                onChange={setSelectedQualification}
                allowClear
                style={{ width: "100%", height: 40 }}
                options={specialties.map((spec) => ({
                  value: spec.id,
                  label: spec.name,
                }))}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                mode="multiple"
                placeholder="Выберите квоты"
                value={selectedQuotas}
                onChange={setSelectedQuotas}
                allowClear
                style={{ width: "100%", height: 40 }}
                options={quotas.map((quota) => ({
                  value: quota.id,
                  label: quota.name,
                }))}
              />
            </Col>
          </Row>
        }
      >
        <Row justify="end" gutter={[16, 16]} align="middle">
          <Col>
            <Button type="default" onClick={handleClearFilters} size="middle">
              Сбросить фильтры
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddEntrant}
              size="middle"
            >
              Добавить абитуриента
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={entrantsList}
        rowKey="id"
        bordered
        size="small"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: entrantsCount,
          showQuickJumper: false,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20", "25", "30", "40", "50"],
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
          showTotal: (total, range) =>
            `Показано ${range[0]}-${range[1]} из ${total}`,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName="cursor-pointer hover:bg-gray-100"
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default EntrantsList;
