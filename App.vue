<script>
export default {
  globalData: {
    status: {}
  },
  onLaunch: async function() {
    if (this.$utils.isPcClient()) {
      uni.showToast({
        title: '为了获得更好的交互体验，请使用手机访问，或者下载APP',
        duration: 4000,
        icon: 'none'
      });
    }
  },
	onShow: async function() {
      let address = (await this.$http.indexService.getCityList({})).data;
      this.$utils.setLocalStorage("address", address);
	},
	onHide: function() {
	}
};
</script>

<style lang="less">
@import "common/less/tpl/reset";
</style>
