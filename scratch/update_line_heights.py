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

for filename in files:
    filepath = os.path.join(base_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (not found)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Update .mobile-menu-link to include line-height: 1.2;
    # Locate `.mobile-menu-link {` or `.mobile-menu-link{`
    # Let's match the block and add line-height: 1.2; if not present
    pattern_menu = r'(\.mobile-menu-link\s*\{[^}]*)(\})'
    def replace_menu(match):
        block = match.group(1)
        if 'line-height' not in block:
            # Add line-height: 1.2; before the closing brace
            # Check if there is a trailing semicolon, if not, add it
            block = block.rstrip()
            if not block.endswith(';'):
                block += ';'
            block += ' line-height: 1.2;'
        return block + match.group(2)
        
    content = re.sub(pattern_menu, replace_menu, content)
    
    # 2. Update .btn-gold to include line-height: 1.2;
    pattern_btn = r'(\.btn-gold\s*\{[^}]*)(\})'
    def replace_btn(match):
        block = match.group(1)
        if 'line-height' not in block:
            block = block.rstrip()
            if not block.endswith(';'):
                block += ';'
            block += ' line-height: 1.2;'
        return block + match.group(2)
        
    content = re.sub(pattern_btn, replace_btn, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Successfully updated {filename}")
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
