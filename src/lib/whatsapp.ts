export function formatWhatsAppUrl(
  phone: string,
  message: string
): string {
  // Clean phone number: remove +, -, spaces
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // If starts with 08..., convert to 628...
  if (cleanPhone.startsWith('08')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  
  // If fallback empty, provide a default
  if (!cleanPhone) {
    cleanPhone = '6281234567890';
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getGeneralConsultationMessage(): string {
  return 'Halo KyDev, saya tertarik untuk konsultasi jasa pembuatan website. Boleh minta informasi lebih lanjut?';
}

export function getProductConsultationMessage(productName: string): string {
  return `Halo KyDev, saya tertarik dengan paket jasa "${productName}". Boleh minta penjelasan detail dan estimasi proses pengerjaannya?`;
}
