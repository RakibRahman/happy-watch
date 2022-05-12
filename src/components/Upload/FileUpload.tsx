import React from 'react';
import {Box, Text, Input, FormLabel} from '@chakra-ui/react';
import useDragDrop from '../../hooks/useDragDrop';
const FileUpload = () => {


  const getVideoDuration = (file: File) => {
    console.log(file);
  };

  const {dropRef, inputRef, selectFile,onSelectFile} = useDragDrop(getVideoDuration);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.files[0]) //throws error cause ts assume Object is possibly null;

    const file = e.target.files![0]; // ""non-null assertion operator !"" to fix "Object is possibly null" issue

   

    // const {files} = e.target;
    // console.log(files);
  };

  return (
    <Box onClick={selectFile} ref={dropRef} w="120px" h="120px" bg="red">
      FileUpload
      <FormLabel>Browse File</FormLabel>
      <Input
        ref={inputRef}
        name="file-up"
        id="file-up"
        type="file"
        onChange={onSelectFile}
        accept='video/mp4,video/webm'
        hidden
      />
    </Box>
  );
};

export default FileUpload;
