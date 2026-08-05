import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Analyze Crop — Upload a Photo | KrushiMitr" },
      {
        name: "description",
        content:
          "Drag and drop or capture a crop photo and let KrushiMitr AI analyze disease, nutrients and treatment.",
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
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!/image\/(jpeg|jpg|png)/.test(file.type)) {
      toast.error("Please upload a JPG, JPEG or PNG image.");
      return;
    }
    setFileName(file.name);
    setProgress(0);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      let value = 0;
      const timer = setInterval(() => {
        value += 8 + Math.random() * 12;
        setProgress(Math.min(100, Math.round(value)));
        if (value >= 100) clearInterval(timer);
      }, 90);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = () => {
    if (!preview) return;
    try {
      sessionStorage.setItem("krushimitr:image", preview);
    } catch {
      /* storage may be unavailable */
    }
    navigate({ to: "/analysis" });
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
              Upload a clear, well-lit photo of an affected leaf or plant. Our
              AI does the rest.
            </p>
          </div>

          <div className="surface-card mt-10 p-6 sm:p-8">
            {!preview ? (
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
                  Supported formats: JPG, JPEG, PNG · up to 10 MB
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
                      cameraRef.current?.click();
                    }}
                  >
                    <Camera className="mr-1 h-4 w-4" /> Use Camera
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
                      {progress < 100 ? "Uploading…" : "Upload complete"}
                    </p>
                    <Progress value={progress} className="mt-4 h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {progress}%
                    </p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      disabled={progress < 100}
                      onClick={startAnalysis}
                      className="rounded-full bg-gradient-primary text-primary-foreground"
                    >
                      {progress < 100 && (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      )}
                      Analyze Crop
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full bg-card"
                      onClick={() => {
                        setPreview(null);
                        setProgress(0);
                      }}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}