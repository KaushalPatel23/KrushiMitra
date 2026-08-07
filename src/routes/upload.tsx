import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SiteLayout } from "@/components/site/SiteLayout";
import { api } from "@/lib/api";
import { useUserLocation } from "@/lib/location";

const CROPS = [
  "Wheat",
  "Rice",
  "Cotton",
  "Maize",
  "Sugarcane",
  "Soybean",
  "Tomato",
  "Potato",
  "Onion",
  "Chilli",
  "Banana",
  "Mango",
] as const;

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Analyze Crop — Upload a Photo | KrushiMitr" },
      {
        name: "description",
        content:
          "Choose your crop and upload a photo so KrushiMitr stores crop context with your analysis.",
      },
      { property: "og:title", content: "Analyze Crop — KrushiMitr" },
      {
        property: "og:description",
        content: "Upload a crop photo for instant AI diagnosis.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [cropName, setCropName] = useState("");
  const [customCropName, setCustomCropName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraMode, setCameraMode] = useState<"user" | "environment">("environment");
  const { coordinates, locationLabel, status, requestLocation, errorMessage } = useUserLocation({
    autoRequest: false,
    reason: "to personalize the location shown with your analysis",
  });

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (cameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => undefined);
    }
  }, [cameraOpen, cameraStream]);

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setCameraOpen(false);
    setCameraError(null);
  };

  const openCamera = async (requestedMode: "user" | "environment" = cameraMode) => {
    if (typeof window === "undefined") return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported in this browser.");
      setCameraOpen(true);
      return;
    }

    setCameraError(null);

    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: requestedMode },
        audio: false,
      });
      setCameraMode(requestedMode);
      setCameraStream(stream);
      setCameraOpen(true);
      setCameraError(null);
    } catch (error) {
      setCameraError("Camera permission was denied or unavailable. You can still upload an image from your device.");
      setCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraStream) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");

    if (!context) {
      toast.error("Unable to capture photo from the current camera feed.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Unable to capture photo from the current camera feed.");
        return;
      }
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
        type: blob.type || "image/jpeg",
      });
      handleFile(file);
      stopCamera();
    }, "image/jpeg", 0.95);
  };

  const validateFile = (file: File) => {
    if (!/image\/(jpeg|jpg|png|webp)/.test(file.type)) {
      toast.error("Please upload a JPG, JPEG, PNG, or WEBP image.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    setImageFile(file);
    setFileName(file.name);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      try {
        sessionStorage.setItem("krushimitr:image", result);
      } catch {
        /* ignore storage errors */
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadAnalysis = async () => {
    if (!imageFile) {
      toast.error("Please select an image to upload.");
      return;
    }
    const selectedCropName = cropName === "other" ? customCropName.trim() : cropName;
    if (!selectedCropName) {
      toast.error("Please choose your crop name.");
      return;
    }

    let resolvedLocation: { latitude: number; longitude: number } | null = null;
    let resolvedLocationLabel = "Location unavailable";

    if (status === "idle") {
      const locationResult = await requestLocation();
      resolvedLocation = locationResult?.coordinates ?? null;
      resolvedLocationLabel = locationResult?.label ?? "Location unavailable";
    } else if (coordinates) {
      resolvedLocation = coordinates;
      resolvedLocationLabel = locationLabel;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("cropName", selectedCropName);
    if (resolvedLocation) {
      formData.append("latitude", String(resolvedLocation.latitude));
      formData.append("longitude", String(resolvedLocation.longitude));
    }

    setIsUploading(true);
    setProgress(10);

    try {
      const payload = await api.postForm("/analysis", formData);
      const data = payload?.data;
      try {
        sessionStorage.setItem(
          "krushimitr:analysis",
          JSON.stringify({
            ...data,
            cropName: selectedCropName,
            location: resolvedLocationLabel,
            latitude: resolvedLocation?.latitude ?? null,
            longitude: resolvedLocation?.longitude ?? null,
          }),
        );
        if (preview) {
          sessionStorage.setItem("krushimitr:image", preview);
        }
      } catch {
        /* ignore storage issues */
      }
      navigate({ to: "/analysis" });
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setProgress(100);
    }
  };

  return (
    <SiteLayout>
      <section className="hero-glow">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Analyze your crop
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Select the crop and upload a photo. The selected crop name is stored with your analysis.
            </p>
          </div>

          <div className="surface-card mt-10 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Crop name
                  </label>
                  <select
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="">Select a crop</option>
                    {CROPS.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                    <option value="other">Other / Enter manually</option>
                  </select>
                  {cropName === "other" && (
                    <input
                      value={customCropName}
                      onChange={(e) => setCustomCropName(e.target.value)}
                      placeholder="Enter crop name"
                      className="mt-3 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary"
                    />
                  )}
                </div>

                {cameraOpen ? (
                  <div className="rounded-3xl border border-border bg-secondary/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Live camera preview</p>
                        <p className="text-xs text-muted-foreground">Capture a photo directly from your device camera.</p>
                      </div>
                      <Button type="button" variant="outline" className="rounded-full bg-card" onClick={stopCamera}>
                        Close Camera
                      </Button>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-black">
                      <video ref={videoRef} className="h-72 w-full object-cover" playsInline muted autoPlay />
                    </div>
                    {cameraError ? (
                      <p className="mt-3 text-sm text-destructive">{cameraError}</p>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">Use the rear camera on mobile devices for the best experience.</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button type="button" className="rounded-full bg-gradient-primary text-primary-foreground" onClick={capturePhoto}>
                        <Camera className="mr-1 h-4 w-4" /> Capture Photo
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full bg-card" onClick={() => {
                        const nextMode = cameraMode === "environment" ? "user" : "environment";
                        void openCamera(nextMode);
                      }}>
                        Switch Camera
                      </Button>
                    </div>
                  </div>
                ) : !preview ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFile(file);
                    }}
                    onClick={() => inputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
                      dragging
                        ? "border-primary bg-primary-tint"
                        : "border-border bg-secondary/40 hover:border-primary/50"
                    }`}
                  >
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                      <UploadCloud className="h-7 w-7" />
                    </span>
                    <p className="mt-6 text-lg font-medium">
                      Drag &amp; drop your crop photo here
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Supported formats: JPG, JPEG, PNG, WEBP · up to 5 MB
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Button
                        type="button"
                        className="rounded-full bg-gradient-primary text-primary-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRef.current?.click();
                        }}
                      >
                        <ImagePlus className="mr-1 h-4 w-4" /> Upload Image
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full bg-card"
                        onClick={(e) => {
                          e.stopPropagation();
                          void openCamera();
                        }}
                      >
                        <Camera className="mr-1 h-4 w-4" /> Take Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative overflow-hidden rounded-2xl border border-border">
                      <img
                        src={preview}
                        alt="Uploaded crop preview"
                        className="h-64 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium">{fileName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {isUploading ? "Uploading�" : "Ready to upload"}
                        </p>
                        <Progress value={progress} className="mt-4 h-2" />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {progress}%
                        </p>
                      </div>
                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button
                          disabled={isUploading}
                          onClick={uploadAnalysis}
                          className="rounded-full bg-gradient-primary text-primary-foreground"
                        >
                          {isUploading && (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          )}
                          Upload &amp; Analyze
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full bg-card"
                          onClick={() => {
                            setPreview(null);
                            setProgress(0);
                            setImageFile(null);
                            setFileName("");
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" /> Remove
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-full bg-card"
                          onClick={() => {
                            setPreview(null);
                            setProgress(0);
                            setImageFile(null);
                            setFileName("");
                            void openCamera();
                          }}
                        >
                          <Camera className="mr-1 h-4 w-4" /> Retake Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>

              <div className="rounded-3xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
                <p className="text-sm font-semibold text-foreground">
                  Why crop name matters
                </p>
                <p className="mt-3">
                  The crop name you select is stored with the image so future AI analysis can be tailored to the crop type.
                </p>
                <p className="mt-4">
                  Supported crops: {CROPS.join(", ")}.
                </p>
                <p className="mt-4">
                  Location is requested only when you submit the analysis so the result can be tied to your current area. If permission is denied or unavailable, the app will keep working and show a fallback label.
                </p>
                <p className="mt-2 text-sm text-foreground">
                  {status === "loading"
                    ? "Requesting your location…"
                    : status === "success"
                      ? `Location: ${locationLabel}`
                      : status === "denied"
                        ? `Location: ${locationLabel}`
                        : `Location: ${locationLabel}`}
                </p>
                {errorMessage ? <p className="mt-1 text-xs text-muted-foreground">{errorMessage}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
