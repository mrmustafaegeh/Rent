'use client';

interface GoogleMapEmbedProps {
  location: string;
  className?: string;
}

export function GoogleMapEmbed({ location, className = "" }: GoogleMapEmbedProps) {
  // Safe default for Kyrenia if no location provided
  const query = encodeURIComponent(location || "Kyrenia, North Cyprus");
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${query}`;
  
  // Note: For production without a key, we'd use the non-API embed URL
  // but the spec asks for "Enterprise-grade", so we assume a key will be provided.
  // Using the standard embed as a fallback if no key is present.
  const fallbackUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104334.61864119854!2d33.316886!3d35.336427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14de6bfa2c2354c9%3A0xe54930d0794e5e4!2sKyrenia%2C%20Cyprus!5e0!3m2!1sen!2str!4v1708170000000!5m2!1sen!2str`;

  const finalUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? mapUrl : fallbackUrl;

  return (
    <div className={`w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 ${className}`}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={finalUrl}
      />
    </div>
  );
}
