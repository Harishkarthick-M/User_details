import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Search2Icon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { db } from "../firebase/firebaseconfic";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

const Home = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const userDetailsSchema = Yup.object({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    avatar: Yup.string().url("Invalid URL").required("Avatar URL is required"),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (values, actions) => {
    try {
      const docRef = await addDoc(collection(db, "users"), values);
      setUsers((prevUsers) => [...prevUsers, { id: docRef.id, ...values }]);
      actions.resetForm();
      onClose();

      toast({
        title: "User added.",
        description: "The new user has been added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    }
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

      <Box display="flex" justifyContent="space-between" mb={8}>
        <InputGroup mr={"5px"}>
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

        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
          Add User
        </Button>
      </Box>

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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                avatar: "",
              }}
              validationSchema={userDetailsSchema}
              onSubmit={handleAddUser}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="first_name">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.first_name && form.touched.first_name
                        }
                        mb={4}
                      >
                        <FormLabel>First Name</FormLabel>
                        <Input {...field} placeholder="First Name" />
                        <FormErrorMessage>
                          {form.errors.first_name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="last_name">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.last_name && form.touched.last_name
                        }
                        mb={4}
                      >
                        <FormLabel>Last Name</FormLabel>
                        <Input {...field} placeholder="Last Name" />
                        <FormErrorMessage>
                          {form.errors.last_name}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb={4}
                      >
                        <FormLabel>Email</FormLabel>
                        <Input {...field} placeholder="Email" />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="avatar">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.avatar && form.touched.avatar}
                        mb={4}
                      >
                        <FormLabel>Avatar URL</FormLabel>
                        <Input {...field} placeholder="Avatar URL" />
                        <FormErrorMessage>
                          {form.errors.avatar}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <ModalFooter px={0}>
                    <Button
                      colorScheme="teal"
                      mr={3}
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Add
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
