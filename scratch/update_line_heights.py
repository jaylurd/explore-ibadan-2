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

# 1. Clean #mobile-menu to include transform and remove !important
clean_mobile_menu_style = """#mobile-menu {
  position: fixed;
  inset: 0;
  background: var(--forest);
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 2.5rem;
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
    content = re.sub(pattern, clean_mobile_menu_style, content)
    
    # 2. Update .mobile-menu-link to use line-height: 1.5 to match the Tailwind pages
    pattern_menu = r'(\.mobile-menu-link\s*\{[^}]*)(\})'
    def replace_menu(match):
        block = match.group(1)
        # Replace line-height to 1.5
        if 'line-height' in block:
            block = re.sub(r'line-height\s*:\s*[^;]+;', 'line-height: 1.5;', block)
        else:
            block = block.rstrip()
            if not block.endswith(';'):
                block += ';'
            block += ' line-height: 1.5;'
        return block + match.group(2)
        
    content = re.sub(pattern_menu, replace_menu, content)
    
    # 3. Update .btn-gold to use line-height: 1.5 to match
    pattern_btn = r'(\.btn-gold\s*\{[^}]*)(\})'
    def replace_btn(match):
        block = match.group(1)
        if 'line-height' in block:
            block = re.sub(r'line-height\s*:\s*[^;]+;', 'line-height: 1.5;', block)
        else:
            block = block.rstrip()
            if not block.endswith(';'):
                block += ';'
            block += ' line-height: 1.5;'
        return block + match.group(2)
        
    content = re.sub(pattern_btn, replace_btn, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully cleaned mobile menu style in {filename}")
