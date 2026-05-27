import { useSelector } from "react-redux";
import {
  calculateMatchScore,
  getMissingSkills,
  getMatchedSkills,
  getMatchColor,
  getMatchLabel,
} from "../utils/matchAlgorithm";

export const useJobMatch = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const resume = useSelector((state) => state.resume);

  // ✅ Use resume skills first, fall back to profile skills
  const resumeSkills = resume?.parsedSkills || [];
  const profileSkills = user?.skills || [];
  const userSkills = resumeSkills.length > 0 ? resumeSkills : profileSkills;

  const hasResume = !!(resume?.data || resumeSkills.length > 0);
  // Support both "jobseeker" (new) and "user" (legacy) role values
  const isJobSeeker = (user?.role === "jobseeker" || user?.role === "user") && isAuthenticated;

  const getJobMatch = (job) => {
    const requiredSkills = job?.requiredSkills || [];

    if (!userSkills.length || !requiredSkills.length) {
      return null;
    }

    const score = calculateMatchScore(userSkills, requiredSkills);

    return {
      score: score,
      color: getMatchColor(score),
      label: getMatchLabel(score),
      matchedSkills: getMatchedSkills(userSkills, requiredSkills),
      missingSkills: getMissingSkills(userSkills, requiredSkills),
      totalSkills: requiredSkills.length,
    };
  };

  const sortJobsByMatch = (jobs) => {
    if (!jobs?.length || !userSkills.length) return jobs;

    return [...jobs].sort((a, b) => {
      const scoreA = calculateMatchScore(userSkills, a?.requiredSkills || []);
      const scoreB = calculateMatchScore(userSkills, b?.requiredSkills || []);
      return scoreB - scoreA;
    });
  };

  const filterByMinMatch = (jobs, minScore = 0) => {
    if (!jobs?.length || !userSkills.length || !minScore) return jobs;

    return jobs.filter((job) => {
      const score = calculateMatchScore(userSkills, job?.requiredSkills || []);
      return score >= minScore;
    });
  };

  return {
    userSkills,
    hasResume,
    isJobSeeker,
    getJobMatch,
    sortJobsByMatch,
    filterByMinMatch,
  };
};
