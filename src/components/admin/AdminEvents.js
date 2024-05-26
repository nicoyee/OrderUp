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


const AdminEvents = () => {
  return (
    <div id='adminManageContainer'>
      
        <div className='adminManage-header'>
            <h1>Events</h1>
        </div>

          <TableContainer id='dataTable'>
            <Table variant='striped' colorScheme='whiteAlpha' >
              <Thead>
                <Tr >
                  <Th>OrderID</Th>
                  <Th>User</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Time</Th>
                  <Th>Location</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Ongoing'>Ongoing</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
                <Tr>
                  <Td>BdMXsnGggMA6mwmLkQou</Td>
                  <Td>John Doe</Td>
                  <Td><span className='orderStatusTag-Pending'>Pending</span></Td>
                  <Td>01/01/2022</Td>
                  <Td>04:30 PM</Td>
                  <Td>Gov. M. Cuenco Ave., Talamban, Talamban, Cebu City 6000</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
    </div>
  );
};

export default AdminEvents;