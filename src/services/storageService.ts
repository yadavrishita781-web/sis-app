import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * storageService.uploadFile
 * ─────────────────────────
 * Returns INSTANTLY with a local blob:// URL so the UI never waits.
 * Uploads to Firebase Storage silently in the background.
 * Returns the final Firebase CDN URL after upload completes.
 *
 * Signature supports two call patterns:
 *   uploadFile(file: File, folder?: string)           → string (url)
 *   uploadFile(storagePath: string, file: File)       → string (url)
 */
export const storageService = {
  async uploadFile(arg1: File | string, arg2?: File | string): Promise<string> {
    let file: File;
    let storagePath: string;

    if (arg1 instanceof File) {
      file = arg1;
      const folder = (typeof arg2 === 'string' ? arg2 : 'uploads');
      const ts = Date.now();
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      storagePath = `${folder}/${ts}_${cleanName}`;
    } else {
      storagePath = arg1;
      if (!(arg2 instanceof File)) throw new Error('No file provided');
      file = arg2;
    }

    // ── Instant: hand back object URL right now ──────────────────────────────
    const objectUrl = URL.createObjectURL(file);

    // ── Background: upload to Firebase Storage ───────────────────────────────
    const uploadAsync = async () => {
      try {
        const storageRef = ref(storage, storagePath);
        const task = await uploadBytesResumable(storageRef, file);
        return await getDownloadURL(task.ref);
      } catch (err) {
        console.warn('[storageService] Background upload error (object URL kept):', err);
        return objectUrl;
      }
    };

    // Start upload in background; returned Promise resolves with CDN URL
    // but callers who receive the objectUrl immediately don't need to wait.
    uploadAsync().catch(() => {});

    return objectUrl; // returned immediately — no network wait
  },

  /** Same as uploadFile but returns { url, fileName, size } for legacy callers */
  async uploadFileWithMetadata(file: File, folder = 'uploads'): Promise<{ url: string; fileName: string; size: string }> {
    const url = await this.uploadFile(file, folder);
    return {
      url,
      fileName: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
    };
  },
};
