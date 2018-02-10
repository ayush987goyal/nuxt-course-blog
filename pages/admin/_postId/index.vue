<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '~/components/Admin/AdminPostForm';

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  data() {
    return {
      loadedPost: {
        author: 'Ayush',
        title: 'My awesome post',
        content: 'Super amazing',
        thumbnailLink:
          'https://i.investopedia.com/image/jpeg/1509206221062/tech_global_shutterstock_134102588.jpg'
      }
    };
  }
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
