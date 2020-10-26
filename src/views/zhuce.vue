<template>
<div class="hello">
  <div class="form-signin">
    <div class="left">
      <img src="../assets/login.jpg" alt />
    </div>
    <div class="right">
      <div class="fom">
        <h2 class="form-signin-heading">注册系统</h2><br>
        <input type="text" class="form-control" placeholder="账号" autofocus id="name" />
        <br />
        <input type="password" class="form-control" placeholder="密码" id="password" />
        <br />
	 <el-radio-group v-model="radio">
		<el-radio label="admin">管理员</el-radio>
  		<el-radio label="professor">领域专家</el-radio>
  		<el-radio label="common_user">用户</el-radio>
	 </el-radio-group>
        <div style="height: 20px;width: 300px;"></div>
        <button class="btn btn-lg btn-primary btn-block" type="submit" @click="logIn">注册</button>
        <br />
      </div>
      <div class="fot">
        <h4>联系我们</h4>
        <p>北京市 海淀区 中关村东路1号院 清华科技园创新大厦 A座10层1002</p>
        <p>+86 10 64303888</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    radio: "",
    base:'',
    zhuce:''
	};
  },
  created(){
    this.axios({
      url:'./../../static/api.json',
      method:'get'
    }).then((res)=>{
      this.base=res.data.base
      this.zhuce=res.data.zhuce
    })
  },
  methods: {
    logIn() {
      //console.log($("#name").val())
      //console.log($("#password").val())
      //console.log($('input[name="manKindA"]:checked').val())

      this.axios({
        // url: "/api/register/",
        url:this.base+this.zhuce,
        method: "POST",
        data: {
          name: $("#name").val(),
          password: $("#password").val(),
          role: this.radio
        }
      }).then(res => {
        // console.log(res.data);
        if (res.data.code == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            path: "/login"
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.hello{
	width: 100%;
		height: 100%;
		// background:linear-gradient(0deg,rgba(30,31,42,1),rgba(61,64,84,1));
    background-image: url('../../static/yy.png');
  background-size: 100% 100%;
}
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
      margin-top: 45%;
      padding-left: 8%;
      p {
        color: gray;
      }
    }
  }
}
</style>
