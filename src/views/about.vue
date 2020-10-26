<template>
        <div class="about">
        <div class="about-head"><n-ews></n-ews></div>
        <div class="about-txt">
            &emsp;&emsp;知识图谱技术在产业界正经历着应用的高速增长。然而，设计和开发一个知识图谱系统并且在真实世界中部署和使用它依旧面临着显著的障碍。其主要原因在于学术领域对知识图谱的研究导向甚至对知识图谱的定义本身存在着巨大的认知鸿沟。与此同时，大规模使用知识图谱技术过程中所面临的一系列实践性问题也有待解决。为此，明略科学院知识工程实验室设计、开发了一套软件开发包：HAO图谱。<br/>
&emsp;&emsp;HAO图谱立足于产业应用与前沿学术研究的交叉点，专注于服务企业级知识图谱系统的开发。它既可以独立运行，也可以交付企业技术团队在其之上进行二次开发，与其他HAO模块相互连接形成明略科学院的HAO智能系统，服务国家人工营销智能创新平台的总体布局。目前的HAO图谱演示系统是世界范围内首个公开发布的语音到图谱的实时生成系统，其核心模块包括：语音流监听，语音转文本，文本补全，文本转图谱以及图谱话题切换。其中文本转图谱模块，在与ICDM 2019自动知识图谱构建比赛世界冠军团队的技术较量中，取得了中文语料上压倒性的指标优势。<br/>
&emsp;&emsp;《人民日报》3月2日关于“信息化助力复工复产”的报道 : <span>https://wap.peopleapp.com/article/5220507/5122857?from=singlemessage&isappinstalled=0</span>
        </div>
        
        </div>
</template>
<script>
import nEws from "@/assets/head.vue";
export default {
    components: {
    nEws
    },
    mounted(){
        $(".about-txt span").click(function(){
            window.open("https://wap.peopleapp.com/article/5220507/5122857?from=singlemessage&isappinstalled=0")
        })
    }
}
</script>
<style lang="less">
    .about{
        width: 100%;
        background: linear-gradient(
        144deg,
        rgba(80, 86, 101, 1) 0%,
        rgba(54, 58, 69, 1) 100%
      );
        overflow-y: hidden;
        height: 100%;
    }
    .about-head{
	width: 100%;
	height: 64px;
    background: #000
}
    .about-txt{
        width: 70%;
        margin: 50px auto;
        font-size: 25px;
        line-height: 40px;
        color: #eee;
        span{
            font-size: 20px;
            cursor: pointer;
            word-break:break-all;
            color: rgba(0, 162, 255, 0.658);
        }
        span:hover{
            color: #fff
        }
    }
</style>