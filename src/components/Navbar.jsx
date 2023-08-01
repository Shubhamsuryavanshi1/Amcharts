import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  return (
    <Box
      width="100vw"
      height="12vh"
      sx={{ backgroundColor: "#1D5D9B", overflowX: "hidden" }}
    >
      <Stack
        height="12vh"
        direction="row"
        spacing={4}
        alignItems="center"
        justifyContent="flexStart"
        ml="20px"
      >
        <Link to="">
          <AiFillHome color="white" />
        </Link>
        <Link to="columnChart">
          <Typography
            variant="subtitle1"
            sx={{
              cursor: "pointer",
              color: "#f7f8fa",
              borderBottom:
                location.pathname === "/columnChart"
                  ? "1px solid #f7f8fa"
                  : "none",
            }}
          >
            Column Chart
          </Typography>
        </Link>
        <Link to="treeChart">
          <Typography
            variant="subtitle1"
            sx={{
              cursor: "pointer",
              color: "#f7f8fa",
              borderBottom:
                location.pathname === "/treeChart"
                  ? "1px solid #f7f8fa"
                  : "none",
            }}
          >
            Tree Chart
          </Typography>
        </Link>
        <Link to="tableData">
          <Typography
            variant="subtitle1"
            sx={{
              cursor: "pointer",
              color: "#f7f8fa",
              borderBottom:
                location.pathname === "/tableData"
                  ? "1px solid #f7f8fa"
                  : "none",
            }}
          >
            Table
          </Typography>
        </Link>
      </Stack>
    </Box>
  );
};

export default Navbar;
