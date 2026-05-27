/**
 * Normalize skills array (lowercase + trim)
 */
const normalizeSkills = (skills) => {
  return skills?.map((s) => s.toLowerCase().trim()) || [];
};

/**
 * Match a job skill against user skills
 */
const isSkillMatch = (jobSkill, userSkills) => {
  return userSkills.some(
    (userSkill) =>
      userSkill === jobSkill ||
      userSkill.includes(jobSkill) ||
      jobSkill.includes(userSkill),
  );
};

/**
 * Get matched skills
 */
export const getMatchedSkills = (userSkills, jobSkills) => {
  if (!userSkills?.length || !jobSkills?.length) return [];

  const normalizedUser = normalizeSkills(userSkills);
  const normalizedJob = normalizeSkills(jobSkills);

  return normalizedJob.filter((jobSkill) =>
    isSkillMatch(jobSkill, normalizedUser),
  );
};

/**
 * Get missing skills
 */
export const getMissingSkills = (userSkills, jobSkills) => {
  if (!userSkills?.length) return jobSkills || [];
  if (!jobSkills?.length) return [];

  const normalizedUser = normalizeSkills(userSkills);
  const normalizedJob = normalizeSkills(jobSkills);

  return normalizedJob.filter(
    (jobSkill) => !isSkillMatch(jobSkill, normalizedUser),
  );
};

/**
 * Calculate match percentage
 */
export const calculateMatchScore = (userSkills, jobSkills) => {
  if (!userSkills?.length || !jobSkills?.length) return 0;

  const matchedSkills = getMatchedSkills(userSkills, jobSkills);
  const percentage = (matchedSkills.length / jobSkills.length) * 100;

  return Math.round(percentage);
};

/**
 * Get match color based on percentage
 */
export const getMatchColor = (percentage) => {
  if (percentage >= 70) return "green";
  if (percentage >= 40) return "yellow";
  return "red";
};

/**
 * Get match label based on percentage
 */
export const getMatchLabel = (percentage) => {
  if (percentage >= 80) return "Excellent Match";
  if (percentage >= 70) return "Great Match";
  if (percentage >= 50) return "Good Match";
  if (percentage >= 30) return "Partial Match";
  return "Low Match";
};
