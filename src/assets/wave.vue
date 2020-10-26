<template>
    <div class="wave-all">
        <div class="liner-box">
      <span class="lines">
      <hr class="hr hr1">
      <hr class="hr hr2">
      <hr class="hr hr3">
      <hr class="hr hr4">
      <hr class="hr hr5">
      <hr class="hr hr6">
      <hr class="hr hr7">
      <hr class="hr hr8">
      <hr class="hr hr9">
      <hr class="hr hr10">
    </span>
</div>
		<div class="liner-box">
      <span class="lines">
      <hr class="hr hr1">
      <hr class="hr hr2">
      <hr class="hr hr3">
      <hr class="hr hr4">
      <hr class="hr hr5">
      <hr class="hr hr6">
      <hr class="hr hr7">
      <hr class="hr hr8">
      <hr class="hr hr9">
      <hr class="hr hr10">
    </span>
</div>
		<div class="liner-box">
      <span class="lines">
      <hr class="hr hr1">
      <hr class="hr hr2">
      <hr class="hr hr3">
      <hr class="hr hr4">
      <hr class="hr hr5">
      <hr class="hr hr6">
      <hr class="hr hr7">
      <hr class="hr hr8">
      <hr class="hr hr9">
      <hr class="hr hr10">
    </span>
</div>
		<div class="liner-box">
      <span class="lines">
      <hr class="hr hr1">
      <hr class="hr hr2">
      <hr class="hr hr3">
      <hr class="hr hr4">
      <hr class="hr hr5">
      <hr class="hr hr6">
      <hr class="hr hr7">
      <hr class="hr hr8">
      <hr class="hr hr9">
      <hr class="hr hr10">
    </span>
</div>
		<div class="liner-box">
      <span class="lines">
      <hr class="hr hr1">
      <hr class="hr hr2">
      <hr class="hr hr3">
      <hr class="hr hr4">
      <hr class="hr hr5">
      <hr class="hr hr6">
      <hr class="hr hr7">
      <hr class="hr hr8">
      <hr class="hr hr9">
      <hr class="hr hr10">
    </span>
</div>
    </div>
</template>
<style lang="less">
.wave-all{
    width: 100%;
    height: 100%;
    display: flex
}
    .hr{
    background-color: #666;
    width: 3px;
    
    float: left;
    margin-left: 12px;
    animation: liner 0.2s ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate;
}

.hr1{
    animation-delay: -2s;
    height:10%;
}
.hr2{
    animation-delay: -1.9s;
    height:20%;
}
.hr3{
    animation-delay: -1.8s;
    height:10%;
}
.hr4{
    animation-delay: -1.7s;
    height:20%;
}
.hr5{
    animation-delay: -1.6s;
    height:10%;
}
.hr6{
    animation-delay: -1.5s;
    height:10%;
}
.hr7{
    animation-delay: -1.4s;
    height:20%;
}
.hr8{
    animation-delay: -1.3s;
    height:10%;
}
.hr9{
    animation-delay: -1.2s;
    height:20%;
}
.hr10{
    animation-delay: -1.1s;
    height:10%;
}
@keyframes liner {
    0% {
        transform: scaleY(1);
    }
    100% {
        transform: scaleY(6);
    }
}
</style>