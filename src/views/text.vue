<template>
  <div id="container">
    <!-- <div class="assassin" style="position:fixed;top:0;left:0;z-index:1000000;color:#fff;border:solid 1px">获取</div> -->
    <div class="buju">
      <n-ews></n-ews>
      <div class="yy-imga" id="player">
        <ul>
          <li></li>
        </ul>
      </div>
      <p class="yy-p">没有数据</p>
      <div class="loading1">
        <button id="zanting">暂停</button>
        <button class="yy-btn1" id="btn1">Stop</button>
        <button class="clear1">清除</button>
      </div>
      <el-popover
        placement="bottom"
        class="yy-neirong"
        trigger="click"
        :content="msg"
        v-model="visible"
        width="300"
      >
        <el-button slot="reference">文本详情</el-button>
      </el-popover>
    </div>
    <div class="sy-yy">
      <div class="left">
        <el-scrollbar style="height: 100%">
          <ul></ul>
        </el-scrollbar>
      </div>
      <div class="asd1">
        <li>{{ time }}</li>
        <li>{{ gettime }}</li>
        <li>{{ circle }}</li>
        <li>{{ diamond }}</li>
        <li>{{ box }}</li>
        <li>{{ links }}</li>
      </div>
      <div id="mynetwork"></div>
      <div class="custom-menu">
        <ul>
          <li class="top">显示软文</li>
        </ul>
      </div>
      <font></font>
    </div>
  </div>
</template>
<script type="text/javascript">
import nEws from "@/assets/head.vue";
import vis from "@/assets/vis.js";
import "@/assets/vis.css";
export default {
  data() {
    return {
      visible: false,
      flag: true,
      msg: "",
      url: "1",
      record: null,
      clickurl: "",
      clickyy: "",
      ws: null,
      num: 1,
      str: "",
      timer: null,
      timer1: null,
      strr: null,
      str1: "",
      att: [],
      httpurl1: "",
      time: "",
      gettime: "",
      circle: "",
      diamond: "",
      box: "",
      links: "",
    };
  },
  components: {
    nEws,
  },
  created() {
    this.fnnd();
  },
  methods: {
    fnn(a, b) {
      var nodeId = a;
      var options = {
        scale: 1,
        offset: { x: 0, y: 0 },
        animation: {
          duration: 50,
          easingFunction: "linear",
        },
      };
      b.focus(nodeId, options);
    },
    fnnd() {
      this.axios({
        url: "./../../static/api.json",
        method: "get",
      }).then((res) => {
        this.newurl = res.data.audio_url1;
        this.base = res.data.base;
        this.clickurl = res.data.yyclick;
        this.clickyy = res.data.clickyy;
        this.httpurl1 = res.data.https_url1;
      });
    },
    fitAnimated(a) {
      var offsetx = 300;
      var offsety = 300;
      var duration = 1000;
      var easingFunction = "easeOutQuad";
      var options = {
        offset: {
          x: offsetx,
          y: offsety,
        },
        duration: duration,
        easingFunction: easingFunction,
      };
      a.fit({
        animation: options,
      });
    },
    clickkill(a) {
      this.axios({
        url: this.base + this.clickurl,
        method: "post",
        data: a,
      }).then((res) => {
        this.strr = res.data.datas;
        let that = this;
        if (this.strr[0].item.length == 0) {
          that.num = 1;
        } else {
          $(".left").css("border-right", "1px solid gray");
          $(".el-scrollbar__view").append("<ul />");
          for (const i in this.strr[0].item) {
            $(".el-scrollbar__view ul").append(
              "<li>" +
                this.strr[0].item[i].key +
                ":" +
                this.strr[0].item[i].value +
                "</li>"
            );
          }
        }
      });
    },
    rightclick(a, b) {
      this.axios({
        url: this.base + this.clickyy,
        method: "post",
        data: {
          text: a,
        },
      }).then((res) => {
        var ai = res.data.data;
        $("font").show(1);
        $("font").css(b);
        $("font").text(ai.data);
      });
    },
  },
  mounted() {
    $(".yy-imga ul li").css(
      "line-height",
      $(".yy-imga ul li").height() - 55 + "px"
    );
    $(".yy-imga ul li").css(
      "font-size",
      parseFloat($("html").css("font-size")) + 5 + "px"
    );
    var that = this;
    var number = "";
    var tim = setInterval(function () {
      if (that.newurl == undefined) {
      } else {
        stop();
        webSocket(that.newurl);
        clearInterval(tim);
      }
    }, 100);
    var arr = [];
    var network = null;
    var nodearr = [];
    var newarr = {};
    var flag = true;
    var flag1 = true;
    var a = $(".yy-imga ul").width();
    var nodes, edges, network;
    function webSocket(url) {
      that.flag = true;
      that.ws = new WebSocket(url);
      that.timer1 = setInterval(function () {
        if (that.ws.readyState == 3) {
          if (that.flag == true) {
            webSocket(that.newurl);
          } else {
            that.ws.close();
          }
        } else if (that.ws.readyState == 1) {
          that.ws.send("ok");
        } else if (that.ws.readyState == 2) {
          that.ws.close();
          clearInterval(that.timer1);
        }
      }, 1000);
      that.ws.onopen = function () {
        console.log("ok");
        if (that.ws.readyState != 1) {
          console.log("no");
        }
      };
      that.ws.onmessage = function (msg) {
        var arr = [];
        var node = null;
        var link = null;
        arr = JSON.parse(msg.data);
        if (arr.text == undefined) {
          arr.text = "";
        }
        if (arr.score != undefined) {
          that.time = arr.score;
        }
        if (arr.response_time != undefined) {
          that.gettime = arr.response_time;
        }
        if (arr.count_circle != undefined) {
          that.circle = arr.count_circle;
        }
        if (arr.count_diamond != undefined) {
          that.diamond = arr.count_diamond;
        }
        if (arr.count_box != undefined) {
          that.box = arr.count_box;
        }
        if (arr.count_links != undefined) {
          that.links = arr.count_links;
        }
        that.msg += arr.text;
        that.str += arr.text;
        node = arr.nodes;
        link = arr.links;
        if (arr.code == 200) {
          if (arr.nodes.length >= 0 || arr.links.length >= 0) {
            $(".loading1").show(1000);
            $(".yy-btn").hide(1000);
            $(".buju").attr("class", "buju1");
            $(".yy-p").hide(1000);
            $(".sy-yy").css("opacity", "1");
            $(".yy-neirong").show(1000);
            $(".yy-imga").show(10);

            if (node.length != 0) {
              // newarr.nodes.push(node)
              nodearr.push(node[0]);
              addNode();
            } else if (link.length != 0) {
              // newarr.links.push(link)
              addEdge();
            } else if (node.length != 0 || link.length != 0) {
              nodearr.push(node[0]);
              // newarr.nodes.push(node)
              // newarr.links.push(link)
              addEdge();
              addNode();
            }

            if (arr.links.length != 0) {
              that.att.push(arr.links[0]);
            }

            function addNode() {
              try {
                // for (const i in nodearr) {
                if (nodes.get(node[0].id) != null) {
                  // node[0].color = "rgba(0,0,0,0.3)"
                  nodes.update([node[0]]);
                } else {
                  nodes.add(node);
                }
                // }
              } catch (err) {
                console.log(err);
              }
            }

            function addEdge() {
              try {
                if (edges.get(link[0]) != null) {
                  // node[0].color = "rgba(0,0,0,0.3)"
                  edges.update([link[0]]);
                } else {
                  edges.add(link);
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        } else if (arr.code == 500) {
          alert("断开连接，正在重连" + arr.code);
          stop();
          webSocket(that.newurl);
        } else {
          number = 1;
        }
      };
      that.timer = setInterval(function () {
        //	    	b =
        var arr0 = that.str.split("undefined");
        var arr1 = arr0.join("");
        var arr = arr1.split("");
        var newa = arr.splice(0, 2);
        that.str = arr.join("");
        that.str1 += newa.join("");
        var b = "";
        if ($(".yy-imga ul li").width() > $(".yy-imga ul").width() - 5) {
          b = that.str1.split("");
          b.splice(0, 1);
          that.str1 = b.join("");
        }
        $(".yy-imga ul li").html(that.str1);
      }, 100);

      that.ws.onclose = function (evt) {
        console.log("on");
      };
      $("#zanting").show(500);
      $("#btn").html("Stop");
      $("#btn").attr("id", "btn1");
    }
    $(function () {
      // create an array with nodes

      nodes = new vis.DataSet();
      edges = new vis.DataSet();
      var taht = this;
      // create a network
      var container = document.getElementById("mynetwork");
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        nodes: {
          // shape: "circle",
          // size: 5,
          borderWidth: 0,
          font: {
            size: 14,
            color: "#fff",
          },
          widthConstraint: {
            minimum: 30,
            maximum: 60,
          },
          // color: {
          //   background:"linear-gradient(360deg,rgba(0,202,193,1) 0%,rgba(136,230,130,1) 100%);"
          // },
          shadow: true,
        },
        edges: {
          width: 2,
          length: 100,
          labelHighlightBold: false,
        },
        physics: {
          enabled: true,
        },
      };
      network = new vis.Network(container, data, options);
      network.on("click", function (params) {
        $("font").hide(1);
        $(".custom-menu").hide(1);
        var item = null;
        if (params.nodes.length != 0) {
          $(".el-scrollbar__view ul").remove();
          nodes.get(params.nodes[0]);
          item = {
            mongo_id: nodes.get(params.nodes[0]).id,
            mongo_name: nodes.get(params.nodes[0]).label,
          };
          that.clickkill(item);
        }
      });
      var n = "";
      network.on("oncontext", function (params) {
        n = "";
        $("font").hide(1);
        params.event.preventDefault();
        if (network.getNodeAt(params.pointer.DOM) != undefined) {
          $(".custom-menu").hide(1);
          var top = {
            top: params.event.pageY + "px",
            left: params.event.pageX + "px",
          };
          $(".custom-menu").finish().toggle(1);
          $(".custom-menu").css(top);
          n = nodes.get(network.getNodeAt(params.pointer.DOM)).label;
          for (var i = 0; i < that.att.length; i++) {
            if (that.att[i].from == network.getNodeAt(params.pointer.DOM)) {
              n += nodes.get(that.att[i].to).label;
            } else if (
              that.att[i].to == network.getNodeAt(params.pointer.DOM)
            ) {
              n += nodes.get(that.att[i].from).label;
            }
          }
          $(".custom-menu ul li")
            .off("click")
            .on("click", function () {
              $(".custom-menu").hide(1);
              that.rightclick(n, top);
            });
        }
      });
      if (that.msg.length > 500) {
        var a = that.msg.split("");
        a.splice(0, a.length - 500);
        that.msg = a.join("");
      }
    });
    /*
     * 开始对讲
     */
    document.querySelector("#btn1").addEventListener("click", function () {
      flag1 = !flag1;
      if (flag1 == false) {
        stop();
      } else if (flag1 == true) {
        nodes.clear();
        edges.clear();
        that.msg = "";
        that.str = "";
        that.str1 = "";
        var aee = "";
        $(".yy-imga ul li").html(aee);
        $(".el-scrollbar__view ul").remove();
        $(".el-scrollbar__view").append("<ul />");
        $.get(that.base + that.httpurl1, { text: "is_clear" }, function (
          res
        ) {});
        webSocket(that.newurl);
      }
    });
    $(".clear1").click(function () {
      nodes.clear();
      edges.clear();
      that.msg = "";
      that.str = "";
      that.str1 = "";
      var aee = "";
      $(".yy-imga ul li").html(aee);
      $(".el-scrollbar__view ul").remove();
      $(".el-scrollbar__view").append("<ul />");
      $.get(that.base + that.httpurl1, { text: "is_clear" }, function (res) {});
    });

    function stop() {
      that.flag = false;
      $(".wave").hide(50);
      that.num++;
      if (that.ws) {
        that.ws.send("over");
        clearInterval(that.timer);
        clearInterval(that.timer1);
        $.get(that.base + that.httpurl1, { text: "stop" }, function (res) {});
        that.ws.close();
        console.log("关闭对讲以及WebSocket");
        that.fitAnimated(network);
      }
      $("#btn1").html("Restart");
      $("#btn1").attr("id", "btn");
      $("#zanting").hide(500);
    }
  },
  destroyed() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
    this.ws.close();
  },
};
</script>
<style type="text/css" lang="less">
.wave {
  width: 70%;
  height: 30%;
  // background: #fff;
  position: absolute;
  left: 21%;
  top: 40%;
}

.jixu {
  width: 100px;
  height: 50px;
  position: fixed;
  left: 45%;
  top: 7.5%;
  display: none;
  cursor: pointer;
  text-align: center;
  line-height: 50px;
  color: #fff;
  .el-button--warning.is-plain {
    background: linear-gradient(
      360deg,
      rgba(14, 86, 160, 1) 0%,
      rgba(74, 171, 255, 1) 100%
    );
    border: none;
    color: #fff;
  }
}

.imgab {
  position: fixed;
  top: 1px;
  left: 1px;
}

.sy-yy {
  width: 100%;
  height: 89%;
  // background: #394251;
  // border: solid 3px rgba(80, 86, 101, 1);
  margin: 50px 0% 1%;
  opacity: 0;
  position: relative;
  display: flex;
  z-index: 11;
  .left {
    width: 20%;
    height: 100%;
    color: lightgrey;
    z-index: 1000;
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .el-scrollbar__view ul li {
      height: auto;
      line-height: 30px;
      border-bottom: 1px dashed gray;
      padding: 0 10px;
    }
    button {
      background: none;
      border: 1px solid;
      margin-left: 20px;
    }
  }
  .custom-menu {
    width: 70px;
    height: 100px;
    position: fixed;
    background: #555;
    display: none;
    z-index: 100000;
    line-height: 30px;
  }
  font {
    z-index: 100000;
    font-size: 17px;
    color: white;
    position: fixed;
    left: 0;
    top: 0;
    display: none;
    background: #666;
    border: solid 1px;
    border-radius: 5px;
  }
  .custom-menu ul {
    width: 100%;
    background: #555;
    list-style: none;
    margin: 0;
    padding: 0;
    color: #fff;
    .custom-menu ul .top {
      height: 40px;
      line-height: 30px;
    }
  }
  .custom-menu ul .top:hover {
    background: #999;
  }
}

#mynetwork {
  width: 80%;
  height: 100%;
  z-index: 100;
}

.steal {
  width: 40px;
  height: 40px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  opacity: 0;
}

#container {
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
  // background: url(../../static/yy.png);
  // background-size: 100% 100%;
  overflow-y: hidden;
}

.buju1 {
  width: 100%;
  height: 50px;
  display: flex;
}

#tuichu {
  width: 5%;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
  text-align: center;
  position: fixed;
  right: 0;
  top: 10;
  font-size: 16px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: rgba(166, 171, 189, 1);
}

.imga {
  display: none;
  width: 20%;
  position: fixed;
  top: 1%;
  left: 43%;
}
.yy-btn {
  color: white;
  border-radius: 50%;
  width: 450px;
  height: 150px;
  cursor: pointer;
  outline: none;
}
.yy-p {
  width: 100%;
  height: 33px;
  font-size: 24px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  text-align: center;
  padding-top: 130px;
}

.yy-btn1 {
  width: 35%;
  height: 48%;
  line-height: 100%;
  // background: linear-gradient(
  //     360deg,
  //     rgba(14, 86, 160, 1) 0%,
  //     rgba(74, 171, 255, 1) 100%
  // );
  background-color: rgba(79, 105, 127, 0.4);
  border: 1px solid #0e56a0;
  border-radius: 2px;
  // border: 0;
  font-size: 16px;
  font-family: PingFangHK-Medium, PingFangHK;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}

.yyint {
  width: 30%;
  position: fixed;
  left: 40%;
  top: 20px;
}

.loading1 {
  width: 23%;
  height: 10%;
  line-height: 50px;
  text-align: center;
  position: absolute;
  left: 42%;
  top: 0.6%;
  display: none;
  z-index: 100;
  #zanting {
    margin-right: 3%;
    width: 25%;
    height: 48%;
    line-height: 100%;
    background: linear-gradient(
      360deg,
      rgba(14, 86, 160, 1) 0%,
      rgba(74, 171, 255, 1) 100%
    );
    border-radius: 2px;
    border: 0;
    font-size: 16px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
  .clear1 {
    margin-left: 3%;
    width: 20%;
    height: 48%;
    line-height: 100%;
    background: linear-gradient(
      360deg,
      rgba(14, 86, 160, 1) 0%,
      rgba(74, 171, 255, 1) 100%
    );
    border-radius: 2px;
    border: 0;
    font-size: 16px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
}

.yy-neirong {
  z-index: 20;
  position: fixed;
  left: 13%;
  top: 1.5%;
  display: none;
  width: 25%;
  color: white;
  img {
    width: 18px;
    height: 18px;
    position: relative;
    right: -35%;
  }
}

.yy-neirong button {
  width: 80%;
  height: 40px;
  background: rgba(0, 0, 0, 0.4);
  font-size: 20px;
  line-height: 15px;
  color: white;
}

.yy-neirong button i {
  float: right;
  background: 0;
  width: 20px;
  height: 20px;
}
.yy-imga {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: relative;
  z-index: 1;
  display: none;
  ul {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    overflow: hidden;
    margin: 0;
    z-index: 10;
    li {
      float: right;
      line-height: 100%;
      color: #fff;
      height: 98%;
    }
  }
}
.asd1 {
  // height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  list-style: none;
  color: white;
  border: solid 1px gray;
  li {
    text-align: center;
  }
}
</style>
