<template>
  <!-- 头部 -->
  <header class="header">
    <a href="javascript:;">
      <img src="../../../static/img/logo1.png" alt="" />
    </a>
    <div class="header-content">
      <router-link to="/liveBroadcast" tag="a" class="liveBroadcast">{{
        languageData.live
      }}</router-link>
      <a href="javascript:;" v-if="!username" @click="login">{{
        languageData.login
      }}</a>
      <a href="javascript:;" v-if="username" @click="out">{{
        languageData.logout
      }}</a>
      <a href="javascript:;">{{ username }}</a>
      <a href="javascript:;" @click="changeLanguage">中/En</a>
    </div>
  </header>
</template>

<script>
import Language from "../../../static/Language";
export default {
  created() {
    // this.language = Language.defaultLanguage;
    // sessionStorage.setItem("language", "cn");
    this.username = sessionStorage.getItem("username");
    this.sLanguage = sessionStorage.getItem("language");
    if (this.sLanguage) {
      if (this.sLanguage === "cn")
        this.languageData = Language.Language["cnText"];
      else this.languageData = Language.Language["enText"];
    } else {
      this.languageData = Language.Language["cnText"];
    }
    this.axios({
      url: "./../../../static/api.json",
      method: "get",
    }).then((res) => {
      this.base = res.data.base;
      this.logout = res.data.logout;
    });
  },
  data() {
    return {
      language: "",
      languageData: {},
      base: "",
      logout: "",
      username: "",
    };
  },
  methods: {
    changeLanguage() {
      if (this.sLanguage === "cn") {
        this.language = "en";
      } else if ((this.sLanguage = "en")) {
        this.language = "cn";
      } else {
        this.language = "cn";
      }
      sessionStorage.setItem("language", this.language);
      window.location.reload();
    },
    login() {
      this.$router.push("/login");
    },
    out() {
      this.axios({
        url: this.base + this.logout,
        method: "post",
        data: {
          name: this.username,
          role: this.use,
        },
      }).then((res) => {
        console.log(res);
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("role");
        window.location.href = "https://mip.mininglamp.com/#id=k0ouxt&p=login";
        // this.$router.push(this.$route.path);
        // this.username = ''
        // this.use = ''
        // this.list = [
        //     // { name: "Hao图谱", router: "/a45963add6c56959057c91f5b9b1d577", in: "" },
        //     { name: "Hao预测", router: "/cast", in: "" },
        //     { name: "关于", router: "/about", in: "" },
        //     { name: "登录", router: "/login", in: "item" }
        // ]
        // window.location.reload()
      });
    },
  },
};
</script>

<style scoped>
.header {
  height: 70px;
  background: #333;
  font-weight: bold;
  font-size: 34px;
  position: fixed;
  top: 0;
  width: 100%;
}
img {
  height: 60px;
  margin: 5px 0px 0px 15px;
}
.header-content {
  float: right;
  margin-right: 30px;
  font-size: 16px;
  line-height: 70px;
}
.header-content a {
  color: #fff;
  margin-left: 20px;
  text-decoration: none;
}
</style>
