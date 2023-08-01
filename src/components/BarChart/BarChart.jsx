import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import classes from "./BarChart.module.css";
import Select from "react-select";
import { useSelector } from "react-redux";

const BarChart = () => {
  const { data } = useSelector((state) => state.data);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [filteredCompanies, setfilteredCompanies] = useState([]);

  function createCompanyList(data) {
    const allCompanies = Array.from(
      new Set(data.map((item) => item.Company_Name))
    ).map((companyName) => ({
      value: companyName,
      label: companyName,
    }));
    return allCompanies;
  }
  function createLocationList(data) {
    const allLocations = Array.from(
      new Set(data.map((item) => item.HQ_Location))
    ).map((location) => ({
      value: location,
      label: location,
    }));
    return allLocations;
  }

  useEffect(() => {
    if (data.data.length > 0) {
      console.log("inside useEffect");
      const companies = createCompanyList(data.data);
      setAllCompanies(companies);
      const locations = createLocationList(data.data);
      setAllLocations(locations);
    }
  }, [data.data]);

  const constructCompanyData = (selectedCompany) => {
    const filteredCompany = data.data.filter((item) =>
      item.Company_Name.includes(selectedCompany)
    );
    return filteredCompany;
  };

  useEffect(() => {
    if (data.data.length > 0) {
      console.log("useEffect 2");
      let newData = [];
      const initialLocations = allLocations
        .map((item) => item.value)
        .slice(1, 6);
      const filteredData = data.data.filter(
        (item) =>
          initialLocations.includes(item.HQ_Location) ||
          selectedLocation.includes(item.HQ_Location)
      );
      newData = filteredCompanies.length > 0 ? filteredCompanies : filteredData;
      const dataByHQ = newData.reduce((acc, item) => {
        const { HQ_Location } = item;
        if (HQ_Location && HQ_Location !== "") {
          acc[HQ_Location] = (acc[HQ_Location] || 0) + 1;
        }
        return acc;
      }, {});
      const chartData = Object.keys(dataByHQ).map((HQ_Location) => ({
        HQ_Location,
        count: dataByHQ[HQ_Location],
      }));

      am4core.useTheme(am4themes_animated);
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      chart.data = chartData;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "HQ_Location";
      categoryAxis.title.text = "Locations";
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "Total companies";

      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "count";
      series.dataFields.categoryX = "HQ_Location";
      if (filteredCompanies.length > 0) {
        series.columns.template.width = am4core.percent(7);
        series.columns.template.tooltipText = `Name: ${selectedCompany}\nNo. of Companies: {valueY}`;
      } else {
        series.columns.template.width = am4core.percent(30);
        series.columns.template.tooltipText =
          "Location: {categoryX}\nNo. of Companies: {valueY}";
      }
      series.columns.template.fill = am4core.color("#0e76ab");
      return () => {
        chart.dispose();
      };
    }
  }, [allLocations,selectedLocation, filteredCompanies]);

  const handleLocationChange = (data) => {
    const newSelectedValues = data.map((item) => item.value);
    const allSelectedValues = [...newSelectedValues];
    setSelectedLocation(allSelectedValues);
  };
  const handleCompanyChange = (data) => {
    setSelectedCompany(data?.value);
    const filteredNodes = constructCompanyData(data?.value);
    setfilteredCompanies(filteredNodes);
  };
  console.log("barchart");
  return (
    <div className={classes.mainDiv}>
      <div className={classes.filter}>
        <div className={classes.dropdown}>
          <Select
            options={allCompanies}
            placeholder="Companies"
            isClearable={true}
            value={allCompanies.find((c) => c.value === selectedCompany)}
            onChange={handleCompanyChange}
            isSearchable={true}
          />
        </div>

        {!selectedCompany && (
          <div className={classes.dropdown}>
            <Select
              options={allLocations}
              placeholder="Locations"
              value={selectedLocation.map((loc) =>
                allLocations.find((l) => l.value === loc)
              )}
              onChange={handleLocationChange}
              isSearchable={true}
              isMulti
            />
          </div>
        )}
      </div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="75vh"
      >
        <div
          id="chartdiv"
          style={{ width: "70vw", height: "100%", margin: "10px" }}
        ></div>
      </Box>
    </div>
  );
};
export default BarChart;
