const jwt = require("jsonwebtoken")

function auth(req, res, next) {
  let header = req.headers.authorization
  if (!header) return res.status(401).json({ message: "Please login to book appointment" })

  let token = header.split(" ")[1]
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Please login to book appointment" })
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ message: "Please login to book appointment" })
  }
}

function authorizeRoles(...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}

module.exports = { auth, authorizeRoles }
