import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import router from 'next/dist/lib/router';

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION (
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

function UpdateItem({ id }) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();

  return (
    <Query
      query={SINGLE_ITEM_QUERY}
      variables={{
        id
      }}
    >
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p>No item found for id {id}</p>

        return (
          <Mutation
            mutation={UPDATE_ITEM_MUTATION}
            variables={{
              title,
              description,
              price,
            }}
          >
            {(updateItem, { loading, error }) => (
              <Form onSubmit={async evt => {
                // chill form
                evt.preventDefault();
                // call mutation

                console.log({ id, title, description, price });

                const res = await updateItem({
                  variables: {
                    id,
                    title,
                    description,
                    price
                  }
                });
                // push user to new item's page
                router.push({
                  pathname: '/item',
                  query: { id: res.data.updateItem.id },
                })
              }}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      defaultValue={data.item.title}
                      onChange={evt => setTitle(evt.target.value)}
                      type="text"
                      id="title"
                      name="title"
                      placeholder="title"
                      required
                    />
                  </label>
                  <label htmlFor="price">
                    Price
                    <input
                      defaultValue={data.item.price}
                      onChange={evt => setPrice(evt.target.value)}
                      type="number"
                      id="price"
                      name="price"
                      placeholder="price"
                      required
                    />
                  </label>
                  <label htmlFor="description">
                    Description
                    <textarea
                      defaultValue={data.item.description}
                      onChange={evt => setDescription(evt.target.value)}
                      id="description"
                      name="description"
                      placeholder="description"
                      required
                    />
                  </label>
                  <button type="submit">Sav{loading ? 'ing' : 'e'}</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
}

export default UpdateItem;