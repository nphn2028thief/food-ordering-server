import { Request, Response } from 'express';
import { compare, genSaltSync, hashSync } from 'bcrypt';

import UserSchema from '../models/User';
import handleResponse from '../configs/response';
import { signInValidation, signUpValidation } from '../validations/auth';
import { ISignIn, ISignUp, IUserDecode } from '../types/auth';
import { EMongoDBCodeError } from '../constants/enum';
import { signAccessToken, signRefreshToken } from '../configs/jwt';
import { ERole } from '../constants/role';

class AuthController {
  async signUp(req: Request, res: Response) {
    const { error, value } = signUpValidation(req.body as ISignUp);

    if (error) {
      return handleResponse.badRequest(res, error.details[0].message);
    }

    const { displayName, email, password } = value;

    try {
      await UserSchema.create({
        displayName,
        email,
        password: hashSync(password, genSaltSync(12)),
      });

      return handleResponse.success(res, 'Sign up successfully!');
    } catch (error: any) {
      if (error.code === EMongoDBCodeError.DUPLICATE_KEY) {
        return handleResponse.conflict(res, 'Email has been used!');
      }

      return handleResponse.error(res);
    }
  }

  async signIn(req: Request, res: Response) {
    const { error, value } = signInValidation(req.body as ISignIn);

    if (error) {
      return handleResponse.badRequest(res, error.details[0].message);
    }

    const { email, password } = value;

    try {
      const user = await UserSchema.findOne({ email });

      if (!user) {
        return handleResponse.notFound(res, 'Email or password is incorrect!');
      }

      const match = await compare(password, user.password);

      if (!match) {
        return handleResponse.notFound(res, 'Email or password is incorrect!');
      }

      const userDecoded: IUserDecode = {
        id: user._id.toHexString(),
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(userDecoded),
        signRefreshToken(userDecoded),
      ]);

      await UserSchema.findByIdAndUpdate(
        user._id,
        {
          $set: {
            refreshToken,
          },
        },
        {
          new: true,
        },
      );

      return handleResponse.success(res, 'Sign in successfully!', 'data', { accessToken, refreshToken });
    } catch (error) {
      return handleResponse.error(res);
    }
  }

  async signInAdmin(req: Request, res: Response) {
    const { error, value } = signInValidation(req.body as ISignIn);

    if (error) {
      return handleResponse.badRequest(res, error.details[0].message);
    }

    const { email, password } = value;

    try {
      const user = await UserSchema.findOne({ email });

      if (!user) {
        return handleResponse.notFound(res, 'Email or password is incorrect!');
      }

      if (user.role !== ERole.ADMIN) {
        return handleResponse.notFound(res, 'Email or password is incorrect!');
      }

      const match = await compare(password, user.password);

      if (!match) {
        return handleResponse.notFound(res, 'Email or password is incorrect!');
      }

      const userDecoded: IUserDecode = {
        id: user._id.toHexString(),
        role: user.role,
      };

      const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(userDecoded),
        signRefreshToken(userDecoded),
      ]);

      await UserSchema.findByIdAndUpdate(
        user._id,
        {
          $set: {
            refreshToken,
          },
        },
        {
          new: true,
        },
      );

      return handleResponse.success(res, 'Sign in successfully!', 'data', { accessToken, refreshToken });
    } catch (error) {
      return handleResponse.error(res);
    }
  }

  async getMe(req: Request, res: Response) {
    const { id } = req.userDecode;

    try {
      const user = await UserSchema.findById(id).lean().select('-password');

      if (!user) {
        return handleResponse.notFound(res, 'User is not found!');
      }

      return res.json(user);
    } catch (error) {
      return handleResponse.error(res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    const { id } = req.userDecode;

    try {
      const user = await UserSchema.findById(id).lean().select('-password');

      if (!user) {
        return handleResponse.notFound(res, 'User is not found!');
      }

      const accessToken = await signAccessToken({ id: user._id.toHexString(), role: user.role });

      return res.json({ accessToken });
    } catch (error) {
      return handleResponse.error(res);
    }
  }
}

export default new AuthController();
