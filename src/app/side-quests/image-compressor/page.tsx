'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Archive,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  OutputFormat,
  FormatOptions,
  DEFAULT_OPTIONS,
  FORMAT_EXTENSIONS,
  compressFile,
  formatBytes,
  formatSavings,
  CompressedFile,
} from '@/lib/imageCompression';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import CompressionAlgorithms from './CompressionAlgorithms';

const MAX_ZIP_SIZE_BYTES = 1024 * 1024 * 1024; // 1 GB

interface FileTask {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
  result?: CompressedFile;
}

export default function ImageCompressorPage() {
  const [tasks, setTasks] = useState<FileTask[]>([]);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [options, setOptions] = useState<FormatOptions>(DEFAULT_OPTIONS);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [zipTooLarge, setZipTooLarge] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tasksRef = useRef<FileTask[]>([]);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const totalOriginalSize = useMemo(
    () => tasks.reduce((sum, t) => sum + t.file.size, 0),
    [tasks]
  );
  const totalCompressedSize = useMemo(
    () => tasks.reduce((sum, t) => sum + (t.result?.compressedSize ?? 0), 0),
    [tasks]
  );
  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  );
  const errorCount = useMemo(
    () => tasks.filter((t) => t.status === 'error').length,
    [tasks]
  );
  const allDone = completedCount + errorCount === tasks.length && tasks.length > 0;

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/')
    );
    if (imageFiles.length === 0) return;
    setTasks((prev) => [
      ...prev,
      ...imageFiles.map((file) => ({
        file,
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        status: 'pending' as const,
      })),
    ]);
    setZipBlob(null);
    setZipTooLarge(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setZipBlob(null);
    setZipTooLarge(false);
  }, []);

  const startCompression = useCallback(async () => {
    if (tasksRef.current.length === 0 || isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setZipBlob(null);
    setZipTooLarge(false);

    const resetTasks = tasksRef.current.map((t) =>
      t.status === 'done' || t.status === 'error'
        ? { ...t, status: 'pending' as const, result: undefined, error: undefined }
        : t
    );

    setTasks(resetTasks);
    tasksRef.current = resetTasks;

    const currentOptions = options[format];

    for (let i = 0; i < tasksRef.current.length; i++) {
      const task = tasksRef.current[i];
      if (task.status !== 'pending') continue;

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: 'processing' } : t))
      );

      try {
        const result = await compressFile(task.file, format, currentOptions, true);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: 'done', result } : t
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id ? { ...t, status: 'error', error: message } : t
          )
        );
      }

      setProgress(Math.round(((i + 1) / tasksRef.current.length) * 100));
    }

    setIsRunning(false);
  }, [isRunning, format, options]);

  const buildZip = useCallback(async () => {
    const doneTasks = tasks.filter((t): t is FileTask & { result: CompressedFile } =>
      t.status === 'done' && t.result !== undefined
    );
    if (doneTasks.length === 0) return;

    const zipTotal = doneTasks.reduce((sum, t) => sum + t.result.compressedSize, 0);
    if (zipTotal > MAX_ZIP_SIZE_BYTES) {
      setZipTooLarge(true);
      return;
    }

    const zip = new JSZip();
    for (const task of doneTasks) {
      zip.file(task.result.outputName, new Uint8Array(task.result.buffer));
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    setZipBlob(blob);
    setZipTooLarge(false);
  }, [tasks]);

  const downloadZip = useCallback(() => {
    if (!zipBlob) return;
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed-images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [zipBlob]);

  const downloadIndividual = useCallback((task: FileTask) => {
    if (!task.result) return;
    const url = URL.createObjectURL(new Blob([task.result.buffer]));
    const link = document.createElement('a');
    link.href = url;
    link.download = task.result.outputName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const updateOption = useCallback(
    <F extends OutputFormat>(
      fmt: F,
      key: keyof FormatOptions[F],
      value: FormatOptions[F][typeof key]
    ) => {
      setOptions((prev) => ({
        ...prev,
        [fmt]: { ...prev[fmt], [key]: value },
      }));
      setZipBlob(null);
      setZipTooLarge(false);
    },
    []
  );

  return (
    <div className="relative min-h-screen bg-[#0d1117] text-white pt-8 pb-16 flex justify-center text-center [&_h1]:!mb-0 [&_h1]:!text-3xl [&_h1]:!font-semibold [&_h2]:!mb-0 [&_h2]:!text-lg [&_h2]:!font-medium [&_h2]:block">
      <Link
        href="/"
        className="absolute left-6 top-6 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-8 h-8" />
      </Link>
      <div className="w-full max-w-4xl px-6">

        {/* Top spacer */}
        <div className="h-8" />

        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Image Compressor</h1>
          <p className="text-gray-400 mt-2 text-sm !mb-0">
             Compress images locally in your browser. Adjust settings for your usecase. More filetypes and optimization options coming soon.
          </p>
        </div>

        {/* Spacer between title and drop zone */}
        <div className="h-12" />

        {/* Drop zone section */}
        <div className="flex justify-center">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => inputRef.current?.click()}
            className="bg-[#161b22] border border-white/10 hover:border-white/20 rounded-3xl cursor-pointer transition-all flex flex-col items-center justify-center gap-4 w-full max-w-2xl h-48"
          >
            <Upload className="w-12 h-12 text-gray-300" />
            <div className="text-center">
              <p className="text-xl font-medium !mb-0">Drop images here</p>
              <p className="text-sm text-gray-400 mt-1 !mb-0">Drag & drop JPEG, PNG or WebP</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Spacer between drop zone and controls */}
        <div className="h-12" />

        {/* Controls section */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Settings */}
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => {
                  setFormat('jpeg');
                  setZipBlob(null);
                  setZipTooLarge(false);
                }}
                variant={format === 'jpeg' ? 'default' : 'outline'}
                className="w-[100px] py-3 h-6"
              >
                JPEG
              </Button>
              <Button
                onClick={() => {
                  setFormat('png');
                  setZipBlob(null);
                  setZipTooLarge(false);
                }}
                variant={format === 'png' ? 'default' : 'outline'}
                className="w-[120px] py-3 h-auto"
              >
                PNG
              </Button>
              <Button
                onClick={() => {
                  setFormat('webp');
                  setZipBlob(null);
                  setZipTooLarge(false);
                }}
                variant={format === 'webp' ? 'default' : 'outline'}
                className="w-[140px] py-3 h-auto"
              >
                WEBP
              </Button>
            </div>

            {format !== 'png' && (
              <div className="space-y-3 min-w-[300px]">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-sm text-gray-400 leading-6">Quality</Label>
                  <output className="text-sm font-medium tabular-nums">
                    {format === 'jpeg' ? options.jpeg.quality : options.webp.quality}
                  </output>
                </div>
                <Slider
                  value={[
                    format === 'jpeg' ? options.jpeg.quality : options.webp.quality,
                  ]}
                  onValueChange={(value) =>
                    updateOption(format, 'quality', value[0])
                  }
                  min={1}
                  max={100}
                  aria-label="Quality"
                />
              </div>
            )}

            {format === 'png' && (
              <div className="space-y-3 min-w-[300px]">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-sm text-gray-400 leading-6">Colors</Label>
                  <output className="text-sm font-medium tabular-nums">
                    {options.png.colors}
                  </output>
                </div>
                <Slider
                  value={[options.png.colors]}
                  onValueChange={(value) =>
                    updateOption('png', 'colors', value[0])
                  }
                  min={2}
                  max={256}
                  aria-label="Colors"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={startCompression}
              disabled={isRunning || tasks.length === 0}
              size="lg"
              className="px-10 py-50 w-[140px] h-[40px]"
            >
              {isRunning ? 'Compressing...' : 'Compress Images'}
            </Button>
          </div>

          {/* Explanatory section */}
          {tasks.length === 0 && (
            <div className="max-w-2xl text-center text-gray-400 text-sm space-y-4 pt-2">
              <p>
                Images are compressed entirely in your browser. No files are uploaded to a server.
              </p>
              <p>
                <strong className="text-white">JPEG</strong> uses lossy compression based on the Discrete Cosine Transform (DCT). Each 8×8 block is converted into a weighted sum of cosine waves, high-frequency detail is quantized, and the remaining coefficients are Huffman encoded. This page uses a pure JavaScript JPEG encoder so the encoding pipeline can be extended with more options later.
              </p>
              <p>
                <strong className="text-white">WebP</strong> uses VP8 lossy compression. It combines block prediction and transform coding, and typically produces smaller files than JPEG at the same visual quality.
              </p>
              <p>
                <strong className="text-white">PNG</strong> is lossless. The encoder reduces the color count to a palette and then compresses the result with DEFLATE, so no image data is discarded.
              </p>
            </div>
          )}

          {/* Progress */}
          {isRunning && (
            <div className="w-full bg-[#161b22] border border-white/10 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-sm text-gray-400">Compressing...</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-[#0d1117]">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center !mb-0">
                {completedCount} of {tasks.length} files
              </p>
            </div>
          )}

          {/* Empty space section */}
          <div className="py-12" />

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="bg-[#161b22] border border-white/10 rounded-xl px-8 py-8 text-center">
                <p className="text-xs text-gray-500 !mb-2">Original</p>
                <p className="text-lg font-semibold !mb-0">{formatBytes(totalOriginalSize)}</p>
              </div>
              <div className="bg-[#161b22] border border-white/10 rounded-xl px-8 py-8 text-center">
                <p className="text-xs text-gray-500 !mb-2">Compressed</p>
                <p className="text-lg font-semibold !mb-0">{formatBytes(totalCompressedSize)}</p>
              </div>
              <div className="bg-[#161b22] border border-white/10 rounded-xl px-8 py-8 text-center">
                <p className="text-xs text-gray-500 !mb-2">Saved</p>
                <p className={`text-lg font-semibold !mb-0 ${
                  totalCompressedSize < totalOriginalSize ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {totalOriginalSize > 0
                    ? formatSavings(totalOriginalSize, totalCompressedSize)
                    : '0%'}
                </p>
              </div>
            </div>
          )}

          {/* Files */}
          {tasks.length > 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-medium text-center">Files</h2>
              {tasks.map((task, index) => {
                const isFirst = index === 0;
                const isLast = index === tasks.length - 1;
                return (
                <div
                  key={task.id}
                  className={`bg-[#161b22] border border-white/10 hover:border-white/20 !px-16 py-8 transition-all ${
                    isFirst ? 'rounded-t-2xl' : ''
                  } ${isLast ? 'rounded-b-2xl' : ''}`}
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 min-w-0 !px-6">
                      <p className="text-base font-medium text-white truncate">
                        {task.file.name}
                      </p>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-sm text-gray-400 whitespace-nowrap">
                      <span>Original {formatBytes(task.file.size)}</span>
                      <span className="text-gray-600">→</span>
                      <span>
                        Compressed{' '}
                        {task.result ? formatBytes(task.result.compressedSize) : '-'}
                      </span>
                      {task.result && !task.result.keptOriginal && (
                        <span className="text-emerald-400">
                          Saved {formatSavings(task.file.size, task.result.compressedSize)}
                        </span>
                      )}
                      {task.result?.keptOriginal && (
                        <span className="text-amber-400">Kept original</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {task.status === 'pending' && (
                        <span className="inline-flex items-center rounded-full bg-gray-500/10 text-gray-400 px-3 py-1 text-xs font-medium">
                          Pending
                        </span>
                      )}
                      {task.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-400 px-3 py-1 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          Processing
                        </span>
                      )}
                      {task.status === 'done' && !task.result?.keptOriginal && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 px-3 py-1 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
                        </span>
                      )}
                      {task.status === 'done' && task.result?.keptOriginal && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 px-3 py-1 text-xs font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Kept
                        </span>
                      )}
                      {task.status === 'error' && (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 text-red-400 px-3 py-1 text-xs font-medium"
                          title={task.error}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Error
                        </span>
                      )}

                      {task.status === 'done' && (
                        <Button
                          onClick={() => downloadIndividual(task)}
                          variant="outline"
                          size="icon"
                          title="Download"
                          className="h-12 w-12"
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                      )}
                      {!isRunning && (
                        <Button
                          onClick={() => removeTask(task.id)}
                          variant="outline"
                          size="icon"
                          title="Remove"
                          className="h-9 w-9"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="md:hidden mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span>Original {formatBytes(task.file.size)}</span>
                    <span className="text-gray-600">→</span>
                    <span>
                      Compressed{' '}
                      {task.result ? formatBytes(task.result.compressedSize) : '-'}
                    </span>
                    {task.result && !task.result.keptOriginal && (
                      <span className="text-emerald-400">
                        Saved {formatSavings(task.file.size, task.result.compressedSize)}
                      </span>
                    )}
                    {task.result?.keptOriginal && (
                      <span className="text-amber-400">Kept original</span>
                    )}
                  </div>

                  {(task.status === 'pending' || task.status === 'processing') && (
                    <div className="mt-5 !-mx-16">
                      <div className="relative h-2 bg-[#0d1117] overflow-hidden">
                        <div className="absolute left-0 top-0 h-full bg-white/80 animate-pulse w-full" />
                      </div>
                    </div>
                  )}
                </div>
              );
              })}

              {/* Spacer between file list and ZIP buttons */}
              <div className="h-8" />

              {allDone && completedCount > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    onClick={buildZip}
                    disabled={zipBlob !== null || zipTooLarge}
                    size="lg"
                    className="px-16 py-8 w-[160px] h-10 text-base"
                  >
                    <Archive className="w-6 h-6" />
                    {zipBlob ? 'ZIP Ready' : zipTooLarge ? 'ZIP Too Large' : 'Build ZIP'}
                  </Button>
                  {zipBlob && (
                    <Button
                      onClick={downloadZip}
                      variant="outline"
                      size="lg"
                      className="px-10 py-5 h-auto"
                    >
                      <Download className="w-4 h-4" />
                      Download ZIP
                    </Button>
                  )}
                  {zipTooLarge && (
                    <p className="text-sm text-amber-400">
                      Total exceeds 1 GB. Download individually.
                    </p>
                  )}
                </div>
              )}

              {/* Bottom spacer */}
              <div className="h-8" />
            </div>
          )}
        </div>

        {tasks.length === 0 && <CompressionAlgorithms />}
      </div>
    </div>
  );
}
