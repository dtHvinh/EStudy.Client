import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

const navData_old = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    // avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
};

export const mock_featuredCourses = [
  {
    id: 1,
    title: "Complete React Development Course",
    description:
      "Master React from basics to advanced concepts with hands-on projects",
    author: "John Smith",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    students: 12543,
    duration: "42 hours",
    lessons: 156,
    image: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    level: "Intermediate",
    isEnrolled: false,
  },
  {
    id: 2,
    title: "Python for Data Science",
    description:
      "Learn Python programming for data analysis and machine learning",
    author: "Sarah Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    students: 8932,
    duration: "38 hours",
    lessons: 124,
    image: "/placeholder.svg?height=200&width=300",
    category: "Data Science",
    level: "Beginner",
    isEnrolled: true,
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    description: "Complete guide to user interface and user experience design",
    author: "Mike Chen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    price: 94.99,
    originalPrice: 149.99,
    rating: 4.7,
    students: 6721,
    duration: "35 hours",
    lessons: 98,
    image: "/placeholder.svg?height=200&width=300",
    category: "Design",
    level: "Intermediate",
    isEnrolled: false,
  },
];

export const mock_enrolledCourses = [
  {
    id: 2,
    title: "Python for Data Science",
    progress: 65,
    nextLesson: "Data Visualization with Matplotlib",
    timeLeft: "2h 30m",
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: 4,
    title: "JavaScript Fundamentals",
    progress: 30,
    nextLesson: "Functions and Scope",
    timeLeft: "4h 15m",
    image: "/placeholder.svg?height=100&width=150",
  },
];

export const mock_categories = [
  "All Categories",
  "Web Development",
  "Data Science",
  "Design",
  "Mobile Development",
  "DevOps",
  "Marketing",
];

export const mockTestData = {
  id: 1,
  title: "Advanced JavaScript Fundamentals",
  description:
    "A comprehensive test covering advanced JavaScript concepts including closures, prototypes, async programming, and modern ES6+ features. This test is designed to evaluate your understanding of core JavaScript principles.",
  duration: 90,
  sectionCount: 4,
  attemptCount: 1247,
  commentCount: 23,
  questionCount: 45,
  sections: [
    {
      id: 1,
      title: "Variables and Data Types",
      description:
        "Understanding primitive and reference types, variable declarations, and type coercion",
    },
    {
      id: 2,
      title: "Functions and Closures",
      description:
        "Function declarations, expressions, arrow functions, and closure concepts",
    },
    {
      id: 3,
      title: "Asynchronous Programming",
      description:
        "Promises, async/await, callbacks, and event loop understanding",
    },
    {
      id: 4,
      title: "Modern JavaScript Features",
      description:
        "ES6+ features including destructuring, modules, classes, and template literals",
    },
  ],
  comments: [
    {
      id: 1,
      text: "Great test! Really helped me understand closures better. The questions were challenging but fair.",
      author: {
        profilePicture: "/placeholder.svg?height=40&width=40",
        name: "Sarah Johnson",
      },
    },
    {
      id: 2,
      text: "The async programming section was particularly well-designed. Loved the practical examples.",
      author: {
        profilePicture: "/placeholder.svg?height=40&width=40",
        name: "Mike Chen",
      },
    },
    {
      id: 3,
      text: "Could use more questions on modern ES6+ features, but overall excellent content quality.",
      author: {
        profilePicture: "/placeholder.svg?height=40&width=40",
        name: "Emily Rodriguez",
      },
    },
    {
      id: 4,
      text: "Perfect difficulty level for intermediate developers. The explanations after each question are very helpful.",
      author: {
        profilePicture: "/placeholder.svg?height=40&width=40",
        name: "David Kim",
      },
    },
    {
      id: 5,
      text: "This test really challenged my understanding of JavaScript fundamentals. Highly recommend!",
      author: {
        profilePicture: "/placeholder.svg?height=40&width=40",
        name: "Lisa Thompson",
      },
    },
  ],
};
