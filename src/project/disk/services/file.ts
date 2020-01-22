import SparkMD5 from 'spark-md5';
import { timeout } from '@/utils';
import http from '@/common/http';
import {
  baseUrl
} from '@/common/env';
import {
  GET_USER_FILES_API,
  CREATE_FILE_API,
  UPLOAD_FILE_API,
  MERGE_FILE_API,
  DOWNLOAD_FILE_API,
  DELETE_FILE_API
} from '@/common/api';

interface UploadOption {
  size?: number;
  onInit?: (progress: number) => void;
  onProgress?: (loaded: number, total: number) => void;
}

const defaultUploadOption: Required<UploadOption> = {
  size: 2 * 1024 * 1024,
  onInit: (progress: number): void => {
    console.log(progress);
  },
  onProgress: (loaded: number, total: number): void => {
    console.log(loaded, total);
  }
};

/**
 * create file
 * @param params
 */
export const preCreateFile = async (
  params: {
    filename: string;
    hash: string;
    segmentCount: number;
  }
): Promise<string> => {
  const response = await http.post<string>(CREATE_FILE_API, params);
  return response.data || '';
};

/**
 * upload file
 * @param params
 */
export const uploadFile = async (
  params: {
    id: string;
    hash: string;
    index: number;
    file: Blob;
  }
): Promise<void> => {
  const formData = new FormData();
  formData.append('id', params.id);
  formData.append('hash', params.hash);
  formData.append('index', params.index + '');
  formData.append('file', params.file, 'file');
  await http.post<void>(UPLOAD_FILE_API, formData, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    }
  });
};

/**
 * merge file
 * @param params
 */
export const mergeFile = async (
  params: {
    id: string;
  }
): Promise<void> => {
  await http.put<void>(MERGE_FILE_API, params);
};

/**
 * upload entry
 * @param files
 */
export const upload = (
  files: FileList,
  option?: UploadOption
): Promise<void> => {
  return new Promise((resolve, reject): void => {
    option = option || defaultUploadOption;
    const sizeLimit: number = option.size ?? defaultUploadOption.size;
    const onInit = option.onInit || defaultUploadOption.onInit;
    const onProgress = option.onProgress || defaultUploadOption.onProgress;

    const file = files[0];
    const totalSize = file.size;
    const filename = file.name;
    const fileReader = new FileReader();

    fileReader.onload = async (event): Promise<void> => {
      if (!event.target || !event.target.result) {
        reject(new Error('Can not read file data!'));
        return;
      }
      const fileData = event.target.result as ArrayBuffer;
      if (totalSize < sizeLimit) {
        // Don't need to slice file
        const spark = new SparkMD5.ArrayBuffer();
        spark.append(fileData);
        const hash = spark.end();
        onInit(1);
        const fileId = await preCreateFile({
          filename,
          hash,
          segmentCount: 0
        });
        if (fileId) {
          await uploadFile({
            id: fileId,
            hash,
            index: -1,
            file: new Blob([fileData])
          });
        }
      } else {
        // We need to slice file into smaller one
        const fileSpark = new SparkMD5.ArrayBuffer();
        const segments: {
          size: number;
          hash: string;
          buffer: ArrayBuffer;
        }[] = [];
        const segmentCount = Math.ceil(totalSize / sizeLimit);
        for (let i = 0; i < segmentCount; i++) {
          const start = i * sizeLimit;
          const end = Math.min(totalSize, start + sizeLimit);
          const segmentBuffer = fileData.slice(start, end);
          const segmentSpark = new SparkMD5.ArrayBuffer();
          segmentSpark.append(segmentBuffer);
          segments.push({
            size: end - start,
            hash: segmentSpark.end(),
            buffer: segmentBuffer
          });
          fileSpark.append(segmentBuffer);
          onInit(parseInt((i + 1) / segmentCount * 100 + ''));
          await timeout(0);
        }
        // create file
        const fileId = await preCreateFile({
          filename,
          segmentCount,
          hash: fileSpark.end()
        });
        if (fileId) {
          // upload segment data
          let loaded = 0;
          for (let i = 0; i < segmentCount; i++) {
            const segment = segments[i];
            await uploadFile({
              id: fileId,
              index: i,
              hash: segment.hash,
              file: new Blob([segment.buffer])
            });
            loaded += segment.size;
            onProgress(loaded, totalSize);
          }
          // merge file
          await mergeFile({ id: fileId });
        }
      }
      resolve();
    };

    fileReader.onerror = (error): void => {
      reject(error);
    };

    fileReader.readAsArrayBuffer(file);
  });
};

export interface UserFileData {
  usedSpace: number;
  count: number;
  files: {
    id: string;
    size: number;
    filename: string;
    createTime: number;
  }[];
}

export async function getUserFiles(): Promise<UserFileData> {
  const response = await http.get<UserFileData>(GET_USER_FILES_API);
  if (!response.data) {
    throw new Error('miss user file data');
  }
  return response.data;
}

/**
 * delete file
 * @param params
 */
export const deleteFile = async (
  params: {
    id: string;
  }
): Promise<void> => {
  await http.delete<void>(`${DELETE_FILE_API}/${params.id}`);
};

/**
 * download file
 * @param params
 */
export const downloadFile = async (
  params: {
    id: string;
  }
): Promise<void> => {
  window.open(`${baseUrl}${DOWNLOAD_FILE_API}/${params.id}`);
};
