<template>
  <div class="home-container">
    <van-nav-bar
      title="home"
      left-arrow
      fixed
    >
      <van-icon
        name="user-o"
        slot="right"
        @click="isShowUserPopup = true"
      />
    </van-nav-bar>
    <label class="upload-btn">
      <van-icon name="plus"></van-icon>
      <input
        type="file"
        hidden
        @change="uploadFile"
      >
    </label>
    <table
      class="file-table"
      cellspacing="0"
      v-if="userFileData"
    >
      <colgroup>
        <col>
        <col width="110px">
        <col width="110px">
        <col width="80px">
      </colgroup>
      <thead>
        <tr>
          <td>filename</td>
          <td>upload date</td>
          <td>size</td>
          <td>operation</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in userFileData.files"
          :key="item.id"
        >
          <td class="filename">{{ item.filename }}</td>
          <td class="upload-date">{{ item.createTime | dateFormat('YYYY-MM-DD') }}</td>
          <td class="file-size">{{ fileSizeFormat(item.size) }}</td>
          <td class="operation">
            <van-icon
              name="down"
              @click="download(item.id)"
            />
            <van-icon
              name="close"
              @click="deleteFile(item.id)"
            />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <div>total: {{ userFileData.count }}</div>
            <div>used space: {{ userFileData.usedSpace }}</div>
          </td>
        </tr>
      </tfoot>
    </table>
    <van-popup
      :style="{ height: '100%' }"
      get-container="body"
      v-model="isShowUserPopup"
      position="right"
    >
      <div class="user-profile">
        <div class="avater"></div>
        <div class="username">
          {{ user ? user.username : '--' }}
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script src="./index.ts"></script>
<style lang="scss">
  .home-container {
    position: relative;
    padding: 46px 20px;
    font-size: 18px;
    text-align: center;

    .van-nav-bar {
      .van-icon {
        font-size: 20px;
      }
    }

    .upload-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      margin: 10px auto 0;
      border-radius: 8px;
      border: 1px dashed #eee;

      .van-icon {
        font-size: 30px;
      }
    }

    .file-table {
      line-height: 30px;
      margin-top: 20px;
      border: 1px solid #eee;
      border-collapse: collapse;

      td {
        border: 1px solid #eee;
      }

      .operation {
        .van-icon {
          cursor: pointer;
        }
      }
    }
  }

  .user-profile {
    width: 200px; /* rem */
    height: 100%;
    padding: 40px 10px;
    overflow: hidden;

    .avater {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      background: url(/static/images/logo.png) no-repeat center/contain;
    }

    .username {
      margin-top: 20px;
      font-size: 16px;
      color: #333;
      word-break: break-all;
      text-align: center;
    }
  }
</style>
