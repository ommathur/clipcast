# 🎬 ClipCast

**ClipCast** is an ultra-fast, privacy-first QR code generator for text and files—including images and videos—built using Next.js 13, TypeScript, and Vercel. Effortlessly convert text or upload files (up to 100MB, auto-zipped if multiple) and instantly get a QR code. No registration, no tracking, no storage.

🌐 **Live:** [clipcast.vercel.app](https://clipcast.vercel.app)

Built by [Om Mathur](https://github.com/ommathur)

---

## 🚀 What does ClipCast do?

- 🔤 **Text to QR:** Paste or type any text and turn it into a scan-ready QR code.
- 📁 **File to QR:** Upload any image, video, PDF, or other file(s) and generate a QR code linking to a public, time-limited (auto-deleting in 1 hour) download.
- 🛡️ **Truly private:** ClipCast stores nothing. All code runs in your browser; file uploads never touch our server, and expire after 1 hour.
- ✨ **High performance:** Lightning-fast UI with smooth transitions and zero bloat.

---

## ✨ Features

- Paste from clipboard or type your message for an instant QR.
- Upload one or more files (max total size: 100MB); multiple files are auto-zipped.
- Files are uploaded through [tmpfiles.org](https://tmpfiles.org) and auto-expire after one hour.
- Modern UI—fully responsive, keyboard accessible, and mobile-friendly.
- No login, no installation needed, 100% free.
- Built on Next.js 13 App Router, with Tailwind CSS styling.

---

## 🧑‍💻 How to use ClipCast?

1. **Open** [clipcast.vercel.app](https://clipcast.vercel.app)
2. To create a **Text QR**:
    - Type or paste your text (click Paste for clipboard input).
    - Click **Generate QR**.
    - Scan the generated QR code, or click **Done** to start over.
3. To create a **File QR**:
    - Click **Choose file(s)...** and select one or more files.
    - Click **Generate QR**.
    - A QR code appears; upon scan, the file can be downloaded via auto-expiring tmpfiles.org link.
    - Link is also shown below the QR for manual access.
4. **No data is logged or stored**. All interactions are session-limited and privacy-respecting.

---

## 🛠️ Tech Stack

- **Next.js 13** (client components + App Router)
- **TypeScript**
- **Tailwind CSS**
- **JSZip** for zipping multiple file uploads
- **react-qr-code** for easy QR rendering
- **tmpfiles.org API** for temp file hosting
- **Vercel Edge** for blazing-fast, free hosting

---

## 📦 Run locally

1. **Clone** and **install dependencies:**
    ```
    git clone https://github.com/ommathur/clipcast.git
    cd clipcast
    npm install
    ```
2. **Start local dev server:**
    ```
    npm run dev
    ```
3. Visit `http://localhost:3000` in your browser.


---


If you like ClipCast, give it a ⭐ and feel free to suggest features.

---

> No registrations, no analytics, no nonsense. Just instant, friendly QR sharing for text and files.  
> **ClipCast — share smarter, not harder.**

