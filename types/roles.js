const ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student',
};

const rolePermissions = {
  [ROLES.ADMIN]: ['manageTenants', 'analytics', 'userReports'],
  [ROLES.INSTRUCTOR]: ['createCourses', 'manageContent', 'viewEarnings'],
  [ROLES.STUDENT]: ['enrollCourses', 'viewContent', 'trackProgress'],
};

module.exports = { ROLES, rolePermissions };
