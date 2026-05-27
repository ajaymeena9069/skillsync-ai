export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

// Pre-defined role combinations for convenience
export const allowRecruiter = authorize("recruiter");
export const allowJobSeeker = authorize("jobseeker");
export const allowAdmin = authorize("admin");
export const allowRecruiterOrAdmin = authorize("recruiter", "admin");
export const allowJobSeekerOrRecruiter = authorize("jobseeker", "recruiter");
