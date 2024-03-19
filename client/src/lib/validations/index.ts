import * as z from "zod";

// USER
const nameValidation = z.object({
  first: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters." }),
  middle: z.string().optional(),
  last: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

const SignupValidation = z.object({
  name: nameValidation,
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    // eslint-disable-next-line no-useless-escape
    .regex(/[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/, {
      message: "Invalid password format.",
    }),
  bio: z.string().optional(),
});

type SignupFormData = z.infer<typeof SignupValidation>;

export const SigninValidation = z.object({
  emailOrUsername: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." })
    // eslint-disable-next-line no-useless-escape
    .regex(/[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/, {
      message: "Invalid password format.",
    }),
});

SigninValidation.refine(
  (data) => {
    if (!data.emailOrUsername.includes("@")) {
      return data;
    } else {
      return data;
    }
  },
  { message: "Invalid input. Please provide a valid email or username." }
);

const ProfileValidation = z.object({
  file: z.array(z.instanceof(File)).optional(),
  name: nameValidation.optional(),
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
});

// POST

const PostValidation = z.object({
  caption: z
    .string()
    .min(1, { message: "This field is required" })
    .max(2200, { message: "Maximum 2,200 characters." }),
  file: z.array(z.instanceof(File)).optional(),
  location: z
    .string()
    .min(0)
    .max(1000, { message: "Maximum 1000 characters." }),
  tags: z.union([z.array(z.string()), z.string()]).default([]),
  image: z.string().optional(),
});

export { PostValidation, ProfileValidation, SignupValidation };
export type { SignupFormData };
