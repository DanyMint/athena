import React, { useEffect, useState } from "react";
import EntrantsList from "../components/EntrantsList";
import EntrantCard from "../components/EntrantCard";
import { Button, Splitter } from "antd";
import EntrantModal from "../components/EntrantModal";
import {
  getRowDataByURLandEndpointname,
  fetchItems,
  deleteItemBy,
} from "../tools/backendAPI";

const Entrants = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entrants, setEntrants] = useState([]);
  const [entrantsCount, setEntrantsCount] = useState(0);
  const [selectedEntrantId, setSelectedEntrantId] = useState(undefined);
  const [selectedEntrant, setSelectedEntrant] = useState(null);
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [selectedQuotas, setSelectedQuotas] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [quotas, setQuotas] = useState([]);
  const [sizes, setSizes] = useState(["60%", "40%"]);

  useEffect(() => {
    getRowDataByURLandEndpointname("quotas", (quotaList) => {
      setQuotas(quotaList.results);
    });

    getRowDataByURLandEndpointname("qualifications", (qualificationList) => {
      setQualifications(qualificationList.results);
    });
  }, []);

  useEffect(() => {
    fetchNewItems(currentPage, pageSize);
  }, [
    currentPage,
    pageSize,
    selectedQuotas,
    selectedQualification,
    searchText,
  ]);

  const fetchNewItems = (page, pSize) => {
    let filterList = [];

    if (selectedQuotas?.length) {
      selectedQuotas.forEach((quota) => {
        filterList.push(`quota=${quota}`);
      });
    }

    if (selectedQualification) {
      filterList.push(`qualification=${selectedQualification}`);
    }

    fetchItems(
      "entrants",
      {
        page: page,
        pageSize: pSize,
        searchQuery: searchText,
        filters: filterList,
      },
      (entrantList) => {
        setEntrants(entrantList.results);
        setEntrantsCount(entrantList.count);
        setSelectedEntrantId(entrantList.results[0]?.id);
      },
    );
  };

  const handleSelectEntrant = (entrant) => {
    setSelectedEntrantId(entrant["id"]);
  };

  const handleAddEntrant = () => {
    setSelectedEntrant(null);
    setIsModalOpen(true);
  };

  const onEditEntrant = (entrant) => {
    console.log(entrant);
    setSelectedEntrant(entrant);
    setIsModalOpen(true);
  };

  const handleOnModalFormClose = () => {
    fetchNewItems(currentPage, pageSize);
  };

  return (
    <div>
      <Splitter onResize={setSizes} style={{ height: "100%" }}>
        <Splitter.Panel min="40%" size={sizes[0]} resizable="enable">
          <EntrantsList
            entrantsList={entrants}
            setSelectedEntrantId={setSelectedEntrantId}
            onSelectEntrant={handleSelectEntrant}
            handleAddEntrant={handleAddEntrant}
            selectedQualification={selectedQualification}
            setSelectedQualification={setSelectedQualification}
            selectedQuotas={selectedQuotas}
            setSelectedQuotas={setSelectedQuotas}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchText={searchText}
            setSearchText={setSearchText}
            specialties={qualifications}
            quotas={quotas}
            entrantsCount={entrantsCount}
          />
        </Splitter.Panel>
        <Splitter.Panel min="30%" size={sizes[1]}>
          <EntrantCard
            entrantId={selectedEntrantId}
            onEdit={onEditEntrant}
            onDelete={() => {
              deleteItemBy("entrants", selectedEntrantId, () => {});
              handleOnModalFormClose();
            }}
          />
        </Splitter.Panel>
      </Splitter>

      <EntrantModal
        selectedEntrant={selectedEntrant}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleOnModalFormClose={handleOnModalFormClose}
      />
    </div>
  );
};

export default Entrants;
