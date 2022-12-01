import Post from "../models/Posts";
import { Request, Response } from "express";
import User from "../models/User";
import LikePost from "../models/Like-post";
import likeComment from "../models/Like-comment";
import Subscription from "../models/Subscription";
import Saved from "../models/Saved";
import Comment from "../models/Comment";
import LikeComment from "../models/Like-comment";
import {
  Post as PostType,
  Comment as CommentType,
  User as UserType,
} from "../types";

class PostController {
  async createPost(req: Request, res: Response): Promise<any> {
    await new Post({
      photo: "posts/" + req?.file?.filename,
      created: new Date(),
      user: req?.user?.id,
      description: req.body.description,
    }).save();

    res.json("ok");
  }

  async getPosts(req: Request, res: Response) {
    const user = req.params.user;
    const posts: PostType[] = await Post.find({ user })
      .sort({ created: -1 })
      .lean();

    const postsCount = await Post.count({ user });

    for (const onepost of posts) {
      const countLiked = await LikePost.count({
        post: onepost._id,
      });

      const saveExists = await Saved.findOne({
        post: onepost._id,
        user: req?.user?.id,
      });

      const comments: CommentType[] = await Comment.find({
        post: onepost._id,
      })
        .populate("user")
        .lean();

      const likeExists = await LikePost
        .findOne({
          post: onepost._id,
          user: req?.user?.id,
        })
        .lean();

      onepost.like = Boolean(likeExists);
      onepost.saved = Boolean(saveExists);
      onepost.countLiked = countLiked;
      onepost.comments = comments;
    }

    res.json({ posts, postsCount });
  }

  async getFeed(req: Request, res: Response) {
    const subscribers = await Subscription.distinct("subscribed", {
      subscriber: req?.user?.id,
    });

    let posts = await Post.find({
      $or: [{ user: { $in: subscribers } }, { user: req?.user?.id }],
    })
      .sort({ created: -1 })
      .populate("user")
      .lean();

    for (const onepost of posts) {
      const countLiked = await LikePost.count({
        post: onepost._id,
      });

      const saveExists = await Saved.findOne({
        post: onepost._id,
        user: req?.user?.id,
      });

      const comments: CommentType[] = await Comment.find({
        post: onepost._id,
      })
        .populate("user")
        .lean();

      for (const onecomment of comments) {
        const likeExists = await likeComment
          .findOne({
            comment: onecomment._id,
            user: req?.user?.id,
          })
          .lean();

        const countLiked = await likeComment.count({
          comment: onecomment._id,
        });

        onecomment.like = Boolean(likeExists);
        onecomment.countLiked = countLiked;
      }

      const likeExists = await LikePost
        .findOne({
          post: onepost._id,
          user: req?.user?.id,
        })
        .lean();

      onepost.like = Boolean(likeExists);
      onepost.saved = Boolean(saveExists);
      onepost.countLiked = countLiked;
      onepost.comments = comments;
    }

    res.json(posts);
  }

  async getRecommendations(req: Request, res: Response) {
    const subscribers = await Subscription.distinct("subscribed", {
      subscriber: req?.user?.id,
    });
    const recommendations = await User.find({
      $and: [{ _id: { $nin: subscribers } }, { _id: { $ne: req?.user?.id } }],
    }).limit(5);

    res.json(recommendations);
  }

  async getSavedPosts(req: Request, res: Response) {
    const user = req?.user?.id;
    const savedPosts = await Saved.find({ user }).populate("post").lean();
    const mapedSavedPosts = savedPosts.map((onepost) => onepost.post);

    res.json(mapedSavedPosts);
  }

  async getPost(req: Request, res: Response) {
    const post = await Post.findOne({
      _id: req.params.postId,
    })
      .populate("user")
      .lean();

    const countLiked = await LikePost.count({
      post: req.params.postId,
    });

    const saveExists = await Saved.findOne({
      post: req.params.postId,
      user: req?.user?.id,
    });

    const comments: CommentType[] = await Comment.find({
      post: req.params.postId,
    })
      .populate("user")
      .lean();

    for (const onecomment of comments) {
      const likeExists = await likeComment
        .findOne({
          comment: onecomment._id,
          user: req?.user?.id,
        })
        .lean();

      const countLiked = await likeComment.count({
        comment: onecomment._id,
      });

      onecomment.like = Boolean(likeExists);
      onecomment.countLiked = countLiked;
    }

    const likeExists = await LikePost
      .findOne({
        post: req.params.postId,
        user: req?.user?.id,
      })
      .lean();

    if (post) {
      post.like = Boolean(likeExists);
      post.saved = Boolean(saveExists);
      post.countLiked = countLiked;
      post.comments = comments;
    }

    res.json(post);
  }

  async comment(req: Request, res: Response) {
    const comment = new Comment({
      post: req.body.post,
      user: req?.user?.id,
      text: req.body.text,
    });

    await comment.save();

    const objectComment: CommentType = comment.toObject();
    const user: UserType = (await User.findById(req?.user?.id))!;
    objectComment.user = user!;
    res.json(objectComment);
  }

  async deleteComment(req: Request, res: Response) {

    const comment = await Comment.findOne({
      _id: req.params.commentId,
    }).lean();

    const post = await Post.findOne({
      _id: comment?.post,
    });

    if (comment?.user == req?.user?.id || post?.user == req?.user?.id) {
      await Comment.deleteOne({
        _id: req.params.commentId,
      });
    }

    res.json("ok");
  }

  async deletePost(req: Request, res: Response) {

    const post = await Post.findOne({
      _id: req.params.postId,
    }).lean();

    console.log(post)

    if (post?.user == req?.user?.id) {
      await Post.deleteOne({
        _id: req.params.postId,
      });
    }
    res.json("ok");
  }

  async likePost(req: Request, res: Response) {
    const likeExists = await LikePost.findOne({
      post: req.body.post,
      user: req?.user?.id,
    });
    if (likeExists) {
      await LikePost.deleteOne({
        post: req.body.post,
        user: req?.user?.id,
      });
    } else {
      await new LikePost({ post: req.body.post, user: req?.user?.id }).save();
    }
    const likes = await LikePost.count({post: req.body.post})
    res.status(200).json(likes);
  }

  async saved(req: Request, res: Response) {
    const savedExists = await Saved.findOne({
      post: req.body.post,
      user: req?.user?.id,
    });
    if (savedExists) {
      await Saved.deleteOne({
        post: req.body.post,
        user: req?.user?.id,
      });
    } else {
      await new Saved({ post: req.body.post, user: req?.user?.id }).save();
    }

    res.status(200).json("ok");
  }

  async likeComment(req: Request, res: Response) {
    const likeExist = await LikeComment.findOne({
      user: req?.user?.id,
      comment: req.body.commentId,
    });
    if (likeExist) {
      await LikeComment.deleteOne({
        user: req?.user?.id,
        comment: req.body.commentId,
      });
    } else {
      await new LikeComment({
        user: req?.user?.id,
        comment: req.body.commentId,
      }).save();
    }
    const likes = await LikeComment.count({ comment: req.body.commentId });
    res.status(200).json(likes);
  }
}

export default new PostController();
