// client/src/components/resume-upload.jsx
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";
import {
  useUploadResumeMutation,
  useGetResumeQuery,
} from "../services/resumeApi";
import { setCredentials } from "../features/auth/authSlice";
import { setResume } from "../features/resume/resumeSlice";


import { toast } from "sonner";

export function ResumeUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [extractedData, setExtractedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const [uploadResume] = useUploadResumeMutation();
  const {
    data: existingResume,
    refetch,
    isLoading: isLoadingResume,
  } = useGetResumeQuery();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingResume?.data) {
      dispatch(setResume(existingResume.data));
      setExtractedData(existingResume.data);
      setUploadStatus("success");
    }
  }, [existingResume, dispatch]);

  const validateAndSetFile = (selectedFile) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage("Please upload a PDF or DOC file");
      return false;
    }

    if (selectedFile.size > maxSize) {
      setErrorMessage("File size must be less than 5MB");
      return false;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    setUploadStatus("idle");
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) validateAndSetFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const result = await uploadResume(formData).unwrap();

      setExtractedData(result.data);
      setUploadStatus("success");

      if (result.user) {
        dispatch(setCredentials({ user: result.user }));
      }

      await refetch();
      onUploadComplete?.(result.data);
    } catch (err) {
      setUploadStatus("error");
      const msg = err?.data?.message || "Failed to parse resume";
      setErrorMessage(msg);
      if (err?.status === 429) {
        toast.error(msg);
      }
      console.error("Upload error:", err);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadStatus("idle");
    setExtractedData(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Show loading skeleton while fetching existing resume
  if (isLoadingResume) {
    return (
      <Card className="p-6 dark:bg-gray-800/80">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  // Show existing resume success state
  if (uploadStatus === "success" && extractedData && !file) {
    return (
      <Card className="p-6 border-green-200 dark:border-green-800/50 bg-green-50/30 dark:bg-green-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-400">
              Resume Ready!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-500">
              Your resume is uploaded and analyzed
            </p>
          </div>
        </div>

        {extractedData.skills?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Skills ({extractedData.skills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {extractedData.skills.slice(0, 6).map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  {skill}
                </Badge>
              ))}
              {extractedData.skills.length > 6 && (
                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  +{extractedData.skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <Button variant="outline" onClick={handleRemoveFile} className="w-full">
          Upload New Resume
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resume Analysis
        </h2>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Upload your resume and our AI will extract your skills and experience
      </p>

      {/* Drop Zone */}
      {!file && uploadStatus !== "uploading" && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl py-12 px-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-purple-500 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/30"
              : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            PDF, DOC up to 5MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessage && uploadStatus !== "uploading" && (
        <div className="mt-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700 dark:text-red-400">
                {errorMessage}
              </p>
              {errorMessage?.toLowerCase().includes("limit") && (
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
                  Please try again in 24 hours.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected File Preview */}
      {file && uploadStatus !== "uploading" && uploadStatus !== "success" && (
        <div className="border-2 border-purple-500/30 dark:border-purple-400/30 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(2)} KB • Ready to upload
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <Button onClick={handleUpload} className="w-full mt-4">
            Parse Resume with AI
          </Button>
        </div>
      )}

      {/* Uploading State */}
      {uploadStatus === "uploading" && (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Parsing Resume...
          </span>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            This may take a few seconds
          </p>
        </div>
      )}

      {/* Success State with Extracted Data */}
      {uploadStatus === "success" && extractedData && file && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl p-5 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-900 dark:text-green-400">
              Resume Parsed Successfully!
            </h3>
          </div>

          <div className="space-y-4">
            {extractedData.skills?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🎯 Extracted Skills ({extractedData.skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {extractedData.experience &&
              extractedData.experience !== "Not specified" && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    💼 Experience
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {extractedData.experience}
                  </p>
                </div>
              )}

            {extractedData.education?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🎓 Education
                </p>
                {extractedData.education.map((edu, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {edu.degree} from {edu.institution}
                  </p>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleRemoveFile}
              className="w-full"
            >
              Upload Different Resume
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
