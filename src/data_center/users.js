import gql from "graphql-tag";
export const users = {
  users: {
    query: gql`
      query MyQuery {
        users {
          id
          username
          display_name
        }
      }
    `,
    update: (data) => {
      return data.users;
    },
  },
}
