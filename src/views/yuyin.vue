<template>
  <div id="container">
    <n-ews></n-ews>
    <div class="buju">
      <div class="yy-imga" id="player">
        <ul>
          <li></li>
        </ul>
      </div>
      <!-- <div class="yy-input">
                <img src="../../static/h.gif" class="yy-btn" />
            </div> -->
      <!-- <p class="yy-p">请问，您需要什么帮助？</p> -->
      <!-- <el-popover
                placement="bottom"
                class="yy-neirong"
                trigger="click"
                :content="msg"
                v-model="visible"
                width="300"
            >
                <el-button slot="reference">{{ txt }}</el-button>
            </el-popover> -->

      <div class="jixu"></div>
    </div>
    <div class="sy-yy">
      <div class="left">
        <el-scrollbar style="height: 100%">
          <ul></ul>
        </el-scrollbar>
      </div>

      <div class="loading2">
        <!--<button id="zanting">暂停</button>-->
        <div style="width: 60%; display: inline-block">
          <el-input
            v-model="videoUrl"
            class="video-input"
            placeholder="请输入视频地址"
          ></el-input>
        </div>
        <button class="yy-btn1" @click="videoOption" id="btn1">
          <span v-if="isStart == 'Stop'">{{ language.stop }}</span>
          <span v-if="isStart == 'Start'">{{ language.start }}</span>
          <span v-if="isStart == 'restart'">{{ language.restart }}</span>
        </button>
        <button class="clear">{{ language.clear }}</button>
        <button class="allvis">{{ language.extract }}</button>
        <span class="timeremain-label">{{ formatTimeremain }}</span>
        <video
          id="video1"
          controls="controls"
          width="0"
          muted
          style="margin-top: 15px"
        >
          <source src="" type="video/mp4" />
          <!-- <source src="/example/html5/mov_bbb.ogg" type="video/ogg">
          <source src="/example/html5/mov_bbb.webm" type="video/webm"> -->
        </video>
        <div id="output"></div>
      </div>

      <div class="asd">
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
      <!-- <div class="wave">
                <img src="../../static/s.gif" alt />
            </div> -->
    </div>
  </div>
</template>
<script type="text/javascript">
// import nEws from "@/assets/head.vue";
import nEws from "@/views/globalComponents/header.vue";
import vis from "@/assets/vis.js";
import Language from "../../static/Language";
import "@/assets/vis.css";
export default {
  data() {
    return {
      visible: false,
      msg: "",
      url: "1",
      record: null,
      clickurl: "",
      clickyy: "",
      ws: null,
      num: 1,
      str: "",
      timer: null,
      anode: [],
      strr: null,
      str1: "",
      att: [],
      time: "",
      gettime: "",
      circle: "",
      diamond: "",
      box: "",
      links: "",
      httpurl: "",
      error: true,
      usertimer: "",
      websocket_state: "",
      logout: "",
      use: "",
      flag: false,
      txt: "文本详情",
      timeremain: 0,
      timecheck: "",
      timeupdate: "",
      txtfalg: true,
      updateTimeremainId: null,
      ip: "",
      language: {},
      isStart: "",
      videoUrl: "", // 视频播放地址
    };
  },
  computed: {
    formatTimeremain: function () {
      let ss = this.timeremain % 60;
      let mm = Math.floor(this.timeremain / 60) % 60;
      let hh = Math.floor(this.timeremain / 3600);
      if (ss < 10) {
        ss = "0" + ss;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      if (hh < 10) {
        hh = "0" + hh;
      }
      return hh + ":" + mm + ":" + ss;
    },
  },
  components: {
    nEws,
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
      url: "./../../static/api.json",
      method: "get",
    }).then((res) => {
      this.url = res.data.audio_url;
      this.base = res.data.base;
      this.clickurl = res.data.yyclick;
      this.clickyy = res.data.clickyy;
      this.httpurl = res.data.https_url;
      this.websocket_state = res.data.websocket_state;
      this.timecheck = res.data.timecheck;
      this.timeupdate = res.data.timeupdate;
      this.logout = res.data.logout;
      this.timecheck = this.base + res.data.timecheck;
      this.timeupdate = this.base + res.data.timeupdate;
      this.imgcallback = this.base + res.data.imgcallback;
      this.username = sessionStorage.getItem("username");
    });
  },
  methods: {
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      var dataURL = canvas.toDataURL("image/" + ext);
      return dataURL;
    },
    videoOption() {
      const that = this;
      var i = 0;
      let video = document.getElementById("video1");
      let output = document.getElementById("output");
      if (that.isStart == "Start") {
        video.src = this.videoUrl;
        video.play();

        video.addEventListener(
          "play",
          function () {
            var canvas = document.createElement("canvas");
            i = window.setInterval(function () {
              var img = document.createElement("img");
              canvas.getContext("2d").drawImage(video, 0, 0, 270, 135);
              //ctx.drawImage(v,0,0,270,135);
              img.src = canvas.toDataURL("image/png");
              //output.appendChild(img);
              //   let timeDisplay = Math.floor(video.currentTime);
              console.log(video.currentTime); // 时间
              let imgData = that.getBase64Image(img);
              //   console.log(base64);
              that.imgCallback(video.currentTime, imgData);
            }, 1000);
          },
          false
        );

        that.isStart = "Stop";
      } else {
        video.pause();
        clearInterval(i);
        that.isStart = "Start";
      }
    },
    imgCallback(currentTime, imgData) {
      this.axios({
        url: this.base + '/imgcallback/',
        method: "post",
        data: {
          image: imgData,
          session_id: 1,
          timestamp: currentTime,
        },
      }).then((res) => {
        if (res.data.code == 200) {
        }
      });
    },
    //图自动居中的函数
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
    //节点左击函数
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
    //节点右击函数
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

    // 更新倒计时
    updateDuration() {
      this.axios({
        url: this.timeupdate,
        method: "POST",
        data: {
          name: sessionStorage.getItem("username") || this.ip,
          role: sessionStorage.getItem("role") || "visitor",
          duration: this.timeremain,
        },
      })
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res.data.mes);
          } else {
            console.log(res.data.mes);
          }
        })
        .catch((err) => {
          console.log("更新时间失败！");
        });
    },
  },
  mounted() {
    var that = this;
    var initTimeId = null;
    var isAdmin = sessionStorage.getItem("role") === "admin";

    // var ip = this.ip
    // console.log(ip)
    // var ip = returnCitySN["cip"]
    //获取本机mac地址
    function getUserIP(onNewIP) {
      let MyPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;
      let pc = new MyPeerConnection({
        iceServers: [],
      });
      let noop = () => {};
      let localIPs = {};
      let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
      let iterateIP = (ip) => {
        console.log(ip);
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
      };
      pc.createDataChannel("");
      pc.createOffer()
        .then((sdp) => {
          sdp.sdp.split("\n").forEach(function (line) {
            if (line.indexOf("candidate") < 0) return;
            line.match(ipRegex).forEach(iterateIP);
          });
          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch((reason) => {});
      pc.onicecandidate = (ice) => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    }
    function initStatus() {
      if (initTimeId) {
        clearTimeout(initTimeId);
        initTimeId = null;
      }
      if (that.timecheck) {
        if (isAdmin) {
          that.timeremain = 1;
          ready();
        }
        /*******************默认设置为不自动录音********************/
        tempSetBtnInfo();
        /**********************************************************/
      } else {
        initTimeId = setTimeout(initStatus, 500);
      }
    }
    var number = "";
    var arr = [];
    var network = null;
    var nodearr = [];
    var newarr = {};
    newarr.nodes = [];
    newarr.links = [];
    var begin = document.getElementById("btn");
    var end = document.getElementById("btn1");
    $(".yy-imga ul li").css(
      "line-height",
      $(".yy-imga ul li").height() - 55 + "px"
    );
    $(".yy-imga ul li").css(
      "font-size",
      parseFloat($("html").css("font-size")) + 5 + "px"
    );
    var flag = true;
    // 是否开始录音
    var isRunning = true;
    var btn = document.getElementById("ibtn");
    var a = $(".yy-imga ul").width();

    // $("#zanting").on("click", function() {
    // 	flag = !flag;
    // });

    function init(rec) {
      that.record = rec;
    }

    //录音对象
    var Recorder = function (stream) {
      var sampleBits = 16; //输出采样数位 8, 16
      var sampleRate = 8000; //输出采样率
      var context = new AudioContext();
      var audioInput = context.createMediaStreamSource(stream);
      var recorder = context.createScriptProcessor(4096, 1, 1);
      var audioData = {
        size: 0, //录音文件长度
        buffer: [], //录音缓存
        inputSampleRate: 48000, //输入采样率
        inputSampleBits: 16, //输入采样数位 8, 16
        outputSampleRate: sampleRate, //输出采样数位
        oututSampleBits: sampleBits, //输出采样率
        clear: function () {
          this.buffer = [];
          this.size = 0;
        },
        input: function (data) {
          this.buffer.push(new Float32Array(data));
          this.size += data.length;
        },
        compress: function () {
          //合并压缩
          //合并
          var data = new Float32Array(this.size);
          var offset = 0;
          for (var i = 0; i < this.buffer.length; i++) {
            data.set(this.buffer[i], offset);
            offset += this.buffer[i].length;
          }
          //压缩
          var compression = parseInt(
            this.inputSampleRate / this.outputSampleRate
          );
          var length = data.length / compression;
          var result = new Float32Array(length);
          var index = 0,
            j = 0;
          while (index < length) {
            result[index] = data[j];
            j += compression;
            index++;
          }
          return result;
        },
        encodePCM: function () {
          //这里不对采集到的数据进行其他格式处理，如有需要均交给服务器端处理。
          var sampleRate = Math.min(
            this.inputSampleRate,
            this.outputSampleRate
          );
          var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
          var bytes = this.compress();
          var dataLength = bytes.length * (sampleBits / 8);
          var buffer = new ArrayBuffer(dataLength);
          var data = new DataView(buffer);
          var offset = 0;
          for (var i = 0; i < bytes.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, bytes[i]));
            data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          }
          return new Blob([data]);
        },
      };

      var sendData = function () {
        //对以获取的数据进行处理(分包)
        var reader = new FileReader();
        reader.onload = (e) => {
          var outbuffer = e.target.result;
          var arr = new Int8Array(outbuffer);
          if (arr.length > 0) {
            var tmparr = new Int8Array(1024);
            var j = 0;
            for (var i = 0; i < arr.byteLength; i++) {
              tmparr[j++] = arr[i];
              if ((i + 1) % 1024 == 0) {
                // if(flag == false) {
                // 	$("#zanting").html("继续");
                // } else {
                // 	$("#zanting").html("暂停");
                // 	if(that.ws.readyState === 3) {
                // 		if(that.flag == true) {
                // 			reconnect(that.url);
                // 		}
                // 	} else if(that.ws.readyState === 1) {
                // 		that.ws.send(tmparr);
                // 	}
                // }

                if (that.ws.readyState === 3) {
                  if (that.flag) {
                    reconnect(that.url);
                  }
                } else if (that.ws.readyState === 1) {
                  that.ws.send(tmparr);
                }

                if (arr.byteLength - i - 1 >= 1024) {
                  tmparr = new Int8Array(1024);
                } else {
                  tmparr = new Int8Array(arr.byteLength - i - 1);
                }
                j = 0;
              }
              if (i + 1 == arr.byteLength && (i + 1) % 1024 != 0) {
                // if(flag == false) {
                // 	$("#zanting").html("继续");
                // } else {
                // 	$("#zanting").html("暂停");
                // 	if(that.ws.readyState == 3) {
                // 		if(that.flag == true) {
                // 			reconnect(that.url);
                // 		}
                // 	} else if(that.ws.readyState == 1) {
                // 		that.ws.send(tmparr);
                // 	}
                // }
                if (that.ws.readyState === 3) {
                  if (that.flag) {
                    reconnect(that.url);
                  }
                } else if (that.ws.readyState === 1) {
                  that.ws.send(tmparr);
                }
              }
            }
          }
        };
        reader.readAsArrayBuffer(audioData.encodePCM());
        audioData.clear(); //每次发送完成则清理掉旧数据
      };

      this.start = function () {
        audioInput.connect(recorder);
        recorder.connect(context.destination);
      };

      this.stop = function () {
        recorder.disconnect();
      };

      this.getBlob = function () {
        return audioData.encodePCM();
      };

      this.clear = function () {
        audioData.clear();
      };

      recorder.onaudioprocess = function (e) {
        var inputBuffer = e.inputBuffer.getChannelData(0);
        audioData.input(inputBuffer);
        sendData();
      };
    };

    /*
     * WebSocket
     */
    var nodes, edges, network;

    function useWebSocket(url) {
      createWebSocket(url, 0);
    }

    function createWebSocket(url, reconnect_flag) {
      // try{
      that.ws = new WebSocket(url);
      that.ws.binaryType = "arraybufferer"; //传输的是 ArrayBuffer 类型的数据
      that.lockReconnect = false;
      initWebSocket(url, reconnect_flag);
    }
    //websocket连接函数
    function reconnect(url) {
      if (that.lockReconnect) return;
      that.lockReconnect = true;
      if (that.flag == true) {
        setTimeout(function () {
          createWebSocket(url, 1); // 当重连时，传入reconnect_flag=1
          console.log("开始重连");
          that.lockReconnect = false;
        }, 1000);
      }
    }

    function initWebSocket(url, reconnect_flag) {
      that.ws.onclose = function () {
        console.log("连接关闭！");
      };
      that.ws.onerror = function () {
        if (that.error == true) {
          // $.get(that.base + that.httpurl, { data: "reconn" }, function(res) {
          // });
          if (that.flag == true) {
            reconnect(that.url);
          }
        } else if (that.error == false) {
          console.log("关闭成功");
        } else {
          alert("未知错误");
        }
      };

      that.ws.onopen = function () {
        heartCheck.reset().start();
        console.log("握手成功");
        if (that.ws.readyState == 1) {
          //ws进入连接状态，则每隔500毫秒发送一包数据
          that.record.start();
        }
      };
      //websocket请求返回
      that.ws.onmessage = function (msg) {
        heartCheck.reset().start();
        var arr = [];
        var node = [];
        var link = [];
        arr = JSON.parse(msg.data);
        if (arr.text != undefined) {
          if (that.txtfalg == false) {
            that.msg = arr.text;
            that.txt = "摘要详情";
          } else {
            that.msg += arr.text;
          }
        }
        that.str += arr.text;
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
        if (arr.text != "") {
          $(".wave").hide(1);
        }
        that.anode.push(arr.nodes);
        if (arr.code == 200) {
          $(".loading2").show(1000);
          $(".yy-btn").hide(1000);
          $(".buju").attr("class", "buju1");
          $(".yy-input").attr("class", "yyint");
          $(".yy-p").hide(1000);
          $(".sy-yy").css("opacity", "1");
          $(".yy-neirong").show(1000);
          $(".yy-imga").show(1000);
          $(".yyp").show(1000);
          if (arr.reset == -1) {
            stop();
          }
          if (arr.nodes.length != 0 || arr.links.length != 0) {
            for (const i in arr.nodes) {
              node.push(arr.nodes[i]);
            }
            for (const i in arr.links) {
              link.push(arr.links[i]);
            }
            if (arr.reset == 1) {
              //1开始画图
              if (node.length != 0 || link.length != 0) {
                addNode();
                addEdge();
              } else if (link.length != 0) {
                addEdge();
              } else if (node.length != 0) {
                nodearr.push(node[0]);
                addNode();
              }
              // console.log(nodes);
              // console.log(edges);
            } else if (arr.reset == 0) {
              //0唤醒小明
              if (node.length != 0 || link.length != 0) {
                addEdge();
                addNode();
              } else if (link.length != 0) {
                newarr.links.push(link[0]);
                addEdge();
              } else if (node.length != 0) {
                addNode();
              }
            } else if (arr.reset == 2) {
              stop();
            }
            if (arr.links.length != 0) {
              that.att.push(arr.links);
            }
            //添加节点
            function addNode() {
              try {
                // for (const i in nodearr) {
                for (const i in node) {
                  if (nodes.get(node[i].id) != null) {
                    nodes.update(node[i]);
                  } else {
                    nodes.add(node[i]);
                    console.log("有节点增加");
                  }
                }
                // }
              } catch (err) {
                console.log(err);
              }
            }
            //添加线
            function addEdge() {
              for (const i in link) {
                try {
                  edges.add(link[i]);
                  console.log("有边增加");
                } catch (err) {
                  edges.update(link[i]);
                }
              }
            }
            //删除节点和线的函数
            function remove() {
              try {
                for (const i in newarr.nodes) {
                  nodes.remove(newarr.nodes[i]);
                  delete newarr.nodes[i];
                }
                for (const i in newarr.links) {
                  edges.remove(newarr.links[i]);
                  delete newarr.links[i];
                }
              } catch (err) {
                console.log(err);
              }
            }
          }
        } else if (arr.code == 500) {
          stop();
          alert("断开连接，正在重连" + arr.code);
          ready();
          $(".wave").hide(1);
        } else {
          number = 1;
        }
      };
    }

    var heartCheck = {
      timeout: 60000, //1分钟发一次心跳
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
      },
      start: function () {
        var self = this;
        this.timeoutObj = setTimeout(function () {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          //onmessage拿到返回的心跳就说明连接正常
          that.ws.send("ping");
          self.serverTimeoutObj = setTimeout(function () {
            //如果超过一定时间还没重置，说明后端主动断开了
            that.ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          }, self.timeout);
        }, this.timeout);
      },
    };
    //开始画图
    $(function () {
      // create an array with nodes
      nodes = new vis.DataSet();
      edges = new vis.DataSet();
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
      //图谱左击事件
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
      //图谱右击事件
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
    //摘要按钮事件
    $(".allvis").click(function () {
      that.ws.send("extract");
      that.record.stop();
      that.record.clear();
    });

    function tempSetBtnInfo() {
      //   var btn1Label = isAdmin ? "Stop" : "Start";
      that.isStart = isAdmin ? "Stop" : "Start";
      isRunning = isAdmin;

      $(".loading2").show(1000);
      $(".yy-btn").hide(1000);
      $(".buju").attr("class", "buju1");
      $(".yy-input").attr("class", "yyint");
      $(".yy-p").hide(1000);
      $(".sy-yy").css("opacity", "1");
      $(".yy-neirong").show(1000);
      $(".yy-imga").show(1000);
      $(".yyp").show(1000);
      //   $("#btn1").html(btn1Label);
      // $(".allvis").hide(500);
      if (isAdmin) {
        $(".clear").show(500);
      } else {
        $(".clear").hide();
        $(".allvis").hide();
      }
      $(".timeremain-label").hide(500);
    }
    /*
     * 开始对讲
     */
    function ready() {
      /**********************  发布时注释或删除掉 *******************************/
      if (isAdmin) {
        $(".timeremain-label").hide(500);
      } else {
        $(".timeremain-label").show(500);
      }
      if (that.timeremain < 1 && !isAdmin) {
        stop();
        isRunning = false;
        return;
      } else {
        // $("#btn1").html("Stop");
        that.isStart = "Stop";
        // $("#btn1").show(500)
        $(".allvis").show(500);
        $(".clear").show(500);
        isRunning = true;
      }
      /*********************************************************************/
      navigator.getUserMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia;

      if (!navigator.getUserMedia) {
        alert("浏览器不支持音频输入");
      } else {
        /**********************  发布时取消注释 *******************************/
        navigator.getUserMedia(
          {
            audio: true,
          },
          function (mediaStream) {
            init(new Recorder(mediaStream));
            console.log("开始对讲");
            var useCount = 1;
            if (that.url == "1") {
              that.$router.go(0);
            } else {
              // $("#zanting").show(500);
              $(".allvis").show(500);
              if (that.str1 != "") {
                $(".wave").hide(1);
              } else {
                $(".wave").show(1);
              }
              that.error = true;
              useWebSocket(that.url);
              that.timer = setInterval(function () {
                var arr0 = that.str.split("undefined");
                var arr1 = arr0.join("");
                var arr = arr1.split("");
                var newa = arr.splice(0, 1);
                // arr.splice(0,2)
                that.str = arr.join("");
                that.str1 += newa.join("");
                var b = "";
                if (
                  $(".yy-imga ul li").width() >
                  $(".yy-imga ul").width() - 5
                ) {
                  b = that.str1.split("");
                  b.splice(0, 1);
                  that.str1 = b.join("");
                }
                $(".yy-imga ul li").html(that.str1);
                useCount++;
                if (useCount % 10 === 0) {
                  if (!isAdmin) {
                    updateTimeremain();
                  }
                }
              }, 100);
            }
          },
          function (error) {
            console.log(error);
            switch (error.message || error.name) {
              case "PERMISSION_DENIED":
              case "PermissionDeniedError":
                console.info("用户拒绝提供信息。");
                alert("用户拒绝提供信息。");
                // $("#btn1").html("Restart");
                that.isStart = "restart";
                // $("#btn1").attr("id", "btn");
                break;
              case "NOT_SUPPORTED_ERROR":
              case "NotSupportedError":
                console.info("浏览器不支持硬件设备。");
                alert("浏览器不支持硬件设备。");
                // $("#btn1").html("Restart");
                that.isStart = "restart";
                // $("#btn1").attr("id", "btn");
                break;
              case "MANDATORY_UNSATISFIED_ERROR":
              case "MandatoryUnsatisfiedError":
                console.info("无法发现指定的硬件设备。");
                alert("无法发现指定的硬件设备。");
                // $("#btn1").html("Restart");
                that.isStart = "restart";
                // $("#btn1").attr("id", "btn");
                break;
              default:
                console.info(
                  "无法打开麦克风。异常信息:" + (error.code || error.name)
                );
                alert("无法打开麦克风。异常信息:" + (error.code || error.name));
                break;
            }
          }
        );
        /*********************************************************************/
      }
      // $("#btn").html("Stop");
      // $("#btn").attr("id", "btn1");
      // isRunning = false;
      that.time = "";
      that.gettime = "";
    }

    // 可录音时展示的按钮
    function showRunningBtns() {
      nodes.clear();
      edges.clear();
      that.msg = "";
      that.str = "";
      that.str1 = "";
      var aae = "";
      $(".left").css("border-right", "none");
      $(".yy-imga ul li").html(aae);
      $(".el-scrollbar__view ul").remove();
      $(".el-scrollbar__view").append("<ul />");
      that.time = "";
      that.gettime = "";
      that.circle = "";
      that.diamond = "";
      that.box = "";
      that.links = "";
    }

    //stop点击事件
    /* document.querySelector("#btn1").addEventListener("click", function () {
      if (isRunning) {
        stop();
      } else {
        if (isAdmin) {
          that.timeremain = 1;
          ready();
          showRunningBtns();
        } else {
          getDuration(showRunningBtns);
        }
      }
    });*/
    //清除按钮事件
    $(".clear").click(function () {
      nodes.clear();
      edges.clear();
      that.msg = "";
      that.str = "";
      that.str1 = "";
      var aae = "";
      $(".yy-imga ul li").html(aae);
      $(".el-scrollbar__view ul").remove();
      $(".el-scrollbar__view").append("<ul />");
      that.time = "";
      that.gettime = "";
      that.circle = "";
      that.diamond = "";
      that.box = "";
      that.links = "";
      $.get(that.base + that.httpurl, { data: "is_clear" }, function (res) {});
    });
    //stop函数
    function stop() {
      isRunning = false;
      that.error = false;
      $(".wave").hide(50);
      that.num++;
      flag = true;
      if (that.ws) {
        that.ws.send("over");
        that.ws.close();
        that.record.stop();
        that.record.clear();
        console.log("关闭对讲以及WebSocket");
        that.fitAnimated(network);
      }
      //   $("#btn1").html("Restart");
      that.isStart = "restart";
      // $("#btn1").attr("id", "btn");
      $(".timeremain-label").hide(500);
      // $("#zanting").hide(500);
      $(".allvis").hide(500);
      if (that.timer) {
        clearInterval(that.timer);
        that.timer = null;
      }
      if (!isAdmin) {
        that.updateDuration();
      }
    }

    // 前端更新倒计时
    function updateTimeremain() {
      if (that.timeremain > 0) {
        that.timeremain--;
      }
      if (that.timeremain < 1) {
        stop();
        alert("体验时间已经使用完毕，请前往注册：https://mip.mininglamp.com/");
      }
    }

    // 获取倒计时
    function getDuration(callBack) {
      console.log(that.ip);
      if (sessionStorage.getItem("username") || that.ip != "") {
        that
          .axios({
            url: that.timecheck,
            method: "POST",
            data: {
              name: sessionStorage.getItem("username") || that.ip,
              role: sessionStorage.getItem("role") || "visitor",
            },
          })
          .then((res) => {
            if (res.data.code === 200) {
              that.timeremain = res.data.mes;
              if (that.timeremain > 0) {
                console.log(that.timeremain);
                ready();
                if (callBack) {
                  callBack();
                }
                // that.updateTimeremainId = setInterval(updateTimeremain, 1000)
              } else {
                alert(
                  "体验时间已经使用完毕，请前往注册：https://mip.mininglamp.com/"
                );
              }
            } else {
              console.log(res.data.mes);
              alert("服务使用时间获取失败");
              // that.timeremain = 0
              // that.updateTimeremainId = setInterval(updateTimeremain, 1000)
            }
          })
          .catch((err) => {
            // that.timeremain = 0
            // that.updateTimeremainId = setInterval(updateTimeremain, 1000)
          });
      } else {
        alert("用户信息获取失败，请稍后再试！");
        navigator.getUserMedia =
          navigator.getUserMedia || navigator.webkitGetUserMedia;
        if (!navigator.getUserMedia) {
          alert("浏览器不支持音频输入");
        } else {
          /**********************  发布时取消注释 *******************************/
          navigator.getUserMedia(
            {
              audio: true,
            },
            function (mediaStream) {
              init(new Recorder(mediaStream));
              console.log("开始对讲");
              if (that.url == "1") {
                that.$router.go(0);
              } else {
                // $("#zanting").show(500);
                $(".allvis").show(500);
                if (that.str1 != "") {
                  $(".wave").hide(1);
                } else {
                  $(".wave").show(1);
                }
                that.error = true;
                useWebSocket(that.url);
              }
            },
            function (error) {
              console.log(error);
              switch (error.message || error.name) {
                case "PERMISSION_DENIED":
                case "PermissionDeniedError":
                  console.info("用户拒绝提供信息。");
                  alert("用户拒绝提供信息。");
                  //   $("#btn1").html("Restart");
                  that.isStart = "restart";
                  // $("#btn1").attr("id", "btn");
                  break;
                case "NOT_SUPPORTED_ERROR":
                case "NotSupportedError":
                  console.info("浏览器不支持硬件设备。");
                  alert("浏览器不支持硬件设备。");
                  //   $("#btn1").html("Restart");
                  that.isStart = "restart";
                  // $("#btn1").attr("id", "btn");
                  break;
                case "MANDATORY_UNSATISFIED_ERROR":
                case "MandatoryUnsatisfiedError":
                  console.info("无法发现指定的硬件设备。");
                  alert("无法发现指定的硬件设备。");
                  //   $("#btn1").html("Restart");
                  that.isStart = "restart";
                  // $("#btn1").attr("id", "btn");
                  break;
                default:
                  console.info(
                    "无法打开麦克风。异常信息:" + (error.code || error.name)
                  );
                  alert(
                    "无法打开麦克风。异常信息:" + (error.code || error.name)
                  );
                  break;
              }
            }
          );
          /*********************************************************************/
        }
        if (that.ws) {
          that.ws.send("over");
          that.ws.close();
          that.record.stop();
          that.record.clear();
          console.log("关闭对讲以及WebSocket");
          that.fitAnimated(network);
        }
        getUserIP((ip) => {
          that.ip = ip;
        });
      }
    }
    getUserIP((ip) => {
      that.ip = ip;
    });
    initStatus();
  },
  destroyed() {
    var that = this;
    this.flag = false;
    if (that.updateTimeremainId) {
      clearInterval(that.updateTimeremainId);
      that.updateTimeremainId = null;
    }
    clearInterval(that.timer);
    that.timer = null;
    that.record.stop();
    that.ws.close();
    console.log("关闭");
    // clearInterval(that.usertimer);
    $.post(that.base + that.logout, function (res) {
      console.log(res);
    });
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
  img {
    width: 100%;
  }
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

.yyp {
  position: absolute;
  left: 37%;
  font-size: 30px;
  display: none;
}

.imgab {
  position: fixed;
  top: 1px;
  left: 1px;
}

.sy-yy {
  width: 100%;
  height: 90%;
  // background: #394251;
  // border: solid 3px rgba(80, 86, 101, 1);
  margin: 5 0px 0% 1%;
  opacity: 0;
  position: relative;
  display: flex;
  .left {
    // width: 20%;
    flex: 1;
    background-color: rgba(79, 105, 127, 0.4);
    margin-right: 20px;
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
  .asd {
    // height: 20px;
    position: absolute;
    top: 5px;
    // right: 0;
    left: 27.6%;
    list-style: none;
    color: white;
    // border: solid 1px gray;
    li {
      text-align: left;
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
  // width: 80%;
  flex: 2.8;
  background-color: rgba(79, 105, 127, 0.4);
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
  background: #2c4255;
  overflow-y: hidden;
}

.buju1 {
  width: 100%;
  height: 100px;
  display: flex;
  padding-top: 70px;
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

.yy-imga {
  width: 100%;
  //   height: 250%;
  height: 50px;
  line-height: 50px;
  position: relative;
  z-index: 200;
  display: none;
  ul {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 0;
    overflow: hidden;
    li {
      float: right;
      height: 90%;
      color: #fff;
      height: 35px;
      white-space: nowrap;
    }
  }
}

.yy-input {
  width: 100%;
  height: 100px;
  padding-top: 230px;
  z-index: 10000;
  padding-bottom: 20px;
  text-align: center;
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

.loading2 {
  width: 30%;
  height: 10%;
  line-height: 50px;
  text-align: center;
  position: absolute;
  // left: 35%;
  right: 0;
  top: 0.6%;
  display: none;
  z-index: 200;
  #zanting {
    margin-right: 3%;
    width: 16%;
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
  .clear {
    margin-left: 3%;
    width: 16%;
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
  .allvis {
    margin-left: 3%;
    width: 16%;
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
}

.yy-neirong {
  z-index: 20;
  position: fixed;
  left: 12%;
  top: 1.5%;
  display: none;
  width: 15%;
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

.cike {
  width: 30px;
  height: 30px;
  border: solid 1px #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  opacity: 0;
}

.timeremain-label,
.video-input > .el-input__inner {
  color: #ffffff;
}
</style>
