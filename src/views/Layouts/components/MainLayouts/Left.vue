<template>
  <div class="left">
    <div class="input_search_box">
      <input type="text" class="input_search" placeholder="快速连接">
    </div>
    <div class="left_main">
      <div class="left_tabs">
        <div class="left_tab_item active">
          <div>
            <span class="fa fa-star color_warn"></span>
            <span>收藏</span>
          </div>
        </div>
        <div class="left_tab_item">
          <div>
            <!--<span class="fa fa-list color_primary"></span>-->
            <span>服务器列表</span>
          </div>
        </div>
      </div>
      <div class="left_tab_main"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Left'
}
</script>

<style scoped lang="scss">
  .left {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 250px;
    border-right: 1px solid #e8eaec;

    .input_search_box {
      padding: 10px;

      .input_search {
        width: 100%;
        /*border-radius: 2px;*/
        border: 1px solid #dcdee2;
        outline: none;
        border-radius: 2px;
        font-size: 14px;
        padding: 5px;
        color: #515a6e;
      }
    }

    .left_main {
      flex-grow: 1;
      height: 100%;
      display: flex;
      flex-direction: row;
      padding: 0 5px 5px 5px;
      box-sizing: border-box;

      .left_tabs {
        height: 100%;
        width: 30px;
        box-sizing: border-box;
        border-right: 1px solid #dcdee2;

        .left_tab_item {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 30px;
          padding: 10px 0;
          box-sizing: border-box;
          border: 1px solid rgba(0, 0, 0, 0);
          cursor: pointer;

          & > div {
            font-size: 14px;
            width: 14px;
            text-align: center;
            word-break: break-all;
            line-height: 18px;
            /*writing-mode: vertical-rl;*/
            /*writing-mode: vertical-lr;*/
            /*direction: rtl;*/
            font-weight: bold;
          }

          &.active {
            background: #ffffff;
            border-left: 1px solid #dcdee2;
            border-top: 1px solid #dcdee2;
            border-bottom: 1px solid #dcdee2;
            border-right: 1px solid #ffffff;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }

          &:hover {
            color: #2d8cf0;
          }
        }
      }

      .left_tab_main {
        height: 100%;
        background: #ffffff;
        flex-grow: 1;
        border-top: 1px solid #dcdee2;
        border-right: 1px solid #dcdee2;
        border-bottom: 1px solid #dcdee2;
      }
    }
  }
</style>
