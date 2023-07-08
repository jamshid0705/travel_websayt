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
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this.query;
  }
}

module.exports=Apifeatures



    // Queryni qurish

    // /////////////// 1 filter //////////////
    // const reqObj = { ...req.query };
    // const fields = ['page', 'limit', 'sort', 'fields'];
    // fields.forEach((el) => delete reqObj[el]);

    // //////////2 advance filter /////////////
    // // ? dan keyingi qiymatlarni oladi
    // let queryString = JSON.stringify(reqObj);
    // queryString = queryString.replace(/\bgte|gt|lte|lt\b/g, (val) => `$${val}`);
    // let query = Tour.find(JSON.parse(queryString));

    // /////////// 3 Sort ///////////
    // if(req.query.sort){
    //   const newQuery=req.query.sort.split(',').join(' ')
    //   query = query.sort(newQuery);
    //   // query('price ratingsAverage')
    // }else{
    //   query=query.sort('-createAt')
    // }

    // ///////// 4 fields  ///////////////
    // if(req.query.fields){
    //   const field=req.query.fields.split(',').join(' ')
    //   query=query.select(field)
    //   // select('name price difficulty')
    // }else{
    //   query=query.select('-__v')
    // }

    // ///////// 5 pagination ////////////
    // const page=req.query.page*1 || 1
    // const limit=req.query.limit*1 || 10
    // const skip=(page-1)*limit

    // query=query.skip(skip).limit(limit)

    // if(req.query.page){
    //   const a=await Tour.countDocuments() // tour ni length ni beradi
    //   if(skip>=a){
    //     throw new Error('Bunday page mavjud emas !')
    //   }
    // }
