import glob
import os

files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to replace ._id with .id, but be careful not to replace something that's already .id
    if '._id' in content:
        # replace ._id with .id
        content = content.replace('._id', '.id')
        
        with open(file, 'w') as f:
            f.write(content)
        print(f"Fixed IDs in {file}")
