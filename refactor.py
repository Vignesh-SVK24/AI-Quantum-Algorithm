import re
import os

files = [
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\AITutorPanel.tsx",
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\BlochSphereWidget.tsx",
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\CircuitPlaceholder.tsx",
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\GeminiChat.tsx",
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\MeasurementHistogramWidget.tsx",
    r"C:\Users\selva\.gemini\antigravity\scratch\quantum-platform\frontend\src\components\StateComparisonWidget.tsx",
]

def process_classes(content):
    # Base surfaces
    content = re.sub(r'bg-slate-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-quantum-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-gray-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-indigo-\d+(?:/\d+)?', 'bg-slate-gray', content)
    content = re.sub(r'bg-teal-\d+(?:/\d+)?', 'bg-slate-gray', content)
    content = re.sub(r'bg-emerald-\d+(?:/\d+)?', 'bg-slate-gray', content)
    content = re.sub(r'bg-rose-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-amber-\d+(?:/\d+)?', 'bg-floral-white', content)

    # Text colors
    content = re.sub(r'text-white', 'text-black-olive', content)
    content = re.sub(r'text-slate-200', 'text-black-olive', content)
    content = re.sub(r'text-slate-[345]00(?:/\d+)?', 'text-black-olive/70', content)
    content = re.sub(r'text-teal-\d+(?:/\d+)?', 'text-slate-gray', content)
    content = re.sub(r'text-indigo-\d+(?:/\d+)?', 'text-slate-gray', content)
    content = re.sub(r'text-emerald-\d+(?:/\d+)?', 'text-slate-gray', content)
    content = re.sub(r'text-amber-\d+(?:/\d+)?', 'text-slate-gray', content)
    content = re.sub(r'text-rose-\d+(?:/\d+)?', 'text-slate-gray', content)
    content = re.sub(r'text-cyan-\d+(?:/\d+)?', 'text-slate-gray', content)
    
    # Gradients
    content = re.sub(r'bg-gradient-to-[a-z]+', '', content)
    content = re.sub(r'from-[a-z]+-\d+(?:/\d+)?', '', content)
    content = re.sub(r'via-[a-z]+-\d+(?:/\d+)?', '', content)
    content = re.sub(r'to-[a-z]+-\d+(?:/\d+)?', '', content)

    # Borders
    content = re.sub(r'border-slate-\d+(?:/\d+)?', '', content)
    content = re.sub(r'border-indigo-\d+(?:/\d+)?', '', content)
    content = re.sub(r'border-teal-\d+(?:/\d+)?', '', content)
    content = re.sub(r'border-emerald-\d+(?:/\d+)?', '', content)
    content = re.sub(r'border-rose-\d+(?:/\d+)?', '', content)
    content = re.sub(r'border-amber-\d+(?:/\d+)?', '', content)
    content = re.sub(r'\bborder\b', '', content)
    content = re.sub(r'border-[t|b|l|r]', '', content)

    # Shadows
    content = re.sub(r'shadow-2xl', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-xl', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-lg', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-md', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-sm', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-inner', 'shadow-neu-pressed', content)
    content = re.sub(r'shadow-[a-z]+-\d+(?:/\d+)?', '', content)

    # Rounded
    content = re.sub(r'rounded-md', 'rounded-xl', content)
    content = re.sub(r'rounded-lg', 'rounded-xl', content)
    content = re.sub(r'rounded-full', 'rounded-2xl', content)
    content = re.sub(r'rounded\b', 'rounded-xl', content)

    # Focus
    content = re.sub(r'focus:border-[a-z]+-\d+', 'focus:outline-none focus:ring-2 focus:ring-slate-gray', content)
    content = re.sub(r'focus:outline-none focus:ring-2 focus:ring-slate-gray focus:outline-none focus:ring-2 focus:ring-slate-gray', 'focus:outline-none focus:ring-2 focus:ring-slate-gray', content)

    # Cleanup multiple spaces
    content = re.sub(r'\s+', ' ', content)
    # Put newlines back for component structure
    content = content.replace('> <', '>\n<')
    content = content.replace('; ', ';\n')
    content = content.replace('{ ', '{\n')
    content = content.replace('} ', '}\n')

    # SVG fills and strokes
    content = re.sub(r'fill-[#a-zA-Z0-9]+', 'fill-black-olive', content)
    content = re.sub(r'stroke-[#a-zA-Z0-9]+', 'stroke-black-olive', content)

    # Inputs/Pre / codeblocks -> neu-pressed
    # Simple heuristic: if it's an input or inner panel, add shadow-neu-pressed
    return content

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Base replacements
    # 1. Base Surfaces
    content = re.sub(r'bg-slate-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-quantum-\d+(?:/\d+)?', 'bg-floral-white', content)
    content = re.sub(r'bg-gray-\d+(?:/\d+)?', 'bg-floral-white', content)
    
    # Text
    content = re.sub(r'text-white', 'text-black-olive', content)
    content = re.sub(r'text-slate-200', 'text-black-olive', content)
    content = re.sub(r'text-slate-[345]00(?:/\d+)?', 'text-black-olive/70', content)
    
    # Accent Text
    content = re.sub(r'text-(?:teal|indigo|emerald|amber|rose|cyan)-\d+(?:/\d+)?', 'text-slate-gray', content)
    
    # Gradients
    content = re.sub(r'bg-gradient-to-[a-z]+', '', content)
    content = re.sub(r'from-(?:indigo|teal|cyan|emerald|rose|purple|amber)-\d+(?:/\d+)?', '', content)
    content = re.sub(r'via-(?:indigo|teal|cyan|emerald|rose|purple|amber)-\d+(?:/\d+)?', '', content)
    content = re.sub(r'to-(?:indigo|teal|cyan|emerald|rose|purple|amber)-\d+(?:/\d+)?', '', content)
    
    # Borders
    content = re.sub(r'border-(?:slate|indigo|teal|emerald|rose|amber|cyan)-\d+(?:/\d+)?', '', content)
    content = re.sub(r'\bborder\b', '', content)
    content = re.sub(r'border-[tb] ', ' ', content)
    
    # Rounded
    content = re.sub(r'rounded-(?:md|lg|full)', 'rounded-2xl', content)
    
    # Shadows
    content = re.sub(r'shadow-(?:2xl|xl|lg|md|sm)', 'shadow-neu-raised', content)
    content = re.sub(r'shadow-inner', 'shadow-neu-pressed', content)
    content = re.sub(r'shadow-(?:indigo|teal|cyan|emerald|rose|purple|amber)-\d+(?:/\d+)?', '', content)
    
    # Focus
    content = re.sub(r'focus:border-[a-z]+-\d+', 'focus:outline-none focus:ring-2 focus:ring-slate-gray', content)
    
    # Fix Multiple spaces in classNames
    content = re.sub(r'className="([^"]+)"', lambda m: 'className="{}"'.format(re.sub(r'\s+', ' ', m.group(1)).strip()), content)
    
    # Custom tweaks for Primary Call-to-Action Buttons, inputs, active states.
    # Replace background colors of buttons
    content = re.sub(r'<button([^>]+)bg-floral-white([^>]+)>', r'<button\1bg-slate-gray text-floral-white shadow-neu-raised hover:shadow-neu-pressed rounded-xl\2>', content)
    # Note: Above button replace is basic, might need manual tweaking.
    
    # Inputs
    content = re.sub(r'<input([^>]+)bg-floral-white([^>]+)>', r'<input\1bg-floral-white shadow-neu-pressed rounded-xl\2>', content)
    
    # SVG fills and strokes
    content = re.sub(r'stroke="#[0-9a-fA-F]+"', 'stroke="#31372B"', content)
    content = re.sub(r'fill="#[0-9a-fA-F]+"', 'fill="#31372B"', content)
    
    # Specific fix for Bloch sphere to keep the gradient definitions but just change the colors:
    # Actually, the prompt says "Remove ALL from-X to-Y gradients" and "Do not use any other colors".
    # So we replace hex colors in Bloch and Circuit.
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Refactoring complete.")
