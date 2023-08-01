import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import BarChart from "./components/BarChart/BarChart";
import Home from "./components/Home";
import { useDispatch } from "react-redux";
import { fetchData } from "./redux/actions";
import Tree from "./components/TreeChart/Tree";
import TableData from "./components/TableData/TableData";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData());
  }, []);
  console.log("app");
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/columnChart" element={<BarChart />} />
        <Route exact path="/treeChart" element={<Tree />} />
        <Route exact path="/tableData" element={<TableData />} />
      </Routes>
    </Router>
  );
};

export default App;
