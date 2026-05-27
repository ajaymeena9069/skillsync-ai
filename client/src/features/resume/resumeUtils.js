/**
 * Resume utility functions for storage and normalization
 */

// Get user-specific storage key
const getResumeStorageKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // ✅ Check for both 'id' and '_id' formats
    const userId = user?.id || user?._id;

    if (userId) {
      return `skillSync_resume_${userId}`;
    }
    // Fallback for backward compatibility
    return "skillSync_resume";
  } catch (error) {
    return "skillSync_resume";
  }
};

/**
 * Save resume data to localStorage
 */
export const saveResumeToStorage = (resumeData) => {
  try {
    const key = getResumeStorageKey();
    localStorage.setItem(key, JSON.stringify(resumeData));
    console.log(`✅ Resume saved to localStorage (key: ${key})`);
  } catch (error) {
    console.error("Failed to save resume to storage:", error);
  }
};

/**
 * Get resume data from localStorage
 */
export const getResumeFromStorage = () => {
  try {
    const key = getResumeStorageKey();
    const stored = localStorage.getItem(key);

    // Also check for old key for backward compatibility
    if (!stored) {
      const oldKey = "skillSync_resume";
      const oldStored = localStorage.getItem(oldKey);
      if (oldStored) {
        // Migrate old data to new key and delete old
        localStorage.setItem(key, oldStored);
        localStorage.removeItem(oldKey);
        console.log(`📦 Migrated old resume data to new key: ${key}`);
        return JSON.parse(oldStored);
      }
    }

    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to get resume from storage:", error);
    return null;
  }
};

/**
 * Clear resume from localStorage
 */

export const clearResumeFromStorage = () => {
  try {
    let userId = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      userId = user?.id || user?._id;
    }

    // Method 3: Check for any existing resume keys
    const allKeys = Object.keys(localStorage);
    const resumeKeys = allKeys.filter((key) =>
      key.startsWith("skillSync_resume"),
    );

    console.log("🗑️ Clearing resume data...");
    console.log("   User ID found:", userId);
    console.log("   Resume keys found:", resumeKeys);

    // Clear user-specific key if userId exists
    if (userId) {
      const userKey = `skillSync_resume_${userId}`;
      localStorage.removeItem(userKey);
    }

    // Clear all resume-related keys (fallback)
    resumeKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Also clear old key
    localStorage.removeItem("skillSync_resume");

    console.log("🗑️ Resume completely cleared from localStorage");
  } catch (error) {
    console.error("Failed to clear resume from storage:", error);
  }
};

/**
 * Normalize skills array (lowercase, trim, remove duplicates)
 */
export const normalizeSkills = (skills) => {
  if (!skills) return [];

  let skillArray = [];

  if (Array.isArray(skills)) {
    skillArray = skills;
  } else if (typeof skills === "string") {
    skillArray = skills.split(/[;,|\n]/);
  } else {
    return [];
  }

  return [
    ...new Set(
      skillArray
        .map((skill) => {
          if (typeof skill === "string") return skill.toLowerCase().trim();
          if (skill?.name) return skill.name.toLowerCase().trim();
          if (skill?.skill) return skill.skill.toLowerCase().trim();
          return null;
        })
        .filter(Boolean),
    ),
  ];
};

/**
 * Check if user has resume
 */
export const hasValidResume = (resume) => {
  return !!(resume?.data || resume?.parsedSkills?.length > 0);
};

/**
 * Get total skills count from resume
 */
export const getTotalSkillsCount = (resume) => {
  return resume?.parsedSkills?.length || resume?.skills?.length || 0;
};

/**
 * Clear all resume data for current user (force clear)
 */
export const forceClearResumeData = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || user?._id;
    if (userId) {
      localStorage.removeItem(`skillSync_resume_${userId}`);
    }
    localStorage.removeItem("skillSync_resume");
    console.log("🗑️ All resume data cleared");
  } catch (error) {
    console.error("Failed to force clear resume data:", error);
  }
};
