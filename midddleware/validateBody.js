function validate(req, res, next) {
  let body;
  try {
    body = req.body;
    next();
  } catch (error) {
    return res.status(400).send({
      error: "INVALID BODY REQUEST DATA ",
    });
  }
}
// not used anywhere
