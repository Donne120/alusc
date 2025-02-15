
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  description: string;
}

export const NewsUpdate = () => {
  // This would typically come from an API, but for now we'll use static data
  const news: NewsItem[] = [
    {
      title: "New Leadership Program Launch",
      date: "2024-02-20",
      category: "Academic",
      description: "ALU introduces an innovative leadership development program focused on African entrepreneurship."
    },
    {
      title: "Campus Sustainability Initiative",
      date: "2024-02-19",
      category: "Campus",
      description: "ALU commits to 100% renewable energy usage by 2025 across all campuses."
    },
    {
      title: "Tech Innovation Challenge",
      date: "2024-02-18",
      category: "Events",
      description: "Join the upcoming pan-African tech innovation challenge with prizes worth $10,000."
    }
  ];

  return (
    <div className="h-full p-6 bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C] border-l border-[#9b87f5]/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6] p-0.5">
          <div className="bg-[#1A1F2C] w-full h-full rounded-xl p-2">
            <Newspaper className="w-full h-full text-white" />
          </div>
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
          ALU News Updates
        </h2>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-[#2A2F3C]/50 border border-[#9b87f5]/10 hover:border-[#9b87f5]/20 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-[#9b87f5]/10 text-[#9b87f5]">
                {item.category}
              </span>
              <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <h3 className="font-medium text-white mb-2 group-hover:text-[#9b87f5] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#9b87f5]/10 to-[#D946EF]/10 border border-[#9b87f5]/10">
        <h3 className="text-sm font-medium text-white mb-2">Stay Updated!</h3>
        <p className="text-xs text-gray-400">
          Check this space regularly for the latest news and announcements from ALU.
        </p>
      </div>
    </div>
  );
};
