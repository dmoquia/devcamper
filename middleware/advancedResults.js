const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // copy of req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators of ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // const regex = /\b(gt|gte|lt|lte|in)\b/g; // this is the other way of writing it
  // queryStr = queryStr.replace(regex, "$$" + "$1"); // <-- i replace it w/ this now it display with correct format

  // Finding resource
  // query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");
  query = model.find(JSON.parse(queryStr));

  // SELECT FIELDS
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //  Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // if the above condition is empty then it default sorted base of the default date in the models createdAt: {type: Date,default: Date.now},
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1; // would be the index [p0,p1,p2,p3]
  const limit = parseInt(req.query.limit, 10) || 1; // number of items per page e.g ['10 of p0', ''10 of p1']
  const startIndex = (page - 1) * limit; // set items per page e.g 10 of page1 at index zero
  const endIndex = page * limit;
  // const total = await Bootcamp.countDocuments();
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  // const bootcamps = await query;
  const results = await query;

  // Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
