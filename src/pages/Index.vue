<template>
  <q-page class="flex flex-center">
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
