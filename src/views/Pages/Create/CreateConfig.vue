<template>
  <div class="create_config">
    <Card class="main_card">
      <Form :label-width="100">
        <FormItem label="连接名称">
          <Input v-model="formData.name"/>
        </FormItem>
        <FormItem label="服务器地址">
          <Input v-model="formData.host" placeholder="127.0.0.1"/>
        </FormItem>
        <FormItem label="服务器地址">
          <InputNumber :max="65535" :min="1" v-model="formData.port" placeholder="6379"></InputNumber>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="formData.password" type="password"/>
        </FormItem>
        <FormItem>
          <Button class="btn_save" type="primary" @click="saveConfig">
            <span class="fa fa-save"></span>
            <span>&nbsp;保存</span>
          </Button>
          <Button class="btn_test" @click="testConfig">
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
        host: null,
        port: null,
        password: null
      }
    }
  },
  methods: {
    getConfig () {
      return {
        name: this.formData.name || this.formData.host || '127.0.0.1',
        host: this.formData.host || '127.0.0.1',
        port: this.formData.port || 6379,
        password: this.formData.password || null,
        createdAt: this.formData.createdAt || Date.now(),
        isFavorite: this.formData.isFavorite || false
      }
    },
    async testConfig () {
      const config = this.getConfig()
      let client = await this.$connectRedis(config)
      try {
        await client.select(0)
        this.$Message.success('连接成功')
      } catch (e) {
        this.$Message.warning('连接失败')
      }
      client.disconnect(false)
    },
    saveConfig () {
      const config = this.getConfig()
      this.$store.dispatch('redisConfig/saveConfig', config)
        .then(() => {
          this.$storage.local.remove('tmpEditConfig')
          // this.$Message.success('保存成功')
          this.$getCurrentWindow().close()
        })
        .catch(err => {
          console.log(err)
          this.$Message.error('保存失败')
        })
    }
  },
  mounted () {
    const tmp = this.$storage.local.get('tmpEditConfig')
    if (tmp) {
      this.formData = tmp
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
