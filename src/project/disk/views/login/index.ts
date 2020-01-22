import {
  Vue,
  Component
} from 'vue-property-decorator';
import {
  setToken
} from '@/common/auth';
import {
  postRegisterData,
  postLoginData
} from '../../services/login';

@Component
export default class Login extends Vue {
  public isLoginMode = true;
  public username = 'James';
  public password = '123456';
  public confirmPwd = '123456';

  public login(): void {
    postLoginData({
      username: this.username,
      password: this.password
    }).then((token): void => {
      setToken(token);
      this.$router.push({
        name: 'home'
      });
    });
  }

  public register(): void {
    if (this.confirmPwd !== this.password) {
      this.$toast.fail('error password');
      return;
    }
    postRegisterData({
      username: this.username,
      password: this.password
    }).then((): void => {
      this.$toast.success('register account successfully');
      this.isLoginMode = true;
    });
  }
};
