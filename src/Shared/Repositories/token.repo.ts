import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { IToken } from 'src/models/interface';
import { Token } from 'src/models/Schemas/token';

@Injectable()
export class TokenRepository {
  constructor(@InjectModel('Token') private _tokenModel: Model<Token>) {}

  public async updateAllTokens(
    whereCondition: RootFilterQuery<Token>,
    update: Partial<IToken>,
  ) {
    return await this._tokenModel.updateMany(whereCondition, update).exec();
  }

  public async createToken(token: Partial<IToken>) {
    return await this._tokenModel.create(token);
  }

  public async getToken(whereCondition: RootFilterQuery<Token>) {
    return await this._tokenModel.findOne(whereCondition).exec();
  }
}
