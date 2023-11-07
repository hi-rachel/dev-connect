import React, { useState } from "react";
import { Form, AttachFileButton, SubmitBtn } from "./post-components";
import { TextArea, AttachFileInput } from "./common-components";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostTweetForm() {
  const [loading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const maxSize = 1024 * 1024;
    if (files && files.length === 1 && files[0].size <= maxSize) {
      setFile(files[0]);
    } else {
      alert("Please upload a picture smaller than 1 MB.");
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || loading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: new Date().toISOString(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setTweet("");
      setFile(null);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What is happening?!"
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✔️" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      ></AttachFileInput>
      <SubmitBtn
        type="submit"
        value={loading ? "Posting..." : "Post Tweet"}
      ></SubmitBtn>
    </Form>
  );
}
