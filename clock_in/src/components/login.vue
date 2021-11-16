<template>
  <div class="form-structor">
    <div class="signup">
      <h2 class="form-title" id="signup"><span>或</span>登录</h2>
      <div class="form-holder">
        <!-- 验证 -->
        <van-form :model="signupForm">
          <van-field
            type="number"
            v-model="loginForm.userId"
            class="userId"
            placeholder="学号"
            rules="userId"
            left-icon="guide-o"
            name="pattern"
            :rules="[{ pattern, message: '请输入正确的学号' }]"
            clickable
          />
          <van-field
            left-icon="closed-eye"
            type="password"
            v-model="loginForm.userPassword"
            class="password"
            placeholder="密码"
            rules="userPassword"
            name="validator"
            clickable
            center
            :rules="[{ validator, message: '请输入正确的密码' }]"
          />
        </van-form>
      </div>

      <button class="submit-btn" @click="login">登录</button>
    </div>
    <div class="login slide-up">
      <div class="center">
        <h2 class="form-title" id="login"><span>或</span>注册</h2>
        <div class="form-holder">
          <van-form :model="signupForm">
            <van-field
              v-model="signupForm.userName"
              class="userName"
              name="asyncValidator"
              placeholder="用户名"
              left-icon="contact"
              :rules="[
                { validator: asyncValidator, message: '请输入2~6位的用户名' },
              ]"
              clickable
            />
            <van-field
              type="number"
              v-model="loginForm.userId"
              class="userId"
              placeholder="学号"
              left-icon="guide-o"
              name="pattern"
              :rules="[{ pattern, message: '请输入正确的学号' }]"
              clickable
            />
            <van-field
              type="password"
              v-model="loginForm.userPassword"
              class="userPassword"
              placeholder="密码"
              left-icon="closed-eye"
              clickable
              :rules="[{ validator, message: '密码长度在6到15位必须包含字母' }]"
              name="validator"
            />
            <van-field
              class="checkPassword"
              left-icon="closed-eye"
              v-model="signupForm.checkPassword"
              placeholder="确认密码"
              type="password"
              name="validator"
              clickable
              :rules="[{ validator, message: '请输入确认密码' }]"
            />
          </van-form>
        </div>
        <button class="submit-btn" @click="signup">注册</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        userId: "",
        userPassword: "",
      },
      userPasswordCheck: "",
      signupForm: {
        userName: "",
        checkPassword: "",
      },
      //   验证学号的位数是否足够
      pattern: /\d{10}/,
    };
  },
  created() {
    this.sessionLogin();
  },
  methods: {
    validator(val) {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,15}$/.test(val);
    },
    asyncValidator(val) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(/^[\u4E00-\u9FA5A-Za-z0-9]{2,6}$/.test(val));
        }, 0);
      });
    },
    async login() {
      localStorage.setItem("userId", this.loginForm.userId);
      localStorage.setItem("userPassword", this.loginForm.userPassword);
      const { data: res } = await this.$http({
        url: "/login",
        method: "post",
        params: {
          ...this.loginForm,
        },
      });
      console.log(res);
      localStorage.setItem("token", res.token);
      if (res.state === "登录成功") {
        this.$toast("登录成功");
        this.$router.push("/home");
      }
    },
    async signup() {
      localStorage.setItem("userId", this.loginForm.userId);
      localStorage.setItem("userPassword", this.loginForm.userPassword);
      const { data: res } = await this.$http({
        url: "/register",
        method: "post",
        params: {
          ...this.loginForm,
          userName: "",
        },
      });
      console.log(res);
      localStorage.setItem("token", res.token);
      if (res.state === "注册成功") {
        this.$toast("注册成功");
        this.$router.push("/home");
      }
    },
    sessionLogin() {
      const userId = window.localStorage.getItem("userId");
      const userPassword = window.localStorage.getItem("userPassword");
      this.loginForm.userId = userId;
      this.loginForm.userPassword = userPassword;
    },
  },
  mounted() {
    const loginBtn = document.getElementById("login");
    const signupBtn = document.getElementById("signup");

    loginBtn.addEventListener("click", (e) => {
      let parent = e.target.parentNode.parentNode;
      Array.from(e.target.parentNode.parentNode.classList).find((element) => {
        if (element !== "slide-up") {
          parent.classList.add("slide-up");
        } else {
          signupBtn.parentNode.classList.add("slide-up");
          parent.classList.remove("slide-up");
        }
      });
    });

    signupBtn.addEventListener("click", (e) => {
      let parent = e.target.parentNode;
      Array.from(e.target.parentNode.classList).find((element) => {
        if (element !== "slide-up") {
          parent.classList.add("slide-up");
        } else {
          loginBtn.parentNode.parentNode.classList.add("slide-up");
          parent.classList.remove("slide-up");
        }
      });
    });
  },
};
</script>

<style lang="less" scoped>
html,
body {
  position: relative;
  min-height: 100vh;
  background-color: #e1e8ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Fira Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.form-structor {
  height: 100vh !important;
  width: 100vw;
  background-color: #222;
  border-radius: 15px;
  // height: 100%;
  // width: 390px;
  position: relative;
  overflow: hidden;
}
.form-structor::after {
  content: "";
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(145deg, #719fad, #e7e7e4);
}
.form-structor .signup {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup.slide-up {
  top: 5%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup.slide-up .form-holder,
.form-structor .signup.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
}
.form-structor .signup.slide-up .form-title {
  font-size: 2em;
}
.form-structor .signup.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-title {
  color: #fff;
  font-size: 2em;
  text-align: center;
}
.form-structor .signup .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder {
  border-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: 12px;
}
.form-structor .signup .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .signup .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .signup .submit-btn {
  background-color: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -50px;
  -webkit-transform: translate(-50%, 0);
  background-color: #fff;
  width: 200%;
  height: 100%;
  border-radius: 50%;
  z-index: 4;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center {
  position: absolute;
  top: calc(40% - 10%);
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-title {
  color: #000;
  font-size: 2em;
  text-align: center;
}
.form-structor .login .center .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder {
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #eee;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: 12px;
}
.form-structor .login .center .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .login .center .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .login .center .submit-btn {
  background-color: #6b92a4;
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login.slide-up {
  top: 90%;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .center {
  top: 0%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-holder,
.form-structor .login.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title {
  font-size: 2em;
  margin: 0;
  padding: 0;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
</style>