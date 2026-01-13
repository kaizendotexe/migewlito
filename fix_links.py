import os

root_dir = r"c:\xampp\htdocs\migewlito's\gogogo.com\en-ph\games"
target = 'href="https://gogogo.com/en-ph"'
replacement = 'href="../index.html"'

print(f"Scanning {root_dir}...")

count = 0
for filename in os.listdir(root_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(root_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if target in content:
                new_content = content.replace(target, replacement)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"Finished. Updated {count} files.")
