"""Build the complete public website; generated files are written only to dist/."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from wicklen_site.build import build

if __name__ == "__main__":
    build()
