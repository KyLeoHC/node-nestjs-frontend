<template>
  <div class="login-container">
    <div class="logo"/>
    <van-cell-group class="login-form common-width">
      <van-field
        v-model="username"
        placeholder="请输入用户名"
      />
      <van-field
        type="password"
        v-model="password"
        placeholder="请输入密码"
      />
      <van-field
        type="password"
        v-model="confirmPwd"
        placeholder="请再次输入密码"
        v-if="!isLoginMode"
      />
    </van-cell-group>
    <template v-if="isLoginMode">
      <van-button
        class="common-width"
        type="primary"
        @click="login"
      >
        login
      </van-button>
      <div class="tips"
           @click="isLoginMode = false"
      >
        register
      </div>
    </template>
    <template v-else>
      <van-button
        class="common-width"
        type="primary"
        @click="register"
      >
        register
      </van-button>
      <van-button
        class="common-width"
        @click="isLoginMode = true"
      >
        back
      </van-button>
    </template>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="scss">
  .login-container {
    padding-top: 30px;

    .common-width {
      display: block;
      width: 80%;
      max-width: 400px;
      margin: 0 auto 10px;
    }

    .logo {
      $size: 200px;

      width: $size; /* rem */
      height: $size; /* rem */
      max-width: $size;
      max-height: $size;
      margin: 0 auto 30px;
      background: url(/static/images/logo.png) no-repeat center/cover;
      overflow: hidden;
    }

    .login-form {
      .van-cell:not(:last-child)::after {
        left: 0;
      }
    }

    .tips {
      line-height: 18px;
      font-size: 14px;
      color: #07c160;
      cursor: pointer;
      text-align: center;
    }
  }
</style>
