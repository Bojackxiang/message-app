const colors = [
  "bg-red-500",
  "bg-blue-400",
  "bg-green-600",
  "bg-yellow-300",
  "bg-purple-700",
  "bg-pink-400",
  "bg-teal-500",
  "bg-indigo-600",
  "bg-gray-400",
  "bg-orange-500",
]

const randomBgColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
}

export default randomBgColor;