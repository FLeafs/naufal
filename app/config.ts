/* =========================================================================
   SEMUA DATA UNDANGAN ADA DI FILE INI.
   Cukup edit bagian bertanda  ← GANTI  lalu simpan. Website otomatis update.

   Ada 2 MODE:
   - "public" -> dipakai di path  /  (dan semua path lain)
   - "qnet"   -> dipakai di path  /qnet
   ========================================================================= */

/* ---------------- DATA YANG SAMA UNTUK KEDUA MODE ---------------- */
const shared = {
  couple: {
    // Nama pendek yang tampil besar di cover
    brideShort: "Naufal",
    groomShort: "Billy",

    bride: {
      fullName: "Naufal Noor Widad", // ← GANTI dengan nama lengkap
      instagram: "", // ? GANTI (username tanpa @). Kosongkan bila tidak ada.
      parents: {
        label: "Putri Pertama dari",
        name: "Bpk. Wakhyudiono (Kepala Dusun) & Ibu Rasiyah",
        origin: "Cilapar, Kaligondang, Purbalingga",
      },
    },

    groom: {
      fullName: "Billy Yesnat", // ← GANTI dengan nama lengkap
      instagram: "", // ? GANTI (username tanpa @). Kosongkan bila tidak ada.
      parents: {
        label: "Putra dari",
        name: "Bpk. Frederick F. Yesnat (alm) & Ibu Sumarni",
        origin: "Cirebon",
      },
    },
  },

  /* ---------------- LOKASI (sama untuk kedua mode) ---------------- */
  location: {
    venue: "Kediaman Mempelai Wanita",
    address:
      "Desa Cilapar RT 02 / RW 01, Kecamatan Kaligondang, Kabupaten Purbalingga",
    mapsUrl: "https://maps.app.goo.gl/H1amCmjTWUBQrZt19",
  },

  /* ---------------- QUOTE PEMBUKA ---------------- */
  quote: {
    text: "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati dan dijadikan-Nya kasih sayang di antara kamu.",
    source: "QS. Ar-Rum: 21",
  },

  /* ---------------- MUSIK LATAR ----------------
     Taruh file lagu di:  public/music/song.mp3
     Bila file belum ada, tombol musik otomatis disembunyikan.            */
  music: {
    src: "/music/song.mp3",
    title: "Wedding Song",
  },

  /* ---------------- FOTO ---------------- */
  coverPhoto: "/background/bg-01.jpg", // foto layar sampul
  couplePhoto: "/photo/photo-14.jpg", // foto di balik nama mempelai
  countdownPhoto: "/background/bg-03.jpg", // latar hitung mundur
  closingPhoto: "/background/bg-02.jpg", // latar penutup

  gallery: [
    "/photo/photo-01.jpg",
    "/photo/photo-15.jpg",
    "/photo/photo-03.jpg",
    "/photo/photo-04.jpg",
    "/photo/photo-16.jpg",
    "/photo/photo-06.jpg",
    "/photo/photo-07.jpg",
    "/photo/photo-17.jpg",
    "/photo/photo-09.jpg",
    "/photo/photo-10.jpg",
    "/photo/photo-12.jpg",
    "/photo/photo-13.jpg",
  ],
} as const;

/* ---------------- MODE PUBLIC — path  /  ---------------- */
const publicMode = {
  ...shared,
  mode: "public",

  // Target hitung mundur (WIB / UTC+7)
  countdownTarget: "2026-08-23T10:00:00+07:00",

  dateText: "23 . 08 . 2026",
  dayText: "Minggu, 23 Agustus 2026",

  event: {
    date: "Minggu, 23 Agustus 2026",
    time: "10.00 WIB - Selesai",
  },

  // Tidak ada nama pengundang di mode public
  host: null,
} as const;

/* ---------------- MODE QNET — path  /qnet  ---------------- */
const qnetMode = {
  ...shared,
  mode: "qnet",

  countdownTarget: "2026-08-22T15:00:00+07:00",

  dateText: "22 . 08 . 2026",
  dayText: "Sabtu, 22 Agustus 2026",

  event: {
    date: "Sabtu, 22 Agustus 2026",
    time: "15.00 - 18.00 WIB",
  },

  // Nama pengundang yang tampil di layar sampul
  host: {
    label: "Pengundang",
    name: "Bapak Kadus OnO", // ← GANTI bila perlu
  },
} as const;

export const configs = {
  public: publicMode,
  qnet: qnetMode,
} as const;

export type Mode = keyof typeof configs;
export type InvitationConfig = typeof publicMode | typeof qnetMode;

/** Config default (mode public) — dipakai untuk metadata & path selain /qnet. */
export const config = publicMode;
