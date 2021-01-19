<template>
  <q-page class="flex">
    <div class="flex w-full h-12 py-2">
      <q-card flat bordered class="my-card bg-grey-1 w-full">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Discussion Board Counters</div>
            </div>
            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section avatar>
                        <q-icon name="cached" />
                      </q-item-section>
                      <q-item-section>Refresh</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section avatar>
                        <q-icon name="get_app" />
                      </q-item-section>
                      <q-item-section>Download</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="flex justify-start md:flex-nowrap">
          <div
            class="md:w-1/4 w-full box-shadow p-2 flex flex-col m-2"
            v-for="(data,index) in dashBoard"
            :key="index"
          >
            <div class="flex flex-nowrap justify-between">
              <div>
                <div class="text-bold text-xl">{{data.data}}</div>
                <div>{{data.title}}</div>
              </div>
              <img class="w-1/2 h-36" :src="data.image" alt />
            </div>

            <div class="h-1 bg-blue-300 w-full"></div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- {{users}} -->
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PageIndex",
  created() {
    this.counters();
  },
  data: () => ({
    counts: [
      { image: require("../assets/img/post.svg"), data: "2425", title: "Post" },
      {
        image: require("../assets/img/comments.svg"),
        data: "3349",
        title: "comments",
      },
      {
        image: require("../assets/img/commentByAbwaab.svg"),
        data: "1670",
        title: "Comments by Abwaab Team",
      },
      {
        image: require("../assets/img/userComments.svg"),
        data: "20139",
        title: "Comments by Users",
      },
      {
        image: require("../assets/img/res.svg"),
        data: "53",
        title: "Discussions with empty Replied",
      },
    ],
    users: [],
  }),
  methods: {
    ...mapActions(["counters"]),
  },
  computed: {
    ...mapGetters(["posts", "commentsCount"]),
    dashBoard() {
      this.counts[0].data = this.posts;
      this.counts[1].data = this.commentsCount;
      return this.counts;
    },
  },
};
</script>
<style >
.box-shadow {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
