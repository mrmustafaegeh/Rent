import os
import glob
import re

files_to_process = glob.glob('src/components/**/*.tsx', recursive=True) + glob.glob('src/app/**/*.tsx', recursive=True)

count = 0
for file in files_to_process:
    with open(file, 'r') as f:
        content = f.read()
        
    original = content
    
    if 'framer-motion' in content:
        # Add margin to viewport to trigger slightly before element scrolls into view
        content = content.replace("viewport={{ once: true }}", 'viewport={{ once: true, margin: "-50px" }}')
        content = content.replace("viewport={{ once: true, amount: 0.2 }}", 'viewport={{ once: true, margin: "-50px", amount: 0.2 }}')
        content = content.replace("viewport={{ once: true, amount: 0.3 }}", 'viewport={{ once: true, margin: "-50px", amount: 0.3 }}')
        
        # Smoother transitions
        content = re.sub(r'transition=\{\{\s*(delay: [^,]+,\s*)?duration: 0\.5\s*\}\}', r'transition={{ \1duration: 0.6, ease: [0.22, 1, 0.36, 1] }}', content)
        content = re.sub(r'transition=\{\{\s*(delay: [^,]+,\s*)?duration: 0\.6\s*\}\}', r'transition={{ \1duration: 0.8, ease: [0.22, 1, 0.36, 1] }}', content)
        content = re.sub(r'transition=\{\{\s*(delay: [^,]+,\s*)?duration: 0\.8\s*\}\}', r'transition={{ \1duration: 1.0, ease: [0.22, 1, 0.36, 1] }}', content)
        
        content = re.sub(r'transition=\{\{\s*duration: 0\.5,\s*delay: (.*?)\s*\}\}', r'transition={{ duration: 0.6, delay: \1, ease: [0.22, 1, 0.36, 1] }}', content)
        content = re.sub(r'transition=\{\{\s*duration: 0\.6,\s*delay: (.*?)\s*\}\}', r'transition={{ duration: 0.8, delay: \1, ease: [0.22, 1, 0.36, 1] }}', content)

    # Tailwind animation smoothness optimizations
    # hover:scale-105 is often a bit abrupt, especially for large items.
    # use scale-[1.03] or scale-105 with a longer duration and will-change-transform
    content = content.replace('hover:scale-105 transition-all', 'hover:-translate-y-2 hover:shadow-xl transition-all duration-500 ease-out will-change-transform')
    content = content.replace('hover:scale-105', 'hover:scale-[1.03] duration-500 ease-out will-change-transform')
    content = content.replace('transition-all duration-300', 'transition-all duration-500 ease-out')
    content = content.replace('hover:-translate-y-2 transition-all', 'hover:-translate-y-2 transition-all duration-500 ease-out will-change-transform')
    
    if content != original:
        with open(file, 'w') as f:
            f.write(content)
        count += 1
        print(f"Optimized {file}")

print(f"Optimizations completed in {count} files.")
