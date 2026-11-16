import { defineStore } from 'pinia';
import type { PaginationMeta, UploadRecord } from '#shared/types/api';

export const useUploadsStore = defineStore('prism-uploads', () => {
  const api = useApiClient();
  const config = useRuntimeConfig();

  const items = ref<UploadRecord[]>([]);
  const selectedFile = ref<UploadRecord | null>(null);
  const meta = ref<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const filters = reactive({
    page: 1,
    limit: 12,
    search: '',
    mimeType: '',
    sortBy: 'uploadDate',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const loading = ref(false);
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const error = ref<string | null>(null);

  const fetchUploads = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<UploadRecord[]>(
        '/uploads',
        {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          mimeType: filters.mimeType || undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
        'uploads-list',
      );
      items.value = res.data || [];
      if (res.meta) {
        meta.value = res.meta;
      }
      if (
        selectedFile.value &&
        !items.value.some((i) => i._id === selectedFile.value?._id)
      ) {
        selectedFile.value = items.value[0] || null;
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      error.value = api.extractApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  const uploadFilesWithProgress = (files: File[]): Promise<UploadRecord[]> => {
    return new Promise((resolve, reject) => {
      uploading.value = true;
      uploadProgress.value = 8;

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      if (import.meta.client && typeof XMLHttpRequest !== 'undefined') {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${config.public.apiBaseUrl}/uploads`, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            uploadProgress.value = Math.min(
              95,
              Math.round((event.loaded / event.total) * 100),
            );
          }
        };

        xhr.onload = async () => {
          uploading.value = false;
          uploadProgress.value = 100;
          try {
            const parsed = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              await fetchUploads();
              const uploadedList: UploadRecord[] = parsed.data || [];
              if (uploadedList[0]) {
                selectedFile.value = uploadedList[0];
              }
              resolve(uploadedList);
            } else {
              const msg = Array.isArray(parsed.message)
                ? parsed.message.join(', ')
                : parsed.message || 'Upload failed';
              reject(new Error(msg));
            }
          } catch (parseErr) {
            reject(parseErr);
          }
        };

        xhr.onerror = () => {
          uploading.value = false;
          uploadProgress.value = 0;
          reject(new Error('Network error while uploading image files.'));
        };

        xhr.send(formData);
      } else {
        api
          .post<UploadRecord[]>('/uploads', formData)
          .then(async (res) => {
            uploading.value = false;
            uploadProgress.value = 100;
            await fetchUploads();
            resolve(res.data || []);
          })
          .catch((err) => {
            uploading.value = false;
            uploadProgress.value = 0;
            reject(err);
          });
      }
    });
  };

  const deleteUpload = async (id: string) => {
    await api.del(`/uploads/${id}`);
    if (selectedFile.value?._id === id) {
      selectedFile.value = null;
    }
    await fetchUploads();
  };

  return {
    items,
    selectedFile,
    meta,
    filters,
    loading,
    uploading,
    uploadProgress,
    error,
    fetchUploads,
    uploadFilesWithProgress,
    deleteUpload,
  };
});
