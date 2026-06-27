import os
import re

files = [
    "index.html",
    "about.html",
    "events.html",
    "jobs.html",
    "vendors.html",
    "hotels-restaurants.html",
    "services.html",
    "contact.html",
    "thank-you.html"
]

base_dir = r"c:\Users\USER\Documents\Akinjuwon\workspace\explore ibadan 2"

# Compact mobile menu that fits all items within viewport
compact_mobile_menu_style = """#mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--forest);
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 2.5rem 2.5rem calc(2rem + env(safe-area-inset-bottom)) 2.5rem;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}"""

# Smaller link style
compact_link_style = """.mobile-menu-link {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem; font-weight: 500;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  display: block;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(184,135,11,0.1);
  transition: color 0.2s, padding-left 0.3s;
  line-height: 1.4;
}"""

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace #mobile-menu block
    pattern = r'#mobile-menu\s*\{[^}]*\}'
    content = re.sub(pattern, compact_mobile_menu_style, content)
    
    # Replace .mobile-menu-link block
    pattern_link = r'\.mobile-menu-link\s*\{[^}]*\}'
    content = re.sub(pattern_link, compact_link_style, content, count=1)
    
    # Reduce header margin
    content = content.replace('margin-bottom:1.5rem;width:100%;', 'margin-bottom:1rem;width:100%;')
    content = content.replace('margin-bottom:2.5rem;width:100%;', 'margin-bottom:1rem;width:100%;')
    
    # Reduce Contact Us button margin
    content = content.replace('margin-top:1.5rem;align-self:flex-start;', 'margin-top:1rem;align-self:flex-start;')
    content = content.replace('margin-top:2.5rem;align-self:flex-start;', 'margin-top:1rem;align-self:flex-start;')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Fixed {filename}")
