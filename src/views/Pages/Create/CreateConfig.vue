<template>
  <div class="create_config">
    <Card class="main_card">
      <Form :label-width="100">
        <FormItem label="连接名称">
          <Input v-model="formData.name"/>
        </FormItem>
        <FormItem label="服务器地址">
          <Input v-model="formData.address" placeholder="127.0.0.1"/>
        </FormItem>
        <FormItem label="服务器地址">
          <InputNumber :max="65535" :min="1" v-model="formData.port" placeholder="6379"></InputNumber>
        </FormItem>
        <FormItem>
          <Button class="btn_save" type="primary" @click="saveConfig">
            <span class="fa fa-save"></span>
            <span>&nbsp;保存</span>
          </Button>
          <Button class="btn_test">
            <span class="fa fa-link"></span>
            <span>&nbsp;测试连接</span>
          </Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>

export default {
  name: 'CreateConfig',
  data () {
    return {
      formData: {
        name: null,
        address: null,
        port: null
      }
    }
  },
  methods: {
    saveConfig () {
      const config = {
        name: this.formData.name || this.formData.address || '127.0.0.1',
        address: this.formData.address || '127.0.0.1',
        port: this.formData.port || 6379,
        createdAt: Date.now(),
        isFavorite: false
      }
      console.log(config)
      this.$store.dispatch('redisConfig/saveConfig', config)
        .then(() => {
          // this.$Message.success('保存成功')
          this.$getCurrentWindow().close()
        })
        .catch(err => {
          console.log(err)
          this.$Message.error('保存失败')
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .create_config {
    height: 100%;
    padding: 15px;

    .main_card {
      height: 100%;

      .btn_save {
        margin-right: 20px;
      }
    }
  }
</style>
