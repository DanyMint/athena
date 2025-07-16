import React from "react";
import SimpleAnalyticsTable from "../components/SimpleAnalytics";
import { baseBackEndURL } from "../tools/backendAPI";

function Analytics() {
  return (
    <div className="p-6 text-center">
      <SimpleAnalyticsTable />
    </div>
  );
}

export default Analytics;
