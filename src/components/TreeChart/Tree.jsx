import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Box } from "@mui/material";
import Select from "react-select";
import { useEffect, useState } from "react";
import classes from "./Tree.module.css";
import { useSelector } from "react-redux";
const Tree = () => {
  const { data } = useSelector((state) => state.data);
  const [filterLevel, setFilterLevel] = useState();
  const [allCompanies, setAllCompanies] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const [levelFilteredData, setLevelFilteredData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [companyFilteredData, setCompanyFilteredData] = useState([]);

  const createCompanyList = (data) => {
    const allCompanies = Array.from(
      new Set(data.map((item) => item.Company_Name))
    ).map((companyName) => ({
      value: companyName,
      label: companyName,
    }));
    return allCompanies;
  };

  const createLevelList = (data) => {
    // console.log("createLevelList");
    const allLevels = Array.from(new Set(data.map((item) => item.Level))).map(
      (level) => {
        return {
          value: level,
          label: level,
        };
      }
    );
    return allLevels;
  };

  const constructTreeData = (data) => {
    const companyMap = {};
    data.forEach((item) => {
      const company = { ...item, children: [] };
      companyMap[item.Company_Name] = company;
      if (item.Parent) {
        const parent = companyMap[item.Parent];
        if (parent) {
          parent.children.push(company);
        }
      }
    });
    const treeData = Object.values(companyMap).filter(
      (company) => !company.Parent
    );
    return treeData;
  };

  useEffect(() => {
    if (data.data.length > 0) {
      console.log("inside useEffect 1");
      const companies = createCompanyList(data.data);
      setAllCompanies(companies);
      const levels = createLevelList(data.data);
      setAllLevels(levels);
      const treeData = constructTreeData(data.data);
      setTreeData(treeData);
      setCompanyFilteredData(treeData);
    }
  }, [data.data]);

  const filterTreeDataByLevel = (selectedLevel) => {
    if (selectedLevel === "T2") {
      return treeData;
    } else if (selectedLevel === "T0") {
      const newData = { ...treeData[0], children: [] };
      return [newData];
    } else if (selectedLevel === "T1") {
      const childrenT1 = [...treeData[0].children];
      const newData = childrenT1.map((item) => ({ ...item, children: [] }));
      const newT1Data = { ...treeData[0], children: newData };
      return [newT1Data];
    }
  };

  const constructFilteredData = (selectedCompany) => {
    const map = new Map();
    data.data.forEach((item) => {
      map.set(item.Company_Name, { ...item, children: [] });
    });
    const newFilteredData = [];
    const selectedCompanyNode = map.get(selectedCompany);
    if (selectedCompanyNode && selectedCompanyNode.Level === "T1") {
      const newData = treeData[0].children.filter(
        (item) => item.Company_Name == selectedCompany
      );
      const parentNode = map.get(selectedCompanyNode.Parent);
      parentNode.children = newData;
      newFilteredData.push(parentNode);
      setCompanyFilteredData(newFilteredData);
    } else if (selectedCompanyNode && selectedCompanyNode.Level === "T2") {
      const newParent = treeData[0].children.filter(
        (item) =>
          item.Company_Name.replace(/ *\([^)]*\) */g, "") ===
          selectedCompanyNode.Parent
      );
      const newParentData = [
        { ...newParent[0], children: [selectedCompanyNode] },
      ];
      const newFilteredData = [{ ...treeData[0], children: newParentData }];
      setCompanyFilteredData(newFilteredData);
    } else {
      setCompanyFilteredData(treeData);
    }
  };

  useEffect(() => {
    if (levelFilteredData?.length > 0 || companyFilteredData?.length > 0) {
      console.log("inside useEffect 2");
      const root = am5.Root.new("chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);
      const container = root.container.children.push(
        am5.Container.new(root, {
          width: am5.percent(100),
          height: am5.percent(100),
          layout: root.verticalLayout,
        })
      );

      const series = container.children.push(
        am5hierarchy.Tree.new(root, {
          // singleBranchOnly: true,
          downDepth: 1,
          initialDepth: filterLevel ? parseInt(filterLevel.slice(1)) : 0,
          // initialDepth:0,
          topDepth: 0,
          valueField: 1,
          categoryField: "Company_Name",
          childDataField: "children",
        })
      );
      if (filterLevel && !selectedOptions) {
        series.data.setAll(levelFilteredData);
      } else {
        series.data.setAll(companyFilteredData);
      }
      series.set("selectedDataItem", series.dataItems[0]);
      series.labels.template.setAll({
        text: "{Level}",
        fontSize: 14,
      });
      series.nodes.template.set(
        "tooltipText",
        "{Company_Name}: [bold]{Level}[/]"
      );
      series.circles.template.setAll({
        radius: 15,
      });

      series.outerCircles.template.setAll({
        radius: 15,
      });
      series.nodes.template.setAll({
        draggable: false,
      });
      return () => {
        root.dispose();
      };
    }
  }, [
    filterLevel,
    selectedOptions,
    companyFilteredData,
    levelFilteredData,
  ]);

  const handleLevelChange = (data) => {
    setFilterLevel(data?.value);
    const filteredTreeData = filterTreeDataByLevel(data?.value);
    setLevelFilteredData(filteredTreeData);
  };

  const handleSelectChange = (data) => {
    setSelectedOptions(data?.value);
    constructFilteredData(data?.value);
  };
  console.log("tree");
  // if (loading) {
  //   return <div>...loading</div>;
  // }
  // if (error) {
  //   return <div>Error : {error}</div>;
  // }
  return (
    <div className={classes.mainDiv}>
      <div className={classes.filter}>
        <div className={classes.dropdown}>
          <Select
            options={allCompanies}
            placeholder="Companies"
            value={allCompanies.find((c) => c.value === selectedOptions)}
            onChange={handleSelectChange}
            isSearchable={true}
            isClearable={true}
          />
        </div>
        <div className={classes.dropdown}>
          {!selectedOptions && <Select
            options={allLevels}
            placeholder="Level"
            value={allLevels.find((c) => c.value === filterLevel)}
            onChange={handleLevelChange}
            isSearchable={true}
            isClearable={true}
          />}
        </div>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="75vh"
      >
        <div
          id="chartdiv"
          style={{ width: "80vw", height: "100%", margin: "10px" }}
        ></div>
      </Box>
    </div>
  );
};

export default Tree;
