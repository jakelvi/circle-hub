// posts.d.ts

import { Url } from "url";

type INewPost = {
  userId: Schema.Types.ObjectId;
  id?: Schema.Types.ObjectId;
  caption: string;
  image?: string;
  location?: string;
  tags?: [string];
  likes?: Array<{
    userId: Schema.Types.ObjectId;
    _id?: false;
  }>;
  favorites?: Array<{
    userId: Schema.Types.ObjectId;
    _id?: false;
  }>;
  createdAt: Date;
};

type IUpdatePost = {
  userId: Schema.Types.ObjectId;
  id: string;
  caption: string;
  image?: string;
  location?: string;
  tags?: [string];
  likes?: Array<{
    userId: Schema.Types.ObjectId;
  }>;
  favorites?: Array<{
    userId: Schema.Types.ObjectId;
  }>;
};

export { INewPost, IUpdatePost };
