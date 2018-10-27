const TOP_LEVEL_COMMENT_MUTATION = `
  mutation CreateTopLevelComment($link: ID!, $content: String!) {
    createComment(
      link: $link,
      content: $content
    ) {
      author {
        _id
      }
      comments {
        _id
      }
      content
      created_at
      link {
        _id
      }
    }
  }
`;

const NESTED_COMMENT_MUTATION = `
  mutation CreateNestedComment($link: ID!, $parent: ID!, $content: String!) {
    createComment(
      link: $link,
      parent: $parent,
      content: $content,
    ) {
      author {
        _id
      }
      comments {
        _id
      }
      content
      created_at
      link {
        _id
      }
      parent {
        _id
      }
    }
  }
`;