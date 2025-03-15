
from typing import List, Dict, Any

class BrainResponseFormatter:
    """Handles the formatting of ALU Brain responses for contextual presentation"""
    
    def format_for_context(self, results: List[Dict[str, Any]]) -> str:
        """Format search results as context for the prompt engine with enhanced presentation"""
        if not results:
            return "No relevant information found in the ALU knowledge base."
            
        formatted_context = "### Relevant Information from ALU Knowledge Base\n\n"
        
        for i, result in enumerate(results):
            entry = result['entry']
            category = result['category']
            
            # Format category nicely
            formatted_category = category.replace('_', ' ').title()
            
            # Format header based on entry type and category
            entry_type = entry.get('type', 'short_response')
            formatted_context += f"## {i+1}. {formatted_category} - {self._get_type_label(entry_type)}\n\n"
            
            # Format the question/topic
            formatted_context += f"**Q: {entry.get('question', 'Information')}**\n\n"
            
            # Format answer based on entry type
            answer = entry.get('answer', '')
            
            if entry_type == 'link_response' and 'links' in entry:
                formatted_context += f"{answer}\n\n"
                formatted_context += "**Relevant Links:**\n"
                for link in entry.get('links', []):
                    formatted_context += f"- [{link.get('text', 'Link')}]({link.get('url', '')})\n"
            
            elif entry_type == 'table_response' and 'table' in entry:
                formatted_context += f"{answer}\n\n"
                table = entry.get('table', {})
                if 'headers' in table and 'rows' in table:
                    # Format as markdown table
                    headers = table.get('headers', [])
                    rows = table.get('rows', [])
                    
                    # Create table header
                    formatted_context += "| " + " | ".join(headers) + " |\n"
                    formatted_context += "| " + " | ".join(["---" for _ in headers]) + " |\n"
                    
                    # Create table rows
                    for row in rows:
                        formatted_context += "| " + " | ".join(row) + " |\n"
            
            elif entry_type == 'statistical_response' and 'statistics' in entry:
                formatted_context += f"{answer}\n\n"
                formatted_context += "**Key Statistics:**\n"
                for stat in entry.get('statistics', []):
                    formatted_context += f"- **{stat.get('metric', '')}:** {stat.get('value', '')}\n"
            
            elif entry_type == 'date_response' and 'dates' in entry:
                formatted_context += f"{answer}\n\n"
                formatted_context += "**Important Dates:**\n"
                
                # Sort dates by deadline if possible
                dates = sorted(entry.get('dates', []), 
                               key=lambda x: x.get('deadline', ''), 
                               reverse=False)
                               
                for date_item in dates:
                    formatted_context += f"- **{date_item.get('round', '')}:** {date_item.get('deadline', '')}\n"
            
            elif entry_type == 'procedural_response' and 'steps' in entry:
                formatted_context += f"{answer}\n\n"
                formatted_context += "**Process Steps:**\n"
                for i, step in enumerate(entry.get('steps', [])):
                    formatted_context += f"{i+1}. {step}\n"
            
            else:
                # Default formatting for text-based responses
                formatted_context += f"{answer}\n"
            
            # Add metadata if available and relevant
            if 'metadata' in entry and entry['metadata']:
                metadata = entry['metadata']
                if metadata.get('source') or metadata.get('lastUpdated'):
                    formatted_context += "\n**Source Information:**\n"
                    if metadata.get('source'):
                        formatted_context += f"- Source: {metadata['source']}\n"
                    if metadata.get('lastUpdated'):
                        formatted_context += f"- Last Updated: {metadata['lastUpdated']}\n"
            
            formatted_context += "\n---\n\n"
        
        return formatted_context
    
    def _get_type_label(self, entry_type: str) -> str:
        """Convert entry type to a human-readable label"""
        type_labels = {
            'link_response': 'Resource Links',
            'table_response': 'Tabular Data',
            'statistical_response': 'Statistics', 
            'date_response': 'Important Dates',
            'procedural_response': 'Process Guide',
            'long_response': 'Detailed Explanation',
            'short_response': 'Quick Answer'
        }
        
        return type_labels.get(entry_type, 'Information')
