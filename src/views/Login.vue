<template>
  <div class="hello">
    <div class="form-signin">
      <div class="left">
        <img src="../assets/login.jpg" alt />
      </div>
      <div class="right">
        <div class="fom">
          <h2 class="form-signin-heading">明略科技欢迎你</h2>
          <br />
          <input
            type="text"
            class="form-control"
            placeholder="账号"
            autofocus
            id="name"
          />
          <br />
          <input
            type="password"
            class="form-control"
            placeholder="密码"
            id="password"
          />
          <br />
          <el-radio-group v-model="radio">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="professor">领域专家</el-radio>
            <el-radio label="common_user">用户</el-radio>
          </el-radio-group>
          <div style="height: 20px; width: 300px"></div>
          <button class="btn btn-lg btn-primary" type="submit" @click="logIn">
            登录
          </button>
          <br />
          <br />
          <button @click="zhuce" id="zhuce">还没有账号?点击注册一个吧!</button>
          <!-- <button @click="zhuce">还没有账户?点击我来注册一个吧!</button> -->
        </div>
        <div class="fot">
          <h4>联系我们</h4>
          <p>北京市 海淀区 中关村东路1号院 清华科技园创新大厦 A座10层1002</p>
          <p>+86 10 64303888</p>
        </div>
      </div>
    </div>
    <div class="log-cc"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: "",
      base: "",
      login: "",
      url: "",
      queuingSystem: "",
      timer: null,
    };
  },
  methods: {
    //开始登陆
    logIn() {
      if (!this.url) {
        setTimeout(this.logIn, 200);
        return;
      }
      var url = this.url;
      let that = this;
      this.axios({
        url: url,
        method: "POST",
        data: {
          name: $("#name").val(),
          password: $("#password").val(),
          role: this.radio,
        },
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message({
            message: "登陆成功",
            type: "success",
          });
          //  *************修改后***************************
          sessionStorage.setItem("role", this.radio);
          sessionStorage.setItem("username", $("#name").val());
          this.$router.push({
            path: "/a45963add6c56959057c91f5b9b1d577",
          });
          //  *************修改前***************************
          // if (
          //   res.data.role_data.role_data == "admin" ||
          //   res.data.role_data.role_data == "professor"
          // ) {
          //
          //   this.$router.push({
          //     // path: "/navo"
          //       path: "/a45963add6c56959057c91f5b9b1d577"
          //   });
          // } else if (res.data.role_data.role_data == "common_user") {
          //     that.timer = setInterval(() => {that.zhi()}, 6000);
          // }
        } else if (res.data.code == 403) {
          this.$message.error("非常抱歉，有人正在体验中，请稍后再试");
          this.$router.push({
            path: "/a45963add6c56959057c91f5b9b1d577",
          });
        } else {
          this.$message.error(res.data.mes);
          this.$router.push({
            path: "/a45963add6c56959057c91f5b9b1d577",
          });
        }
      });
    },
    //注册按钮跳转
    zhuce() {
      this.$router.push({
        path: "/zhuce",
      });
    },
    // 排队功能函数
    zhi() {
      this.axios({
        url: this.queuingSystem,
        method: "POST",
        data: {
          name: sessionStorage.getItem("username"),
          role: sessionStorage.getItem("role"),
        },
      }).then((res) => {
        if (res.data.code == 403) {
          this.$message.error("排队中!");
        } else {
          this.$router.push({
            path: "/a45963add6c56959057c91f5b9b1d577",
          });
          clearInterval(that.timer);
        }
      });
    },
  },
  created() {
    var that = this;
    var flag = true;

    // fn()
    function fn() {
      if (flag == true) {
        that.$router.go(0);
        flag = false;
      }
    }
    //访问api.json
    this.axios({
      url: "./../../static/api.json",
      method: "get",
    }).then((res) => {
      var ssr = res.data;
      this.base = res.data.base;
      this.login = res.data.login;
      this.url = this.base + this.login;
      this.queuingSystem = this.base + res.data.queuing_system;
    });
  },
  mounted() {
    //记录用户
    if (localStorage.pagecount) {
      localStorage.pagecount = Number(localStorage.pagecount) + 1;
    } else {
      localStorage.pagecount = 331;
    }
    $(".log-cc").html("您是第" + localStorage.pagecount + "位访问用户");

    $("#name").val(this.$route.query.user);
    $("#password").val(this.$route.query.user);
    this.radio = this.$route.query.role;
    this.logIn();
  },
  destroyed() {
    let that = this;
    //跳转关闭间接调用
    clearInterval(that.timer);
  },
};
</script>

<style lang="scss" scoped>
.log-cc {
  background: none;
  color: rgba(123, 134, 164, 1);
  position: fixed;
  text-align: center;
  font-size: 18px;
  width: 100%;
  bottom: 2%;
}
#zhuce {
  outline: none;
  border: 0;
  background: none;
  width: 80%;
  text-align: left;
  color: gray;
}
.hello {
  width: 100%;
  height: 100%;
  /*background: linear-gradient(0deg, rgba(30, 31, 42, 1), rgba(61, 64, 84, 1));*/
  background-image: url("./../../static/yy.png");
  background-size: 100% 100%;
  transform: scale(1);
  background-repeat: no-repeat;
  .form-signin {
    width: 52.28%;
    height: 77.78%;
    display: flex;
    position: relative;
    left: 24%;
    top: 12%;
    .left {
      width: 50%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      background: rgba(255, 255, 255, 1);
      .fom {
        width: 80%;
        margin-top: 20%;
        margin-left: 8%;
        input {
          outline: none;
          background: none;
        }
        .btn {
          width: 10rem;
          background: linear-gradient(
            90deg,
            rgba(74, 171, 255, 1),
            rgba(0, 202, 193, 1)
          );
          border-radius: 4px;
          border: 0;
        }
      }

      .fot {
        width: 100%;
        margin-top: 35%;
        padding-left: 4%;
        p {
          color: gray;
        }
      }
    }
  }
}
.el-radio-group {
  .el-radio {
    margin-right: 10px;
    .el-radio__label {
      padding-left: 0px;
    }
  }
}
</style>
