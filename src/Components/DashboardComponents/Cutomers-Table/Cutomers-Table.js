import React from 'react';
import './Cutomers-Table.css';
import Table from '../../Table/Table.js';

export default function CustomersTable() {
  return (
    <div className='customers-table-container'>
        <h1 className='customers-header'>Customers Table</h1>
        <Table DataType="customers" ClickHandler={ClickHandler}/>
    </div>
  )
}
function ClickHandler(ID) {
      const params = new URLSearchParams();
      params.append("ID", ID);
      const newUrl = `${
        window.location.origin
      }/Dashboard/profile?${params.toString()}`;
      console.log(newUrl)
      window.location.href = newUrl;
  }