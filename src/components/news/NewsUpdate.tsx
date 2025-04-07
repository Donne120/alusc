
import { Newspaper, ExternalLink, Globe, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  description: string;
  url: string;
}

export const NewsUpdate = () => {
  // This would typically come from an API, but for now we'll use static data
  const news: NewsItem[] = [
    {
      title: "New Leadership Program Launch",
      date: "2024-02-20",
      category: "Academic",
      description: "ALU introduces an innovative leadership development program focused on African entrepreneurship.",
      url: "https://www.alueducation.com/news/leadership-program-2024"
    },
    {
      title: "Campus Sustainability Initiative",
      date: "2024-02-19",
      category: "Campus",
      description: "ALU commits to 100% renewable energy usage by 2025 across all campuses.",
      url: "https://www.alueducation.com/news/sustainability-2025"
    },
    {
      title: "Tech Innovation Challenge",
      date: "2024-02-18",
      category: "Events",
      description: "Join the upcoming pan-African tech innovation challenge with prizes worth $10,000.",
      url: "https://www.alueducation.com/events/tech-challenge"
    }
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C] border-l border-[#9b87f5]/20 shadow-xl">
      {/* Header with improved design */}
      <div className="p-6 pb-4 backdrop-blur-sm bg-[#1A1F2C]/60 border-b border-[#9b87f5]/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6] p-0.5 shadow-lg shadow-purple-500/20">
            <div className="bg-[#1A1F2C] w-full h-full rounded-xl p-2.5 flex items-center justify-center">
              <Globe className="w-full h-full text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
              Global ALU News
            </h2>
            <p className="text-xs text-gray-400">Latest updates from around the ALU network</p>
          </div>
        </div>
      </div>

      {/* Scrollable news content */}
      <div className="flex-grow overflow-y-auto p-6 pt-4 space-y-5">
        {news.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-[#2A2F3C] border border-[#9b87f5]/10 overflow-hidden shadow-lg transition-all group hover:shadow-purple-500/10"
          >
            {/* Decorative gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9b87f5] to-[#D946EF]"></div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="bg-[#9b87f5]/10 text-[#9b87f5] border-[#9b87f5]/20 hover:border-[#9b87f5]/20 hover:bg-[#9b87f5]/15">
                  {item.category}
                </Badge>
                <span className="text-xs font-medium text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-[#9b87f5] transition-colors flex items-center gap-2">
                  {item.title}
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-gray-300 line-clamp-2 mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#9b87f5]/10">
                  <span className="text-xs text-[#9b87f5]">Read more</span>
                  <div className="flex space-x-2">
                    <button className="p-1.5 rounded-full hover:bg-[#9b87f5]/10 transition-colors" title="Share">
                      <Share className="w-4 h-4 text-gray-400 hover:text-[#9b87f5]" />
                    </button>
                  </div>
                </div>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with subscription hint */}
      <div className="mt-auto p-5 bg-gradient-to-r from-[#9b87f5]/10 via-[#8B5CF6]/10 to-[#D946EF]/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white mb-1">Stay Globally Connected</h3>
            <p className="text-xs text-gray-400">
              Subscribe for real-time ALU news from our campuses worldwide.
            </p>
          </div>
          <Newspaper className="w-5 h-5 text-[#9b87f5] opacity-80" />
        </div>
      </div>
    </div>
  );
};
