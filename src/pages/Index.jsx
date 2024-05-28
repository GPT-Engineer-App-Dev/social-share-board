import { usePosts, useAddPost } from "../integrations/supabase/index.js";
import { useState } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Text, Textarea, VStack, Heading, Spinner, Alert, AlertIcon } from "@chakra-ui/react";

const Index = () => {
  const { data: posts, isLoading, isError } = usePosts();
  const addPostMutation = useAddPost();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handlePost = () => {
    if (name && message) {
      addPostMutation.mutate({ title: name, body: message });
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
        <Button colorScheme="blue" onClick={handlePost} isLoading={addPostMutation.isLoading}>
          Post
        </Button>
      </VStack>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Alert status="error">
          <AlertIcon />
          There was an error loading the posts.
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {posts.map((post) => (
            <Box key={post.id} p={4} borderWidth="1px" borderRadius="md">
              <Text fontWeight="bold">{post.title}</Text>
              <Text>{post.body}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;