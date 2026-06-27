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

# Robust mobile menu style without inset, using top/left/width/height/min-height for full compatibility
robust_mobile_menu_style = """#mobile-menu {
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
  justify-content: center;
  padding: 3rem 2.5rem;
  box-sizing: border-box;
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
    content = re.sub(pattern, robust_mobile_menu_style, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully applied robust full-screen styling to {filename}")
