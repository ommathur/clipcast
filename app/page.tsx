"use client";

import React, { useState, useRef } from "react";
import Aurora from "@/components/Aurora";
import "@/components/Aurora.css";
import QRCode from "react-qr-code";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [activeQR, setActiveQR] = useState<"text" | "file" | null>(null);
  const [qrText, setQrText] = useState("");
  const [clipboardError, setClipboardError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileQrUrl, setFileQrUrl] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasteFromClipboard = async () => {
    setClipboardError("");
    try {
      const text = await navigator.clipboard.readText();
      setQrText(text);
    } catch {
      setClipboardError("Clipboard access denied.");
    }
  };

  const handleGenerateTextQR = () => {
    setActiveQR("text");
    setFileQrUrl("");
    setFiles([]);
  };

  const handleFileUpload = async () => {
    setFileError("");
    setFileQrUrl("");
    if (!files.length) {
      setFileError("Please select at least one file.");
      return;
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 100 * 1024 * 1024) {
      setFileError("Total upload must be under 100MB.");
      return;
    }
    setFileLoading(true);
    try {
      let toUpload: Blob;
      let filename: string;
      if (files.length === 1) {
        toUpload = files[0];
        filename = files[0].name;
      } else {
        const zip = new JSZip();
        files.forEach((file) => zip.file(file.name, file));
        toUpload = await zip.generateAsync({ type: "blob" });
        filename = "clipcast-files.zip";
      }
      const formData = new FormData();
      formData.append("file", toUpload, filename);
      const res = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const url = data?.data?.url;
      if (!url) throw new Error("No URL returned");
      setFileQrUrl(url);
      setActiveQR("file");
      setQrText(""); // reset text state
    } catch {
      setFileError("Upload failed.");
    } finally {
      setFileLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleCustomFileClick = () => fileInputRef.current?.click();

  const handleClear = () => {
    setActiveQR(null);
    setQrText("");
    setClipboardError("");
    setFiles([]);
    setFileQrUrl("");
    setFileError("");
    setFileLoading(false);
  };

  const isQRActive = activeQR !== null;
  const showQRValue =
    activeQR === "text" ? qrText.trim() : activeQR === "file" ? fileQrUrl : "";
  const showFileLink = activeQR === "file" && fileQrUrl;

  return (
    <div className="relative min-h-screen bg-black">
      <Aurora />

      {/* Main blurred content */}
      <div
        className={`relative min-h-screen z-10 flex flex-col items-center justify-center gap-10 px-4 py-8 transition-all
        ${isQRActive ? "blur-sm select-none pointer-events-none" : ""}
      `}
      >
        <h1
          className="text-white font-bold tracking-tight text-center"
          style={{ fontSize: "clamp(5rem,7vw,5rem)", lineHeight: 1.07 }}
        >
          Welcome to ClipCast
        </h1>
        {/* Card container */}
        <div
          className={`
            flex flex-wrap justify-center items-start w-full max-w-5xl 
            gap-8
            ${isQRActive ? "pointer-events-none select-none" : ""}
          `}
        >
          {/* TEXT CARD */}
          <Card className="flex-1 min-w-[300px] max-w-[380px] bg-black text-white border border-neutral-800 shadow-lg flex flex-col gap-3 py-6 px-5">
            <h2 className="text-center font-bold mb-1 text-lg">Text to QR</h2>
            <textarea
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="Type your text..."
              disabled={isQRActive}
              rows={2}
              className="resize-vertical rounded-md bg-neutral-900 border border-neutral-700 p-3 text-sm text-white focus:outline-none focus:border-white/40 transition min-h-[36px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={handlePasteFromClipboard}
                type="button"
                disabled={isQRActive}
                className="flex-1"
              >
                Paste
              </Button>
              <Button
                onClick={handleGenerateTextQR}
                type="button"
                className="flex-1"
                disabled={!qrText.trim() || isQRActive}
              >
                Generate QR
              </Button>
            </div>
            {clipboardError && (
              <div className="text-red-500 text-xs">{clipboardError}</div>
            )}
          </Card>

          {/* FILE CARD */}
          <Card className="flex-1 min-w-[300px] max-w-[380px] bg-black text-white border border-neutral-800 shadow-lg flex flex-col gap-3 py-6 px-5">
            <h2 className="text-center font-bold mb-1 text-lg">
              File/Image/Video to QR
            </h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="*"
              multiple
              disabled={isQRActive}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            <Button
              disabled={isQRActive}
              onClick={handleCustomFileClick}
              type="button"
              className="w-full"
            >
              {files.length === 0
                ? "Choose file(s)..."
                : files.length === 1
                ? "1 file selected"
                : `${files.length} files selected`}
            </Button>
            <div className="text-[10px] text-neutral-400 text-center">
              Max 100MB • Auto-deletes after 1 hour.
            </div>
            <Button
              disabled={fileLoading || isQRActive || !files.length}
              onClick={handleFileUpload}
              type="button"
              className="w-full"
            >
              {fileLoading ? "Uploading..." : "Generate QR"}
            </Button>
            {fileError && (
              <div className="text-xs text-red-500">{fileError}</div>
            )}
          </Card>
        </div>

        <div className="mt-6 text-sm text-neutral-400 font-bold text-center">
          No files/text are stored on ClipCast.
        </div>
      </div>

      {/* QR Modal Overlay */}
      {isQRActive && showQRValue && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-2">
          <div
            className="
              bg-neutral-900/95 rounded-2xl shadow-2xl max-w-[95vw] w-full sm:max-w-md px-5 py-8
              flex flex-col items-center justify-center
            "
          >
            <div className="flex items-center justify-center">
              <QRCode
                value={showQRValue}
                size={260}
                bgColor="#000"
                fgColor="#fff"
                style={{
                  padding: 18,
                  background: "#000",
                  borderRadius: 14,
                  width: "100%",
                  maxWidth: 280,
                }}
              />
            </div>
            {showFileLink && (
              <div className="mt-6 text-base font-bold break-all text-center text-white">
                <a
                  href={fileQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-white"
                  style={{ wordBreak: "break-all" }}
                >
                  {fileQrUrl}
                </a>
              </div>
            )}
            <Button
              onClick={handleClear}
              className="
                mt-7 w-40 text-lg py-3 rounded-lg bg-neutral-800 text-white font-semibold
                hover:bg-neutral-700 focus:bg-neutral-700 transition
              "
              type="button"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
