//files.d.ts
export type INewFile = {
  users: [
    userId: Schema.Types.ObjectId,
    url?: string,
    data?: buffer,
    mimeType?: string,
    createdAt: date
  ];
  posts: [
    postId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    url?: string,
    data?: buffer,
    mimeType?: string,
    createdAt: date
  ];
};
