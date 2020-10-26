//=======================================================================
//author: shihuc
//date: 2018-09-19
//动态获取服务地址
//=======================================================================
var protocol = window.location.protocol;
var baseService = window.location.host;
var pathName = window.location.pathname;
var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
var a;
var protocolStr = document.location.protocol;
var baseHttpProtocol = "http://";
if(protocolStr == "https:") {  
  baseHttpProtocol = "https://";
}
var svrUrl =  "http://192.168.27.34:8000/api/getwavfile/";
//=========================================================================
  
var recorder = null;
var startButton = document.getElementById('btn-start-recording');
var stopButton = document.getElementById('btn-stop-recording');
//var loading = document.querySelector(".loading")
//var audio = document.querySelector('audio');
var audio = document.getElementById('audioSave');

function startRecording() {
    if(recorder != null) {
        recorder.close();
    }
    Recorder.get(function (rec) {
        recorder = rec;
        recorder.start();
    });
    $(".loading").css("display","block")
//  stopButton.disabled = false;    
//  playButton.disabled = false;
}

function stopRecording() {
    recorder.stop(); 
    recorder.upload(svrUrl)
    console.log(svrUrl)
    $(".loading").css("display","none")
    // $("#container").css("display","none")
    $(".buju").attr("class",".buju1")
    $(".yy-imga").css("padding-left","50px")
    $(".yy-imga").css("padding-top",0)
    $(".yy-imga").css("margin",0)
    $(".yy-input").css("margin","10px")
    $(".loading").css("left","70%")
    $(".loading").css("top","7px")
    $(".yy-input").css("position","absolute")
    $(".yy-input").css("left","20%")
    $(".yy-input").css("top","10px")
    $(".sy-yy").show()
}

//function playRecording() {
//  recorder.play(audio);
//  console.log(audio.src)
//}
