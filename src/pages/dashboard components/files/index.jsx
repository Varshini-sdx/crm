import { useState, useEffect } from "react";
import api from "@/api/axios";
import { 
  FileText, 
  Download, 
  Trash2, 
  UploadCloud 
} from "lucide-react";
import styles from "./files.module.css";

export default function Files() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/files", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("FILES API RESPONSE RAW:", res.data);
      let rawFiles = [];
      if (Array.isArray(res.data)) {
        rawFiles = res.data;
      } else if (res.data && typeof res.data === 'object') {
        const firstArray = Object.values(res.data).find(val => Array.isArray(val));
        rawFiles = firstArray || [];
      }
      setFiles(rawFiles);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/api/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      }
      fetchFiles();
    } catch (err) {
      console.error("Failed to upload files", err);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (err) {
      console.error("Failed to delete file", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className={styles.panel}>
      <div className={styles.filesHeader}>
        <h3>Shared Files ({files.length})</h3>
      </div>

      <label className={styles.fileUpload}>
        <UploadCloud size={32} />
        <span>Click to upload or drag and drop</span>
        <p>PDF, DOC, PNG or JPG (max. 10MB)</p>
        <input type="file" multiple hidden onChange={handleFileUpload} />
      </label>

      <div className={styles.filesList}>
        {files.map((f, i) => (
          <div key={i} className={styles.fileRow}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>
                <FileText size={22} color="#6b5cff" />
              </div>
              <div className={styles.fileName}>
                {f.file_name || f.name}
                <div className={styles.fileMeta}>
                  {f.size || "1.2 MB"} • {f.created_at ? new Date(f.created_at).toLocaleDateString() : "Today"}
                </div>
              </div>
            </div>

            <div className={styles.fileActions}>
              {f.id && (
                <button className={styles.downloadBtn}
                  onClick={async () => {
                    try {
                      const res = await api.get(
                        `/api/files/${f.id}`,
                        {
                          responseType: "blob",
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        }
                      );
                      const url = window.URL.createObjectURL(res.data);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = f.file_name;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error("Failed to download file", err);
                    }
                  }}
                >
                  <Download size={16} />
                </button>
              )}

              {f.id && (
                <button className={styles.deleteBtn}
                  onClick={() => deleteFile(f.id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {files.length === 0 && <div style={{ textAlign: 'center', color: '#8a8fb2', padding: '2rem' }}>No files uploaded yet.</div>}
      </div>
    </div>
  );
}
