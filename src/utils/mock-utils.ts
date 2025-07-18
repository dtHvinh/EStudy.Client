const generateReportedContent = () => {
  const contentTypes = ["Lesson", "Quiz", "Vocabulary"];
  const reasons = [
    "Inappropriate Content",
    "Copyright Violation",
    "Spam",
    "Misinformation",
    "Offensive Language",
    "Low Quality",
  ];
  const severities = ["Low", "Medium", "High", "Critical"];
  const statuses = ["Pending", "Under Review", "Resolved", "Dismissed"];

  return Array.from({ length: 156 }, (_, i) => ({
    id: i + 1,
    contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
    contentTitle: `${contentTypes[Math.floor(Math.random() * contentTypes.length)]} ${i + 1}: Sample Content Title`,
    reportedBy: `User${Math.floor(Math.random() * 100) + 1}`,
    reporterEmail: `user${Math.floor(Math.random() * 100) + 1}@example.com`,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    reportDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString(),
    description:
      "This content contains inappropriate material that violates community guidelines.",
    contentAuthor: `Author${Math.floor(Math.random() * 50) + 1}`,
  }));
};

// Mock data for users
const generateUsers = () => {
  const roles = ["Student", "Teacher", "Admin", "Moderator"];
  const statuses = ["Active", "Suspended", "Banned", "Inactive"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  return Array.from({ length: 284 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    level: levels[Math.floor(Math.random() * levels.length)],
    joinDate: new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    ).toLocaleDateString(),
    lastActive: `${Math.floor(Math.random() * 30) + 1} days ago`,
    reportsCount: Math.floor(Math.random() * 10),
    warningsCount: Math.floor(Math.random() * 5),
    contentCount: Math.floor(Math.random() * 50),
  }));
};

export const mock_reportedContent = generateReportedContent();
export const mock_allUsers = generateUsers();
