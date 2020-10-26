<template>
  <div class="live-broadcast">
    <!-- 头部 -->
    <m-header />
    <!-- 主题部分 -->
    <!-- <main :style="{ height: bodyheight + 'px' }"> -->
    <main>
      <div class="container">
        <div class="fltoutbox left-box">
          <h3 class="title">{{ language.task_list }}</h3>
          <div class="search-box">
            <input class="search-input" v-model.trim="taskid" type="text" />
            <el-button @click="search">{{ language.search_btn }}</el-button>
          </div>
          <div>
            <ul class="result-list">
              <li
                v-for="(item, index) of resultListData"
                :key="index"
                :class="{ odd: index % 2 == 1 }"
                @click="getResult(item.task_id)"
              >
                {{ item.task_name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="fltoutbox right-box">
          <h3 class="title">{{ language.list_title }}</h3>
          <div class="right-box-content">
            <div>
              <!-- <img class="right-box-img" src="../../../static/2.png" alt="" /> -->
              <el-carousel indicator-position="outside">
                <el-carousel-item
                  v-for="(item, index) in resultData.pic_info_list"
                  :key="index"
                >
                  <img :src="item.pic_url" class="right-box-img" alt="" />
                </el-carousel-item>
              </el-carousel>
              <div>
                <p class="right-box-text">{{ resultText }}</p>
              </div>
            </div>
            <div class="pagination" v-if="total !== 0">
              <el-pagination
                ref="pagination"
                background
                :prev-text="language.previous"
                :next-text="language.next"
                layout="slot, prev, pager, next, slot"
                @current-change="handleCurrentChange"
                @prev-click="prevClick"
                @next-click="nextClick"
                :current-page="currpage"
                :page-size="1"
                :total="total"
              >
                <el-button
                  type="button"
                  @click="jumpFirstPage"
                  class="my-btn first-page-btn btn-prev"
                  >{{ language.first }}</el-button
                >
                <el-button
                  type="button"
                  @click="jumpLastPage"
                  class="my-btn btn-prev last-page-btn"
                  >{{ language.last }}</el-button
                >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import mHeader from "../globalComponents/header";
import Language from "../../../static/Language";
export default {
  components: {
    mHeader,
  },
  data() {
    return {
      //   bodyheight: document.body.clientHeight - 70,
      taskid: "", // 查询数据
      resultListData: [], // 左侧列表
      configUrl: "",
      resultListApi: "",
      resultApi: "",
      total: 0,
      currpage: 1,
      page: 1,
      language: {},
      result: [], // 右侧数据列表
      text_url: "", // 右侧文本url
      picInfoList: [], // 右侧图片list
      resultData: {}, // 右侧展示数据
      resultText: "",
    };
  },
  created() {
    let sLanguage = sessionStorage.getItem("language");
    if (sLanguage) {
      if (sLanguage === "cn") this.language = Language.Language["cnText"];
      else this.language = Language.Language["enText"];
    } else {
      this.language = Language.Language["cnText"];
    }
    //请求api.json
    this.axios({
      url: "./../../../static/api.json",
      method: "get",
    }).then((res) => {
      this.configUrl =
        // process.env.NODE_ENV === "production" ? "" : res.data.configUrl;
        process.env.NODE_ENV === "production"
          ? "http://49.234.136.17"
          : res.data.configUrl;
      this.resultListApi = res.data.resultListApi;
      this.resultApi = res.data.resultApi;
      this.getResultList("userid_demo");
      // 为了展示数据，暂时先调用
      //   this.getResult();
    });
  },
  methods: {
    /**
     * @description 获取左侧列表
     * @param {String} 查询id
     */
    getResultList(user_id) {
      console.log(this.configUrl);
      console.log(this.resultListApi);
      this.axios({
        url: this.configUrl + this.resultListApi,
        method: "post",
        data: {
          user_id: user_id,
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.resultListData = res.data.data;
        }
      });
    },
    /**
     * @description 查询按钮
     */
    search() {
      this.getResultList(this.taskid);
    },
    /**
     * @description 页数点击
     */
    handleCurrentChange(val) {
      this.page = val;
      this.resultData = this.result[this.page - 1];
      this.getText();
    },
    /**
     * @description 上一页
     */
    prevClick() {
      this.page = this.page - 1;
      this.resultData = this.result[this.page - 1];
      this.getText();
    },
    /**
     * @description 下一页
     */
    nextClick() {
      this.page = this.page + 1;
      this.resultData = this.result[this.page - 1];
      this.getText();
    },
    /**
     * @description 首页
     */
    jumpFirstPage() {
      this.$refs.pagination.handleCurrentChange(1);
      this.$emit("handleCurrentChange", 1);
      this.page = 1;
      this.resultData = this.result[this.page - 1];
      this.getText();
    },
    /**
     * @description 尾页
     */
    jumpLastPage() {
      let font = this.$refs.pagination;
      let cpage = Math.ceil(font.total / font.pageSize);
      font.handleCurrentChange(cpage);
      this.page = this.result.length - 1;
      this.resultData = this.result[this.page - 1];
      this.getText();
    },
    /**
     * @description 获取右侧数据
     * @param {String} 左侧当前点击数据id
     */
    getResult(taskId) {
      this.axios({
        url: this.configUrl + this.resultApi,
        method: "post",
        data: {
          task_id: "taskid_test",
        },
      }).then((res) => {
        if (res.data.code === 20000) {
          this.result = res.data.data;
          if (this.result.length > 0) {
            this.total = this.result.length;
            this.resultData = this.result[0];
            this.picInfoList = this.result[0].pic_info_list;
            this.getText();
            // this.getText(this.result[0])
          }
        }
      });
    },
    getText() {
      this.axios({
        url:
          this.configUrl +
          this.resultData.text_url.split("/").splice(3).join("/"),
        method: "get",
        // responseType: "blob",
      }).then((res) => {
        this.resultText = res.data;
      });
    },
  },
};
</script>
<style>
.el-input__inner {
  background-color: rgba(79, 105, 127, 0);
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #072951;
  border: 1px solid #4b8df8;
  color: #fff;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  font-size: 14px;
  background: #ffffff1a;
  border: 1px solid #c5b7b7;
  color: #fff;
  text-decoration: none;
  height: 35px;
  line-height: 35px;
  min-width: 40px;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  border-color: #081832;
  color: #fff;
}
.el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  height: 35px;
  line-height: 35px;
  min-width: 40px;
  padding: 0 5px;
}
</style>
<style scoped>
.live-broadcast {
  height: 100%;
}
main {
  background-color: #020712;
  margin: 0;
  background: #2c4255;
  height: 100%;
  padding-top: 70px;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
}
.fltoutbox {
  background-color: rgba(79, 105, 127, 0.4);
  padding: 10px;
  margin-top: 30px;
  /* height: 96%; */
}
.left-box {
  flex: 1;
  margin-right: 20px;
}
.right-box {
  flex: 2.8;
  text-align: center;
}
.title {
  color: #fff;
  line-height: 40px;
  margin-left: 35px;
  text-align: left;
}
.search-box {
  margin-bottom: 10px;
  height: 50px;
}
.search-input {
  width: 70%;
  border: 1px solid #0e94ea;
  background-color: rgba(79, 105, 127, 0);
  height: 100%;
  color: #fff;
  font-weight: bolder;
  text-indent: 10px;
}

.el-button {
  height: 100%;
  width: 25%;
  background: #0e94ea;
  border: 1px solid #0e94ea;
  color: #fff;
}
.result-list {
  width: 96%;
}
.result-list li {
  text-align: center;
  color: #fff;
  font-weight: bolder;
  font-size: 16px;
  cursor: pointer;
  padding: 12px 6px;
}
.odd {
  background: #1f223c;
}
.right-box-content {
  width: 85%;
  margin: 0 auto;
}
.right-box-img {
  width: 100%;
  height: 100%;
  /* height: 300px; */
}
.right-box-text {
  margin-top: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: bolder;
  text-align: left;
  text-indent: 2em;
}
.pagination {
  width: 100%;
  position: relative;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #072951;
  border-color: #4b8df8;
  color: #fff;
}
.el-pagination > slot:nth-last-child(1) .first-page-btn {
  display: none;
}
.el-pagination > slot:nth-child(1) .last-page-btn {
  display: none;
}
.my-btn {
  line-height: 35px;
  width: 40px;
  padding: 0 5px;
  background: #ffffff1a;
  border: 1px solid #c5b7b7;
}
</style>
