import React, { useState } from 'react'
import "./ImageUpload.css"
import { Button } from "@material-ui/core"
import {db,storage} from "./firebase"
import firebase from "firebase"

function ImageUpload({username}) {
    const [image,setImage]=useState(null)
    const [progress,setProgress]=useState(0)
    const [caption,setCaption]=useState("")

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=()=>{
        const uploadTask= storage.ref(`images/${image.name}`).put(image)//what it do is access
        //storaging firebase get a ref to this photo(images/....) we were creating new photo
        //.put is putting image that is grab to that point

        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                //here we write progress function..
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                )
                setProgress(progress)
            },
            (error)=>{
                //error functions here...when you get error when uploading
                console.log(error)
                alert(error.message)
            },
            ()=>{
                //complete function here...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //here we post image inside database
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                    })
                    setProgress(0)
                    setCaption("")
                    setImage(null)
                })
            }
        )
    }
    return (
        <div className="imageupload">
            <progress 
            className="imageupload__progress"
            value={progress}
            max="100"
            />
            <input 
            type="text"
            placeholder="Enter caption here.."
            onChange={(e)=>setCaption(e.target.value)}
            value={caption}
            />
            <input 
            type="file"
            onChange={handleChange}
            />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
