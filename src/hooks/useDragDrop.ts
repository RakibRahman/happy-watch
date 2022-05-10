import {DragEvent, useEffect, useRef,SyntheticEvent} from 'react';

const handleDrag = (e:DragEvent | SyntheticEvent) => { 
    e.preventDefault();
    e.stopPropagation(); // prevent other events from bubbling or calling other
};

const handleDrop = (e:DragEvent | Event) => {
    e.preventDefault();
    e.stopPropagation();

    // check dataTransfer exists
    const fileData = 'dataTransfer' in e ? (e as DragEvent).dataTransfer : e.target;
    
   const data = fileData?.files.length>0 && fileData?.files
 };

export default function useDragDrop() {

    const dropRef = useRef<any>();

    useEffect(() => {
        const dropArea = dropRef.current;

        dropArea.addEventListener('dragover', handleDrag);
        dropArea.addEventListener('drop', handleDrop);

        return () => {
            dropArea.removeEventListener('dragover', handleDrag);
            dropArea.removeEventListener('drop', handleDrop);
        }
    })

};