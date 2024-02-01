import Joi from 'joi';
import { ISignIn, ISignUp } from '../types/auth';

export const signUpValidation = (data: ISignUp) => {
  const rule = Joi.object<ISignUp>({
    displayName: Joi.string().required().messages({
      'string.empty': 'Display name can not be empty!',
      'any.required': 'Display name is required!',
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email can not be empty!',
      'string.email': 'Email is invalid!',
      'any.required': 'Email is required!',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password can not be empty!',
      'any.required': 'Password is required!',
    }),
    confirmPassword: Joi.equal(Joi.ref('password')).required().messages({
      'string.empty': 'Confirm password can not be empty!',
      'any.only': 'Confirm password does not match!',
      'any.required': 'Confirm password is required!',
    }),
  });

  return rule.validate(data);
};

export const signInValidation = (data: ISignIn) => {
  const rule = Joi.object<ISignIn>({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email can not be empty!',
      'string.email': 'Email is invalid!',
      'any.required': 'Email is required!',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password can not be empty!',
      'any.required': 'Password is required!',
    }),
  });

  return rule.validate(data);
};
