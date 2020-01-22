import {
  Vue,
  Component
} from 'vue-property-decorator';
import {
  dateFormat
} from '@/utils';
import {
  UserProfile,
  getUserProfileData
} from '../../services/home';
import {
  upload,
  getUserFiles,
  deleteFile,
  downloadFile
} from '../../services/file';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;

@Component({
  filters: {
    dateFormat
  }
})
export default class Home extends Vue {
  public isShowUserPopup = false;
  public user: UserProfile | null = null;
  public userFileData: PromiseType<ReturnType<typeof getUserFiles>> | null = null;

  public async mounted(): Promise<void> {
    const toastLoading = this.$toast.loading();
    this.user = await getUserProfileData();
    await this.loadUserFiles();
    toastLoading.close();
  }

  public async loadUserFiles(): Promise<void> {
    this.userFileData = await getUserFiles();
  }

  public async uploadFile(event: HTMLInputEvent): Promise<void> {
    const target = event.target;
    if (target && target.files && target.files.length) {
      const toastLoading = this.$toast.loading();
      await upload(target.files, {
        onInit: (progress): void => {
          toastLoading.message = `初始化${progress}%`;
        },
        onProgress: (loaded, total): void => {
          toastLoading.message = `上传中${parseInt((loaded / total * 100).toFixed(2))}%`;
        }
      });
      toastLoading.clear();
      this.$toast.success('upload file successfully!');
      this.loadUserFiles();
    }
  }

  public fileSizeFormat(size: number): string {
    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;
    let num = 0;
    let unit = '';
    if (size < kilobyte) {
      num = size;
      unit = 'B';
    } else if (size < megabyte) {
      num = parseFloat((size / kilobyte).toFixed(2));
      unit = 'KB';
    } else if (size < gigabyte) {
      num = parseFloat((size / megabyte).toFixed(2));
      unit = 'MB';
    } else {
      num = parseFloat((size / gigabyte).toFixed(2));
      unit = 'G';
    }
    return `${num}${unit}`;
  }

  public async deleteFile(id: string): Promise<void> {
    await this.$dialog.confirm({
      title: 'Alert',
      message: 'Are you sure to delete this file?'
    });
    const toastLoading = this.$toast.loading();
    await deleteFile({ id });
    await this.loadUserFiles();
    toastLoading.close();
  }

  public download(id: string): void {
    downloadFile({ id });
  }
};
