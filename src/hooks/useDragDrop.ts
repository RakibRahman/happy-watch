import {ChangeEvent, DragEvent, useEffect, useRef} from 'react';

export default function useDragDrop(onDrop: (file: File) => void) {
  const dropRef = useRef<any>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent other events from bubbling or calling other
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // check dataTransfer exists
    // const fileData = 'dataTransfer' in e ? (e as DragEvent).dataTransfer : e.target;
    // const {files} =fileData;
    // const data = fileData?.files.length>0 && fileData?.files

    const files = e.dataTransfer.files;

    if (files.length > 0 && files) {
      const fileData = files[0];
      onDrop(fileData);
      e.dataTransfer.clearData();
    }
  };

  const selectFile = () => {
    inputRef.current?.click();
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      onDrop(file);
    }
  };

  useEffect(() => {
    const dropArea = dropRef.current;

    dropArea.addEventListener('dragover', handleDrag);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDrag);
      dropArea.removeEventListener('drop', handleDrop);
    };
  });

  return {dropRef, inputRef, selectFile, onSelectFile};
}
