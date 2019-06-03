import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import router from 'next/dist/lib/router';

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION (
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

function CreateItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [largeImage, setLargeImage] = useState('');

  async function uploadFile(evt) {
    const { files } = evt.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits-advanced-react');

    const res = await fetch('https://api.cloudinary.com/v1_1/dk9me1isq/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();

    console.log(file);

    file.secure_url && setImage(file.secure_url);
    file.eager && setLargeImage(file.eager[0].secure_url);
  }

  return (
    <Mutation
      mutation={CREATE_ITEM_MUTATION}
      variables={{
        title,
        description,
        price,
        image,
        largeImage,
      }}
    >
      {(createItem, { loading, error }) => (
        <Form onSubmit={async evt => {
          // chill form
          evt.preventDefault();
          // call mutation
          const res = await createItem();
          // push user to new item's page
          router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id },
          })
        }}>
          <Error error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                onChange={uploadFile}
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
              />
              {image && <img src={image} alt="Upload Preview" width="200px" />}
            </label>
            <label htmlFor="title">
              Title
              <input
                value={title}
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
                value={price}
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
                value={description}
                onChange={evt => setDescription(evt.target.value)}
                id="description"
                name="description"
                placeholder="description"
                required
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
}

export default CreateItem;