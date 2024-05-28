import { useState } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack, Heading } from "@chakra-ui/react";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handlePost = () => {
    if (name && message) {
      setPosts([...posts, { name, message }]);
      setName("");
      setMessage("");
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <Box as="nav" bg="blue.500" color="white" p={4} mb={6}>
        <Heading size="lg">Public Post Board</Heading>
      </Box>
      <VStack spacing={4} mb={6}>
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="message">
          <FormLabel>Message</FormLabel>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handlePost}>
          Post
        </Button>
      </VStack>
      <VStack spacing={4} align="stretch">
        {posts.map((post, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="md">
            <Text fontWeight="bold">{post.name}</Text>
            <Text>{post.message}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;