function parseCookie(cookie) {
  return cookie.split(";").reduce((acc, c) => {
    const [key, value] = c.trim().split("=");
    return Object.assign(acc, { [key]: value });
  }, {});
}

module.exports = { parseCookie };
