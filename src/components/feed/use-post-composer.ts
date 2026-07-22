import { useState } from "react";
import { createClient } from "@/services/supabase/client";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_POST_IMAGE_SIZE,
  POST_SELECT,
} from "./constants";
import type { Post } from "./types";

export function usePostComposer({
  supabase,
  userId,
  fixedGroupId,
  onPostCreated,
}: {
  supabase: ReturnType<typeof createClient>;
  userId: string | null;
  fixedGroupId?: string;
  onPostCreated: (post: Post) => void;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    fixedGroupId ?? null,
  );
  const [composerText, setComposerText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [composerError, setComposerError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileChange(file: File | null) {
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
      setComposerError("Only JPEG, PNG, WEBP, and GIF images are allowed.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_POST_IMAGE_SIZE) {
      setComposerError("Image must be 2MB or smaller.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setComposerError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleCreatePost() {
    const content = composerText.trim();
    if (!content || !userId || isPosting) return;

    setIsPosting(true);
    setComposerError("");

    let imageUrl: string | undefined;
    if (selectedFile) {
      try {
        const filePath = `${userId}/${Date.now()}_${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(filePath, selectedFile);

        if (uploadError) {
          setComposerError(uploadError.message ?? "Could not upload image.");
          setIsPosting(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from("posts")
          .getPublicUrl(filePath);
        imageUrl = publicData.publicUrl;
      } catch (err) {
        console.error(err);
        setComposerError("Image upload failed.");
        setIsPosting(false);
        return;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        author_id: userId,
        content,
        group_id: fixedGroupId ?? selectedGroupId,
        image_url: imageUrl,
      })
      .select(POST_SELECT)
      .single();

    setIsPosting(false);

    if (error) {
      console.error(error);
      setComposerError(error.message ?? "Could not create post.");
      return;
    }

    onPostCreated(data as unknown as Post);
    setComposerText("");
    if (!fixedGroupId) setSelectedGroupId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  return {
    selectedGroupId,
    setSelectedGroupId,
    composerText,
    setComposerText,
    isPosting,
    composerError,
    selectedFile,
    previewUrl,
    handleFileChange,
    handleCreatePost,
  };
}
