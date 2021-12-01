export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ message: err.errorList });
  } else {
    next(err);
  }
};

export const unAuthorizedRequestHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ message: "Unauthorized" });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res
      .status(404)
      .send({ message: err.message || "Resource not found!", success: false });
  } else {
    next(err);
  }
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log("Hey I'm the error middleware here is the error: ", err);
  res.status(500).send({ message: "Generic Server Error" });
};