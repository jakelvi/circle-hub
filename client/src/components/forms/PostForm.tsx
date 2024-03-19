import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "../../lib/validations/index";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "../../context/AuthContex";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/postQueries";
import { INewPost } from "@/types";
import { useState } from "react";

type PostFormProps = {
  post?: INewPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      image: "",
      file: [],
      caption: post?.caption || "",
      location: post?.location || "",
      tags: post?.tags
        ? Array.isArray(post.tags)
          ? post.tags
          : [post.tags]
        : [],
    },
  });

  const { mutateAsync: createPost } = useCreatePost();
  const { mutateAsync: updatePost } = useUpdatePost();

  const [isLoadingCreatePost, setIsLoadingCreatePost] = useState(false);
  const [isLoadingUpdatePost, setIsLoadingUpdatePost] = useState(false);

  const handleSubmit = async (formData: z.infer<typeof PostValidation>) => {
    if (post && action === "Update") {
      setIsLoadingUpdatePost(true);

      const file = form.getValues("file");
      let updatedPost;
      if (file && file.length > 0) {
        updatedPost = {
          ...formData,
          userId: user?.id,
          id: id || "",
          file: file as File[],
          tags:
            typeof formData.tags === "string"
              ? formData.tags.split(",").map((tag: string) => tag.trim())
              : formData.tags,
        };
        await updatePost(updatedPost);
      } else {
        updatedPost = {
          ...formData,
          userId: post?.userId || "",
          id: id || "",
          image: post.image,
          tags:
            typeof formData.tags === "string"
              ? formData.tags.split(",").map((tag: string) => tag.trim())
              : formData.tags,
        };
        try {
          await updatePost(updatedPost);
        } catch (error) {
          toast({ title: `${action} post failed. Please try again.` });
        }
      }

      setIsLoadingUpdatePost(false);
      navigate(`/posts/${id}`);
    } else {
      setIsLoadingCreatePost(true);
      const file = form.getValues("file");

      let newPost;
      if (file && file.length > 0) {
        newPost = {
          ...formData,
          userId: user?.id,
          file: file as File[],
          tags:
            typeof formData.tags === "string"
              ? formData.tags.split(",").map((tag: string) => tag.trim())
              : formData.tags,
        };
      } else {
        newPost = {
          ...formData,
          userId: user?.id,
          tags:
            typeof formData.tags === "string"
              ? formData.tags.split(",").map((tag: string) => tag.trim())
              : formData.tags,
        };
      }

      try {
        await createPost(newPost);
        setIsLoadingCreatePost(false);
        navigate("/");
      } catch (error) {
        toast({ title: `${action} post failed. Please try again.` });
        setIsLoadingCreatePost(false);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>

              <FormControl>
                <>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.image || ""}
                  />
                </>
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma ", ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreatePost || isLoadingUpdatePost}>
            {(isLoadingCreatePost || isLoadingUpdatePost) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
