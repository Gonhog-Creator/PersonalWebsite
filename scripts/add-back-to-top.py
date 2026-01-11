# add_back_to_top.py
import os
from pathlib import Path

GALLERY_PATHS = [
    # Main country galleries
    'src/app/galleries/argentina/page.tsx',
    'src/app/galleries/uruguay/page.tsx',
    'src/app/galleries/italy/page.tsx',
    'src/app/galleries/greece/page.tsx',
    'src/app/galleries/belgium/page.tsx',
    'src/app/galleries/scotland/page.tsx',
    'src/app/galleries/united-states/page.tsx',
    'src/app/galleries/switzerland/page.tsx',
    'src/app/galleries/germany/page.tsx',
    'src/app/galleries/france/page.tsx',
    'src/app/galleries/uk/page.tsx',
    'src/app/galleries/costa-rica/page.tsx',
    'src/app/galleries/slovenia/page.tsx',
    'src/app/galleries/austria/page.tsx',
    'src/app/galleries/australia/page.tsx',
    'src/app/galleries/greece/page.tsx',

    # Italy city galleries
    'src/app/galleries/italy/rome/page.tsx',
    'src/app/galleries/italy/venice/page.tsx',
    'src/app/galleries/italy/bologna/page.tsx',
    'src/app/galleries/italy/bassano-del-grappa/page.tsx',
    'src/app/galleries/italy/padova/page.tsx',
    'src/app/galleries/italy/trieste/page.tsx',
]

IMPORT_STATEMENT = "import { BackToTop } from '@/components/ui/BackToTop';"
COMPONENT_INSERT = "      <BackToTop />\n    </div>"


def process_file(file_path):
    try:
        # Read the file content once and store it
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = content = f.read()

        # Check for unterminated regex pattern
        if 'BackToTop' in content:
            # Fix any potential unterminated regex patterns
            fixed_content = content.replace(
                '    </div>\n    </div>\n  );\n}',
                '    </div>\n  );\n}'
            )

            # Only write if we made a change
            if fixed_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                print(f"✓ Fixed unterminated regex in {file_path}")
                return
            else:
                print(f"✓ {file_path} is already correct")
                return

        # Rest of the existing import and component addition logic...
        imports_end = content.find('export default')
        if imports_end == -1:
            imports_end = content.find('function')

        import_section = content[:imports_end]
        if IMPORT_STATEMENT not in import_section:
            last_import = import_section.rfind('import')
            last_import_end = import_section.find('\n', last_import) + 1
            content = (content[:last_import_end] +
                       f"\n{IMPORT_STATEMENT}\n" +
                       content[last_import_end:])

        # Find the last closing div before the component's return statement ends
        last_div = content.rfind('\n    </div>\n  );\n}')
        if last_div != -1:
            content = content[:last_div] + '\n      <BackToTop />' + content[last_div:]
        else:
            last_div = content.rfind('</div>')
            if last_div != -1:
                content = content[:last_div].rstrip() + '\n      <BackToTop />\n    </div>' + content[last_div + 6:]

        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {file_path}")
        else:
            print(f"✓ {file_path} was already up to date")

    except Exception as e:
        print(f"✗ Error processing {file_path}: {str(e)}")


def main():
    root_dir = Path(__file__).parent.parent  # Go up one more level to the project root
    for rel_path in GALLERY_PATHS:
        file_path = root_dir / rel_path
        if file_path.exists():
            process_file(file_path)
        else:
            print(f"⚠️  File not found: {file_path}")

if __name__ == "__main__":
    main()