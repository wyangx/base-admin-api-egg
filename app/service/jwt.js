'use strict';

const UUID = require('uuid').v4;
const dayjs = require('dayjs');
const Service = require('egg').Service;
const AuthException = require('../exception/auth');

class JwtService extends Service {
  async createToken (userId, secret, expire) {
    const now = dayjs().unix();
    return this.app.jwt.sign({
      aud: 'http://127.0.0.1',
      iss: '',
      jti: UUID(),
      iat: now,
      nbf: now,
      exp: now + expire,
      uid: userId,
    }, secret);
  }

  async awardToken (userId) {
    const config = this.app.config.jwt;
    return {
      token: await this.createToken(userId, config.secret, config.expire),
      refresh_token: await this.createToken(userId, config.refresh_secret, config.refresh_expire),
    };
  }

  async refreshToken (refreshToken) {
    const userId = await this.getUserIdFromToken(refreshToken, true);
    const token = await this.createToken(userId, this.app.config.jwt.secret, this.app.config.jwt.expire);
    return {
      token,
      refresh_token: refreshToken,
    };
  }

  async verifyToken (token, isRefresh = false) {
    if (!token) {
      throw new AuthException();
    }
    const secret = isRefresh ? this.app.config.jwt.refresh_secret : this.app.config.jwt.secret;
    try {
      await this.app.jwt.verify(token, secret);
    } catch (e) {
      if (e.message === 'jwt expired' && !isRefresh) {
        throw new AuthException('令牌过期', 10003);
      }
      throw new AuthException();
    }
    return true;
  }

  async getUserIdFromToken (token, isRefresh = false) {
    await this.verifyToken(token, isRefresh);
    const res = await this.app.jwt.decode(token);
    return res.uid;
  }
}

module.exports = JwtService;
