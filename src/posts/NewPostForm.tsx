import React, { useState } from "react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Form,
  AttachFileButton,
  SubmitBtn,
  TagInputArea,
  TagInput,
  AddPhoto,
  PreviewPhoto,
  DeletePreviewIcon,
} from "./NewPostForm.styled";
import { AttachFileInput, Tag } from "../common/common.styled";
import { MdAddAPhoto } from "react-icons/md";
import { TextArea } from "../common/form/Form.styled";
import { DeletePostImg } from "../common/post/Post.styled";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function NewPostForm() {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      alert("Please upload a picture smaller than 1 MB.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (tags.length >= 10) {
        alert("You can't add more than 10 tags.");
        setTagInput("");
        return;
      }
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleTagRemove = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const onDeletePostImg = async () => {
    try {
      if (file) {
        if (confirm("Are you sure you want to delete this photo?")) {
          setFile(null);
          setPreviewUrl(null);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || loading) return;

    if (post === "") {
      alert("Please enter your message.");
      return;
    }

    if (post.length > 500) {
      alert("Please keep your message under 500 characters.");
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

      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        console.log(url);
        await updateDoc(doc, {
          postImg: url,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setPost("");
      setFile(null);
      setTags([]);
      setPreviewUrl(null);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={8}
        maxLength={500}
        onChange={onChange}
        value={post}
        placeholder="What is happening?!"
      />
      <DeletePostImg onClick={onDeletePostImg}>
        {previewUrl && <PreviewPhoto src={previewUrl} />}
        <DeletePreviewIcon>
          <RiDeleteBin6Line size={30} />
        </DeletePreviewIcon>
      </DeletePostImg>
      <TagInputArea>
        {tags.map((tag, index) => (
          <Tag key={index}>
            {tag} <button onClick={() => handleTagRemove(index)}>x</button>
          </Tag>
        ))}
        <TagInput
          type="text"
          tabIndex={0}
          aria-label="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags, press Enter to add"
        />
      </TagInputArea>
      <AttachFileButton htmlFor="file">
        <AddPhoto>
          <MdAddAPhoto aria-label="Add a photo" size={20} />
          {file ? "Photo added ✔️" : "Add photo"}
        </AddPhoto>
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
