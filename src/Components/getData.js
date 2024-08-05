import axios from "axios";
import React from "react";
import { AiFillStar } from "react-icons/ai";


async function callCustomersData() {
  var TableData = {
    columns: [],
    Data: [],
  };
  TableData.columns = [
    {
      Header: "Info",
      columns: [
        {
          Header: "ID",
          accessor: "ID",
        },
        {
          Header: "Email",
          accessor: "Email",
        },
        {
          Header: "Phone",
          accessor: "Phone",
        },
      ],
    },
    {
      Header: "Name",
      columns: [
        {
          Header: "First Name",
          accessor: "Fname",
        },
        {
          Header: "Last Name",
          accessor: "Lname",
        },
      ],
    },
  ];
  const storedToken = localStorage.getItem("admintoken");
  if (!storedToken) {
    return []; // Token not found, return an empty array
  }
  const URL = "http://localhost:3001/adminmanagement/getalluser";
  try {
    const response = await axios.post(URL, { storedToken });
    if (response.status === 200) {
      TableData.Data = response.data.alluser;
      return TableData
    } else {
      console.error("Unexpected response status:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Handle the error by returning an empty array
  }
}

async function callContactusData(){
  const StatusCell = ({ value: initialValue }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
  
    // If the initialValue is changed externally, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    // Render "Open" for true and "Closed" for false
    return <span className="table-cell">{value ? "Open" : "Closed"}</span>;
  };
  const ImportantCell = ({ value: initialValue }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);
  
    // If the initialValue is changed externally, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
  
    // Render "Open" for true and "Closed" for false
    return <span className="table-cell">{value ? <AiFillStar/> : ""}</span>;
  };
  var TableData = {
    columns: [],
    Data: [],
  };
  TableData.columns = [
    {
      Header: "Info",
      columns: [
        {
          Header: "ID",
          accessor: "ID",
        },
        {
          Header: "Important",
          accessor: "Important",
          Cell: ImportantCell,
        },
        {
          Header: "Email",
          accessor: "Email",
        },
        {
          Header: "Status",
          accessor: "Status",
          Cell: StatusCell,
        },
        {
          Header: "Received",
          accessor: "Received",
        },
      ],
    },
    {
      Header: "Name",
      columns: [
        {
          Header: "First Name",
          accessor: "Fname",
        },
        {
          Header: "Last Name",
          accessor: "Lname",
        },
      ],
    },
  ];

  

  const storedToken = localStorage.getItem("admintoken");
  if (!storedToken) {
    return []; // Token not found, return an empty array
  }
  const URL = "http://localhost:3001/contactadmin/getall";
  try {
    const response = await axios.post(URL, { storedToken });
    if (response.status === 200) {
      TableData.Data = response.data.allContactUs;
      return TableData
    } else {
      console.error("Unexpected response status:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Handle the error by returning an empty array
  }
  
}
export default async function getData(props) {
  switch (props) {
    case "customers":
      return callCustomersData();
    case "contactus":
      return callContactusData();
    default:
      return [];
  }
}
