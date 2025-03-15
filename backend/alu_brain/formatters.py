
from typing import List, Dict, Any

class BrainResponseFormatter:
    """Handles the formatting of ALU Brain responses"""
    
    def format_for_context(self, results: List[Dict[str, Any]]) -> str:
        """Format search results as context for the prompt engine"""
        if not results:
            return "No relevant information found in the ALU knowledge base."
            
        formatted_context = "### Relevant information from ALU Brain:\n\n"
        
        for result in results:
            entry = result['entry']
            category = result['category']
            
            formatted_context += f"Category: {category.replace('_', ' ').title()}\n"
            formatted_context += f"Question: {entry.get('question', '')}\n"
            
            # Format answer based on entry type
            entry_type = entry.get('type', 'short_response')
            answer = entry.get('answer', '')
            
            if entry_type == 'link_response' and 'links' in entry:
                formatted_context += f"Answer: {answer}\n"
                for link in entry.get('links', []):
                    formatted_context += f"- {link.get('text', '')}: {link.get('url', '')}\n"
            
            elif entry_type == 'table_response' and 'table' in entry:
                formatted_context += f"Answer: {answer}\n"
                table = entry.get('table', {})
                if 'headers' in table and 'rows' in table:
                    # Simple text formatting of the table
                    formatted_context += "Table data:\n"
                    for row in table.get('rows', []):
                        formatted_context += f"  {', '.join(row)}\n"
            
            elif entry_type == 'statistical_response' and 'statistics' in entry:
                formatted_context += f"Answer: {answer}\n"
                for stat in entry.get('statistics', []):
                    formatted_context += f"- {stat.get('metric', '')}: {stat.get('value', '')}\n"
            
            elif entry_type == 'date_response' and 'dates' in entry:
                formatted_context += f"Answer: {answer}\n"
                for date_item in entry.get('dates', []):
                    formatted_context += f"- {date_item.get('round', '')}: {date_item.get('deadline', '')}\n"
            
            else:
                # Default formatting for text-based responses
                formatted_context += f"Answer: {answer}\n"
            
            formatted_context += "\n---\n\n"
        
        return formatted_context
