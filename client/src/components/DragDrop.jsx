import React, {useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import Button from "./Button";
import {FaTrash} from 'react-icons/fa';

const fileTypes = ["JPG", "PNG", "GIF"];
const maxFileSize = 1; //MB

function DragDrop({file, setFile}) {
    //const [file, setFile] = useState(null);

    const handleChange = (file) => {
        // sem dojde 1. subor 
        setFile(file);
    };

    const byteToKB = (val) => {
        return (val / 1024).toFixed(2);
    }

    return (
        <>
            {!file &&
                <FileUploader
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    maxSize={maxFileSize}
                />}

            {file &&
                <div className={'flex flex-row gap-2'}>
                    <Button
                        type={'secondary'}
                        onClick={() => setFile(null)}
                        children={<FaTrash/>}
                        ariaLabel={'delete file'}
                        className={'max-w-min px-1 lg:px-1.5 py-1 lg:py-1.5'}
                    >
                    </Button>
                    <p
                        className={'my-auto'}
                    >
                        {`${file.name} ${byteToKB(file.size)} KB`}
                    </p>
                </div>
            }
        </>
    )
}

export default DragDrop;