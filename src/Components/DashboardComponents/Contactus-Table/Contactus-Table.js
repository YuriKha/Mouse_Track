import React from 'react';
import './Contactus-Table.css';
import Table from '../../Table/Table.js';

export default function ContactusTable() {
  return (
    <div className='contactus-table-container'>
        <h1 className='contactus-header'>Customers Messages</h1>
        <Table DataType="contactus" ClickHandler={ClickHandler}/>
    </div>
  )
}
function ClickHandler(ID) {
      const params = new URLSearchParams();
      params.append("ID", ID);
      const newUrl = `${
        window.location.origin
      }/Dashboard/message?${params.toString()}`;
      console.log(newUrl)
      window.location.href = newUrl;
  }