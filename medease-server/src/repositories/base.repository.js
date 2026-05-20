class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    return this.model.findById(id, null, options);
  }

  async findOne(filter = {}, options = {}) {
    return this.model.findOne(filter, null, options);
  }

  find(filter = {}, options = {}) {
    return this.model.find(filter, null, options);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  async updateOne(filter, data, options = { new: true }) {
    return this.model.findOneAndUpdate(filter, data, options);
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async deleteMany(filter = {}) {
    return this.model.deleteMany(filter);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async exists(filter = {}) {
    return this.model.exists(filter);
  }

  async paginate(filter = {}, { page = 1, limit = 10, sort = { createdAt: -1 } } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async aggregate(pipeline = []) {
    return this.model.aggregate(pipeline);
  }

  modelInstance() {
    return this.model;
  }
}

module.exports = BaseRepository;
