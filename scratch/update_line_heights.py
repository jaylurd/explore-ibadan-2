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

# 1. Scrollable, flex-start layout for mobile menu to prevent cutoffs
scrollable_mobile_menu_style = """#mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: var(--forest);
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 3rem 2.5rem 6rem 2.5rem;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
    content = re.sub(pattern, scrollable_mobile_menu_style, content)
    
    # Replace HTML margins inside mobile menu
    # Reduce header margin-bottom
    content = content.replace('margin-bottom:2.5rem;width:100%;', 'margin-bottom:1.5rem;width:100%;')
    content = content.replace('margin-bottom: 2.5rem; width: 100%;', 'margin-bottom: 1.5rem; width: 100%;')
    content = content.replace('margin-bottom:2.5rem; width:100%;', 'margin-bottom:1.5rem; width:100%;')
    
    # Reduce Contact Us button margin-top
    content = content.replace('margin-top:2.5rem;align-self:flex-start;', 'margin-top:1.5rem;align-self:flex-start;')
    content = content.replace('margin-top:2.5rem; align-self:flex-start;', 'margin-top:1.5rem; align-self:flex-start;')
    content = content.replace('margin-top: 2.5rem; align-self: flex-start;', 'margin-top: 1.5rem; align-self: flex-start;')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully fixed spacing and cutoff issues in {filename}")
