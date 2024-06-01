import React, { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Form, AttachFileButton, SubmitBtn } from "./NewPostForm.styled";
import { TextArea, AttachFileInput } from "../common/common.styled";

export default function NewPostForm() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    console.log(user);

    if (!user || loading) return;

    if (post === "") {
      alert("Please enter your message.");
      return;
    }

    if (post.length > 180) {
      alert("Please keep your message under 180 characters.");
      return;
    }

    try {
      setLoading(true);

      const doc = await addDoc(collection(db, "posts"), {
        userName: user.displayName,
        userId: user.uid,
        userImg: user.photoURL,
        content: post,
        createdAt: new Date().toISOString(),
        tags,
        likedBy: [],
        bookmarkedBy: [],
      });

      console.log(doc);

      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${doc.id}`);
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
      setPost("");
      setFile(null);
      setTags([]);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={post}
        placeholder="What is happening?!"
      />
      <div>
        {tags.map((tag, index) => (
          <span key={index}>
            {tag} <button onClick={() => handleTagRemove(index)}>x</button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags, press Enter to add"
        />
      </div>
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
        value={loading ? "Posting..." : "Post"}
      ></SubmitBtn>
    </Form>
  );
}
