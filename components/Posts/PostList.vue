<template>
  <section class="post-list">
    <PostPreview
      id="1"
      :is-admin="this.isAdmin"
      title="Hello there!"
      previewText="This is my first post!"
      thumbnail="https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg"/>
    <PostPreview
      id="2"
      :is-admin="this.isAdmin"
      title="Hello there! - the second time!"
      previewText="This is my second post!"
      thumbnail="https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg"/>
    <PostPreview
      id="3"
      :is-admin="this.isAdmin"
      title="Hi!"
      previewText="This is my third post!"
      thumbnail="https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg"/>
  </section>
</template>

<script>
import PostPreview from '~/components/Posts/PostPreview';

export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>

