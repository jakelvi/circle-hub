type IName = {
  first: string;
  middle?: string;
  last: string;
};

export type INewUser = {
  name: IName;
  username: string;
  email: string;
  password: string;
  bio?: string;
  profileImage?: string;
};

export type IUserData = {
  id: string;
  name: IName;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
};

export type IUser = {
  name: IName;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  id: string;
  post: IPost[];
  following: string[];
  followers: string[];
};

export type IUpdateUser = {
  profileImage?: string;
  id?: string;
  name?: IName;
  username?: string;
  file?: File[] | null;
  bio?: string;
  post?: string[];
  following?: string[];
};

export type ILogin = {
  email?: string;
  username?: string;
  password: string;
};

export type IPost = {
  userId: string;
  _id: string;
  image?: string;
  caption: string;
  location?: string;
  tags?: string | string[];
  likes?: Array<{
    userId: string;
    id?: false;
  }>;
  favorites?: Array<{
    userId: string;
    id?: false;
  }>;
  createdAt: Date;
};

export type INewPost = {
  userId?: string;
  image?: string | undefined;
  id?: string;
  caption: string;
  file?: File[] | null;
  location?: string;
  tags?: string | string[];
};

export type IUpdatePost = {
  userId: string;
  id?: string;
  image?: string | undefined;
  caption?: string;
  file?: File[] | null;
  location?: string;
  tags?: string | string[];
  likes?: Array<{
    userId: string;
    _id?: false;
  }>;
  favorites?: Array<{
    userId: string;
    _id?: false;
  }>;
};

export type INavLink = {
  profileImg?: string;
  imgURL?: string;
  route: string;
  label: string;
};

export type ToggleFollowData = {
  data: boolean;
  message: string;
};
