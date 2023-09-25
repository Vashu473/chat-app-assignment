import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router";
import Signup from "../components/Authentication/Signup";
import { ChatState } from "../Context/ChatProvider";
let itemsPerPage = 5;
function User() {
  const { user } = ChatState();
  useEffect(() => {
    if (location.state.state === "alluser" && user) {
      getAllUsers();
    }
  }, [user]);
  const getAllUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios("/api/user/all", config);
    setUsers(data);
  };
  const location = useLocation();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          My Chat App
        </Text>
      </Box>
      {location.state.state == "alluser" ? (
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentUsers.map((data) => {
                return (
                  <Tr
                    key={data._id}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      history.push("/user", { state: "edit", id: data._id })
                    }
                  >
                    <Td>{data._id.slice(14)}</Td>
                    <Td>{data.name}</Td>
                    <Td>{data.email}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={users.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </Box>
      ) : (
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              {location.state.state == "add" ? (
                <Tab>Add User</Tab>
              ) : (
                <Tab>Edit User</Tab>
              )}
            </TabList>
            <TabPanels>
              {location.state.state == "add" ? (
                <TabPanel>
                  <Signup mode="add" />
                </TabPanel>
              ) : (
                <TabPanel>
                  <Signup mode="edit" id={location.state.id} />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Container>
  );
}

export default User;

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Box mt={4} textAlign="center">
      {pageNumbers.map((number) => (
        <Button
          key={number}
          size="sm"
          variant={number === currentPage ? "solid" : "outline"}
          onClick={() => paginate(number)}
          mx={1}
        >
          {number}
        </Button>
      ))}
    </Box>
  );
};
