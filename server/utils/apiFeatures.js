class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      
      let parsedQuery = JSON.parse(queryStr);
      
      if (parsedQuery.luxuryFeatures) {
        parsedQuery.luxuryFeatures = { $in: parsedQuery.luxuryFeatures.split(',') };
      }
      
      if (parsedQuery.category) {
         parsedQuery.category = { $regex: parsedQuery.category, $options: 'i' };
      }
      
      if (parsedQuery.name) {
         parsedQuery.name = { $regex: parsedQuery.name, $options: 'i' };
      }
      
      if(parsedQuery.minPrice) {
        parsedQuery.pricePerDay = { ...parsedQuery.pricePerDay, $gte: Number(parsedQuery.minPrice) };
        delete parsedQuery.minPrice;
      }
      
      if(parsedQuery.maxPrice) {
        parsedQuery.pricePerDay = { ...parsedQuery.pricePerDay, $lte: Number(parsedQuery.maxPrice) };
        delete parsedQuery.maxPrice;
      }
  
      this.query = this.query.find(parsedQuery);
      
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        let sortBy = this.queryString.sort;
        if (sortBy === 'price_low') sortBy = 'pricePerDay';
        if (sortBy === 'price_high') sortBy = '-pricePerDay';
        if (sortBy === 'rating') sortBy = '-ratingAverage';
        if (sortBy === 'newest') sortBy = '-createdAt';
        
        const sortByFields = sortBy.split(',').join(' ');
        this.query = this.query.sort(sortByFields);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
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
  
  export default APIFeatures;