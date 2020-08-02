import React, {useState} from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';


function ImageUpload() {
    const [caption, setCaption] = useState('');

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange =  (e) => {
        setImage(e.target.value[0]); // seetiing current image
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/$(image.name)`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress bar
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }
        )
    }

    return (
        <div>
            <input type="text" placeholder="enter a caption..." 
                onChange={event => setCaption(event.target.value)} value={''} 
            />

            <input type="file" onChange={handleChange} />

            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
