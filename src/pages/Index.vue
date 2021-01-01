<template>
  <q-page class="flex px-4">
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
                      <q-item-section>
                        Refresh
                      </q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section avatar>
                        <q-icon name="get_app" />
                      </q-item-section>
                      <q-item-section>
                        Download
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="flex justify-start">
          <div class="w-1/4 h-36 justify-between items-center flex flex-col p-2">
            <div class="w-full flex justify-between items-center">
              <div class="flex flex-col h-full w-auto">
                <span class="w-full text-4xl">2425</span>
                <span class="text-gray-600 text-lg w-full">Post</span>
              </div>
              <img src="../assets/img/post.svg" class="w-36" alt />
            </div>
            <div class="h-1 bg-blue-300 w-full"></div>
          </div>
          <div class="w-1/4 h-36 justify-between items-center flex flex-col p-2">
            <div class="w-full flex justify-between items-center">
              <div class="flex flex-col h-full w-auto">
                <span class="w-full text-4xl">3349</span>
                <span class="text-gray-600 text-lg w-full">comments</span>
              </div>
              <img src="../assets/img/comments.svg" class="w-40" alt />
            </div>
            <div class="h-1 bg-blue-300 w-full"></div>
          </div>
          <div class="w-1/4 h-36 justify-between items-center flex flex-col p-2">
            <div class="w-full flex justify-between items-center">
              <div class="flex flex-col flex-wrap h-full w-1/3">
                <span class="w-full text-4xl">1670</span>
                <span class="text-gray-600 text-base">Comments by Abwaab Team</span>
              </div>
              <img src="../assets/img/commentByAbwaab.svg" class="w-40" alt />
            </div>
            <div class="h-1 bg-blue-300 w-full"></div>
          </div>
          <div class="w-1/4 h-36 justify-between items-center flex flex-col p-2">
            <div class="w-full flex justify-between items-center">
              <div class="flex flex-col flex-wrap h-full w-1/3">
                <span class="w-full text-4xl">20139</span>
                <span class="text-gray-600 text-base">Comments by Users</span>
              </div>
              <img src="../assets/img/userComments.svg" class="w-40" alt />
            </div>
            <div class="h-1 bg-blue-300 w-full"></div>
          </div>
          <div class="w-1/4 h-36 justify-between items-center flex flex-col p-2">
            <div class="w-full flex justify-between items-center">
              <div class="flex flex-col flex-wrap h-full w-1/3">
                <span class="w-full text-4xl">53</span>
                <span class="text-gray-600 text-base">Discussions with empty Replied</span>
              </div>
              <img src="../assets/img/res.svg" class="w-28" alt />
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

export default {
  name: "PageIndex",
  data: () => ({
    users: [],
  }),
};
</script>
