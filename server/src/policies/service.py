# server/src/policies/service.py
from .models import Policy

def get_policies():
    return [
        Policy(name="Comprehensive Health Insurance", provider="HDFC Ergo",
               coverage="₹10,00,000", premium="₹12,000/year",
               features=["Cashless Claims", "No Room Rent Limit", "Pre & Post Hospitalization"]),
        Policy(name="Family Health Shield", provider="Star Health",
               coverage="₹15,00,000", premium="₹18,500/year",
               features=["Family Floater", "Maternity Cover", "Annual Health Checkup"]),
        Policy(name="Senior Citizen Health Plus", provider="Max Bupa",
               coverage="₹5,00,000", premium="₹25,000/year",
               features=["No Age Limit", "Pre-existing Disease Cover", "Home Care Treatment"]),
        Policy(name="Premium Life Cover", provider="ICICI Prudential",
               coverage="₹50,00,000",premium="₹15,000/year",
               features=["Accidental Death Benefit", "Critical Illness Rider", "Tax Benefits"]),
        Policy(name="Motor Complete Protection",provider="Bajaj Allianz",
               coverage="₹8,00,000",premium="₹8,500/year",
               features=["Zero Depreciation", "Engine Protection", "Roadside Assistance"]),
        Policy(name="Home Shield Insurance",provider="Reliance General",
               coverage="₹25,00,000",premium="₹6,000/year",
               features=["Fire & Burglary", "Natural Calamity Cover", "Electronic Equipment Protection"]),
        Policy(name="Travel Smart Plan",provider="Tata AIG",
               coverage="₹10,00,000",premium="₹4,500/trip",
               features=["Medical Emergencies Abroad", "Trip Cancellation", "Lost Baggage Cover"]),
        Policy(name="Business Liability Cover",provider="SBI General",
               coverage="₹1,00,00,000",premium="₹45,000/year",
               features=["Professional Indemnity", "Cyber Risk Cover", "Employee Liability"])
    ]