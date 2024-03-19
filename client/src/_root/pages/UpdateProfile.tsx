import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea, Input, Button } from "@/components/ui";
import { ProfileUploader, Loader } from "@/components/shared";
import { ProfileValidation } from "../../lib/validations/index";
import { useUserContext } from "../../context/AuthContex";
import { useGetUserById, useUpdateUser } from "@/lib/react-query/userQueries";
import { useEffect, useState } from "react";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: currentUser } = useGetUserById(id || "");
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: {
        first: user.name.first,
        middle: user.name.middle,
        last: user.name.last,
      },
      username: user.username,
      bio: user.bio || "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue("name.first", currentUser?.name?.first || "");
      form.setValue("name.middle", currentUser?.name?.middle || "");
      form.setValue("name.last", currentUser?.name?.last || "");
      form.setValue("username", currentUser.username || "");
      form.setValue("bio", currentUser.bio || "");
      form.setValue("profileImage", currentUser.profileImage);
    }
  }, [currentUser, form]);

  const { mutateAsync: updateUser } = useUpdateUser();
  const [isLoadingUpdateUser, setIsLoadingUpdateUser] = useState(false);

  const handleUpdate = async (formData: z.infer<typeof ProfileValidation>) => {
    try {
      setIsLoadingUpdateUser(true);

      const file = form.getValues("file");
      if (file && file.length > 0) {
        await updateUser({
          userData: formData,
          userId: currentUser._id,
          file: file as File[],
        });
      } else {
        await updateUser({
          userData: formData,
          userId: currentUser._id,
          file: null,
        });
      }

      setIsLoadingUpdateUser(false);
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Error handling update:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser?.profileImage}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name.first"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">First name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name.middle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Middle name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name.last"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Last name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
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

            <div className="flex gap-4 items-center justify-end">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="shad-button_primary">
                {isLoadingUpdateUser ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Update user"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
