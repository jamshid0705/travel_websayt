class Apifeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }
  filter() {
    const reqObj = { ...this.queryString };
    const fields = ['page', 'limit', 'sort', 'fields'];
    fields.forEach((el) => delete reqObj[el]);

    let queryString = JSON.stringify(reqObj);
    queryString = queryString.replace(/\bgte|gt|lte|lt\b/g, (val) => `$${val}`);
    this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const newQuery = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(newQuery);
    } else {
      this.query = this.query.sort('-createAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const field = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(field);
      // select('name price difficulty')
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports=Apifeatures