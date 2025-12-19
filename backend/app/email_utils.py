import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading

# --- KONFIGURASI SMTP (GMAIL) ---
# PENTING: Untuk GMAIL, kamu harus pakai "App Password", bukan password login biasa.
# Tutorial: https://support.google.com/accounts/answer/185833
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "evoria022@gmail.com"  
SENDER_PASSWORD = "ndig bann njng ewrj"        

def send_email_async(to_email, subject, body):
    """Fungsi pengirim email yang berjalan di background (agar tidak bikin loading lama)"""
    try:
        # Setup Pesan
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html')) # Kita pakai format HTML biar bagus

        # Koneksi ke Server Gmail
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls() # Amankan koneksi
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        # Kirim!
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text)
        server.quit()
        
        print(f"✅ Email konfirmasi berhasil dikirim ke {to_email}")
        
    except Exception as e:
        print(f"Gagal kirim email: {str(e)}")
        print("Tips: Pastikan SENDER_EMAIL & SENDER_PASSWORD di email_utils.py sudah benar.")

def send_booking_confirmation(to_email, user_name, event_title, booking_code, quantity, total_price):
    """
    Menyusun template email konfirmasi tiket
    """
    subject = f"Tiket Konfirmasi: {event_title} - Kode: {booking_code}"
    
    # Template HTML Sederhana
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #2c3e50;">Terima Kasih, {user_name}!</h2>
            <p>Pemesanan tiket kamu berhasil. Berikut detailnya:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Event</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{event_title}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Kode Booking</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 18px; color: #e67e22;"><strong>{booking_code}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Jumlah Tiket</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">{quantity}</td>
                </tr>
                 <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Harga</strong></td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">Rp {total_price:,}</td>
                </tr>
            </table>
            
            <p style="margin-top: 20px;">
                Silakan tunjukkan Kode Booking ini di lokasi acara.<br>
                <em>Simpan email ini sebagai bukti pembayaran.</em>
            </p>
            
            <div style="margin-top: 30px; font-size: 12px; color: #888;">
                &copy; 2025 Event Ticketing System Kelompok 4
            </div>
        </div>
      </body>
    </html>
    """
    
    # Jalankan di Thread terpisah agar user tidak menunggu loading kirim email
    thread = threading.Thread(target=send_email_async, args=(to_email, subject, html_body))
    thread.start()

def send_reset_token_email(to_email, token):
    """
    Mengirim email berisi token reset password
    """
    subject = "Reset Password - Kode Verifikasi"
    
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 10px; max-width: 500px;">
            <h2 style="color: #c0392b;">Permintaan Reset Password</h2>
            <p>Seseorang (semoga kamu) meminta untuk mereset password akun Ticketing kamu.</p>
            <p>Gunakan kode berikut untuk membuat password baru:</p>
            
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px;">
                {token}
            </div>
            
            <p style="margin-top: 20px; font-size: 13px; color: #777;">
                Kode ini hanya berlaku selama <strong>15 menit</strong>.<br>
                Jika kamu tidak meminta ini, abaikan saja email ini.
            </p>
        </div>
      </body>
    </html>
    """
    
    thread = threading.Thread(target=send_email_async, args=(to_email, subject, html_body))
    thread.start()