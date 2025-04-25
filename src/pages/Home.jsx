import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Image,
  IconButton,
  Text,
  SimpleGrid,
  VStack,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Search2Icon, DeleteIcon } from "@chakra-ui/icons";

const Home = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://reqres.in/api/users?per_page=12")
      .then((res) => res.json())
      .then((data) => setUsers(data.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase())
    );
  });

  return (
    <Box p={5}>
      <Heading textAlign="start" mb={8}>
        All Members
      </Heading>

      <InputGroup mb={8}>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search members"
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>

      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {filteredUsers.map((user) => (
          <Box
            key={user.id}
            bg="lightblue"
            p={6}
            borderRadius="lg"
            textAlign="center"
            onClick={() => navigate(`/user/${user.id}`)}
            _hover={{ cursor: "pointer", boxShadow: "md" }}
            position="relative"
            role="group"
          >
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="delete"
              size="sm"
              position="absolute"
              top={2}
              right={3}
              opacity={0}
              _groupHover={{ opacity: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(user.id);
              }}
            />
            <VStack spacing={3}>
              <Image
                src={user.avatar}
                alt="User Avatar"
                borderRadius="full"
                boxSize="100px"
              />
              <Text fontWeight="bold">
                {user.first_name} {user.last_name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.email}
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
