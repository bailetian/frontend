<template>
  <div>
    <div class="new-head">
      <p>
        <img src="../../static/1.png" alt />
      </p>
      <ul v-for="(item, index) in list" :key="index">
        <li v-if="item.in === ''" :class="item.in">
          <router-link @click.native="flushCom" :to="item.router">{{
            item.name
          }}</router-link>
        </li>
        <li v-if="item.in === 'item'" :class="item.in" @click="logOut(index)">
          <span v-if="!!username" class="username-label">{{ username }}</span>
          <span class="logout-btn" @click.native="flushCom">{{
            item.name
          }}</span>
        </li>
      </ul>
      <!-- <router-link to="/login">
          <li class="new-li" style="border-left:1px solid gray;">退出</li>
      </router-link>-->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      use: "",
      txt: "",
      base: "",
      logout: "",
      username: "",
      list: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$router.replace(from.path);
    });
  },
  methods: {
    rout() {
      // console.log(this)
      // if (this.use == "common_user") {
      //   this.$router.push("/a45963add6c56959057c91f5b9b1d577");
      // } else {
      //   this.$router.push("/navo");
      // }
    },
    flushCom() {
      this.rout();
      this.$router.go(0);
    },
    logOut(index) {
      // let role=sessionStorage.getItem("token")
      // console.log(this.list[index]);
      if (this.list[index].name === "退出") {
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
          window.location.href =
            "https://mip.mininglamp.com/#id=k0ouxt&p=login";
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
      } else if (this.list[index].name == "登录") {
        // window.location.href = "https://mip.mininglamp.com/#id=k0ouxt&p=login";
        this.$router.push("/login");
      } else if (this.list[index].in == "none") {
        console.log(this.$router);
        alert("正在开发,敬请期待....");
        this.$router.push(this.$route.path);
      } else {
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.username = sessionStorage.getItem("username");
    this.use = sessionStorage.getItem("token");
    this.list = [
      { name: "关于", router: "/about", in: "" },
      {
        name: this.username ? "退出" : "登录",
        router: this.username ? "/" : "/login",
        in: "item",
      },
    ];
    this.axios({
      url: "./../../static/api.json",
      method: "get",
    }).then((res) => {
      this.base = res.data.base;
      this.logout = res.data.logout;
    });
  },
};
</script>
<style lang="less">
.new-head {
  z-index: 10;
  width: 100%;
  height: 60px;
  background: rgba(55, 57, 71, 0.5);
  display: flex;
  position: fixed;
  top: 0;
  p {
    margin: 0;
    width: 85%;
    img {
      height: 100%;
    }
  }
  ul {
    width: 4rem;
    height: 100%;
    display: flex;
    line-height: 64px;
    margin: 0;
    z-index: 10000;
    li {
      width: 100%;
      text-align: center;
    }
    li a {
      flex: 1;
      width: 4rem;
      text-align: center;
      height: 100%;
      color: #a6abbd;
      cursor: pointer;
      outline: none;
      text-decoration: none;
    }
    li a:hover {
      color: #fff;
    }
    .item {
      border-left: 1px solid gray;
    }

    .logout-btn {
      color: #a6abbd;
      cursor: pointer;

      &:hover {
        color: #ffffff;
      }
    }

    .username-label {
      margin-right: 16px;
      color: #ffffff;
    }
  }
}
</style>
