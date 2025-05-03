import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Container,
  Center,
  Spinner,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import theme from './theme';

const MotionBox = motion(Box);

// Simple video icon SVG
const VideoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/generate-video`,
        {
          prompt: prompt,
        }
      );
      
      setVideoUrl(response.data.video_path);
      toast({
        title: 'Success',
        description: 'Video generated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate video. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.lg" py={10}>
        <VStack gap={8}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="2xl" textAlign="center" mb={2}>
              Manim Video Generator
            </Heading>
            <Text textAlign="center" color="gray.400">
              Transform your ideas into beautiful mathematical animations
            </Text>
          </MotionBox>

          <MotionBox
            w="100%"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the animation you want to create..."
              size="lg"
              h="200px"
              bg="gray.800"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'blue.500' }}
            />
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              size="lg"
              isLoading={isLoading}
              loadingText="Generating..."
              leftIcon={<VideoIcon />}
              _hover={{ transform: 'scale(1.05)' }}
              _active={{ transform: 'scale(0.95)' }}
            >
              Generate Video
            </Button>
          </MotionBox>

          {isLoading && (
            <Center>
              <Spinner size="xl" color="blue.500" />
            </Center>
          )}

          {videoUrl && !isLoading && (
            <MotionBox
              w="100%"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <video
                src={videoUrl}
                controls
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </MotionBox>
          )}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
