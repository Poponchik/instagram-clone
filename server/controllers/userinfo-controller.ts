import { Request, Response } from "express";
import User from "../models/User";
import Subscription from "../models/Subscription";
import tokenService from "../service/token-service";
import { User as UserType } from "../types";

class UserInfoController {
  async editUser(req: Request, res: Response) {
    const objectToUpdate = req.body;

    if (req.file) {
      objectToUpdate.photo = "avatars/" + req.file.filename;
    }

    const updatedUser: UserType | null = await User.findByIdAndUpdate(
      req?.user?.id,
      objectToUpdate,
      { new: true }
    );
    const newToken = tokenService.generateAccessToken(
      updatedUser?._id as string,
      updatedUser?.email as string,
      updatedUser?.username as string,
      updatedUser?.photo as string
    );
    res.status(200).json(newToken);
  }

  async getUserInfo(req: Request, res: Response) {
    const username = req.params.username;
    const userInfo = await User.findOne({ username: username }).lean();
    if (!userInfo) {
      return res.sendStatus(404);
    }

    const countSubscribed = await Subscription.count({
      subscribed: userInfo._id,
    });
    const countSubscribers = await Subscription.count({
      subscriber: userInfo._id,
    });

    const subscriptionExists = await Subscription.findOne({
      subscriber: req?.user?.id,
      subscribed: userInfo._id,
    });

    userInfo.subscription = Boolean(subscriptionExists);
    userInfo.countSubscribers = countSubscribers;
    userInfo.countSubscribed = countSubscribed;
    res.json(userInfo);
  }

  async findUser(req: Request, res: Response) {
    const username = req.body.username;
    const users = await User.find({ username: { $regex: username } });
    res.json(users);
  }

  async subscribe(req: Request, res: Response) {
    const subscriptionExists = await Subscription.findOne({
      subscriber: req?.user?.id,
      subscribed: req.body.subscribed,
    });
    if (subscriptionExists) {
      await Subscription.deleteOne({
        subscriber: req?.user?.id,
        subscribed: req.body.subscribed,
      });
    } else {
      await new Subscription({
        subscriber: req?.user?.id,
        subscribed: req.body.subscribed,
      }).save();
    }

    res.status(200).json("ok");
  }
}

export default new UserInfoController();
