import React, { useEffect, useRef, useState } from "react";
import { Select, Divider, Button, Input, Space, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getSelectItems,
  addNewElement,
  addNewElementMultiField,
} from "../tools/backendAPI";
import dayjs from "dayjs";

const componentMap = {
  input: Input,
  select: Select,
};

const SelectWithCustomAddForm = ({
  value,
  onChange,
  endpoint,
  fieldsConfig = [],
  selectPlaceholder = "Выберите значение",
  items,
  setItems,
  isMultipleMode = false,
}) => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const handleAdd = async () => {
    const values = await form.validateFields();

    const cleaned = {};
    for (const key in values) {
      const val = values[key];
      cleaned[key] =
        dayjs.isDayjs(val) && val.isValid() ? val.toISOString() : val;
    }

    const labelField =
      fieldsConfig.find((f) => f.name === "name")?.name ||
      (fieldsConfig.length > 0 ? fieldsConfig[0].name : null);

    if (!labelField) {
      message.error("Невозможно определить отображаемое поле.");
      return;
    }

    const labelValue = cleaned[labelField];

    setItems([...items, { label: labelValue, value: labelValue }]);
    onChange(labelValue);

    addNewElementMultiField(endpoint, cleaned);

    form.resetFields();
  };

  const innerHandleAdd = () => {
    handleAdd();
  };

  const renderFormItems = () => {
    return fieldsConfig.map((field) => {
      const Component = componentMap[field.type];
      if (!Component) return null;

      return (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules}
        >
          <Component {...field.props} />
        </Form.Item>
      );
    });
  };

  return (
    <Select
      {...(isMultipleMode ? { mode: "multiple" } : {})}
      value={value}
      onChange={onChange}
      placeholder={selectPlaceholder}
      dropdownRender={(menu) => (
        <>
          <div className="pt-4">{menu}</div>
          <Divider style={{ margin: "8px 0" }} />
          <div style={{ padding: "8px" }}>
            <Form form={form} layout="vertical">
              {renderFormItems()}
              <Space>
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={innerHandleAdd}
                >
                  Добавить
                </Button>
              </Space>
            </Form>
          </div>
        </>
      )}
      options={items}
    />
  );
};

export default SelectWithCustomAddForm;
