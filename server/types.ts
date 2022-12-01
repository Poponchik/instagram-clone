export {};

declare global {
    namespace Express {
      export interface Request {
        file?: Multer.File;
        user?: AuthUser;
      }
    }
  }

  export type AuthUser = Pick<User, 'username' | 'name' | 'photo'> & {id: string}

  export type User = {
    _id: string;
    username: string;
    name: string;
    description: string;
    photo: string;
    subscription?: boolean;
    countSubscribed?: number;
    countSubscribers?: number;
    password: string;
    email: string;
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
  