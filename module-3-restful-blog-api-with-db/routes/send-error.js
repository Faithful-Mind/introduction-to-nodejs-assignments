function sendError(res, code, location, msg) {
  if (!msg) switch (code) {
    case 404: msg = 'Not Found'; break;
    case 400: msg = 'Bad Request'; break;
    case 500: msg = 'Internal Server Error'; break;
  }
  res.status(code).send({ errors: [{ location, msg }] });
}

module.exports = sendError;