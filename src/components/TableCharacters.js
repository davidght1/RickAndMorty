import React, { useEffect, useState } from "react";
import axios from "axios";

// material ui imports
import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
import Pagination from "@mui/material/Pagination";

import SearchIcon from "@material-ui/icons/Search";
import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableContainer,
  Button,
} from "@material-ui/core";
import {
  Box,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

//material ui style table
const columns = [
  { id: "image", label: "", minWidth: 30 },
  { id: "name", label: "name", minWidth: 100 },
  {
    id: "origin",
    label: "origin",
    minWidth: 100,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "status",
    minWidth: 100,
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "species",
    label: "species",
    minWidth: 100,
    format: (value) => value.toFixed(2),
  },
  {
    id: "gender",
    label: "gender",
    minWidth: 20,
    format: (value) => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    marginLeft: "10%",
    marginTop: "1%",
    width: "80%",
    marginBottom: "25px",
  },
  container: {
    maxHeight: 640,
  },
  // center input
  centerInput: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1%",
  },
  centerInput2: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    marginLeft: "20%",
    marginRight: "20%",
  },
  rowContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  dialog: {
    display: "flex",
  },
});
//end style and data

const TableCharacters = () => {
  const classes = useStyles();
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState({});
  const [clearData, setClearData] = useState(1);

  // get data
  const getCharactersData = async (p) => {
    try {
      const { data } = await axios.get(
        `https://rickandmortyapi.com/api/character?page=${p}`
      );
      setCharacters(data.results);
      setFilteredCharacters(data.results);
    } catch (error) {}
  };
  //render page on open with the value page 1
  useEffect(() => {
    getCharactersData(1);
  }, []);
  // close the modal window
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter({});
  };
  // show first episode
  const showFirstEpisode = (episodes) => {
    if (episodes && episodes.length > 0) {
      const firstEpisodeUrl = episodes[0];
      const episodeNumber = firstEpisodeUrl.split("/").pop();
      return episodeNumber;
    }
    return "";
  };
  //show last
  const showLastEpisode = (episodes) => {
    if (episodes && episodes.length > 0) {
      const lastEpisodeUrl = episodes[episodes.length - 1];
      const episodeNumber = lastEpisodeUrl.split("/").pop();
      return episodeNumber;
    }
    return "";
  };
  // clean search filter
  const cleanSearch = () => {
    setStatus("");
    setGender("");
    setSearchValue("");
    getCharactersData(clearData);
  };

  //filter
  const filterCharacters = (selectedGender, selectedStatus, searchValue) => {
    setFilteredCharacters(
      characters.filter((character) => {
        const isGenderMatch =
          selectedGender === "" || character.gender === selectedGender;
        const isStatusMatch =
          selectedStatus === "" || character.status === selectedStatus;
        const isSearchMatch =
          searchValue === "" ||
          character.name.toLowerCase().includes(searchValue.toLowerCase());
        return isGenderMatch && isStatusMatch && isSearchMatch;
      })
    );
  };

  return (
    <div>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <img src={selectedCharacter.image} />
        <h2 style={{ paddingLeft: "10%" }}>{selectedCharacter.name}</h2>

        <p style={{ paddingLeft: "10%" }}>
          First Appearance: {showFirstEpisode(selectedCharacter.episode)}
        </p>
        <hr
          style={{ borderTop: "1px solid black", opacity: 0.5, width: "80%" }}
        />
        <p style={{ paddingLeft: "10%" }}>
          Last Appearance: {showLastEpisode(selectedCharacter.episode)}
        </p>
        <hr
          style={{
            marginBottom: "20%",
            borderTop: "1px solid black",
            opacity: 0.5,
            width: "80%",
          }}
        />
      </Dialog>
      {/* container of all inputs */}
      <div className={classes.centerInput}>
        <TextField
          id="filled-full-width"
          label="Search Character"
          style={{ width: "70%" }}
          placeholder="Search..."
          variant="filled"
          value={searchValue}
          onChange={(e) => {
            // setFilteredCharacters(
            //   characters.filter((character) =>
            //     character.name
            //       .toLowerCase()
            //       .startsWith(e.target.value.toLowerCase())
            //   )
            // );
            const searchValue = e.target.value;
            setSearchValue(searchValue);
            filterCharacters(gender, status, searchValue);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className={classes.centerInput2}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                // setFilteredCharacters(
                //   characters.filter(
                //     (character) => character.gender === e.target.value
                //   )
                // );
                const selectedGender = e.target.value;
                filterCharacters(selectedGender, status, searchValue);
                setGender(selectedGender);
              }}
            >
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Button clean */}
        <Button
          style={{
            backgroundColor: "#3f51b5",
            color: "white",
            borderRadius: "4px",
            padding: "8px 16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onClick={cleanSearch}
        >
          Clear
        </Button>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Status"
              value={status}
              onChange={(e) => {
                // setStatus(e.target.value);
                // setFilteredCharacters(
                //   characters.filter(
                //     (character) => character.status === e.target.value
                //   )
                // );
                const selectedStatus = e.target.value;
                filterCharacters(gender, selectedStatus, searchValue);
                setStatus(selectedStatus);
              }}
            >
              <MenuItem value={"Alive"}>Alive</MenuItem>
              <MenuItem value={"Dead"}>Dead</MenuItem>
              <MenuItem value={"unknown"}>unknown</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCharacters.map((character) => (
                <TableRow
                  key={character.id}
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedCharacter(character);
                  }}
                >
                  <TableCell>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={character.image}
                        alt={character.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{character.name}</p>
                  </TableCell>
                  <TableCell>
                    <p>{character.origin.name}</p>
                  </TableCell>
                  <TableCell>
                    <p>{character.status}</p>
                  </TableCell>
                  <TableCell>
                    <p>{character.species}</p>
                  </TableCell>
                  <TableCell>
                    <p>{character.gender}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={42}
          defaultPage={1}
          onChange={(event, page) => {
            setClearData(page);
            getCharactersData(page);
            setGender("");
            setStatus("");
          }}
        />
      </Paper>
    </div>
  );
};

export default TableCharacters;
