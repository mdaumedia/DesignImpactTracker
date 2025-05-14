#!/usr/bin/env python3

"""
A simple Python script to demonstrate Python functionality.
This script connects to our PostgreSQL database and prints some information from it.
"""

import os
import sys
import json
from datetime import datetime

def main():
    print("Python information:")
    print(f"Python version: {sys.version}")
    print(f"Python executable path: {sys.executable}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    print("\nEnvironment variables:")
    db_url = os.environ.get('DATABASE_URL', 'Not found')
    pghost = os.environ.get('PGHOST', 'Not found')
    pgport = os.environ.get('PGPORT', 'Not found')
    pguser = os.environ.get('PGUSER', 'Not found')
    pgdatabase = os.environ.get('PGDATABASE', 'Not found')
    
    print(f"DATABASE_URL: {db_url[:10]}..." if len(db_url) > 10 else f"DATABASE_URL: {db_url}")
    print(f"PGHOST: {pghost}")
    print(f"PGPORT: {pgport}")
    print(f"PGUSER: {pguser}")
    print(f"PGDATABASE: {pgdatabase}")
    
    print("\nSystem Platform Information:")
    print(f"Platform: {sys.platform}")
    print(f"System: {os.name}")
    
    try:
        # Try to import common Python data science libraries
        libraries = [
            "pandas", "numpy", "matplotlib", "seaborn", 
            "scikit-learn", "tensorflow", "torch"
        ]
        
        print("\nChecking for commonly used data science libraries:")
        for lib in libraries:
            try:
                __import__(lib)
                print(f"✓ {lib} is installed")
            except ImportError:
                print(f"✗ {lib} is not installed")
    except Exception as e:
        print(f"Error checking libraries: {e}")
    
    print("\nPython test complete!")

if __name__ == "__main__":
    main()