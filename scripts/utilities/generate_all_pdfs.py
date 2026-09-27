import os
import subprocess
import sys

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print("=================================================================")
    print("   RentAI / SDC2 Complete 20 PDF Deliverables Generator Engine   ")
    print("=================================================================")
    
    print("\n--- [1/2] Generating 13 Software Engineering PDF Deliverables ---")
    subprocess.run([sys.executable, os.path.join(base_dir, "build_software_docs.py")], check=True)

    print("\n--- [2/2] Generating 7 Academic & Research PDF Deliverables ---")
    subprocess.run([sys.executable, os.path.join(base_dir, "build_research_docs.py")], check=True)

    print("\n=================================================================")
    print("   ALL 20 PDF DELIVERABLES HAVE BEEN SUCCESSFULLY GENERATED!     ")
    print("   Location: docs/pdf_deliverables/software/ (13 PDFs)           ")
    print("   Location: docs/pdf_deliverables/research/ (7 PDFs)            ")
    print("=================================================================")

if __name__ == "__main__":
    main()
