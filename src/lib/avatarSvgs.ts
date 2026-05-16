// Real Indian portrait photos from Pexels (verified 200 OK, free for demo use)
// https://www.pexels.com/license/
const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop`;

export const AVATAR_SVGS: Record<string, string> = {
  "1":      PX(4053536),   // Ramachandra Shet — elderly patriarch, weathered face
  "2":      PX(11138457),  // Savitribai Shet  — elderly matriarch, red bindi
  "3":      PX(2601464),   // Venkatesh Kamat  — grandfather
  "4":      PX(5746790),   // Suresh Kamat     — father, young-middle-aged male
  "5":      PX(34515496),  // Rekha Pai        — aunt, colourful sari
  "6":      PX(7485047),   // Priya Kamat      — self, young Indian woman
  "elder":  PX(17815020),  // Shri Narayanarao Shet — Elder/Admin, grey beard
};
