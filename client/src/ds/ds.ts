import { authorizedAxios, unauthorizedAxios } from "../config";
import { User as UserType, Post as PostType } from "../types";

export class Auth {
  private prefix;

  constructor() {
    this.prefix = "/auth";
  }

  async registration(email: string, password: string, username: string, name: string) {
    return unauthorizedAxios.post(`${this.prefix}/registration`, {email, password, username, name});
  }

  async login(email: string, password: string) {
    return unauthorizedAxios.post(`${this.prefix}/login`, {email, password});
  }
}

export class User {
  private prefix;

  constructor() {
    this.prefix = "/user";
  }

  async getInfo(username: string): Promise<UserType> {
    const { data } = await authorizedAxios.get(`${this.prefix}/${username}`);
    return data;
  }

  async toggleSubscribtion(userId: string) {
    return authorizedAxios.post(`${this.prefix}/subscriptions`, {
      subscribed: userId,
    });
  }

  async editProfile(name: string, username: string, description: string) {
    return authorizedAxios.post(`${this.prefix}/edit`, {name, username, description});
  }

  async uploadMainPhoto(data: any) {
    return authorizedAxios.post(`${this.prefix}/edit`, data);
  }

  async searchUser(username: string): Promise<UserType[]> {
    const { data } = await authorizedAxios.post(`${this.prefix}/search`, { username })
    return data;
  }
}

export class Post {
  private prefix;

  constructor() {
    this.prefix = "/post";
  }

  async getPosts(userId: string) {
    const { data } = await authorizedAxios.get(
      `${this.prefix}/account/${userId}`
    );
    return data;
  }

  async getPost(postId: string) {
    return authorizedAxios.get(`${this.prefix}/post/${postId}`);
  }

  async getSavedPosts() {
    return authorizedAxios.get(`${this.prefix}/saved/get`);
  }

  async getFeed() {
    return authorizedAxios.get(`${this.prefix}/feed/get`);
  }

  async getRecommendation() {
    return authorizedAxios.get(`${this.prefix}/recommendations/get`);
  }

  async sendComment(commentText: string, postId: string) {
    return authorizedAxios.post(`${this.prefix}/comments/get`, {
      text: commentText,
      post: postId,
    });
  }

  async deleteComment(id: string) {
    return authorizedAxios.delete(`${this.prefix}/${id}`);
  }

  async deletePost(id: string) {
    return authorizedAxios.delete(`${this.prefix}/deletepost/${id}`);
  }

  async likePost(postId: string) {
    return authorizedAxios.post(`${this.prefix}/like/post`, { post: postId });
  }

  async likeComment(commentId: string) {
    return authorizedAxios.post(`${this.prefix}/like/comment`, { commentId });
  }

  async save(postId: string) {
    return authorizedAxios.post(`${this.prefix}/save/post`, { post: postId });
  }

  async uploadPhoto(data: any) {
    return authorizedAxios.post(`${this.prefix}/upload`, data);
  }
}
