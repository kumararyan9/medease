import BaseRepository from './base.repository.js';
import User from '@/models/user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByEmailWithPassword(email) {
    return this.model
      .findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('roleId', 'name slug');
  }

  async findActiveById(id) {
    return this.findOne({ _id: id, isActive: true });
  }

  async findByRole(role, _options = {}) {
    throw new Error('findByRole is deprecated — query by roleId instead');
  }

  async updateLastLogin(id) {
    return this.update(id, { lastLoginAt: new Date() });
  }
}

export default new UserRepository();
