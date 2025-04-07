
import { ExternalLink, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  description: string;
  url: string;
  image: string;
}

export const NewsUpdate = () => {
  // This would typically come from an API, but for now we'll use static data with real images
  const news: NewsItem[] = [
    {
      title: "New Leadership Program Launch",
      date: "2024-02-20",
      category: "Academic",
      description: "ALU introduces an innovative leadership development program focused on African entrepreneurship.",
      url: "https://www.alueducation.com/news/leadership-program-2024",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Campus Sustainability Initiative",
      date: "2024-02-19",
      category: "Campus",
      description: "ALU commits to 100% renewable energy usage by 2025 across all campuses.",
      url: "https://www.alueducation.com/news/sustainability-2025",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    },
    {
      title: "Tech Innovation Challenge",
      date: "2024-02-18",
      category: "Events",
      description: "Join the upcoming pan-African tech innovation challenge with prizes worth $10,000.",
      url: "https://www.alueducation.com/events/tech-challenge",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
    }
  ];

  return (
    <div className="h-full overflow-hidden flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C] border-l border-[#9b87f5]/20 shadow-xl">
      {/* Header with simplified title */}
      <div className="p-6 pb-4 backdrop-blur-sm bg-[#1A1F2C]/60 border-b border-[#9b87f5]/20">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">
            ALU News
          </h2>
        </div>
      </div>

      {/* Scrollable news content */}
      <div className="flex-grow overflow-y-auto p-6 pt-4 space-y-5">
        {news.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-[#2A2F3C] border border-[#9b87f5]/10 overflow-hidden shadow-lg transition-all group hover:shadow-purple-500/10"
          >
            {/* Image at the top of the card */}
            <div className="w-full h-40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            
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
            <p className="text-xs text-gray-400">
              Subscribe for real-time ALU news from our campuses worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
