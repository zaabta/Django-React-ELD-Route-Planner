import io
from reportlab.pdfgen import canvas

def generate_daily_log(driver, date, total_miles, logs):
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer)
    
    # Title
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(200, 800, "Driver's Daily Log")

    # Driver & Date
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, 780, f"Driver: {driver}")
    pdf.drawString(400, 780, f"Date: {date}")
    
    # Total Miles
    pdf.drawString(50, 760, f"Total Miles: {total_miles}")

    # Log Grid (Basic)
    pdf.setFont("Helvetica", 10)
    for log in logs:
        hour = log["hour"]
        status = log["status"]
        y_pos = 700 - (hour * 20)  # Adjust positioning
        pdf.drawString(100, y_pos, f"Hour {hour}: {status}")

    # Save PDF
    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer
