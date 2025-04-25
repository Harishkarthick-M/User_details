import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Text,
  Heading,
  Button,
  Spinner,
  IconButton,
  Flex,
  useColorModeValue,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const User = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    fetch(`https://reqres.in/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data);
        setFormData({
          first_name: data.data.first_name,
          last_name: data.data.last_name,
          email: data.data.email,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const cardBg = useColorModeValue("white", "gray.700");
  const cardShadow = useColorModeValue("lg", "dark-lg");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setUser({
      ...user,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!user) {
    return (
      <Flex direction="column" align="center" justify="center" h="100vh">
        <Text color="red.400" fontSize="lg">
          User not found.
        </Text>
        <Button mt={4} onClick={() => navigate("/")}>
          Go Back
        </Button>
      </Flex>
    );
  }

  return (
    <Flex justify="center" mt={10} px={4}>
      <Box
        p={8}
        bg={cardBg}
        borderRadius="lg"
        boxShadow={cardShadow}
        maxW="md"
        w="full"
      >
        {!isEditing ? (
          <>
            <IconButton
              colorScheme="blue"
              aria-label="edit"
              icon={<EditIcon />}
              onClick={handleEditClick}
            />
            <Flex direction="column" align="center" gap={4}>
              <Image
                src={user.avatar}
                alt="User Avatar"
                borderRadius="full"
                boxSize="120px"
              />
              <Heading size="md">
                {user.first_name} {user.last_name}
              </Heading>
              <Text color="gray.500">{user.email}</Text>
              <Button colorScheme="blue" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </Flex>
          </>
        ) : (
          <Flex direction="column" gap={4}>
            <FormControl>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>

            <Flex justify="space-between" gap={4} mt={4}>
              <Button colorScheme="red" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default User;
