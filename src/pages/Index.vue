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
    <ul>
      <li v-for="item in test" :key="item.id">{{item.username}}</li>
    </ul>
    <!-- {{users}} -->
  </q-page>
</template>

<script>
import { users } from "../data_center/users";
import gql from "graphql-tag";
export default {
  apollo: users,
  name: "PageIndex",
  data: () => ({
    users: [],
  }),
  computed: {
    test() {
      return this.users;
    },
  },
  methods: {
    addTag() {
      // We save the user input in case of an error
      const newTag = this.newTag;
      // We clear it early to give the UI a snappy feel
      this.newTag = "";
      // Call to the graphql mutation
      this.$apollo
        .mutate({
          // Query
          mutation: gql`
            mutation($label: String!) {
              addTag(label: $label) {
                id
                label
              }
            }
          `,
          // Parameters
          variables: {
            label: newTag,
          },
          // Update the cache with the result
          // The query will be updated with the optimistic response
          // and then with the real result of the mutation
          update: (store, { data: { addTag } }) => {
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: TAGS_QUERY });
            // Add our tag from the mutation to the end
            data.tags.push(addTag);
            // Write our data back to the cache.
            store.writeQuery({ query: TAGS_QUERY, data });
          },
          // Optimistic UI
          // Will be treated as a 'fake' result as soon as the request is made
          // so that the UI can react quickly and the user be happy
          // optimisticResponse: {
          //   __typename: "Mutation",
          //   addTag: {
          //     __typename: "Tag",
          //     id: -1,
          //     label: newTag,
          //   },
          // },
        })
        .then((data) => {
          // Result
          console.log(data);
        })
        .catch((error) => {
          // Error
          console.error(error);
          // We restore the initial user input
          this.newTag = newTag;
        });
    },
  },
};
</script>
