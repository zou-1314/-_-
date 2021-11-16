<template>
  <div class="login">
    <!-- 下拉刷新功能 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    </van-pull-refresh>
    <div class="topFlexOne">
      <div class="top1Sky"></div>
      <van-cell-group class="card1" inset>
        <div class="topUserName">
          <div>用户名:</div>
          <div class="userNameTop">{{ userForm.userName }}</div>
          <button @click="editUserName">
            <van-icon name="edit" />
          </button>
          <!-- <div class="update">已上传</div> -->
        </div>
        <!-- 积分 -->
        <div class="bottomPoint">
          <div class="totalPoint">总积分：</div>
          <p>{{ userForm.allPoint }}</p>

          <div class="todayPoint">今日积分：</div>
          <p>{{ userForm.lastPoint }}</p>
        </div>
      </van-cell-group>
      <div class="top2Sky"></div>
      <van-cell-group
        inset
        class="updateStateWhite"
        v-if="changeColor === 'white'"
      >
        <div class="updateStateOne">上传状态:</div>
        <div class="updateStateTwo">{{ updatePicState }}</div>
      </van-cell-group>
      <van-cell-group
        inset
        class="updateStateTrue"
        v-if="changeColor === 'true'"
      >
        <div class="updateStateOne">上传状态:</div>
        <div class="updateStateTwo">{{ updatePicState }}</div>
      </van-cell-group>
      <van-cell-group
        inset
        class="updateStateFalse"
        v-if="changeColor === 'false'"
      >
        <div class="updateStateOne">上传状态:</div>
        <div class="updateStateTwo">{{ updatePicState }}</div>
      </van-cell-group>
      <div class="top2Sky"></div>
      <!-- 拍照上传照片 -->
      <van-cell-group inset class="card2">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="1"
          preview-size="28rem"
          capture="camera"
          upload-text="点击拍照"
        />

        <!-- <van-loading type="spinner" /> -->
        <!-- <img src="{{qrCodeImg}}" alt="" /> -->
        <div class="setButtom">
          <van-button type="primary" round @click="updatePlatePic"
            >上传
          </van-button>
          <van-button type="primary" round @click="deletePlatePic"
            >删除
          </van-button>
        </div>
      </van-cell-group>
      <div class="top3Sky"></div>
    </div>

    <!-- <div class="bottomCard"></div> -->
    <div class="informHeight">
      <van-tabbar v-model="active" active-color="#000" inactive-color="#07C160">
        <van-tabbar-item icon="bar-chart-o" @click="goIntegral"
          >排行</van-tabbar-item
        >
        <van-tabbar-item icon="home-o">主页</van-tabbar-item>
      </van-tabbar>
    </div>

    <!-- 修改名字对话框 -->
    <van-dialog
      v-model="editUserNameVisible"
      title="修改用户名"
      show-cancel-button
      @confirm="informEditUserName"
    >
      <van-form validate-first>
        <van-field
          v-model="editNewUserName"
          placeholder="请输入新的用户名"
          name="asyncValidator"
          :rules="[
            { validator: asyncValidator, message: '请输入2~6位的用户名' },
          ]"
        />
      </van-form>
    </van-dialog>

    <!-- 是否删除上传的照片 -->
    <van-dialog
      v-model="deletePicVisible"
      title="确定删除照片吗？"
      show-cancel-button
      @confirm="confirmDeletePic"
    >
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { Toast } from "vant";
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      active: 0,
      //   用户信息
      userForm: {},
      //   修改名字对话框默认不显示
      editUserNameVisible: false,
      //   删除照片对话框默认隐藏
      deletePicVisible: false,
      //   保存用户修改的新的用户名
      editNewUserName: "",
      //   用户上传的照片
      fileList: [],
      //  下拉刷新
      isLoading: false,
      container: null,
      //   照片是否上传
      updatePicState: "",
      //   根据状态渲染背景色
      changeColor: "white",
    };
  },
  created() {
    this.picWhetherUpload();
    this.baseInf();
  },
  mounted() {
    this.container = this.$refs.container;
  },

  methods: {
    goIntegral() {
      this.$router.push("/integral");
    },
    // 进入页面获取基本信息
    async baseInf() {
      const str = window.localStorage.getItem("token");
      const formData = new FormData();
      formData.append("token", str);
      const { data: res } = await this.$http.post(
        `/point/getCurUser`,
        formData
      );
      this.userForm = res;
    },
    // 点击修改用户名
    async editUserName() {
      this.editUserNameVisible = true;
    },
    async informEditUserName() {
      if (this.editNewUserName.length < 2 || this.editNewUserName.length > 6) {
        return this.$toast.fail("用户名在2~6位");
      }
      const str = window.localStorage.getItem("token");
      const formData = new FormData();
      formData.append("token", str);
      formData.append("userName", this.editNewUserName);
      const { data: res } = await this.$http.post(
        "/user/changeUserName",
        formData
      );
      if (res.state !== "用户名修改成功") return this.$toast.fail("修改失败");
      this.$toast.success(res.state);
      this.baseInf();
    },
    // 跳出弹框询问是否删除上传照片
    deletePlatePic() {
      this.deletePicVisible = true;
    },
    // 删除图片
    async confirmDeletePic() {
      const str = window.localStorage.getItem("token");
      const formData = new FormData();
      formData.append("token", str);
      const { data: res } = await this.$http.post(
        "/record/deleteImage",
        formData
      );
      if (res.state == "图片删除失败") return this.$toast.fail("删除失败");
      if (res.state == "时间非法") return this.$toast.fail("超过删除时间");
      this.fileList = [
        {
          url: "",
          isImage: true,
        },
      ];
      this.$toast.success("删除成功！");
      window.location.reload();
    },
    // 获取预览照片
    async previewPic() {
      this.updatePicState = "照片上传成功";
      this.changeColor = "true";
      const self = this;
      const str = window.localStorage.getItem("token");
      const { data: res } = await this.$http.get(
        "/record/preview?token=" + str,
        { responseType: "blob" }
      );
      let blob = res;
      let reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64
      reader.onload = function () {
        self.fileList = [
          {
            url: reader.result,
            isImage: true,
            message: "加载中...",
          },
        ];
      };
    },
    // 判断今日是否上传图片
    async picWhetherUpload() {
      const str = window.localStorage.getItem("token");
      const formData = new FormData();
      formData.append("token", str);
      const { data: res } = await this.$http.post(
        `/record/whetherUpload?token=` + str
      );
      if (res.state === "今日已写入") return this.previewPic();
      this.updatePicState = "照片未上传";
      this.changeColor = "false";
    },
    // 异步校验函数返回 Promise校验用户名
    asyncValidator(val) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(/^[\u4E00-\u9FA5A-Za-z0-9]{2,6}$/.test(val));
        }, 0);
      });
    },
    //压缩前将file转换成img对象
    readImg(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.readAsDataURL(file);
        img.onload = function () {
          resolve(img);
        };
        img.onerror = function (e) {
          reject(e);
        };
      });
    },
    // 压缩图片
    compressImg(img, type, mx, mh) {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const { width: originWidth, height: originHeight } = img;
        // 最大尺寸限制
        const maxWidth = mx;
        const maxHeight = mh;
        // 目标尺寸
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > 1) {
            // 宽图片
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            // 高图片
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片绘制
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob(function (blob) {
          resolve(blob);
        }, type || "image/png");
      });
    },
    // 压缩图片入口主函数
    async updatePlatePic(file) {
      const str = window.localStorage.getItem("token");
      const img = await this.readImg(this.fileList[0].file);
      const blob = await this.compressImg(img, file.type, 1000, 1000);
      const formData = new FormData();
      formData.append("file", blob, this.userForm.userName + ".jpg");
      const { data: res } = await this.$http.post(
        "/record/upload?token=" + str,
        formData
      );
      if (res.state == "今日已上传,请走修改接口")
        return this.$toast.fail("今日已上传！");
      this.$toast.success("上传成功！");
      this.updatePicState = "照片上传成功";
      this.changeColor = "true";
      this.baseInf();
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
      }, 1000);
    },
  },
};
</script>

<style  lang='less' scoped>
@font-family: Georgia, Times, "Times New Roman", serif;
.login {
  height: 100vh;
}
.login {
  flex: 1;
  display: flex;
  flex-direction: column !important;
  align-items: center !important;
}
.topFlexOne {
  flex: 1;
}
.van-tabbar {
  font-family: @font-family;
  height: 7rem;
  width: 100vw;
  background: linear-gradient(145deg, #c4d2d4, #e5e6e3);
}
.card1 {
  height: 17vh;
  width: 31rem;
  padding: 0rem;
}
.van-cell-group--inset {
  margin: 0 17px;
  overflow: hidden;
  border-radius: 8px;
}
.top1Sky {
  height: 4rem;
}
.top3Sky {
  height: 42rem;
}
.card2 {
  position: absolute;
  height: 53vh;
  width: 31rem;
  margin-bottom: 5rem;
  overflow: auto;
  //   border: 1px solid #18dcff;

  .van-uploader {
    transform: translate(1.5rem, 0.5rem);
  }
  .setButtom {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    transform: translateY(3rem);
    .van-button {
      width: 11rem;
    }
  }
}
.top2Sky {
  height: 2rem;
}
.updateStateWhite {
  padding: 1rem 1.8rem;
  height: 4vh;
  display: flex;
  justify-content: space-between;
  width: 27.5rem;
  background-color: #fff;
}
.updateStateTrue {
  padding: 1rem 1.8rem;
  height: 4vh;
  display: flex;
  justify-content: space-between;
  width: 27.5rem;
  background-color: #57bf7d;
}

.updateStateFalse {
  padding: 1rem 1.8rem;
  height: 4vh;
  display: flex;
  justify-content: space-between;
  width: 80%;
  background-color: #ff4d4d;
}
.updateStateOne,
.updateStateTwo {
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 600;
}
.updateStateTwo {
  margin-right: 2rem;
}
.van-tabbar-item--active {
  background: linear-gradient(145deg, #bfced1, #d2dbdb);
}
/* 用户名样式 */
.topUserName {
  display: flex;

  padding: 3rem 3rem 0 3rem;
  font-size: 2rem;
  font-weight: 900;
  font-family: @font-family;

  button {
    margin: 0 0 0 1rem;
    border-radius: 1rem;
    border: 0px;
    background-color: #fff;
  }
  .userNameTop {
    margin-left: 1rem;
    // width: 13rem;
  }
}
// 积分
.bottomPoint {
  display: flex;
  padding: 2rem 3rem 0 3rem;

  div {
    font-size: 2rem;
    font-weight: 900;
    font-family: @font-family;
  }
  p {
    font-size: 2rem;
    transform: translateY(-2rem);
  }
}
.todayPoint {
  margin-left: 4.3rem;
  font-size: 2rem;
  font-weight: 900;
  font-family: @font-family;
}
</style>