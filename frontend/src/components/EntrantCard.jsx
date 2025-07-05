import React, { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Tag,
  Empty,
  Button,
  Dropdown,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { getRowDataByURLandEndpointname } from "../tools/backendAPI";

const EntrantCard = ({ entrantId, onEdit, onDelete }) => {
  const [descriptionItems, setDescriptionItems] = useState([]);
  const [rowEntrantData, setRowEntrantData] = useState({});

  useEffect(() => {
    const responseParser = (entrantData) => {
      setRowEntrantData(entrantData);
      let fullname = "Не указано";
      if (
        typeof entrantData.first_name !== "undefined" &&
        typeof entrantData.patronymic !== "undefined" &&
        typeof entrantData.last_name !== "undefined"
      ) {
        fullname = `${entrantData.first_name} ${entrantData.patronymic} ${entrantData.last_name}`;
      }

      const newDescriptionItems = [
        {
          key: 1,
          label: "ФИО",
          children: fullname,
        },
        {
          key: 2,
          label: "ИИН",
          children: entrantData?.individual_identical_number || "Не указано",
        },
        {
          key: 3,
          label: "Дата рождения",
          children:
            typeof entrantData.birth_date !== "undefined"
              ? new Date(entrantData.birth_date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Не указано",
        },
        {
          key: 4,
          label: "Национальность",
          children: entrantData?.nationality || "Не указано",
        },
        {
          key: 5,
          label: "Пол",
          children: entrantData?.gender || "Не указано",
        },
        {
          key: 6,
          label: "Язык обучения",
          children: entrantData?.language_of_study || "Не указано",
        },
        {
          key: 7,
          label: "Квалификация",
          children:
            typeof entrantData?.qualification === "string"
              ? entrantData.qualification
              : "Квалификация не выбрана",
        },
        {
          key: 8,
          label: "База обучения",
          children:
            entrantData?.previous_place_of_study?.name ||
            "База обучения не указана",
        },
        {
          key: 9,
          label: "Формат обучения",
          children: entrantData?.study_format || "Не указан формат обучения",
        },
        {
          key: 10,
          label: "На бюджетной основе",
          children:
            typeof entrantData.on_the_budget !== "undefined"
              ? entrantData.on_the_budget === true
                ? "Да"
                : "Нет"
              : "Не указан способ оплаты",
        },
        {
          key: 11,
          label: "Квоты",
          children:
            Array.isArray(entrantData.quota) && entrantData.quota.length > 0
              ? entrantData.quota.map((q, index) => (
                  <Tag key={index} color="blue">
                    {q}
                  </Tag>
                ))
              : "Нет квот",
        },
        {
          key: 12,
          label: "Родители",
          children:
            Array.isArray(entrantData.parents) &&
            entrantData?.parents?.length > 0 ? (
              <div>
                {entrantData.parents
                  .map((p) => `${p.last_name} ${p.first_name}${p.patronymic}`)
                  .join(", ")}
              </div>
            ) : (
              "Родители не указаны"
            ),
        },
        {
          key: 13,
          label: "Откуда узнал о коллдже",
          children:
            typeof entrantData?.how_found_out_about_college !== "undefined" &&
            entrantData?.how_found_out_about_college?.length > 0
              ? entrantData?.how_found_out_about_college
              : "Источник не указан",
        },
        {
          key: 14,
          label: "Номер телефона",
          children:
            typeof entrantData?.entrant_phone_number !== "undefined" &&
            entrantData?.entrant_phone_number?.length > 0
              ? entrantData?.entrant_phone_number
              : "Телефон не указан",
        },
        {
          key: 15,
          label: "Адрес проживания",
          children:
            typeof entrantData?.residence_address !== "undefined" &&
            entrantData?.residence_address?.length > 0
              ? entrantData?.residence_address
              : "Адрес не указан",
        },
        {
          key: 16,
          label: "Запись создана",
          children:
            typeof entrantData?.created_at !== "undefined"
              ? new Date(entrantData.created_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "Дата не указана",
        },
        {
          key: 17,
          label: "Изменено",
          children:
            typeof entrantData?.updated_at !== "undefined"
              ? new Date(entrantData.updated_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "Дата не указана",
        },
      ];
      setDescriptionItems(newDescriptionItems);
    };

    if (typeof entrantId === "number") {
      getRowDataByURLandEndpointname(`entrants/${entrantId}`, responseParser);
    }
  }, [entrantId]);

  if (typeof entrantId === "undefined") {
    return (
      <div className="p-6 space-y-4">
        <Card title="Карточка абитуриента" bordered={false}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      </div>
    );
  }

  const items = [
    {
      key: "1",
      label: "Редактировать",
      icon: <EditOutlined />,
      onClick: () => {
        onEdit(rowEntrantData);
      },
    },
    {
      key: "2",
      label: "Удалить",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <Card
        title="Карточка абитуриента"
        bordered={false}
        extra={
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomRight"
            arrow
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        }
      >
        <Descriptions
          column={1}
          items={descriptionItems}
          contentStyle={{
            fontSize: "16px",
          }}
          labelStyle={{
            fontSize: "16px",
          }}
        ></Descriptions>
      </Card>
    </div>
  );
};

export default EntrantCard;
