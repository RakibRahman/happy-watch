import React, {useEffect} from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  FormLabel,
  Flex,
  Progress,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import useDragDrop from '../../hooks/useDragDrop';
import {theme} from '../../utils/theme';
import {BsCloudArrowUp} from 'react-icons/bs';
import {User, FileUploadStateProps} from '../../utils/types';

type FileUpload = {
  user: User;
  handleUpload: (file: File) => void;
  state: FileUploadStateProps;
};

const FileUpload: React.FC<FileUpload> = ({user, handleUpload, state}) => {
  const {file, downloadURL, uploading, progress} = state;

  useEffect(() => {
    if (file) {
      console.log(file);
    }
  }, [file]);
  const getVideoDuration = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const media = new Audio(reader.result as string);

      media.onloadedmetadata = () => {
        const duration = Math.round(media.duration);

        if (duration > 180) {
          alert('Duration is over 180 seconds');
        } else {
          handleUpload(file);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const {dropRef, inputRef, selectFile, onSelectFile} =
    useDragDrop(getVideoDuration);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.files[0]) //throws error cause ts assume Object is possibly null;

    const file = e.target.files![0]; // ""non-null assertion operator !"" to fix "Object is possibly null" issue

    // const {files} = e.target;
    // console.log(files);
  };

  return (
    <Flex
      flexDirection="column"
      align="center"
      justify="space-between"
      py={10}
      px={4}
      width="250px"
      border="2px dashed gray"
      bg="#FFFFFF"
      onClick={selectFile}
      ref={dropRef}
      cursor="pointer"
      rounded="5px"
      _hover={{
        borderColor: theme.colorRed,
        bg: 'gray.100',
      }}
    >
      {!uploading && (
        <>
          <BsCloudArrowUp fontSize="4rem" />
          <Text fontWeight="bold" fontSize="1.2rem">
            Select video to upload
          </Text>
          <Text>or drag and drop a file</Text>

          <Text mt={6} textAlign="center" color={theme.colorGray}>
            MP4 or WebM
            <br />
            720x1280 resolution or higher
            <br />
            Up to 180 seconds
            <br />
            Less than 1 GB
          </Text>

          <Input
            ref={inputRef}
            name="file-up"
            id="file-up"
            type="file"
            onChange={onSelectFile}
            accept="video/mp4,video/webm"
            hidden
          />

          <Button
            mt={10}
            bg={theme.colorRed}
            color={theme.colorWhite}
            _hover={{
              opacity: 0.8,
            }}
          >
            Select File
          </Button>
        </>
      )}

      {uploading && (
        <Box>
          <CircularProgress value={progress} color="green.400">
            <CircularProgressLabel>{progress}%</CircularProgressLabel>
          </CircularProgress>
          <Text>Uploading {file?.name}</Text>
        </Box>
      )}
    </Flex>
  );
};

export default FileUpload;
