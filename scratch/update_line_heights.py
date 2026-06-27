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

# We want `#mobile-menu` to be styled identically with explicit !important overrides to neutralize Tailwind preflight differences
mobile_menu_style = """#mobile-menu {
  position: fixed !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100vh !important;
  background: var(--forest) !important;
  z-index: 300 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 3rem 2.5rem !important;
  box-sizing: border-box !important;
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1) !important;
}"""

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the existing #mobile-menu block
    # Matches #mobile-menu { ... } across multiple lines
    pattern = r'#mobile-menu\s*\{[^}]*\}'
    content = re.sub(pattern, mobile_menu_style, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully updated mobile menu style in {filename}")
