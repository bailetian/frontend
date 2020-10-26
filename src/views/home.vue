<template>
  <div>
    <!-- 头部 -->
    <m-header />
    <!-- 主题部分 -->
    <main>
      <div class="container">
        <div class="fltoutbox left-box">
          <h3 class="title">{{ language.title }}</h3>
          <div class="left-box-content">
            <em>2012-10-23 10:52:00</em>
            <div>
              <span class="content-network">央视网：</span>
              <span class="content-text"
                >主持人以其母亲曾经对美国的期待作总结，本场辩论结束。</span
              >
            </div>
            <img src="../../static/2.png" alt="" />
          </div>
          <div class="left-box-content">
            <em>2012-10-23 10:52:00</em>
            <div>
              <span class="content-network">央视网：</span>
              <span class="content-text"
                >主持人以其母亲曾经对美国的期待作总结，本场辩论结束。</span
              >
            </div>
            <img src="../../static/2.png" alt="" />
          </div>
          <div class="left-box-content">
            <em>2012-10-23 10:52:00</em>
            <div>
              <span class="content-network">央视网：</span>
              <span class="content-text"
                >主持人以其母亲曾经对美国的期待作总结，本场辩论结束。</span
              >
            </div>
          </div>
        </div>
        <div class="fltoutbox right-box">
          <video id="video" controls="controls">
            <source src="https://www.bilibili.com/video/av32896976?t=164" />
          </video>
          <div id="output"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import mHeader from "./globalComponents/header";
import Language from "../../static/Language";
export default {
  components: {
    mHeader,
  },
  data() {
    return {
      bodyheight: document.body.clientHeight - 70,
      language: {},
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
    this.$nextTick(() => {
      this.getImage();
    });
  },
  methods: {
    getImage() {
      var video, output;
      var scale = 0.3;
      var initialize = function () {
        output = document.getElementById("output");
        video = document.getElementById("video");
        video.addEventListener("click", captureImage);
      };

      var captureImage = function () {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);

        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        output.appendChild(img);
      };

      initialize();
    },
  },
};
</script>

<style scoped>
main {
  background-color: #020712;
  margin: 0;
  font-family: "Microsoft YaHei";
  font-weight: lighter;
  background: #2c4255;
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
}
.title {
  color: #fff;
  line-height: 40px;
  margin-left: 35px;
  text-align: left;
}
.left-box-content {
  color: #fff;
  font-size: 16px;
  margin-top: 25px;
}
.left-box-content .content-network {
  font-weight: bold;
}
.left-box-content img {
  width: 95%;
}
</style>
