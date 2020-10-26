<template>
	<div class="hello">
		<img src="../assets/1.png" alt="" @click="getIn">
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			getIn() {
				this.$router.push({
					path: '/Table' 
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.hello {
		width: 100%;
		height: 100%;

		img {
			width: 100%;
			height: 100%;
		}
	}
</style>
