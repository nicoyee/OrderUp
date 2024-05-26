import './css/AdminManage.css';
import '../common/css/orderInfo.css';
import food from "../../assets/foodplaceholder.png";

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';


const AdminUsers = () => {
  return (
    <div id='adminManageContainer'>
      
        <div className='adminManage-header'>
            <h1>Users</h1>
        </div>

          <TableContainer id='dataTable'>
            <Table variant='striped' colorScheme='whiteAlpha' >
              <Thead>
                <Tr >
                  <Th>UserID</Th>
                  <Th>Display Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                </Tr>
             
              </Tbody>
            </Table>
          </TableContainer>


    </div>
  );
};

export default AdminUsers;