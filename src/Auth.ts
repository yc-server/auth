import { Schema, model, PaginateModel, Document } from '@ycs/db';
import { Boom } from '@ycs/error';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import * as uniqueValidator from 'mongoose-unique-validator';
import { IConfig } from './IConfig';
import { randomBytes, pbkdf2 } from 'crypto';

function preValidate(config: IConfig) {
  return async function(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) return next();

    // Password must not be empty if there is no any providers
    if (!this.password || !this.password.length) {
      if (!this.providers || !this.providers.length)
        return next(Boom.badData(config.messages.errors.invalid_password));
      return next();
    }

    // Make salt
    try {
      this.salt = await this.makeSalt();
      const hashedPassword = await this.encryptPassword(this.password);
      this.password = hashedPassword;
      next();
    } catch (e) {
      next(e);
    }
  };
}

export class Auth {
  schema: Schema;
  model: PaginateModel<Document>;
  constructor(public config: IConfig) {
    this.schema = new Schema(
      {
        password: {
          type: String,
          required() {
            if (!this.providers || !this.providers.length) return true;
            return false;
          },
          validate: {
            validator(v) {
              if (this.providers && this.providers.length) return true;
              return v.length;
            },
            message: this.config.messages.errors.empty_password,
          },
        },
        providers: [
          {
            name: {
              required: true,
              type: String,
            },
            openid: String,
          },
        ],
        roles: {
          type: [String],
          default: this.config.defaultRoles,
        },
        salt: {
          type: String,
        },
        username: {
          lowercase: true,
          required() {
            if (!this.providers || !this.providers.length) {
              return true;
            } else {
              return false;
            }
          },
          type: String,
          unique: true,
          uniqueCaseInsensitive: true,
          validate: {
            validator(v) {
              if (this.providers && this.providers.length) return true;
              return v.length;
            },
            message: this.config.messages.errors.empty_username,
          },
        },
      },
      { timestamps: {} }
    ).plugin(uniqueValidator, {
      mesages: this.config.messages.errors.username_already_in_use,
    });

    this.schema['options'].toJSON = {
      transform(doc, ret, options) {
        delete ret.password;
        delete ret.salt;
        return ret;
      },
    };

    this.schema.pre('validate', preValidate(this.config));

    this.schema.methods = {
      /**
       * Authenticate - check if the passwords are the same
       *
       * @param {String} password
       * @return {Boolean}
       * @api public
       */
      async authenticate(password): Promise<boolean> {
        const pwdGen = await this.encryptPassword(password);
        return this.password === pwdGen;
      },

      /**
       * Make salt
       *
       * @param {Number} byteSize Optional salt byte size, default to 16
       * @return {String}
       * @api public
       */
      makeSalt(byteSize: number = 16): Promise<any> {
        return new Promise((resolve, reject) => {
          randomBytes(byteSize, (err, salt) => {
            if (err) {
              reject(err);
            } else {
              resolve(salt.toString('base64'));
            }
          });
        });
      },

      /**
       * Encrypt password
       *
       * @param {String} password
       * @return {String}
       * @api public
       */
      encryptPassword(password): Promise<string> {
        return new Promise((resolve, reject) => {
          if (!password || !this.salt)
            reject(new Error('Missing password or salt'));
          const defaultIterations = 10000;
          const defaultKeyLength = 64;
          const salt = new Buffer(this.salt, 'base64');
          return pbkdf2(
            password,
            salt,
            defaultIterations,
            defaultKeyLength,
            'sha256',
            (err, key) => {
              if (err) {
                reject(err);
              } else {
                resolve(key.toString('base64'));
              }
            }
          );
        });
      },
    };
    this.model = model('__auth', this.schema);
  }

  signToken(doc: any, options: SignOptions) {
    return sign(
      {
        _id: doc._id,
        providers: doc.providers,
        roles: doc.roles,
      },
      this.config.secret,
      options
    );
  }

  verifyToken(token: string): Promise<any> {
    if (!token) return Promise.resolve();
    return new Promise(resolve => {
      verify(token, this.config.secret, (error, decoded) => {
        if (error) return resolve();
        resolve(decoded);
      });
    });
  }
}
