import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { addDoc, collection, updateDoc } from "firebase/firestore";
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
import { MdAddAPhoto } from "react-icons/md";
import { DeletePostImg } from "../../../common/post/Post.styled";
import { RiDeleteBin6Line } from "react-icons/ri";
import { auth, db, storage } from "../../../firebase";
import { TextArea } from "../../../common/form/Form.styled";
import { AttachFileInput, Tag } from "../../../common/common.styled";
import {
  MAX_POST_CHARACTER_SIZE,
  MAX_UPLOAD_SIZE,
} from "../../../constants/constants";

const NewPostForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1 && files[0].size <= MAX_UPLOAD_SIZE) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    } else {
      alert(t("newPostForm.msg.uploadWarning"));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (tags.length >= 10) {
        alert(t("newPostForm.msg.tagLimit"));
        setTagInput("");
        return;
      }
      const newTag = tagInput.trim().toLowerCase();
      if (tags.map((tag) => tag.toLowerCase()).includes(newTag)) {
        alert(t("newPostForm.msg.tagExists"));
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

  const handleDeletePostImg = async () => {
    try {
      if (file) {
        if (confirm(t("newPostForm.msg.deletePhotoConfirm"))) {
          setFile(null);
          setPreviewUrl(null);
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || loading) return;

    if (post === "") {
      alert(t("newPostForm.msg.enterMessage"));
      return;
    }

    if (post.length < 2) {
      alert(t("newPostForm.msg.messageTooShort"));
      return;
    }

    if (post.length > MAX_POST_CHARACTER_SIZE) {
      alert(
        t("newPostForm.msg.messageTooLong", { max: MAX_POST_CHARACTER_SIZE })
      );
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
    <Form onSubmit={handleSubmit}>
      <TextArea
        rows={8}
        maxLength={MAX_POST_CHARACTER_SIZE}
        onChange={handleChange}
        value={post}
        placeholder={t("newPostForm.postPlaceholder")}
      />
      <DeletePostImg onClick={handleDeletePostImg}>
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
          aria-label={t("newPostForm.tags")}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("newPostForm.tagPlaceholder")}
        />
      </TagInputArea>
      <AttachFileButton htmlFor="file">
        <AddPhoto>
          <MdAddAPhoto aria-label={t("newPostForm.addPhoto")} size={20} />
          {file ? t("newPostForm.photoAdded") : t("newPostForm.addPhotoButton")}
        </AddPhoto>
      </AttachFileButton>
      <AttachFileInput
        onChange={handleFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={loading ? t("newPostForm.posting") : t("newPostForm.postButton")}
      />
    </Form>
  );
};

export default NewPostForm;
