export type User = {
  _id: string;
  username: string;
  name: string;
  description: string;
  photo: string;
  subscription?: boolean;
  countSubscribed?: number;
  countSubscribers?: number;
};

export type Comment = {
    _id: string;
    text: string;
    user: string | User;
    post: string;
    like: boolean;
    countLiked: number;
};

export type Post = {
  _id: string;
  photo: string;
  description: string;
  comments: Comment[];
  like: boolean;
  saved: boolean;
  user: string | User;
  countLiked: number;
};
