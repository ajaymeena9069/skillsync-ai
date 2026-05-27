// Format salary with proper currency and units
export const formatSalary = (min, max, currency = "INR") => {
  const formatAmount = (amount) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`; // Lakhs
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`; // Thousands
    }
    return amount.toString();
  };

  const currencySymbol = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbol[currency] || currency;
  
  if (min === max) {
    return `${symbol}${formatAmount(min)}`;
  }
  
  return `${symbol}${formatAmount(min)} - ${symbol}${formatAmount(max)}`;
};

// Format date to relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format location type
export const formatLocationType = (type) => {
  const types = {
    remote: "Remote",
    onsite: "On-site",
    hybrid: "Hybrid",
  };
  return types[type] || capitalize(type);
};

// Format employment type
export const formatEmploymentType = (type) => {
  const types = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    freelance: "Freelance",
    internship: "Internship",
  };
  return types[type] || capitalize(type);
};

// Format experience level
export const formatExperienceLevel = (level) => {
  const levels = {
    entry: "Entry Level",
    mid: "Mid Level",
    senior: "Senior Level",
    lead: "Lead/Principal",
  };
  return levels[level] || capitalize(level);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Generate random color for avatar
export const getAvatarColor = (name) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
