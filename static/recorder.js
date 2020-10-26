(function (window) {  
    //兼容  
    window.URL = window.URL || window.webkitURL;  
    //请求麦克风
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;  
  
    var Recorder = function (stream, config) {  
        //创建一个音频环境对象  
        audioContext = window.AudioContext || window.webkitAudioContext;  
        var context = new audioContext();  
        
        config = config || {};  
        config.channelCount = 1;
        config.numberOfInputChannels = config.channelCount;
        config.numberOfOutputChannels = config.channelCount;
        config.sampleBits = config.sampleBits || 16;      //采样数位 8, 16  
        //config.sampleRate = config.sampleRate || (context.sampleRate / 6);   //采样率(1/6 44100)
        config.sampleRate = config.sampleRate || 16000;   //采样率16K
        //创建缓存，用来缓存声音  
        config.bufferSize = 4096;
        
        //将声音输入这个对像  
        var audioInput = context.createMediaStreamSource(stream);  
          
        //设置音量节点  
        var volume = context.createGain();
        audioInput.connect(volume);  
  
        // 创建声音的缓存节点，createScriptProcessor方法的  
        // 第二个和第三个参数指的是输入和输出都是声道数。
        var recorder = context.createScriptProcessor(config.bufferSize, config.channelCount, config.channelCount); 
         
        //用来储存读出的麦克风数据，和压缩这些数据，将这些数据转换为WAV文件的格式
        var audioData = {  
            size: 0          //录音文件长度  
            , buffer: []     //录音缓存  
            , inputSampleRate: context.sampleRate    //输入采样率  
            , inputSampleBits: 16                    //输入采样数位 8, 16  
            , outputSampleRate: config.sampleRate    //输出采样率  
            , oututSampleBits: config.sampleBits     //输出采样数位 8, 16  
            , input: function (data) {  
                this.buffer.push(new Float32Array(data));  //Float32Array
                this.size += data.length;  
            }  
            , getRawData: function () { //合并压缩  
                //合并  
                var data = new Float32Array(this.size);  
                var offset = 0;  
                for (var i = 0; i < this.buffer.length; i++) {
                    data.set(this.buffer[i], offset);  
                    offset += this.buffer[i].length;  
                }  
                //压缩
                var getRawDataion = parseInt(this.inputSampleRate / this.outputSampleRate);  
                var length = data.length / getRawDataion;  
                var result = new Float32Array(length);  
                var index = 0, j = 0;  
                while (index < length) {  
                    result[index] = data[j];  
                    j += getRawDataion;  
                    index++;  
                }  
                return result;
            }             
            ,getFullWavData: function(){
              var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);  
              var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);  
              var bytes = this.getRawData();  
              var dataLength = bytes.length * (sampleBits / 8);  
              var buffer = new ArrayBuffer(44 + dataLength);  
              var data = new DataView(buffer);  
              var offset = 0;  
              var writeString = function (str) {  
                for (var i = 0; i < str.length; i++) {  
                    data.setUint8(offset + i, str.charCodeAt(i));  
                }  
              };  
              // 资源交换文件标识符   
              writeString('RIFF'); offset += 4;  
              // 下个地址开始到文件尾总字节数,即文件大小-8   
              data.setUint32(offset, 36 + dataLength, true); offset += 4;  
              // WAV文件标志  
              writeString('WAVE'); offset += 4;  
              // 波形格式标志   
              writeString('fmt '); offset += 4;  
              // 过滤字节,一般为 0x10 = 16   
              data.setUint32(offset, 16, true); offset += 4;  
              // 格式类别 (PCM形式采样数据)   
              data.setUint16(offset, 1, true); offset += 2;  
              // 通道数   
              data.setUint16(offset, config.channelCount, true); offset += 2;  
              // 采样率,每秒样本数,表示每个通道的播放速度   
              data.setUint32(offset, sampleRate, true); offset += 4;  
              // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8   
              data.setUint32(offset, config.channelCount * sampleRate * (sampleBits / 8), true); offset += 4;  
              // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8   
              data.setUint16(offset, config.channelCount * (sampleBits / 8), true); offset += 2;  
              // 每样本数据位数   
              data.setUint16(offset, sampleBits, true); offset += 2;  
              // 数据标识符   
              writeString('data'); offset += 4;  
              // 采样数据总数,即数据总大小-44   
              data.setUint32(offset, dataLength, true); offset += 4; 
              // 写入采样数据   
              data = this.reshapeWavData(sampleBits, offset, bytes, data);
//                var wavd = new Int8Array(data.buffer.byteLength);
//                var pos = 0;
//                for (var i = 0; i < data.buffer.byteLength; i++, pos++) {
//                    wavd[i] = data.getInt8(pos);
//                }                
//                return wavd;


              return new Blob([data], { type: 'audio/wav' });
                   
            }
            ,closeContext:function(){
                context.close();   //关闭AudioContext否则录音多次会报错。
            }
            ,getPureWavData: function(offset) {
                var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits)
                var bytes = this.getRawData();  
                var dataLength = bytes.length * (sampleBits / 8);  
                var buffer = new ArrayBuffer(dataLength);  
                var data = new DataView(buffer);
                data = this.reshapeWavData(sampleBits, offset, bytes, data);                
//                var wavd = new Int8Array(data.buffer.byteLength);
//                var pos = 0;
//                for (var i = 0; i < data.buffer.byteLength; i++, pos++) {
//                    wavd[i] = data.getInt8(pos);
//                }                
//                return wavd;

                  return new Blob([data], { type: 'audio/wav' });


            }            
            ,reshapeWavData: function(sampleBits, offset, iBytes, oData) {
                if (sampleBits === 8) {  
                    for (var i = 0; i < iBytes.length; i++, offset++) {  
                        var s = Math.max(-1, Math.min(1, iBytes[i]));  
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;  
                        val = parseInt(255 / (65535 / (val + 32768)));  
                        oData.setInt8(offset, val, true);  
                    }  
                } else {  
                    for (var i = 0; i < iBytes.length; i++, offset += 2) {  
                        var s = Math.max(-1, Math.min(1, iBytes[i]));  
                        oData.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);  
                    }  
                } 
                return oData;
            }
        };  
  
        //开始录音  
        this.start = function () {
            audioInput.connect(recorder);  
            recorder.connect(context.destination);
        };  
  
        //停止  
        this.stop = function () {  
            recorder.disconnect();             
        };  
  
        //获取音频文件  
        this.getBlob = function () {  
            this.stop();  
            return audioData.getFullWavData();
            
        };  
  
        //回放  
        this.play = function (audio) {  
            audio.src = window.URL.createObjectURL(this.getBlob());
            console.log(audio.src)
            console.log(this.getBlob.size)
            audio.onended = function() {
                $('#play').text("Play");
            };
        };  
        
        //停止播放
        this.stopPlay=function(audio){
            audio.pause();
        }

        this.close=function(){
            audioData.closeContext();
        }
  
        //上传  
        this.upload = function (url, pdata, callback) {
            var fd = new FormData();  
            fd.append('file', this.getBlob());  
            var xhr = new XMLHttpRequest();
            for (var e in pdata)
            fd.append(e, pdata[e]);  
            if (callback) {  
                xhr.upload.addEventListener('progress', function (e) {  
                    callback('uploading', e);  
                }, false);  
                xhr.addEventListener('load', function (e) {  
                    callback('ok', e);  
                }, false);  
                xhr.addEventListener('error', function (e) {  
                    callback('error', e);  
                }, false);  
                xhr.addEventListener('abort', function (e) {  
                    callback('cancel', e);  
                }, false);  
            }
//          console.log(1)
//          xhr.open('POST', url);  
//          console.log(2)
//          xhr.send(fd);
//          console.log(3)
//          xhr.onreadystatechange = function () {  
//          console.log(4)
//              if (xhr.readyState == 4 || xhr.status == 200) {  
//          console.log(5)
//                  console.log(xhr.response) 
//          console.log(6)
//              }  
//          };
//          xhr.open('POST', url); //async=false,采用同步方式处理       
            xhr.open('POST', url,); //async=false,采用同步方式处理       
            xhr.send(fd); 
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) { //响应数据接收完毕
                	if(xhr.status == 200){
                  a = JSON.parse(xhr.responseText)
                  console.log(xhr.responseText);
                  console.log(typeof xhr.responseText);
//                a = ab.code
                  console.log(typeof a)
                  console.log(a)
                //   console.log(a.data)
                  fn(a)
      function fn(graph){
    		
    	
        var width = 1900,
            height = 1400;

        var color = d3.scale.category10(); // 构造一个 10 种颜色的序数比例尺
        // color()只需要传入a-z字母即可获取对应的颜色 k==>a  循环
        var radius = d3.scale.sqrt() // 构建一个平方根比例尺
            .range([0, 1]); //构造一个新的乘方比例尺，输入值域默认为[0,1],输出范围默认为[0,1],指数默认为0.5。这种方法可以简记为: d3.scale.pow().exponent(.5)

        var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force() // - 使用物理模拟排放链接节点的位置
            .size([1200, 700])
            .charge(-10000) // 取得或者设置电荷强度
            .linkDistance(100);

            var edges = [];
            graph.links.forEach(
                function (e) {
                    var sourceNode = graph.nodes.filter(function (n) {
                            return n.id === e.source;
                        })[0],
                        targetNode = graph.nodes.filter(
                            function (n) {
                                return n.id === e.target;
                            })[0]

                    edges.push({
                        source: sourceNode,
                        target: targetNode,
                        bond: e.bond
                    });
                }
            );
            force
                .nodes(graph.nodes) // 取得或者设置布局的节点数组
                .links(edges) // 取得或者设置节点间的链接数组
                .on("tick", tick) // 监听在计算布局位置时的更新  执行tick函数
                .start(); // 当节点变化时启动或者重启模拟

            //  玩箭头
            var marker =
                svg.append("marker")
                .attr("id", "arrows")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10") //坐标系的区域
                .attr("refX", 32) //箭头坐标
                .attr("markerWidth", 12) //标识的大小
                .attr("markerHeight", 12)
                .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width", 2) //箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5") //箭头的路径
                .attr('fill', '#000'); //箭头颜色


            // 玩line    
            var link = svg.selectAll(".link")
                .data(edges)
                .enter().append("path")
                .attr({
                    'd': function (d) {
                        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target
                            .y
                    },
                    'class': 'edgepath',
                    'id': function (d, i) {
                        return 'edgepath' + i;
                    }
                })
                .style('stroke', "#121212")
                .style('stroke-width',1)
                .attr("class", "link")
                .attr("marker-end", "url(#resolved)");

            // 玩线上文字

            var edges_text = svg.selectAll(".edgelabel")
                .data(edges)
                .enter()
                .append("text")
                .attr({
                    'class': 'edgelabel',
                    'id': function (d, i) {
                        return 'edgepath' + i;
                    },
                    'dx': 80,
                    'dy': 0
                    //'font-size':10,
                    //'fill':'#aaa'
                })
            //设置线条上的文字
            edges_text.append('textPath')
                .attr('xlink:href', function (d, i) {
                    return '#edgepath' + i
                })
                .style("pointer-events", "none")
                .text(function (d) {
                	console.log(d)
                    return d.source.text;
                });

            // 玩 node
            var node = svg.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", "node")
                .call(force.drag); // 为当前选择调用一个函数。  给节点绑定拖动行为

            node.append("circle") // 设置圆圈的样式
                .attr("r", '30')
                .style("fill", function(d,i){
                	return color(i)
                })
                .style('stroke', function (d) {
                    var color = ''
                    switch (d.atom) {
                        case 'C':
                            color = '#2299F8';
                            break;
                        case 'O':
                            color = '#2A93D8';
                            break;
                        case 'H':
                            color = '#d191F4';
                            break;
                    }
                    return color;
                })
                .on('click', function (node) {
                    link.style('stroke', function (line) {
                        if (line.source.id == node.id || line.target.id == node.id) {
                            return 'red'
                        } else {
                            return '#121212'
                        }
                    })
                });

            node.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle") // 文本锚点属性被用来描述该文本与所给点的对齐方式 (开头、中间、末尾对齐) 。
                .text(function (d) { // 确定节点的文字
                    return d.text;
                }).style('fill', function (d) {
                    return "223";
                });

            function tick() {
                // 更新线
                link.selectAll("line")
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });


                link.attr('d', function (d) {
                    var path = 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target
                        .y;
                    return path;
                });

//              edges_text.attr('transform', function (d, i) {
////              	console.log(d)
//                  if (d.target.x < d.source.x) {
//                      bbox = this.getBBox();
//                      console.log(bbox)
//                      rx = bbox.x + bbox.width / 2;
//                      ry = bbox.y + bbox.height / 2;
//                      return 'rotate(180 ' + rx + ' ' + ry + ')';
//                  } else {
//                      return 'rotate(0)';
//                  }
//              });

                // 更新节点
                node.attr("transform", function (d) {

                    return "translate(" + d.x + "," + d.y + ")";
                });
//				  svg.call(d3.zoom().on('zoom', zoomed));
            }}
    	function zoomed() {
    var transform = d3.event.transform;
    var k = Math.sqrt(100 / projection.scale());
    projection.scale(scale * transform.k)
    updatePaths(svg, graticule, world, geoPath);
  };

                	}
                }
            }
        };
        
        this.trans = function (url, callback) {
            var fd = new FormData();
            var buffer = audioData.getPureWavData(0);            
            fd.set('wavData', buffer);
            fd.set('wavSize', buffer.size);
            console.log("wavSize: " + buffer.size);
            document.getElementById('btn-text-content').value = "当前录音长度为：" + buffer.size;
            var xhr = new XMLHttpRequest();
            console.log(buffer)
//          xhr.open('POST', url); //async=false,采用同步方式处理       
//          xhr.onreadystatechange = function(){
//              if (xhr.readyState == 4) { //响应数据接收完毕
//                callback(xhr.responseText, xhr.status);
//              }
//          }
//          xhr.send(buffer);  
			xhr.open('post',url);  
            xhr.send(fd); 
            xhr.onreadystatechange = function () {  
                if (xhr.readyState == 4 && xhr.status == 200) {  
                    console.log(xhr.responseText,xhr.status) 
                }  
            };
        };
        
        var $bo=$("#inbo");
        var $change=$("#change");
        var width=$bo.width();
        //音频采集  
        recorder.onaudioprocess = function (e) {
            audioData.input(e.inputBuffer.getChannelData(0));
           //获取输入和输出的数据缓冲区
           var input = e.inputBuffer.getChannelData(0);
           //绘制条形波动图
           for(i=0;i<width;i++){
              var changeWidth=width/2*input[input.length*i/width|0];
              $change.width(changeWidth);
           }
//          var timeHidden=document.getElementById('audiolength');
//          timeHidden.Value=e.playbackTime;
//          console.log(timeHidden.Value);
//          if(timeHidden.Value>=60){
//              recorder.disconnect();  
//              setTimeout(saveAudio(),500);
//          }
        };  
  
    };  
    //抛出异常  
    Recorder.throwError = function (message) {  
        throw new function () { this.toString = function () { return message; };};  
    };  
    //是否支持录音  
    Recorder.canRecording = (navigator.getUserMedia != null);  
    //获取录音机  
    Recorder.get = function (callback, config) {  
        if (callback) {  
            if (navigator.getUserMedia) {  
                navigator.getUserMedia(  
                    { audio: true } //只启用音频  A
                    , function (stream) {  //stream这个参数是麦克风的输入流，将这个流传递给Recorder
                        var rec = new Recorder(stream, config);  
                        callback(rec);  
                    }  
                    , function (error) {  
                        switch (error.code || error.name) {  
                            case 'PERMISSION_DENIED':  
                            case 'PermissionDeniedError':  
                                Recorder.throwError('用户拒绝提供信息。');  
                                break;  
                            case 'NOT_SUPPORTED_ERROR':  
                            case 'NotSupportedError':  
                                Recorder.throwError('浏览器不支持硬件设备。');  
                                break;  
                            case 'MANDATORY_UNSATISFIED_ERROR':  
                            case 'MandatoryUnsatisfiedError':  
                                Recorder.throwError('无法发现指定的硬件设备。');  
                                break;  
                            default:  
                                Recorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));  
                                break;  
                        }  
                    });  
            } else {  
                Recorder.throwErr('当前浏览器不支持录音功能。'); return;  
            }  
        }  
    };  
    window.Recorder = Recorder;  
  
})(window);