import os
import re

dir_path = 'src'

replacements = [
    # Backgrounds
    (r'bg-slate-\d+', 'bg-floral-white shadow-neu-raised rounded-2xl'),
    (r'bg-quantum-\w+(-\d+)?(/\d+)?', 'bg-floral-white'),
    (r'bg-gray-\d+', 'bg-floral-white'),
    (r'bg-slate-\d+/\d+', 'bg-floral-white shadow-neu-raised rounded-2xl'),
    (r'bg-slate-900/90', 'bg-floral-white shadow-neu-raised'),
    
    # Text colors
    (r'text-white', 'text-black-olive'),
    (r'text-slate-200', 'text-black-olive'),
    (r'text-slate-300', 'text-black-olive/80'),
    (r'text-slate-400', 'text-black-olive/70'),
    (r'text-slate-500', 'text-black-olive/60'),
    (r'text-(teal|emerald|cyan|indigo|purple|rose|red|green|amber|blue)-\d+', 'text-slate-gray'),
    
    # Borders
    (r'border(-[a-z]+)? border-slate-\d+(/\d+)?', 'border-none'),
    (r'border-slate-\d+(/\d+)?', 'border-none'),
    
    # Primary Buttons & Accents
    (r'bg-gradient-to-[a-z]+ from-[a-z]+-\d+ to-[a-z]+-\d+', 'bg-slate-gray text-floral-white shadow-neu-raised rounded-xl'),
    (r'bg-gradient-to-[a-z]+ from-[a-z]+-\d+ via-[a-z]+-\d+ to-[a-z]+-\d+', 'bg-slate-gray text-floral-white shadow-neu-raised rounded-xl'),
    (r'bg-indigo-\d+', 'bg-slate-gray shadow-neu-raised text-floral-white rounded-xl'),
    (r'bg-teal-\d+', 'bg-slate-gray shadow-neu-raised text-floral-white rounded-xl'),
    
    # Hover states
    (r'hover:text-white', 'hover:text-slate-gray'),
    (r'hover:bg-slate-\d+(/\d+)?', 'hover:shadow-neu-pressed'),
    
    # Misc
    (r'shadow-\w+(-\w+)?(/\d+)?', ''),
]

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            orig = content
            # Apply replacements
            for pattern, repl in replacements:
                content = re.sub(pattern, repl, content)
                
            # Extra cleanup
            content = content.replace('shadow-neu-raised shadow-neu-raised', 'shadow-neu-raised')
            content = content.replace('rounded-2xl rounded-2xl', 'rounded-2xl')
            content = content.replace('bg-floral-white bg-floral-white', 'bg-floral-white')
            content = content.replace('border-none border-none', 'border-none')
            
            if orig != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
