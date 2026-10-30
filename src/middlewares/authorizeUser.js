const authorizeUser = (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  const requestedUserId = Number(req.params.id);
  if (!Number.isSafeInteger(requestedUserId)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  if (req.user.role !== "ADMIN" && requestedUserId !== Number(req.user.id)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  req.userId = requestedUserId;
  return next();
};

module.exports = authorizeUser;
